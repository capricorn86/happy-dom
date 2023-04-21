import IHTMLElement from '../html-element/IHTMLElement';

/**
 * HTML Script Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement.
 */
export default interface IHTMLScriptElement extends IHTMLElement {
	type: string;
	src: string;
	charset: string;
	lang: string;
	async: boolean;
	defer: boolean;
	text: string;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IHTMLScriptElement;
}
