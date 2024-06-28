import * as PropertySymbol from '../../PropertySymbol.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import Element from '../element/Element.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import INodeList from './INodeList.js';

/**
 * NodeList.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeList
 */
class NodeList<T> extends Array<T> implements INodeList<T> {
	public [PropertySymbol.htmlCollection]: IHTMLCollection<Element> | null = null;

	/**
	 * Returns `Symbol.toStringTag`.
	 *
	 * @returns `Symbol.toStringTag`.
	 */
	public get [Symbol.toStringTag](): string {
		return 'NodeList';
	}

	/**
	 * Returns `[object NodeList]`.
	 *
	 * @returns `[object NodeList]`.
	 */
	public toLocaleString(): string {
		return '[object NodeList]';
	}

	/**
	 * Returns `[object NodeList]`.
	 *
	 * @returns `[object NodeList]`.
	 */
	public toString(): string {
		return '[object NodeList]';
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
	 * Appends item.
	 *
	 * @param item Item.
	 * @returns True if added.
	 */
	public [PropertySymbol.addItem](item: T): boolean {
		if (super.includes(item)) {
			return false;
		}

		super.push(item);

		if (this[PropertySymbol.htmlCollection]) {
			this[PropertySymbol.htmlCollection][PropertySymbol.addItem](<Element>item);
		}

		return true;
	}

	/**
	 * Inserts item before another item.
	 *
	 * @param newItem New item.
	 * @param [referenceItem] Reference item.
	 * @returns True if inserted.
	 */
	public [PropertySymbol.insertItem](newItem: T, referenceItem: T | null): boolean {
		if (!referenceItem) {
			return this[PropertySymbol.addItem](newItem);
		}

		if (super.includes(newItem)) {
			return false;
		}

		const index = super.indexOf(referenceItem);

		if (index === -1) {
			throw new DOMException(
				"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.",
				DOMExceptionNameEnum.notFoundError
			);
		}

		super.splice(index, 0, newItem);

		if (this[PropertySymbol.htmlCollection]) {
			const htmlCollectionReferenceItem = this[PropertySymbol.htmlCollection][index] || null;
			this[PropertySymbol.htmlCollection][PropertySymbol.insertItem](
				<Element>newItem,
				htmlCollectionReferenceItem
			);
		}

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
			throw new DOMException(
				"Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.",
				DOMExceptionNameEnum.notFoundError
			);
		}

		super.splice(index, 1);

		if (this[PropertySymbol.htmlCollection]) {
			this[PropertySymbol.htmlCollection][PropertySymbol.removeItem](<Element>item);
		}

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
	 * Returns a shallow copy of a portion of an array into a new array object selected from start to end.
	 *
	 * @param [start] Start.
	 * @param [end] End.
	 * @returns A new array containing the extracted elements.
	 */
	public [PropertySymbol.slice](start?: number, end?: number): T[] {
		return super.slice(start, end);
	}
}

// Removes Array methods from NodeList.
const descriptors = Object.getOwnPropertyDescriptors(Array.prototype);
for (const key of Object.keys(descriptors)) {
	if (
		typeof key !== 'symbol' &&
		key !== 'item' &&
		key !== 'entries' &&
		key !== 'values' &&
		key !== 'keys' &&
		key !== 'constructor'
	) {
		const descriptor = descriptors[key];
		if (key === 'length') {
			Object.defineProperty(NodeList.prototype, key, {
				set: () => {},
				get: descriptor.get
			});
		} else if (typeof descriptor.value === 'function') {
			Object.defineProperty(NodeList.prototype, key, {});
		}
	}
}

export default NodeList;
