import * as PropertySymbol from '../../PropertySymbol.js';
import Attr from '../attr/Attr.js';
import Element from '../element/Element.js';
import HTMLCollection from '../element/HTMLCollection.js';
import TNamedNodeMapListener from '../element/TNamedNodeMapListener.js';
import HTMLFormElement from './HTMLFormElement.js';
import RadioNodeList from './RadioNodeList.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection extends HTMLCollection<
	THTMLFormControlElement,
	THTMLFormControlElement | RadioNodeList
> {
	public [PropertySymbol.namedItems] = new Map<string, RadioNodeList>();
	#namedNodeMapListeners = new Map<THTMLFormControlElement, TNamedNodeMapListener>();

	/**
	 * Constructor.
	 * @param formElement
	 */
	constructor(formElement: HTMLFormElement) {
		super((item: Element) => {
			if (
				item[PropertySymbol.tagName] !== 'INPUT' &&
				item[PropertySymbol.tagName] !== 'SELECT' &&
				item[PropertySymbol.tagName] !== 'TEXTAREA' &&
				item[PropertySymbol.tagName] !== 'BUTTON' &&
				item[PropertySymbol.tagName] !== 'FIELDSET'
			) {
				return false;
			}
			if (formElement[PropertySymbol.childNodesFlatten][PropertySymbol.includes](item)) {
				return true;
			}
			if (
				!item[PropertySymbol.attributes]['form'] ||
				!formElement[PropertySymbol.attributes]['id']
			) {
				return false;
			}
			return (
				item[PropertySymbol.attributes]['form'].value ===
				formElement[PropertySymbol.attributes]['id'].value
			);
		});
	}

	/**
	 * @override
	 */
	public namedItem(name: string): THTMLFormControlElement | RadioNodeList | null {
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

		const listener = (attribute: Attr): void => {
			if (attribute.name === 'form') {
				this[PropertySymbol.removeItem](item);
				this[PropertySymbol.addItem](item);
			}
		};

		this.#namedNodeMapListeners.set(item, listener);
		item[PropertySymbol.attributes][PropertySymbol.addEventListener]('set', listener);
		item[PropertySymbol.attributes][PropertySymbol.addEventListener]('remove', listener);

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

		const listener = (attribute: Attr): void => {
			if (attribute.name === 'form') {
				this[PropertySymbol.removeItem](newItem);
				this[PropertySymbol.insertItem](newItem, referenceItem);
			}
		};

		this.#namedNodeMapListeners.set(newItem, listener);
		newItem[PropertySymbol.attributes][PropertySymbol.addEventListener]('set', listener);
		newItem[PropertySymbol.attributes][PropertySymbol.addEventListener]('remove', listener);

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

		const listener = this.#namedNodeMapListeners.get(item);

		item[PropertySymbol.attributes][PropertySymbol.removeEventListener]('set', listener);
		item[PropertySymbol.attributes][PropertySymbol.removeEventListener]('remove', listener);

		return true;
	}

	/**
	 * Returns named items.
	 *
	 * @param name Name.
	 * @returns Named items.
	 */
	protected [PropertySymbol.getNamedItems](name: string): RadioNodeList {
		return this[PropertySymbol.namedItems].get(name) || new RadioNodeList();
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
