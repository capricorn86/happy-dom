import ValidityState from '../../validity-state/ValidityState.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement.js';
import INodeList from '../node/INodeList.js';

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
	formNoValidate: boolean;
	readonly validity: ValidityState;
	readonly form: IHTMLFormElement;
	readonly validationMessage: string;
	readonly labels: INodeList<IHTMLLabelElement>;

	/**
	 * Checks validity.
	 *
	 * @returns Validity.
	 */
	checkValidity(): boolean;

	/**
	 * Reports validity.
	 *
	 * @returns Validity.
	 */
	reportValidity(): boolean;

	/**
	 * Sets validation message.
	 *
	 * @param message Message.
	 */
	setCustomValidity(message: string): void;
}
