import Element from '../nodes/basic/element/Element';
import Node from '../nodes/basic/node/Node';
import SelfClosingHTMLElements from '../html-config/SelfClosingHTMLElements';
import UnclosedHTMLElements from '../html-config/UnclosedHTMLElements';
import CommentNode from '../nodes/basic/comment-node/CommentNode';
import DocumentType from '../nodes/basic/document-type/DocumentType';
import { encode } from 'he';
import DocumentFragment from '../nodes/basic/document-fragment/DocumentFragment';

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
	 * @return Result.
	 */
	public serializeToString(root: Node): string {
		if (root instanceof Element) {
			const tagName = root.tagName.toLowerCase();
			if (UnclosedHTMLElements.includes(tagName)) {
				return `<${tagName}${this._getAttributes(root)}>`;
			} else if (SelfClosingHTMLElements.includes(tagName)) {
				return `<${tagName}${this._getAttributes(root)}/>`;
			}

			let xml = '';
			for (const node of root.childNodes) {
				xml += this.serializeToString(node);
			}

			return `<${tagName}${this._getAttributes(root)}>${xml}</${tagName}>`;
		} else if (root instanceof DocumentFragment) {
			let xml = '';
			for (const node of root.childNodes) {
				xml += this.serializeToString(node);
			}
			return xml;
		} else if (root instanceof CommentNode) {
			return `<!--${root._textContent}-->`;
		} else if (root instanceof DocumentType) {
			const identifier = root.publicId ? ' PUBLIC' : root.systemId ? ' SYSTEM' : '';
			const publicId = root.publicId ? ` "${root.publicId}"` : '';
			const systemId = root.systemId ? ` "${root.systemId}"` : '';
			return `<!DOCTYPE ${root.name}${identifier}${publicId}${systemId}>`;
		} else if (root['_textContent']) {
			return root['_textContent'];
		}
		return '';
	}

	/**
	 * Returns attributes as a string.
	 *
	 * @param element Element.
	 * @return Attributes.
	 */
	private _getAttributes(element: Element): string {
		const attributes = [];
		for (const attribute of Object.values(element._attributes)) {
			if (attribute.value !== null) {
				attributes.push(attribute.name + '="' + encode(attribute.value) + '"');
			}
		}
		return attributes.length > 0 ? ' ' + attributes.join(' ') : '';
	}
}
