import Node from '../nodes/node/Node';
import Element from '../nodes/element/Element';
import IDocument from '../nodes/document/IDocument';
import VoidElements from '../config/VoidElements';
import UnnestableElements from '../config/UnnestableElements';
import ChildLessElements from '../config/ChildLessElements';
import { decode } from 'he';
import NamespaceURI from '../config/NamespaceURI';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import INode from '../nodes/node/INode';
import IElement from '../nodes/element/IElement';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement';
import IDocumentFragment from '../nodes/document-fragment/IDocumentFragment';
import PlainTextElements from '../config/PlainTextElements';

const CONDITION_COMMENT_REGEXP =
	/<!(--)?\[if (!|le|lt|lte|gt|gte|\(.*\)|&|\|| |IE|WindowsEdition|Contoso|true|false|\d+\.?(\d+)?|)*\]>/gi;
const CONDITION_COMMENT_END_REGEXP = /<!\[endif\](--)?>/gi;
const MARKUP_REGEXP = /<(\/?)([a-z][-.0-9_a-z]*)\s*([^<>]*?)(\/?)>/gi;
const COMMENT_REGEXP = /<!--(.*?)-->|<([!?])([^>]*)>/gi;
const DOCUMENT_TYPE_ATTRIBUTE_REGEXP = /"([^"]+)"/gm;
const ATTRIBUTE_REGEXP = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))/gms;

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
	public static parse(
		document: IDocument,
		data: string,
		evaluateScripts = false
	): IDocumentFragment {
		const root = document.createDocumentFragment();
		const stack: Array<IElement | IDocumentFragment> = [root];
		const markupRegexp = new RegExp(MARKUP_REGEXP, 'gi');
		let parent: IDocumentFragment | IElement = root;
		let parentTagName = null;
		let parentUnnestableTagName = null;
		let lastTextIndex = 0;
		let match: RegExpExecArray;

		if (data !== null && data !== undefined) {
			data = String(data);

			while ((match = markupRegexp.exec(data))) {
				const tagName = match[2].toLowerCase();
				const isStartTag = !match[1];

				if (parent && match.index !== lastTextIndex) {
					const text = data.substring(lastTextIndex, match.index);
					if (parentTagName && PlainTextElements.includes(parentTagName)) {
						parent.appendChild(document.createTextNode(text));
					} else {
						let condCommMatch;
						let condCommEndMatch;
						const condCommRegexp = new RegExp(CONDITION_COMMENT_REGEXP, 'gi');
						const condCommEndRegexp = new RegExp(CONDITION_COMMENT_END_REGEXP, 'gi');
						// @Refer: https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/?redirectedfrom=MSDN
						if (
							isStartTag &&
							(condCommMatch = condCommRegexp.exec(text)) &&
							condCommMatch[0] &&
							(condCommEndMatch = condCommEndRegexp.exec(data.substring(markupRegexp.lastIndex))) &&
							condCommEndMatch[0]
						) {
							markupRegexp.lastIndex += condCommEndRegexp.lastIndex;
							continue;
						} else {
							this.appendTextAndCommentNodes(document, parent, text);
						}
					}
				}

				if (isStartTag) {
					const namespaceURI =
						tagName === 'svg'
							? NamespaceURI.svg
							: (<IElement>parent).namespaceURI || NamespaceURI.html;
					const newElement = document.createElementNS(namespaceURI, tagName);

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

					this.setAttributes(newElement, match[3]);

					if (!match[4] && !VoidElements.includes(tagName)) {
						// Some elements are not allowed to be nested (e.g. "<a><a></a></a>" is not allowed.).
						// Therefore we will auto-close the tag.
						if (parentUnnestableTagName === tagName) {
							stack.pop();
							parent = <Element>parent.parentNode || root;
						}

						parent = <Element>parent.appendChild(newElement);
						parentTagName = tagName;
						parentUnnestableTagName = this.getUnnestableTagName(parent);
						stack.push(parent);
					} else {
						parent.appendChild(newElement);
					}
					lastTextIndex = markupRegexp.lastIndex;

					// Tags which contain non-parsed content
					// For example: <script> JavaScript should not be parsed
					if (ChildLessElements.includes(tagName)) {
						let childLessMatch = null;
						while ((childLessMatch = markupRegexp.exec(data))) {
							if (childLessMatch[2].toLowerCase() === tagName && childLessMatch[1]) {
								markupRegexp.lastIndex -= childLessMatch[0].length;
								break;
							}
						}
					}
				} else {
					stack.pop();
					parent = stack[stack.length - 1] || root;
					parentTagName = (<IElement>parent).tagName
						? (<IElement>parent).tagName.toLowerCase()
						: null;
					parentUnnestableTagName = this.getUnnestableTagName(parent);

					lastTextIndex = markupRegexp.lastIndex;
				}
			}

			// Text after last element
			if ((!match && data.length > 0) || (match && lastTextIndex !== match.index)) {
				const text = data.substring(lastTextIndex);
				this.appendTextAndCommentNodes(document, parent || root, text);
			}
		}

		return root;
	}

	/**
	 * Returns a tag name if element is unnestable.
	 *
	 * @param element Element.
	 * @returns Tag name if element is unnestable.
	 */
	private static getUnnestableTagName(element: IElement | IDocumentFragment): string {
		const tagName = (<IElement>element).tagName ? (<IElement>element).tagName.toLowerCase() : null;
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
		let hasDocumentType = false;
		let lastIndex = 0;
		let match;

		while ((match = commentRegExp.exec(text))) {
			if (match.index > 0 && lastIndex !== match.index) {
				const textNode = document.createTextNode(text.substring(lastIndex, match.index));
				nodes.push(textNode);
			}
			if (match[3] && match[3].toUpperCase().startsWith('DOCTYPE')) {
				const docTypeSplit = match[3].split(' ');

				if (docTypeSplit.length > 1) {
					const docTypeString = docTypeSplit.slice(1).join(' ');
					const attributes = [];
					const attributeRegExp = new RegExp(DOCUMENT_TYPE_ATTRIBUTE_REGEXP, 'gm');
					const isPublic = docTypeString.includes('PUBLIC');
					let attributeMatch;

					while ((attributeMatch = attributeRegExp.exec(docTypeString))) {
						attributes.push(attributeMatch[1]);
					}

					const publicId = isPublic ? attributes[0] || '' : '';
					const systemId = isPublic ? attributes[1] || '' : attributes[0] || '';

					const documentTypeNode = document.implementation.createDocumentType(
						docTypeSplit[1],
						publicId,
						systemId
					);

					nodes.push(documentTypeNode);
					hasDocumentType = true;
				}
			} else {
				const comment = match[1] ? match[1] : match[2] === '?' ? '?' + match[3] : match[3];
				const commentNode = document.createComment(comment);
				nodes.push(commentNode);
				lastIndex = match.index + match[0].length;
			}
		}

		if (!hasDocumentType && lastIndex < text.length) {
			const textNode = document.createTextNode(text.substring(lastIndex));
			nodes.push(textNode);
		}

		return nodes;
	}

	/**
	 * Sets raw attributes.
	 *
	 * @param element Element.
	 * @param attributesString Raw attributes.
	 */
	private static setAttributes(element: IElement, attributesString: string): void {
		const attributes = attributesString.trim();
		if (attributes) {
			const regExp = new RegExp(ATTRIBUTE_REGEXP, 'gi');
			let match: RegExpExecArray;

			// Attributes with value
			while ((match = regExp.exec(attributes))) {
				if (match[1]) {
					const value = decode(match[2] || match[3] || match[4] || '');
					const name = this._getAttributeName(element.namespaceURI, match[1]);
					const namespaceURI = element.tagName === 'SVG' && name === 'xmlns' ? value : null;
					element.setAttributeNS(namespaceURI, name, value);
				}
			}

			// Attributes with no value
			for (const name of attributes.replace(ATTRIBUTE_REGEXP, '').trim().split(' ')) {
				if (name) {
					element.setAttribute(this._getAttributeName(element.namespaceURI, name), '');
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
