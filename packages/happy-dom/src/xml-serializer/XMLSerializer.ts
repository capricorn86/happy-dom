import Element from '../nodes/element/Element';
import Node from '../nodes/node/Node';
import SelfClosingElements from '../config/SelfClosingElements';
import UnclosedElements from '../config/UnclosedElements';
import DocumentType from '../nodes/document-type/DocumentType';
import { encode } from 'he';
import INode from '../nodes/node/INode';
import IElement from '../nodes/element/IElement';

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class XMLSerializer {
	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @param root
	 * @returns Result.
	 */
	public serializeToString(root: INode): string {
		switch (root.nodeType) {
			case Node.ELEMENT_NODE:
				const element = <Element>root;
				const tagName = element.tagName.toLowerCase();

				if (UnclosedElements.includes(tagName)) {
					return `<${tagName}${this._getAttributes(element)}>`;
				} else if (SelfClosingElements.includes(tagName)) {
					return `<${tagName}${this._getAttributes(element)}/>`;
				}

				let innerHTML = '';
				for (const node of root.childNodes) {
					innerHTML += this.serializeToString(node);
				}

				return `<${tagName}${this._getAttributes(element)}>${innerHTML}</${tagName}>`;
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.DOCUMENT_NODE:
				let html = '';
				for (const node of root.childNodes) {
					html += this.serializeToString(node);
				}
				return html;
			case Node.COMMENT_NODE:
				return `<!--${root.textContent}-->`;
			case Node.TEXT_NODE:
				return root['textContent'];
			case Node.DOCUMENT_TYPE_NODE:
				const doctype = <DocumentType>root;
				const identifier = doctype.publicId ? ' PUBLIC' : doctype.systemId ? ' SYSTEM' : '';
				const publicId = doctype.publicId ? ` "${doctype.publicId}"` : '';
				const systemId = doctype.systemId ? ` "${doctype.systemId}"` : '';
				return `<!DOCTYPE ${doctype.name}${identifier}${publicId}${systemId}>`;
		}

		return '';
	}

	/**
	 * Returns attributes as a string.
	 *
	 * @param element Element.
	 * @returns Attributes.
	 */
	private _getAttributes(element: IElement): string {
		let attributeString = '';
		for (const attribute of Object.values((<Element>element)._attributes)) {
			if (attribute.value !== null) {
				attributeString += ' ' + attribute.name + '="' + encode(attribute.value) + '"';
			}
		}
		return attributeString;
	}
}
