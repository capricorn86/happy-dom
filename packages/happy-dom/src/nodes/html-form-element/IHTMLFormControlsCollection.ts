import IRadioNodeList from './IRadioNodeList';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default interface IHTMLFormControlsCollection<T> extends Array<T> {
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
	 */
	namedItem(name: string): T | IRadioNodeList<T> | null;
}
