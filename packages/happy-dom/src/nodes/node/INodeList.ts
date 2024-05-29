import * as PropertySymbol from '../../PropertySymbol.js';
import TNodeListListener from './TNodeListListener.js';

/**
 * NodeList.
 *
 * This interface is used to hide Array methods from the outside.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeList
 */
export default interface INodeList<T> {
	readonly [index: number]: T;

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
	 * Adds event listener.
	 *
	 * @param type Type.
	 * @param listener Listener.
	 */
	[PropertySymbol.addEventListener](
		type: 'add' | 'insert' | 'remove',
		listener: TNodeListListener<T>
	): void;

	/**
	 * Removes event listener.
	 *
	 * @param type Type.
	 * @param listener Listener.
	 */
	[PropertySymbol.removeEventListener](
		type: 'add' | 'insert' | 'remove',
		listener: TNodeListListener<T>
	): void;

	/**
	 * Dispatches event.
	 *
	 * @param type Type.
	 * @param item Item.
	 * @param referenceItem Reference item.
	 */
	[PropertySymbol.dispatchEvent](
		type: 'add' | 'insert' | 'remove',
		item: T,
		referenceItem?: T | null
	): void;

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
