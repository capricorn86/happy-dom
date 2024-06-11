import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import ValidityState from '../../validity-state/ValidityState.js';
import HTMLLabelElement from '../html-label-element/HTMLLabelElement.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import HTMLOptionsCollection from './HTMLOptionsCollection.js';
import Event from '../../event/Event.js';
import Node from '../node/Node.js';
import HTMLLabelElementUtility from '../html-label-element/HTMLLabelElementUtility.js';
import HTMLCollection from '../element/HTMLCollection.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import Element from '../element/Element.js';
import NodeList from '../node/INodeList.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

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
	public [PropertySymbol.selectedOptions]: IHTMLCollection<HTMLOptionElement> =
		new HTMLCollection<HTMLOptionElement>(
			(element: Element) =>
				element[PropertySymbol.tagName] === 'OPTION' && element[PropertySymbol.selectedness]
		);

	// Events
	public onchange: (event: Event) => void | null = null;
	public oninput: (event: Event) => void | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Child nodes listeners
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener]('add', (item: Node) => {
			(<HTMLOptionElement>item)[PropertySymbol.selectNode] = this;
			this[PropertySymbol.options][PropertySymbol.addItem](<HTMLOptionElement>item);
			this[PropertySymbol.updateSelectedness]();
		});
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener](
			'insert',
			(newItem: Node, referenceItem: Node | null) => {
				(<HTMLOptionElement>newItem)[PropertySymbol.selectNode] = this;
				this[PropertySymbol.options][PropertySymbol.insertItem](
					<HTMLOptionElement>newItem,
					<HTMLOptionElement>referenceItem
				);
				this[PropertySymbol.updateSelectedness]();
			}
		);
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener](
			'remove',
			(item: Node) => {
				(<HTMLOptionElement>item)[PropertySymbol.selectNode] = null;
				this[PropertySymbol.options][PropertySymbol.removeItem](<HTMLOptionElement>item);
				this[PropertySymbol.updateSelectedness]();
			}
		);

		// HTMLOptionsCollection listeners
		this[PropertySymbol.options][PropertySymbol.addEventListener]('indexChange', (details) => {
			const length = this[PropertySymbol.options].length;
			for (let i = details.index; i < length; i++) {
				this[i] = this[PropertySymbol.options][i];
			}
			// Item removed
			if (!details.item) {
				delete this[length];
			}
		});
		this[PropertySymbol.options][PropertySymbol.addEventListener]('propertyChange', (details) => {
			if (!this[PropertySymbol.isValidPropertyName](details.propertyName)) {
				return;
			}
			if (details.propertyValue) {
				Object.defineProperty(this, details.propertyName, {
					value: details.propertyValue,
					writable: false,
					enumerable: true,
					configurable: true
				});
			} else {
				delete this[details.propertyName];
			}
		});
	}

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

	/**
	 * Updates option item.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/HTMLSelectElement-impl.js
	 *
	 * @see https://html.spec.whatwg.org/multipage/form-elements.html#selectedness-setting-algorithm
	 * @param [selectedOption] Selected option.
	 */
	public [PropertySymbol.updateSelectedness](selectedOption?: HTMLOptionElement): void {
		const options = this[PropertySymbol.options];
		const isMultiple = this.hasAttribute('multiple');
		const selectedOptions = this[PropertySymbol.selectedOptions];
		const selected: HTMLOptionElement[] = [];

		for (let i = 0, max = options.length; i < max; i++) {
			const option = <HTMLOptionElement>options[i];
			if (!isMultiple) {
				if (selectedOption) {
					option[PropertySymbol.selectedness] = option === selectedOption;
				}

				if (option[PropertySymbol.selectedness]) {
					selected.push(option);

					if (!selectedOptions[PropertySymbol.includes](option)) {
						selectedOptions[PropertySymbol.addItem](option);
					}
				} else {
					selectedOptions[PropertySymbol.removeItem](selectedOptions[0]);
				}
			}
		}

		const size = this.#getDisplaySize();

		if (size === 1 && !selected.length) {
			for (let i = 0, max = options.length; i < max; i++) {
				const option = <HTMLOptionElement>options[i];
				const parentNode = <HTMLElement>option[PropertySymbol.parentNode];
				let disabled = option.hasAttributeNS(null, 'disabled');

				if (
					parentNode &&
					parentNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
					parentNode[PropertySymbol.tagName] === 'OPTGROUP' &&
					parentNode.hasAttributeNS(null, 'disabled')
				) {
					disabled = true;
				}

				if (!disabled) {
					option[PropertySymbol.selectedness] = true;
					break;
				}
			}
		} else if (selected.length >= 2) {
			for (let i = 0, max = options.length; i < max; i++) {
				(<HTMLOptionElement>options[i])[PropertySymbol.selectedness] = i === selected.length - 1;
			}
		}
	}

	/**
	 * Returns display size.
	 *
	 * @returns Display size.
	 */
	#getDisplaySize(): number {
		if (this.hasAttributeNS(null, 'size')) {
			const size = parseInt(this.getAttribute('size'));
			if (!isNaN(size) && size >= 0) {
				return size;
			}
		}
		return this.hasAttributeNS(null, 'multiple') ? 4 : 1;
	}
}
