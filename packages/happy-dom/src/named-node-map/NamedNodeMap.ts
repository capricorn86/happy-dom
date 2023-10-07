import INamedNodeMap from './INamedNodeMap.js';
import IAttr from '../nodes/attr/IAttr.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class NamedNodeMap implements INamedNodeMap {
	[index: number]: IAttr;
	public length = 0;
	protected _namedItems: { [k: string]: IAttr } = {};

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
	public *[Symbol.iterator](): IterableIterator<IAttr> {
		for (let i = 0, max = this.length; i < max; i++) {
			yield this[i];
		}
	}

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): IAttr | null {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Item.
	 */
	public getNamedItem(name: string): IAttr | null {
		return this._namedItems[name] || null;
	}

	/**
	 * Returns item by name and namespace.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 * @returns Item.
	 */
	public getNamedItemNS(namespace: string, localName: string): IAttr | null {
		const attribute = this.getNamedItem(localName);

		if (attribute && attribute.namespaceURI === namespace && attribute.localName === localName) {
			return attribute;
		}

		for (let i = 0, max = this.length; i < max; i++) {
			if (this[i].namespaceURI === namespace && this[i].localName === localName) {
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
	public setNamedItem(item: IAttr): IAttr | null {
		return this._setNamedItemWithoutConsequences(item);
	}

	/**
	 * Adds a new namespaced item.
	 *
	 * @alias setNamedItem()
	 * @param item Item.
	 * @returns Replaced item.
	 */
	public setNamedItemNS(item: IAttr): IAttr | null {
		return this.setNamedItem(item);
	}

	/**
	 * Removes an item.
	 *
	 * @throws DOMException
	 * @param name Name of item.
	 * @returns Removed item.
	 */
	public removeNamedItem(name: string): IAttr {
		const item = this._removeNamedItem(name);
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
	public removeNamedItemNS(namespace: string, localName: string): IAttr | null {
		const attribute = this.getNamedItemNS(namespace, localName);
		if (attribute) {
			return this.removeNamedItem(attribute.name);
		}
		return null;
	}

	/**
	 * Sets named item without calling listeners for certain attributes.
	 *
	 * @param item Item.
	 * @returns Replaced item.
	 */
	public _setNamedItemWithoutConsequences(item: IAttr): IAttr | null {
		if (item.name) {
			const replacedItem = this._namedItems[item.name] || null;

			this._namedItems[item.name] = item;

			if (replacedItem) {
				this._removeNamedItemIndex(replacedItem);
			}

			this[this.length] = item;
			this.length++;

			if (this._isValidPropertyName(item.name)) {
				this[item.name] = item;
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
	public _removeNamedItem(name: string): IAttr | null {
		return this._removeNamedItemWithoutConsequences(name);
	}

	/**
	 * Removes an item without calling listeners for certain attributes.
	 *
	 * @param name Name of item.
	 * @returns Removed item, or null if it didn't exist.
	 */
	public _removeNamedItemWithoutConsequences(name: string): IAttr | null {
		const removedItem = this._namedItems[name] || null;

		if (!removedItem) {
			return null;
		}

		this._removeNamedItemIndex(removedItem);

		if (this[name] === removedItem) {
			delete this[name];
		}

		delete this._namedItems[name];

		return removedItem;
	}

	/**
	 * Removes an item from index.
	 *
	 * @param item Item.
	 */
	protected _removeNamedItemIndex(item: IAttr): void {
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
	protected _isValidPropertyName(name: string): boolean {
		return (
			!this.constructor.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}
}
