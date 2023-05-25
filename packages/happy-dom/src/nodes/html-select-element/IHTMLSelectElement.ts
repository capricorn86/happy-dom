import IHTMLElement from '../html-element/IHTMLElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement.js';
import INodeList from '../node/INodeList.js';
import IHTMLOptionsCollection from './IHTMLOptionsCollection.js';
import ValidityState from '../../validity-state/ValidityState.js';
import Event from '../../event/Event.js';
import IHTMLOptionElement from '../html-option-element/IHTMLOptionElement.js';
import IHTMLOptGroupElement from '../html-opt-group-element/IHTMLOptGroupElement.js';

/**
 * HTML Select Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement.
 */
export default interface IHTMLSelectElement extends IHTMLElement {
	readonly form: IHTMLFormElement;
	readonly labels: INodeList<IHTMLLabelElement>;
	readonly options: IHTMLOptionsCollection;
	readonly type: string;
	readonly validity: ValidityState;
	readonly willValidate: boolean;
	readonly validationMessage: string;
	autofocus: boolean;
	disabled: boolean;
	length: number;
	selectedIndex: number;
	value: string;
	name: string;
	multiple: boolean;
	required: boolean;

	// Events
	onchange: (event: Event) => void | null;
	oninput: (event: Event) => void | null;

	/**
	 * Adds new option to collection.
	 *
	 * @param element HTMLOptionElement or HTMLOptGroupElement to add.
	 * @param before HTMLOptionElement or index number.
	 */
	add(
		element: IHTMLOptionElement | IHTMLOptGroupElement,
		before?: number | IHTMLOptionElement | IHTMLOptGroupElement
	): void;

	/**
	 * Returns option element by index.
	 *
	 * @param index Index.
	 */
	item(index: number): IHTMLOptionElement | IHTMLOptGroupElement;

	/**
	 * Removes option element from the collection.
	 *
	 * @param index Index.
	 */
	remove(index?: number): void;

	/**
	 * Sets validation message.
	 *
	 * @param message Message.
	 */
	setCustomValidity(message: string): void;

	/**
	 * Checks validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	checkValidity(): boolean;

	/**
	 * Reports validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	reportValidity(): boolean;
}
