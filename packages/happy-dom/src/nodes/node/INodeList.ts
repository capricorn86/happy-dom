import * as PropertySymbol from '../../PropertySymbol.js';
import Element from '../element/Element.js';
import IHTMLCollection from '../element/IHTMLCollection.js';

/**
 * NodeList.
 *
 * This interface is used to hide Array methods from the outside.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeList
 */
export default interface INodeList<T> {
	readonly [index: number]: T;
	[PropertySymbol.attachedHTMLCollection]: IHTMLCollection<Element> | null;

	/**
	 * The number of items in the NodeList.
	 */
	readonly length: number;

	/**
	 * Returns `Symbol.toStringTag`.
	 *
	 * @returns `Symbol.toStringTag`.
	 */
	readonly [Symbol.toStringTag]: string;

	/**
	 * Returns `[object NodeList]`.
	 *
	 * @returns `[object NodeList]`.
	 */
	toLocaleString(): string;

	/**
	 * Returns `[object NodeList]`.
	 *
	 * @returns `[object NodeList]`.
	 */
	toString(): string;

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	item(index: number): T;

	/**
	 * Appends item.
	 *
	 * @param item Item.
	 * @returns True if added.
	 */
	[PropertySymbol.addItem](item: T): boolean;

	/**
	 * Inserts item before another item.
	 *
	 * @param newItem New item.
	 * @param [referenceItem] Reference item.
	 * @returns True if inserted.
	 */
	[PropertySymbol.insertItem](newItem: T, referenceItem: T | null): boolean;

	/**
	 * Removes item.
	 *
	 * @param item Item.
	 * @returns True if removed.
	 */
	[PropertySymbol.removeItem](item: T): boolean;

	/**
	 * Index of item.
	 *
	 * @param item Item.
	 * @returns Index.
	 */
	[PropertySymbol.indexOf](item: T): number;

	/**
	 * Returns true if the item is in the list.
	 *
	 * @param item Item.
	 * @returns True if the item is in the list.
	 */
	[PropertySymbol.includes](item: T): boolean;

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	[Symbol.iterator](): IterableIterator<T>;

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	values(): IterableIterator<T>;

	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 *
	 */
	keys(): IterableIterator<number>;

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	entries(): IterableIterator<[number, T]>;
}
