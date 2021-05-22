import Node from '../nodes/node/Node';
import Element from '../nodes/element/Element';
import IDocument from '../nodes/document/IDocument';
import SelfClosingElements from '../config/SelfClosingElements';
import UnnestableElements from '../config/UnnestableElements';
import { decode } from 'he';
import NamespaceURI from '../config/NamespaceURI';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import INode from '../nodes/node/INode';
import IElement from '../nodes/element/IElement';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement';

const MARKUP_REGEXP = /<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>/gi;
const COMMENT_REGEXP = /<!--(.*?)-->/gi;
const DOCUMENT_TYPE_REGEXP = /<!DOCTYPE[\s]([a-zA-Z]+)([^>]*)>/gm;
const DOCUMENT_TYPE_ATTRIBUTE_REGEXP = /"([^"]+)"/gm;
const ATTRIBUTE_REGEXP = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))/gms;
const XMLNS_ATTRIBUTE_REGEXP = /xmlns[ ]*=[ ]*"([^"]+)"/;

/**
 * XML parser.
 */
export default class XMLParser {
	/**
	 * Parses XML/HTML and returns a root element.
	 *
	 * @param document Document.
	 * @param data HTML data.
	 * @param [evaluateScripts = false] Set to "true" to enable script execution.
	 * @returns Root element.
	 */
	public static parse(document: IDocument, data: string, evaluateScripts = false): IElement {
		const root = document.createElement('root');
		const stack = [root];
		const markupRegexp = new RegExp(MARKUP_REGEXP, 'gi');
		let parent = root;
		let parentUnnestableTagName = null;
		let lastTextIndex = 0;
		let match: RegExpExecArray;

		while ((match = markupRegexp.exec(data))) {
			const tagName = match[2].toLowerCase();
			const isStartTag = !match[1];

			if (parent && match.index !== lastTextIndex) {
				const text = data.substring(lastTextIndex, match.index);
				this.appendTextAndCommentNodes(document, parent, text);
			}

			if (isStartTag) {
				const newElement = document.createElement(tagName);
				const xmlnsAttribute = this.getXmlnsAttribute(match[3]);

				// Scripts are not allowed to be executed when they are parsed using innerHTML, outerHTML, replaceWith() etc.
				// However, they are allowed to be executed when document.write() is used.
				// See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
				if (tagName === 'script') {
					(<HTMLScriptElement>newElement)._evaluateScript = evaluateScripts;
				}

				// An assumption that the same rule should be applied for the HTMLLinkElement is made here.
				if (tagName === 'link') {
					(<HTMLLinkElement>newElement)._evaluateCSS = evaluateScripts;
				}

				// The HTML engine can guess that the namespace is SVG for SVG tags
				// Even if "xmlns" is not set if the parent namespace is HTML.
				if (tagName === 'svg' && parent.namespaceURI === NamespaceURI.html) {
					(<string>newElement.namespaceURI) = xmlnsAttribute || NamespaceURI.svg;
				} else {
					(<string>newElement.namespaceURI) = xmlnsAttribute || parent.namespaceURI;
				}

				this.setAttributes(newElement, newElement.namespaceURI, match[3]);

				if (!SelfClosingElements.includes(tagName)) {
					// Some elements are not allowed to be nested (e.g. "<a><a></a></a>" is not allowed.).
					// Therefore we will auto-close the tag.
					if (parentUnnestableTagName === tagName) {
						stack.pop();
						parent = <Element>parent.parentNode || root;
					}

					parent = <Element>parent.appendChild(newElement);
					parentUnnestableTagName = this.getUnnestableTagName(parent);
					stack.push(parent);
				} else {
					parent.appendChild(newElement);
				}

				lastTextIndex = markupRegexp.lastIndex;
			} else {
				stack.pop();
				parent = stack[stack.length - 1] || root;
				parentUnnestableTagName = this.getUnnestableTagName(parent);

				lastTextIndex = markupRegexp.lastIndex;
			}
		}

		// Text after last element
		if ((!match && data.length > 0) || (match && lastTextIndex !== match.index)) {
			const text = data.substring(lastTextIndex);
			this.appendTextAndCommentNodes(document, root, text);
		}

		return root;
	}

	/**
	 * Returns a tag name if element is unnestable.
	 *
	 * @param element Element.
	 * @returns Tag name if element is unnestable.
	 */
	private static getUnnestableTagName(element: IElement): string {
		const tagName = element.tagName.toLowerCase();
		return tagName && UnnestableElements.includes(tagName) ? tagName : null;
	}

	/**
	 * Appends text and comment nodes.
	 *
	 * @param document Document.
	 * @param node Node.
	 * @param text Text to search in.
	 */
	private static appendTextAndCommentNodes(document: IDocument, node: INode, text: string): void {
		for (const innerNode of this.getTextAndCommentNodes(document, text)) {
			node.appendChild(innerNode);
		}
	}

	/**
	 * Returns text and comment nodes from a text.
	 *
	 * @param document Document.
	 * @param text Text to search in.
	 * @returns Nodes.
	 */
	private static getTextAndCommentNodes(document: IDocument, text: string): Node[] {
		const nodes = [];
		const commentRegExp = new RegExp(COMMENT_REGEXP, 'gms');
		const documentTypeRegExp = new RegExp(DOCUMENT_TYPE_REGEXP, 'gm');
		let hasDocumentType = false;
		let lastIndex = 0;
		let match;

		while ((match = commentRegExp.exec(text))) {
			if (match.index > 0) {
				const textNode = document.createTextNode(text.substring(lastIndex, match.index));
				nodes.push(textNode);
			}
			const commentNode = document.createComment(match[1]);
			nodes.push(commentNode);
			lastIndex = match.index + match[0].length;
		}

		while ((match = documentTypeRegExp.exec(text))) {
			let publicId = '';
			let systemId = '';

			if (match[2]) {
				const attributes = [];
				const attributeRegExp = new RegExp(DOCUMENT_TYPE_ATTRIBUTE_REGEXP, 'gm');
				const isPublic = match[2].includes('PUBLIC');
				let attributeMatch;
				while ((attributeMatch = attributeRegExp.exec(match[2]))) {
					attributes.push(attributeMatch[1]);
				}
				publicId = isPublic ? attributes[0] || '' : '';
				systemId = isPublic ? attributes[1] || '' : attributes[0] || '';
			}

			const documentTypeNode = document.implementation.createDocumentType(
				match[1],
				publicId,
				systemId
			);

			nodes.push(documentTypeNode);
			hasDocumentType = true;
		}

		if (!hasDocumentType && lastIndex < text.length) {
			const textNode = document.createTextNode(text.substring(lastIndex));
			nodes.push(textNode);
		}

		return nodes;
	}

	/**
	 * Returns XMLNS attribute.
	 *
	 * @param attributesString Raw attributes.
	 */
	private static getXmlnsAttribute(attributesString: string): string {
		const match = attributesString.match(XMLNS_ATTRIBUTE_REGEXP);
		return match ? match[1] : null;
	}

	/**
	 * Sets raw attributes.
	 *
	 * @param element Element.
	 * @param namespaceURI Namespace URI.
	 * @param attributesString Raw attributes.
	 */
	private static setAttributes(
		element: IElement,
		namespaceURI: string,
		attributesString: string
	): void {
		const attributes = attributesString.trim();
		if (attributes) {
			const regExp = new RegExp(ATTRIBUTE_REGEXP, 'gi');
			let match: RegExpExecArray;

			// Attributes with value
			while ((match = regExp.exec(attributes))) {
				if (match[1]) {
					element.setAttributeNS(
						null,
						this._getAttributeName(namespaceURI, match[1]),
						decode(match[2] || match[3] || match[4] || '')
					);
				}
			}

			// Attributes with no value
			for (const name of attributes
				.replace(ATTRIBUTE_REGEXP, '')
				.trim()
				.split(' ')) {
				if (name) {
					element.setAttributeNS(null, this._getAttributeName(namespaceURI, name), '');
				}
			}
		}
	}

	/**
	 * Returns attribute name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param name Name.
	 * @returns Attribute name based on namespace.
	 */
	private static _getAttributeName(namespaceURI: string, name: string): string {
		if (namespaceURI === NamespaceURI.svg) {
			return name;
		}
		return name.toLowerCase();
	}
}
