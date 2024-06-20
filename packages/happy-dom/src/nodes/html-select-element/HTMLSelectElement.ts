import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import ValidityState from '../../validity-state/ValidityState.js';
import HTMLLabelElement from '../html-label-element/HTMLLabelElement.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import HTMLOptionsCollection from './HTMLOptionsCollection.js';
import Event from '../../event/Event.js';
import HTMLLabelElementUtility from '../html-label-element/HTMLLabelElementUtility.js';
import HTMLCollection from '../element/HTMLCollection.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import Element from '../element/Element.js';
import NodeList from '../node/INodeList.js';

/**
 * HTML Select Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement.
 */
export default class HTMLSelectElement extends HTMLElement {
	// Internal properties.
	public [PropertySymbol.validationMessage] = '';
	public [PropertySymbol.validity] = new ValidityState(this);
	public [PropertySymbol.options]: HTMLOptionsCollection = new HTMLOptionsCollection(this);
	public [PropertySymbol.formNode]: HTMLFormElement | null = null;
	public [PropertySymbol.selectedOptions]: IHTMLCollection<HTMLOptionElement> | null = null;
	public [PropertySymbol.isInsideObservedFormNode] = false;

	// Events
	public onchange: (event: Event) => void | null = null;
	public oninput: (event: Event) => void | null = null;

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.options].length;
	}

	/**
	 * Returns options.
	 *
	 * @returns Options.
	 */
	public get options(): HTMLOptionsCollection {
		return this[PropertySymbol.options];
	}

	/**
	 * Returns validation message.
	 *
	 * @returns Validation message.
	 */
	public get validationMessage(): string {
		return this[PropertySymbol.validationMessage];
	}

	/**
	 * Returns validity.
	 *
	 * @returns Validity.
	 */
	public get validity(): ValidityState {
		return this[PropertySymbol.validity];
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttribute('name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttribute('name', name);
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttribute('disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttribute('disabled');
		} else {
			this.setAttribute('disabled', '');
		}
	}

	/**
	 * Returns multiple.
	 *
	 * @returns Multiple.
	 */
	public get multiple(): boolean {
		return this.getAttribute('multiple') !== null;
	}

	/**
	 * Sets multiple.
	 *
	 * @param multiple Multiple.
	 */
	public set multiple(multiple: boolean) {
		if (!multiple) {
			this.removeAttribute('multiple');
		} else {
			this.setAttribute('multiple', '');
		}
	}

	/**
	 * Returns autofocus.
	 *
	 * @returns Autofocus.
	 */
	public get autofocus(): boolean {
		return this.getAttribute('autofocus') !== null;
	}

	/**
	 * Sets autofocus.
	 *
	 * @param autofocus Autofocus.
	 */
	public set autofocus(autofocus: boolean) {
		if (!autofocus) {
			this.removeAttribute('autofocus');
		} else {
			this.setAttribute('autofocus', '');
		}
	}

	/**
	 * Returns required.
	 *
	 * @returns Required.
	 */
	public get required(): boolean {
		return this.getAttribute('required') !== null;
	}

	/**
	 * Sets required.
	 *
	 * @param required Required.
	 */
	public set required(required: boolean) {
		if (!required) {
			this.removeAttribute('required');
		} else {
			this.setAttribute('required', '');
		}
	}

	/**
	 * Returns type.
	 *
	 * @returns type.
	 */
	public get type(): string {
		return this.hasAttributeNS(null, 'multiple') ? 'select-multiple' : 'select-one';
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		for (let i = 0, max = this[PropertySymbol.options].length; i < max; i++) {
			const option = <HTMLOptionElement>this[PropertySymbol.options][i];
			if (option[PropertySymbol.selectedness]) {
				return option.value;
			}
		}

		return '';
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		for (let i = 0, max = this[PropertySymbol.options].length; i < max; i++) {
			const option = <HTMLOptionElement>this[PropertySymbol.options][i];
			if (option.value === value) {
				option[PropertySymbol.selectedness] = true;
				option[PropertySymbol.dirtyness] = true;
			} else {
				option[PropertySymbol.selectedness] = false;
			}
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get selectedIndex(): number {
		return this[PropertySymbol.options].selectedIndex;
	}

	/**
	 * Sets value.
	 *
	 * @param selectedIndex Selected index.
	 */
	public set selectedIndex(selectedIndex: number) {
		this[PropertySymbol.options].selectedIndex = selectedIndex;
	}

	/**
	 * Returns selected options.
	 *
	 * @returns HTMLCollection.
	 */
	public get selectedOptions(): IHTMLCollection<HTMLOptionElement> {
		if (!this[PropertySymbol.selectedOptions]) {
			this[PropertySymbol.selectedOptions] = new HTMLCollection<HTMLOptionElement>({
				filter: (element: Element) =>
					element[PropertySymbol.tagName] === 'OPTION' && element[PropertySymbol.selectedness]
			});
			for (const option of this[PropertySymbol.options]) {
				if (option[PropertySymbol.selectedness]) {
					this[PropertySymbol.selectedOptions][PropertySymbol.addItem](option);
				}
			}
		}
		return this[PropertySymbol.selectedOptions];
	}

	/**
	 * Returns the associated label elements.
	 *
	 * @returns Label elements.
	 */
	public get labels(): NodeList<HTMLLabelElement> {
		return HTMLLabelElementUtility.getAssociatedLabelElements(this);
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): HTMLFormElement {
		return <HTMLFormElement>this[PropertySymbol.formNode];
	}

	/**
	 * Returns "true" if it will validate.
	 *
	 * @returns "true" if it will validate.
	 */
	public get willValidate(): boolean {
		return (
			this.type !== 'hidden' &&
			this.type !== 'reset' &&
			this.type !== 'button' &&
			!this.disabled &&
			!this['readOnly']
		);
	}

	/**
	 * Returns item from options collection by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): HTMLOptionElement {
		return this[PropertySymbol.options].item(index);
	}

	/**
	 * Adds new option to options collection.
	 *
	 * @param element HTMLOptionElement to add.
	 * @param before HTMLOptionElement or index number.
	 */
	public add(element: HTMLOptionElement, before?: number | HTMLOptionElement): void {
		this[PropertySymbol.options].add(element, before);
	}

	/**
	 * Removes indexed element from collection or the select element.
	 *
	 * @param [index] Index.
	 */
	public override remove(index?: number): void {
		if (typeof index === 'number') {
			this[PropertySymbol.options].remove(index);
		} else {
			super.remove();
		}
	}

	/**
	 * Sets validation message.
	 *
	 * @param message Message.
	 */
	public setCustomValidity(message: string): void {
		this[PropertySymbol.validationMessage] = String(message);
	}

	/**
	 * Checks validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	public checkValidity(): boolean {
		const valid = this.disabled || this[PropertySymbol.validity].valid;
		if (!valid) {
			this.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
		}
		return valid;
	}

	/**
	 * Reports validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	public reportValidity(): boolean {
		return this.checkValidity();
	}
}
