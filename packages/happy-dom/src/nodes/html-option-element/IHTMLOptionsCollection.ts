import IHTMLCollection from '../element/IHTMLCollection';
import IHTMLOptGroupElement from '../html-opt-group-element/IHTMLOptGroupElement';
import IHTMLOptionElement from './IHTMLOptionElement';

/**
 * HTML Options Collection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection.
 */
export default interface IHTMLOptionsCollection
	extends IHTMLCollection<IHTMLOptionElement | IHTMLOptGroupElement> {
	selectedIndex: number;
	length: number;

	/**
	 * Adds new option to collection.
	 *
	 * @param element HTMLOptionElement or HTMLOptGroupElement to add.
	 * @param before HTMLOptionElement or index number.
	 */
	add(
		element: IHTMLOptionElement | IHTMLOptGroupElement,
		before?: number | IHTMLOptionElement | IHTMLOptGroupElement
	): void;

	/**
	 * Removes option element from the collection.
	 *
	 * @param index Index.
	 */
	remove(index: number): void;
}
