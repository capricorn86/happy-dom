import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLFormElement from './HTMLFormElement.js';
import IRadioNodeList from './IRadioNodeList.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection extends HTMLCollection<
	THTMLFormControlElement,
	THTMLFormControlElement | IRadioNodeList
> {
	public [PropertySymbol.namedItems] = new Map<string, IRadioNodeList>();
	#formElement: HTMLFormElement;

	/**
	 * Constructor.
	 *
	 * @param formElement Form element.
	 */
	constructor(formElement: HTMLFormElement) {
		super({
			filter: (item: THTMLFormControlElement) =>
				item[PropertySymbol.tagName] === 'INPUT' ||
				item[PropertySymbol.tagName] === 'SELECT' ||
				item[PropertySymbol.tagName] === 'TEXTAREA' ||
				item[PropertySymbol.tagName] === 'BUTTON' ||
				item[PropertySymbol.tagName] === 'FIELDSET',
			// Array.splice() method creates a new instance of HTMLOptionsCollection with a number sent as the first argument.
			observeNode: formElement instanceof HTMLFormElement ? formElement : null,
			synchronizedPropertiesElement: formElement
		});
		this.#formElement = formElement;
	}

	/**
	 * @override
	 */
	public namedItem(name: string): THTMLFormControlElement | IRadioNodeList | null {
		const namedItems = this[PropertySymbol.namedItems].get(name);

		if (!namedItems?.length) {
			return null;
		}

		if (namedItems.length === 1) {
			return namedItems[0];
		}

		return namedItems;
	}

	/**
	 * Appends item.
	 *
	 * @param item Item.
	 * @returns True if added.
	 */
	public [PropertySymbol.addItem](item: THTMLFormControlElement): boolean {
		const returnValue = super[PropertySymbol.addItem](item);

		if (!returnValue) {
			return false;
		}

		item[PropertySymbol.formNode] = this.#formElement;

		return true;
	}

	/**
	 * Inserts item before another item.
	 *
	 * @param newItem New item.
	 * @param [referenceItem] Reference item.
	 * @returns True if inserted.
	 */
	public [PropertySymbol.insertItem](
		newItem: THTMLFormControlElement,
		referenceItem: THTMLFormControlElement | null
	): boolean {
		const returnValue = super[PropertySymbol.insertItem](newItem, referenceItem);

		if (!returnValue) {
			return false;
		}

		newItem[PropertySymbol.formNode] = this.#formElement;

		return true;
	}

	/**
	 * Removes item.
	 *
	 * @param item Item.
	 * @returns True if removed.
	 */
	public [PropertySymbol.removeItem](item: THTMLFormControlElement): boolean {
		const returnValue = super[PropertySymbol.removeItem](item);

		if (!returnValue) {
			return false;
		}

		item[PropertySymbol.formNode] = null;

		return true;
	}

	/**
	 * Sets named item property.
	 *
	 * @param name Name.
	 */
	protected [PropertySymbol.setNamedItemProperty](name: string): void {
		if (!this[PropertySymbol.isValidPropertyName](name)) {
			return;
		}

		const namedItems = this[PropertySymbol.namedItems].get(name);

		if (namedItems?.length) {
			const newValue = namedItems.length === 1 ? namedItems[0] : namedItems;
			if (Object.getOwnPropertyDescriptor(this, name)?.value !== newValue) {
				Object.defineProperty(this, name, {
					value: newValue,
					writable: false,
					enumerable: true,
					configurable: true
				});
			}
		} else {
			delete this[name];
		}

		this[PropertySymbol.dispatchEvent]('propertyChange', {
			propertyName: name,
			propertyValue: this[name] ?? null
		});
	}
}
