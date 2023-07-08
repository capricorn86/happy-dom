import IHTMLElement from '../html-element/IHTMLElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';

/**
 * HTML Label Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement.
 */
export default interface IHTMLLabelElement extends IHTMLElement {
	readonly control: IHTMLElement;
	readonly form: IHTMLFormElement;
	htmlFor: string;
}
