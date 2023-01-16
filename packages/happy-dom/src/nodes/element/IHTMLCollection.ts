/**
 * HTMLCollection.
 */
export default interface IHTMLCollection<T, NamedItem> extends Array<T> {
	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	item(index: number): T | null;

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	namedItem(name: string): NamedItem | null;
}
