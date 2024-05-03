import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLCollection from '../element/HTMLCollection2.js';
import HTMLInputElement from '../html-input-element/HTMLInputElement.js';
import HTMLTextAreaElement from '../html-text-area-element/HTMLTextAreaElement.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import HTMLButtonElement from '../html-button-element/HTMLButtonElement.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import Document from '../document/Document.js';
import Attr from '../attr/Attr.js';

/**
 * HTMLFieldSetElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement
 */
export default class HTMLFieldSetElement extends HTMLElement {
	// Internal properties
	public [PropertySymbol.elements] = new HTMLCollection<
		HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement | HTMLSelectElement
	>();
	public [PropertySymbol.formNode]: HTMLFormElement | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'set',
			this.#onSetAttribute.bind(this)
		);
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'remove',
			this.#onRemoveAttribute.bind(this)
		);
	}

	/**
	 * Returns elements.
	 *
	 * @returns Elements.
	 */
	public get elements(): HTMLCollection<
		HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement | HTMLSelectElement
	> {
		return this[PropertySymbol.elements];
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): HTMLFormElement {
		const formID = this.getAttribute('form');

		if (formID !== null) {
			if (!this[PropertySymbol.isConnected]) {
				return null;
			}
			return formID
				? <HTMLFormElement>(<Document>this[PropertySymbol.rootNode]).getElementById(formID)
				: null;
		}

		return <HTMLFormElement>this[PropertySymbol.formNode];
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
	 * Returns type "fieldset".
	 *
	 * @returns Type.
	 */
	public get type(): string {
		return 'fieldset';
	}

	/**
	 * Returns empty string as fieldset never candidates for constraint validation.
	 */
	public get validationMessage(): string {
		return '';
	}

	/**
	 * Returns will validate state.
	 *
	 * Always returns false as fieldset never candidates for constraint validation.
	 *
	 * @returns Will validate state.
	 */
	public get willValidate(): boolean {
		return false;
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
	 * Checks validity.
	 *
	 * Always returns true as fieldset never candidates for constraint validation.
	 *
	 * @returns "true" if the field is valid.
	 */
	public checkValidity(): boolean {
		return true;
	}

	/**
	 * Reports validity.
	 *
	 * Always returns true as fieldset never candidates for constraint validation.
	 *
	 * @returns Validity.
	 */
	public reportValidity(): boolean {
		return true;
	}

	/**
	 * Sets validation message.
	 *
	 * Does nothing as fieldset never candidates for constraint validation.
	 *
	 * @param _message Message.
	 */
	public setCustomValidity(_message: string): void {
		// Do nothing as fieldset never candidates for constraint validation.
	}

	/**
	 * Triggered when an attribute is set.
	 *
	 * @param attribute Attribute.
	 * @param replacedAttribute Replaced attribute.
	 */
	#onSetAttribute(attribute: Attr, replacedAttribute: Attr | null): void {
		this.form?.[PropertySymbol.appendFormControlItem](this, attribute, replacedAttribute);
	}

	/**
	 * Triggered when an attribute is removed.
	 *
	 * @param removedAttribute Removed attribute.
	 */
	#onRemoveAttribute(removedAttribute: Attr): void {
		this.form?.[PropertySymbol.removeFormControlItem](this, removedAttribute);
	}
}
