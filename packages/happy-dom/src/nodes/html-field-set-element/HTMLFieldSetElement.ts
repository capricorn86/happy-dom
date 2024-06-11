import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLInputElement from '../html-input-element/HTMLInputElement.js';
import HTMLTextAreaElement from '../html-text-area-element/HTMLTextAreaElement.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import HTMLButtonElement from '../html-button-element/HTMLButtonElement.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import Node from '../node/Node.js';
import Element from '../element/Element.js';

type THTMLFieldSetElement =
	| HTMLInputElement
	| HTMLButtonElement
	| HTMLTextAreaElement
	| HTMLSelectElement;

/**
 * HTMLFieldSetElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement
 */
export default class HTMLFieldSetElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLFieldSetElement;

	// Internal properties
	public [PropertySymbol.elements] = new HTMLCollection<THTMLFieldSetElement>(
		(item: Element) =>
			item.tagName === 'INPUT' ||
			item.tagName === 'BUTTON' ||
			item.tagName === 'TEXTAREA' ||
			item.tagName === 'SELECT'
	);
	public [PropertySymbol.formNode]: HTMLFormElement | null = null;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor() {
		super();
		// Child nodes listeners
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener]('add', (item: Node) => {
			this[PropertySymbol.elements][PropertySymbol.addItem](<THTMLFieldSetElement>item);
		});
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener](
			'insert',
			(newItem: Node, referenceItem: Node | null) => {
				this[PropertySymbol.elements][PropertySymbol.insertItem](
					<THTMLFieldSetElement>newItem,
					<THTMLFieldSetElement>referenceItem
				);
			}
		);
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener](
			'remove',
			(item: Node) => {
				(<THTMLFieldSetElement>item)[PropertySymbol.formNode] = null;
				this[PropertySymbol.elements][PropertySymbol.removeItem](<THTMLFieldSetElement>item);
			}
		);
	}

	/**
	 * Returns elements.
	 *
	 * @returns Elements.
	 */
	public get elements(): IHTMLCollection<
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
}
