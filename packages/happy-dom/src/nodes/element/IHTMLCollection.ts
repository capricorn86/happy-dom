/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable filenames/match-exported */

import * as PropertySymbol from '../../PropertySymbol.js';
import Element from './Element.js';

/**
 * HTMLCollection.
 *
 * This interface is used to hide Array methods from the outside.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
 */
export default interface IHTMLCollection<T extends Element, NamedItem = T> {
	[index: number]: T;

	/**
	 * Returns the number of items in the collection.
	 *
	 * @returns Number of items.
	 */
	readonly length: number;

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 * @returns Item.
	 */
	item(index: number): T | null;

	/**
	 * Returns item by name.
	 *
	 * @param name Name.
	 * @returns Item.
	 */
	namedItem(name: string): NamedItem | null;

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
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	[Symbol.iterator](): IterableIterator<T>;

	/**
	 * Index of item.
	 *
	 * @param item Item.
	 * @returns Index.
	 */
	[PropertySymbol.indexOf](item?: T): number;

	/**
	 * Returns true if the item is in the list.
	 *
	 * @param item Item.
	 * @returns True if the item is in the list.
	 */
	[PropertySymbol.includes](item: T): boolean;
}
