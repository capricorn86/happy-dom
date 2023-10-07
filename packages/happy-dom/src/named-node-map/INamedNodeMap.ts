import IAttr from '../nodes/attr/IAttr.js';

/**
 * NamedNodeMap.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap.
 */
export default interface INamedNodeMap {
	[index: number]: IAttr;
	[Symbol.toStringTag]: string;
	readonly length: number;

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	item: (index: number) => IAttr | null;

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Item.
	 */
	getNamedItem(name: string): IAttr | null;

	/**
	 * Returns item by name and namespace.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 * @returns Item.
	 */
	getNamedItemNS(namespace: string, localName: string): IAttr | null;

	/**
	 * Sets named item.
	 *
	 * @param item Item.
	 * @returns Replaced item.
	 */
	setNamedItem(item: IAttr): IAttr | null;

	/**
	 * Adds a new namespaced item.
	 *
	 * @param item Item.
	 * @returns Replaced item.
	 */
	setNamedItemNS(item: IAttr): IAttr | null;

	/**
	 * Removes an item.
	 *
	 * @param name Name of item.
	 * @returns Removed item.
	 */
	removeNamedItem(name: string): IAttr | null;

	/**
	 * Removes a namespaced item.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the item.
	 * @returns Removed item.
	 */
	removeNamedItemNS(namespace: string, localName: string): IAttr | null;
}
