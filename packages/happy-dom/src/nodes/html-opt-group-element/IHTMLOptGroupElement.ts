import IHTMLElement from '../html-element/IHTMLElement';

/**
 * HTML Opt Group Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptGroupElement.
 */
export default interface IHTMLOptGroupElement extends IHTMLElement {
	disabled: boolean;
	label: string;
}
