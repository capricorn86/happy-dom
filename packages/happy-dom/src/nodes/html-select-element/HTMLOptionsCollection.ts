import DOMException from '../../exception/DOMException.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLSelectElement from './HTMLSelectElement.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';

/**
 * HTML Options Collection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection.
 */
export default class HTMLOptionsCollection extends HTMLCollection<HTMLOptionElement> {
	#selectElement: HTMLSelectElement;

	/**
	 *
	 * @param selectElement
	 */
	constructor(selectElement: HTMLSelectElement) {
		super();

		this.#selectElement = selectElement;
	}

	/**
	 * Returns selectedIndex.
	 *
	 * @returns SelectedIndex.
	 */
	public get selectedIndex(): number {
		return this.#selectElement.selectedIndex;
	}

	/**
	 * Sets selectedIndex.
	 *
	 * @param selectedIndex SelectedIndex.
	 */
	public set selectedIndex(selectedIndex: number) {
		this.#selectElement.selectedIndex = selectedIndex;
	}

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): HTMLOptionElement {
		return this[index];
	}

	/**
	 *
	 * @param element
	 * @param before
	 */
	public add(element: HTMLOptionElement, before?: number | HTMLOptionElement): void {
		if (!before && before !== 0) {
			this.#selectElement.appendChild(element);
			return;
		}

		if (!Number.isNaN(Number(before))) {
			if (<number>before < 0) {
				return;
			}

			this.#selectElement.insertBefore(element, this[<number>before]);
			return;
		}

		const index = this.indexOf(before);

		if (index === -1) {
			throw new DOMException(
				"Failed to execute 'add' on 'DOMException': The node before which the new node is to be inserted is not a child of this node."
			);
		}

		this.#selectElement.insertBefore(element, this[index]);
	}

	/**
	 * Removes indexed element from collection.
	 *
	 * @param index Index.
	 */
	public remove(index: number): void {
		if (this[index]) {
			this.#selectElement.removeChild(<HTMLOptionElement>this[index]);
		}
	}
}
