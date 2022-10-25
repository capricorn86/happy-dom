import DOMException from '../../exception/DOMException';
import HTMLCollection from '../element/HTMLCollection';
import IHTMLOptGroupElement from '../html-opt-group-element/IHTMLOptGroupElement';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement';
import IHTMLOptionElement from './IHTMLOptionElement';
import IHTMLOptionsCollection from './IHTMLOptionsCollection';

/**
 * HTML Options Collection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection.
 */
export default class HTMLOptionsCollection
	extends HTMLCollection
	implements IHTMLOptionsCollection
{
	private _selectElement: IHTMLSelectElement;

	/**
	 *
	 * @param selectElement
	 */
	constructor(selectElement: IHTMLSelectElement) {
		super();

		this._selectElement = selectElement;
	}

	/**
	 * Returns selectedIndex.
	 *
	 * @returns SelectedIndex.
	 */
	public get selectedIndex(): number {
		return this._selectElement.selectedIndex;
	}

	/**
	 * Sets selectedIndex.
	 *
	 * @param selectedIndex SelectedIndex.
	 */
	public set selectedIndex(selectedIndex: number) {
		this._selectElement.selectedIndex = selectedIndex;
	}

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): IHTMLOptionElement | IHTMLOptGroupElement {
		return this[index];
	}

	/**
	 *
	 * @param element
	 * @param before
	 */
	public add(
		element: IHTMLOptionElement | IHTMLOptGroupElement,
		before?: number | IHTMLOptionElement | IHTMLOptGroupElement
	): void {
		if (!before && before !== 0) {
			this._selectElement.appendChild(element);
			return;
		}

		if (!Number.isNaN(Number(before))) {
			if (before < 0) {
				return;
			}

			this._selectElement.insertBefore(element, this[<number>before]);
			return;
		}

		const index = this.indexOf(before);

		if (index === -1) {
			throw new DOMException(
				"Failed to execute 'add' on 'DOMException': The node before which the new node is to be inserted is not a child of this node."
			);
		}

		this._selectElement.insertBefore(element, this[index]);
	}

	/**
	 * Removes indexed element from collection.
	 *
	 * @param index Index.
	 */
	public remove(index: number): void {
		if (this[index]) {
			this._selectElement.removeChild(<IHTMLOptionElement>this[index]);
		}
	}
}
