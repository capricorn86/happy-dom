import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';

/**
 * HTML Option Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement.
 */
export default interface IHTMLOptionElement extends IHTMLElement {
	readonly form: IHTMLFormElement;
	readonly index: number;
	selected: boolean;
	value: string;
	text: string;
	disabled: boolean;
}
