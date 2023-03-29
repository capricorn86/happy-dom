import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';

/**
 * HTML Button Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement.
 */
export default interface IHTMLButtonElement extends IHTMLElement {
	name: string;
	value: string;
	disabled: boolean;
	type: string;
	form: IHTMLFormElement;

	/**
	 * Checks validity.
	 *
	 * @returns Validity.
	 */
	checkValidity(): boolean;
}
