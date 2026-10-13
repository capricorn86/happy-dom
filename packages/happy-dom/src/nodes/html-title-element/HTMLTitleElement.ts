import HTMLElement from '../html-element/HTMLElement.js';
import NodeUtility from '../node/NodeUtility.js';

/**
 * HTMLTitleElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTitleElement
 */
export default class HTMLTitleElement extends HTMLElement {
	/**
	 * Returns text.
	 *
	 * @returns Text.
	 */
	public get text(): string {
		return NodeUtility.getChildTextContent(this);
	}

	/**
	 * Sets text.
	 *
	 * @param text Text.
	 */
	public set text(text: string) {
		this.textContent = text;
	}

	/**
	 * @override
	 */
	public override get innerHTML(): string {
		return this.getHTML();
	}

	/**
	 * @override
	 */
	public override set innerHTML(html: string) {
		this.textContent = html;
	}
}
