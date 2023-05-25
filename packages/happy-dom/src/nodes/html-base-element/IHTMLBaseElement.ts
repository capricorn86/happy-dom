import IHTMLElement from '../html-element/IHTMLElement.js';

/**
 * HTML Base Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base.
 */
export default interface IHTMLBaseElement extends IHTMLElement {
	href: string;
	target: string;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IHTMLBaseElement;
}
