import IHTMLCollection from '../element/IHTMLCollection';
import IHTMLOptionElement from '../html-option-element/IHTMLOptionElement';

/**
 * HTML Options Collection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection.
 */
export default interface IHTMLOptionsCollection extends IHTMLCollection<IHTMLOptionElement> {
	selectedIndex: number;
	length: number;

	/**
	 * Adds new option to collection.
	 *
	 * @param element HTMLOptionElement or HTMLOptGroupElement to add.
	 * @param before HTMLOptionElement or index number.
	 */
	add(element: IHTMLOptionElement, before?: number | IHTMLOptionElement): void;

	/**
	 * Returns option element by index.
	 *
	 * @param index Index.
	 */
	item(index: number): IHTMLOptionElement;

	/**
	 * Removes option element from the collection.
	 *
	 * @param index Index.
	 */
	remove(index: number): void;
}
