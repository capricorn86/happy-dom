/**
 * HTMLCollection.
 */
export default interface IDOMRectList<T> extends Array<T> {
	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	item(index: number): T;
}
