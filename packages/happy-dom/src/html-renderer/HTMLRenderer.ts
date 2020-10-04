import Element from '../nodes/basic/element/Element';
import ShadowRoot from '../nodes/basic/shadow-root/ShadowRoot';
import HTMLTemplateElement from '../nodes/elements/template/HTMLTemplateElement';
import SelfClosingHTMLElements from '../html-config/SelfClosingHTMLElements';
import UnclosedHTMLElements from '../html-config/UnclosedHTMLElements';
import CommentNode from '../nodes/basic/comment-node/CommentNode';

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class HTMLRenderer {
	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @return Result.
	 */
	public static getOuterHTML(element: Element): string {
		const tagName = element.tagName.toLowerCase();

		if (UnclosedHTMLElements.includes(tagName)) {
			return `<${tagName}${this.getAttributes(element)}>`;
		} else if (SelfClosingHTMLElements.includes(tagName)) {
			return `<${tagName}${this.getAttributes(element)}/>`;
		}

		return `<${tagName}${this.getAttributes(element)}>${element.innerHTML}</${tagName}>`;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @returns Result.
	 */
	public static getInnerHTML(element: Element | ShadowRoot): string {
		const renderElement = (<HTMLTemplateElement>element).content || element;
		let html = '';

		for (const child of renderElement.childNodes.slice()) {
			if (child instanceof Element) {
				html += child.outerHTML;
			} else if (child instanceof CommentNode) {
				html += '<!--' + child._textContent + '-->';
			} else if (child['_textContent']) {
				html += child['_textContent'];
			}
		}

		return html;
	}

	/**
	 * Returns attributes as a string.
	 *
	 * @param element Element.
	 * @return Attributes.
	 */
	private static getAttributes(element: Element): string {
		const rawAttributes = element._getRawAttributes();
		return rawAttributes ? ' ' + rawAttributes : '';
	}
}
