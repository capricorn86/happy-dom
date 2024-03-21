import * as PropertySymbol from '../PropertySymbol.js';
import Attr from '../nodes/attr/Attr.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class NamedNodeMap {
	[index: number]: Attr;
	public length = 0;
	protected [PropertySymbol.namedItems]: { [k: string]: Attr } = {};

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
		return this[PropertySymbol.namedItems][name] || null;
	}

	/**
	 * Returns item by name and namespace.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 * @returns Item.
	 */
	public getNamedItemNS(namespace: string, localName: string): Attr | null {
		const attribute = this.getNamedItem(localName);

		if (
			attribute &&
			attribute[PropertySymbol.namespaceURI] === namespace &&
			attribute.localName === localName
		) {
			return attribute;
		}

		for (let i = 0, max = this.length; i < max; i++) {
			if (this[i][PropertySymbol.namespaceURI] === namespace && this[i].localName === localName) {
				return this[i];
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
		return this[PropertySymbol.setNamedItemWithoutConsequences](item);
	}

	/**
	 * Adds a new namespaced item.
	 *
	 * @alias setNamedItem()
	 * @param item Item.
	 * @returns Replaced item.
	 */
	public setNamedItemNS(item: Attr): Attr | null {
		return this.setNamedItem(item);
	}

	/**
	 * Removes an item.
	 *
	 * @throws DOMException
	 * @param name Name of item.
	 * @returns Removed item.
	 */
	public removeNamedItem(name: string): Attr {
		const item = this[PropertySymbol.removeNamedItem](name);
		if (!item) {
			throw new DOMException(
				`Failed to execute 'removeNamedItem' on 'NamedNodeMap': No item with name '${name}' was found.`,
				DOMExceptionNameEnum.notFoundError
			);
		}
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
		const attribute = this.getNamedItemNS(namespace, localName);
		if (attribute) {
			return this.removeNamedItem(attribute[PropertySymbol.name]);
		}
		return null;
	}

	/**
	 * Sets named item without calling listeners for certain attributes.
	 *
	 * @param item Item.
	 * @returns Replaced item.
	 */
	public [PropertySymbol.setNamedItemWithoutConsequences](item: Attr): Attr | null {
		if (item[PropertySymbol.name]) {
			const replacedItem = this[PropertySymbol.namedItems][item[PropertySymbol.name]] || null;

			this[PropertySymbol.namedItems][item[PropertySymbol.name]] = item;

			if (replacedItem) {
				this[PropertySymbol.removeNamedItemIndex](replacedItem);
			}

			this[this.length] = item;
			this.length++;

			if (this[PropertySymbol.isValidPropertyName](item[PropertySymbol.name])) {
				this[item[PropertySymbol.name]] = item;
			}

			return replacedItem;
		}
		return null;
	}

	/**
	 * Removes an item without throwing if it doesn't exist.
	 *
	 * @param name Name of item.
	 * @returns Removed item, or null if it didn't exist.
	 */
	public [PropertySymbol.removeNamedItem](name: string): Attr | null {
		return this[PropertySymbol.removeNamedItemWithoutConsequences](name);
	}

	/**
	 * Removes an item without calling listeners for certain attributes.
	 *
	 * @param name Name of item.
	 * @returns Removed item, or null if it didn't exist.
	 */
	public [PropertySymbol.removeNamedItemWithoutConsequences](name: string): Attr | null {
		const removedItem = this[PropertySymbol.namedItems][name] || null;

		if (!removedItem) {
			return null;
		}

		this[PropertySymbol.removeNamedItemIndex](removedItem);

		if (this[name] === removedItem) {
			delete this[name];
		}

		delete this[PropertySymbol.namedItems][name];

		return removedItem;
	}

	/**
	 * Removes an item from index.
	 *
	 * @param item Item.
	 */
	protected [PropertySymbol.removeNamedItemIndex](item: Attr): void {
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
	protected [PropertySymbol.isValidPropertyName](name: string): boolean {
		return (
			!!name &&
			!this.constructor.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}
}
