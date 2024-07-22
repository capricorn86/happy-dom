import * as PropertySymbol from '../../PropertySymbol.js';
import Attr from '../attr/Attr.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import Element from './Element.js';
import NamespaceURI from '../../config/NamespaceURI.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class NamedNodeMap {
	[index: number]: Attr;

	public length = 0;
	public [PropertySymbol.namedItems]: Map<string, Attr> = new Map();
	public [PropertySymbol.ownerElement]: Element;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 */
	constructor(ownerElement: Element) {
		this[PropertySymbol.ownerElement] = ownerElement;
	}

	/**
	 * Returns string.
	 *
	 * @returns string.
	 */
	public get [Symbol.toStringTag](): string {
		return 'NamedNodeMap';
	}

	/**
	 * Iterator.
	 *
	 * @returns Iterator.
	 */
	public *[Symbol.iterator](): IterableIterator<Attr> {
		for (let i = 0, max = this.length; i < max; i++) {
			yield this[i];
		}
	}

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): Attr | null {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Item.
	 */
	public getNamedItem(name: string): Attr | null {
		return (
			this[PropertySymbol.namedItems].get(
				this.#getAttributeName(this[PropertySymbol.ownerElement][PropertySymbol.namespaceURI], name)
			) || null
		);
	}

	/**
	 * Returns item by name and namespace.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 * @returns Item.
	 */
	public getNamedItemNS(namespace: string, localName: string): Attr | null {
		for (let i = 0; i < this.length; i++) {
			const item = this[i];
			if (
				item[PropertySymbol.namespaceURI] === namespace &&
				item[PropertySymbol.localName] === localName
			) {
				return item;
			}
		}
		return null;
	}

	/**
	 * Sets named item.
	 *
	 * @param item Item.
	 * @returns Replaced item.
	 */
	public setNamedItem(item: Attr): Attr | null {
		return this[PropertySymbol.setNamedItem](item);
	}

	/**
	 * Adds a new namespaced item.
	 *
	 * @alias setNamedItem()
	 * @param item Item.
	 * @returns Replaced item.
	 */
	public setNamedItemNS(item: Attr): Attr | null {
		return this[PropertySymbol.setNamedItem](item);
	}

	/**
	 * Removes an item.
	 *
	 * @throws DOMException
	 * @param name Name of item.
	 * @returns Removed item.
	 */
	public removeNamedItem(name: string): Attr {
		const item = this.getNamedItem(name);
		if (!item) {
			throw new DOMException(
				`Failed to execute 'removeNamedItem' on 'NamedNodeMap': No item with name '${name}' was found.`,
				DOMExceptionNameEnum.notFoundError
			);
		}
		this[PropertySymbol.removeNamedItem](item);
		return item;
	}

	/**
	 * Removes a namespaced item.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the item.
	 * @returns Removed item.
	 */
	public removeNamedItemNS(namespace: string, localName: string): Attr | null {
		const item = this.getNamedItemNS(namespace, localName);
		if (!item) {
			throw new DOMException(
				`Failed to execute 'removeNamedItemNS' on 'NamedNodeMap': No item with name '${localName}' in namespace '${namespace}' was found.`,
				DOMExceptionNameEnum.notFoundError
			);
		}
		this[PropertySymbol.removeNamedItem](item);
		return item;
	}

	/**
	 * Sets named item.
	 *
	 * @param item Item.
	 * @param [ignoreListeners] Ignores listeners.
	 * @returns Replaced item.
	 */
	public [PropertySymbol.setNamedItem](item: Attr, ignoreListeners = false): Attr | null {
		if (!item[PropertySymbol.name]) {
			return null;
		}

		(<Element>item[PropertySymbol.ownerElement]) = this[PropertySymbol.ownerElement];

		const namespaceURI =
			item[PropertySymbol.namespaceURI] ??
			this[PropertySymbol.ownerElement][PropertySymbol.namespaceURI];
		const name = this.#getAttributeName(namespaceURI, item[PropertySymbol.name]);
		const replacedItem = this[PropertySymbol.namedItems].get(name) || null;

		this[PropertySymbol.namedItems].set(name, item);

		if (replacedItem) {
			this.#removeNamedItemIndex(replacedItem);
		}

		this[this.length] = item;
		this.length++;

		if (name === item[PropertySymbol.name] && this.#isValidPropertyName(name)) {
			this[name] = item;
		}

		if (!ignoreListeners) {
			this[PropertySymbol.ownerElement][PropertySymbol.onSetAttribute](item, replacedItem);
		}

		return replacedItem;
	}

	/**
	 * Removes an item.
	 *
	 * @param item Item.
	 * @param [ignoreListeners] Ignores listeners.
	 */
	public [PropertySymbol.removeNamedItem](item: Attr, ignoreListeners = false): void {
		this.#removeNamedItemIndex(item);

		const name = item[PropertySymbol.name];

		if (this[name] === item) {
			delete this[name];
		}

		this[PropertySymbol.namedItems].delete(name);

		if (!ignoreListeners) {
			this[PropertySymbol.ownerElement][PropertySymbol.onRemoveAttribute](item);
		}
	}

	/**
	 * Removes an item from index.
	 *
	 * @param item Item.
	 */
	#removeNamedItemIndex(item: Attr): void {
		for (let i = 0; i < this.length; i++) {
			if (this[i] === item) {
				for (let b = i; b < this.length; b++) {
					if (b < this.length - 1) {
						this[b] = this[b + 1];
					} else {
						delete this[b];
					}
				}
				this.length--;
				break;
			}
		}
	}

	/**
	 * Returns "true" if the property name is valid.
	 *
	 * @param name Name.
	 * @returns True if the property name is valid.
	 */
	#isValidPropertyName(name: string): boolean {
		return (
			!!name &&
			!this.constructor.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}

	/**
	 * Returns attribute name.
	 *
	 * @param namespace Namespace.
	 * @param name Name.
	 * @returns Attribute name based on namespace.
	 */
	#getAttributeName(namespace: string, name: string): string {
		if (namespace === NamespaceURI.svg) {
			return name;
		}
		return name.toLowerCase();
	}
}
