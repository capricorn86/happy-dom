import * as PropertySymbol from '../../PropertySymbol.js';
import Attr from '../attr/Attr.js';
import Node from '../node/Node.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import Element from './Element.js';
import IHTMLCollection from './IHTMLCollection.js';
import THTMLCollectionListener from './THTMLCollectionListener.js';
import TNamedNodeMapListener from './TNamedNodeMapListener.js';

const NAMED_ITEM_ATTRIBUTES = ['id', 'name'];

/**
 * HTMLCollection.
 *
 * We are extending Array here to improve performance.
 * However, we should not expose Array methods to the outside.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
 */
class HTMLCollection<T, NamedItem = T> extends Array<T> implements IHTMLCollection<T, NamedItem> {
	public [PropertySymbol.namedItems] = new Map<string, Array<T>>();
	#namedNodeMapListeners = new Map<
		T,
		{ set: TNamedNodeMapListener; remove: TNamedNodeMapListener }
	>();
	#eventListeners: {
		indexChange: WeakRef<THTMLCollectionListener<T>>[];
		propertyChange: WeakRef<THTMLCollectionListener<T>>[];
	} = {
		indexChange: [],
		propertyChange: []
	};
	#filter: (item: T) => boolean | null;

	/**
	 * Constructor.
	 *
	 * @param [filter] Filter.
	 * @param items
	 */
	constructor(
		filter?: (item: T) => boolean,
		items?: Array<{ [index: number]: T; length: number }>
	) {
		super();

		this.#filter = filter || null;

		if (items) {
			for (let i = 0, max = items.length; i < max; i++) {
				this[PropertySymbol.addItem](<T>items[i]);
			}
		}
	}

	/**
	 * Returns `Symbol.toStringTag`.
	 *
	 * @returns `Symbol.toStringTag`.
	 */
	public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Returns `[object HTMLCollection]`.
	 *
	 * @returns `[object HTMLCollection]`.
	 */
	public toLocaleString(): string {
		return `[object ${this.constructor.name}]`;
	}

	/**
	 * Returns `[object HTMLCollection]`.
	 *
	 * @returns `[object HTMLCollection]`.
	 */
	public toString(): string {
		return `[object ${this.constructor.name}]`;
	}

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): T {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	public namedItem(name: string): NamedItem | null {
		return this[PropertySymbol.namedItems][name] && this[PropertySymbol.namedItems][name].length
			? this[PropertySymbol.namedItems][name][0]
			: null;
	}

	/**
	 * Appends item.
	 *
	 * @param item Item.
	 * @returns True if the item was added.
	 */
	public [PropertySymbol.addItem](item: T): boolean {
		const filter = this.#filter;

		if (item[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode || (filter && !filter?.(item))) {
			return false;
		}

		if (super.includes(item)) {
			this[PropertySymbol.removeItem](item);
		}

		super.push(item);

		this.#addNamedItem(item);
		this[PropertySymbol.dispatchEvent]('indexChange', { index: this.length - 1, item });

		return true;
	}

	/**
	 * Inserts item before another item.
	 *
	 * @param newItem New item.
	 * @param [referenceItem] Reference item.
	 * @returns True if the item was added.
	 */
	public [PropertySymbol.insertItem](newItem: T, referenceItem: T | null): boolean {
		if (!referenceItem) {
			return this[PropertySymbol.addItem](newItem);
		}

		const filter = this.#filter;

		if (
			newItem[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode ||
			(filter && !filter?.(newItem))
		) {
			return false;
		}

		if (super.includes(newItem)) {
			this[PropertySymbol.removeItem](newItem);
		}

		if (!referenceItem) {
			return this[PropertySymbol.addItem](newItem);
		}

		let referenceItemIndex: number = -1;

		if (referenceItem[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
			referenceItemIndex = this[PropertySymbol.indexOf](referenceItem);
		} else {
			const parentChildNodes = (<Node>referenceItem).parentNode?.[PropertySymbol.childNodes];
			for (
				let i = parentChildNodes[PropertySymbol.indexOf](<Node>referenceItem),
					max = parentChildNodes.length;
				i < max;
				i++
			) {
				if (
					parentChildNodes[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
					(!filter || filter(<T>parentChildNodes[i]))
				) {
					referenceItemIndex = this[PropertySymbol.indexOf](<T>parentChildNodes[i]);
					break;
				}
			}
		}

		if (referenceItemIndex === -1) {
			throw new Error(
				'Failed to execute "insertItem" on "HTMLCollection": The node before which the new node is to be inserted is not an item of this collection.'
			);
		}

		super.splice(referenceItemIndex, 0, newItem);

		this.#addNamedItem(newItem);
		this[PropertySymbol.dispatchEvent]('indexChange', { index: referenceItemIndex, item: newItem });

		return true;
	}

	/**
	 * Removes item.
	 *
	 * @param item Item.
	 * @returns True if removed.
	 */
	public [PropertySymbol.removeItem](item: T): boolean {
		const index = super.indexOf(item);

		if (index === -1) {
			return false;
		}

		super.splice(index, 1);

		this.#removeNamedItem(item);
		this[PropertySymbol.dispatchEvent]('indexChange', { index: 0, item: null });

		return true;
	}

	/**
	 * Index of item.
	 *
	 * @param item Item.
	 * @returns Index.
	 */
	public [PropertySymbol.indexOf](item: T): number {
		return super.indexOf(item);
	}

	/**
	 * Returns true if the item is in the list.
	 *
	 * @param item Item.
	 * @returns True if the item is in the list.
	 */
	public [PropertySymbol.includes](item: T): boolean {
		return super.includes(item);
	}

	/**
	 * Adds event listener.
	 *
	 * @param type Type.
	 * @param listener Listener.
	 */
	public [PropertySymbol.addEventListener](
		type: 'indexChange' | 'propertyChange',
		listener: THTMLCollectionListener<T>
	): void {
		this.#eventListeners[type].push(new WeakRef(listener));
	}

	/**
	 * Removes event listener.
	 *
	 * @param type Type.
	 * @param listener Listener.
	 */
	public [PropertySymbol.removeEventListener](
		type: 'indexChange' | 'propertyChange',
		listener: THTMLCollectionListener<T>
	): void {
		const listeners = this.#eventListeners[type];
		for (let i = 0, max = listeners.length; i < max; i++) {
			if (listeners[i].deref() === listener) {
				listeners.splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Dispatches event.
	 *
	 * @param type Type.
	 * @param details Options.
	 * @param [details.index] Index.
	 * @param [details.item] Item.
	 * @param [details.propertyName] Property name.
	 * @param [details.propertyValue] Property value.
	 */
	public [PropertySymbol.dispatchEvent](
		type: 'indexChange' | 'propertyChange',
		details: {
			index?: number;
			item?: T;
			propertyName?: string;
			propertyValue?: any;
		}
	): void {
		const listeners = this.#eventListeners[type];
		for (let i = 0, max = listeners.length; i < max; i++) {
			const listener = listeners[i].deref();
			if (listener) {
				listener(details);
			} else {
				listeners.splice(i, 1);
				i--;
				max--;
			}
		}
	}

	/**
	 * Returns named items.
	 *
	 * @param name Name.
	 * @returns Named items.
	 */
	protected [PropertySymbol.getNamedItems](name: string): T[] {
		return this[PropertySymbol.namedItems].get(name) || [];
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
			if (Object.getOwnPropertyDescriptor(this, name)?.value !== namedItems[0]) {
				Object.defineProperty(this, name, {
					value: namedItems[0],
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

	/**
	 * Returns "true" if the property name is valid.
	 *
	 * @param name Name.
	 * @returns True if the property name is valid.
	 */
	protected [PropertySymbol.isValidPropertyName](name: string): boolean {
		return (
			!!name &&
			!this.constructor.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}

	/**
	 * Updates named item.
	 *
	 * @param item Item.
	 * @param attributeName Attribute name.
	 */
	#updateNamedItem(item: T, attributeName: string): void {
		const filter = this.#filter;

		if (item[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode || (filter && !filter?.(item))) {
			return;
		}

		const name = (<Element>item)[PropertySymbol.attributes][attributeName]?.value;

		if (name) {
			const namedItems = this[PropertySymbol.getNamedItems](name);

			if (!namedItems.includes(item)) {
				this[PropertySymbol.namedItems].set(name, namedItems);
				this[PropertySymbol.setNamedItemProperty](name);
			}
		} else {
			const namedItems = this[PropertySymbol.getNamedItems](name);
			const index = namedItems.indexOf(item);

			if (index !== -1) {
				namedItems.splice(index, 1);
			}

			this[PropertySymbol.setNamedItemProperty](name);
		}
	}

	/**
	 * Adds named item to collection.
	 *
	 * @param item Item.
	 */
	#addNamedItem(item: T): void {
		const listeners = {
			set: (attribute: Attr) => {
				if (NAMED_ITEM_ATTRIBUTES.includes(attribute.name)) {
					this.#updateNamedItem(item, attribute.name);
				}
			},
			remove: (attribute: Attr) => {
				if (NAMED_ITEM_ATTRIBUTES.includes(attribute.name)) {
					this.#updateNamedItem(item, attribute.name);
				}
			}
		};

		item[PropertySymbol.attributes][PropertySymbol.addEventListener]('set', listeners.set);
		item[PropertySymbol.attributes][PropertySymbol.addEventListener]('remove', listeners.remove);

		for (const attributeName of NAMED_ITEM_ATTRIBUTES) {
			const name = (<Element>item)[PropertySymbol.attributes][attributeName]?.value;
			if (name) {
				const namedItems = this[PropertySymbol.getNamedItems](name);

				if (namedItems.includes(item)) {
					return;
				}

				this[PropertySymbol.namedItems].set(name, namedItems);

				this[PropertySymbol.setNamedItemProperty](name);
			}
		}
	}

	/**
	 * Removes named item from collection.
	 *
	 * @param item Item.
	 */
	#removeNamedItem(item: T): void {
		const listeners = this.#namedNodeMapListeners.get(item);

		if (listeners) {
			item[PropertySymbol.attributes][PropertySymbol.removeEventListener]('set', listeners.set);
			item[PropertySymbol.attributes][PropertySymbol.removeEventListener](
				'remove',
				listeners.remove
			);
		}

		for (const attributeName of NAMED_ITEM_ATTRIBUTES) {
			const name = (<Element>item)[PropertySymbol.attributes][attributeName]?.value;
			if (name) {
				const namedItems = this[PropertySymbol.getNamedItems](name);

				const index = namedItems.indexOf(item);

				if (index === -1) {
					return;
				}

				namedItems.splice(index, 1);

				this[PropertySymbol.setNamedItemProperty](name);
			}
		}
	}
}

// Removes Array methods from HTMLCollection.
const descriptors = Object.getOwnPropertyDescriptors(Array.prototype);
for (const key of Object.keys(descriptors)) {
	const descriptor = descriptors[key];
	if (key === 'length') {
		Object.defineProperty(HTMLCollection.prototype, key, {
			set: () => {},
			get: descriptor.get
		});
	} else {
		if (typeof descriptor.value === 'function') {
			Object.defineProperty(HTMLCollection.prototype, key, {});
		}
	}
}

// Forces the type to be an interface to hide Array methods from the outside.
export default HTMLCollection;
