import IHTMLElement from '../html-element/IHTMLElement';

/**
 * HTML Button Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement.
 */
export default interface IHTMLButtonElement extends IHTMLElement {
	type: string;
	disabled: boolean;
	value: string;
}
