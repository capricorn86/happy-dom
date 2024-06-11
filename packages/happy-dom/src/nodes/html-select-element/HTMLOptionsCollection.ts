import DOMException from '../../exception/DOMException.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLSelectElement from './HTMLSelectElement.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import Element from '../element/Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * HTML Options Collection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection.
 */
export default class HTMLOptionsCollection extends HTMLCollection<HTMLOptionElement> {
	#selectedIndex: number | null = null;
	#selectElement: HTMLSelectElement;

	/**
	 *
	 * @param selectElement
	 */
	constructor(selectElement: HTMLSelectElement) {
		super((element: Element) => element[PropertySymbol.tagName] === 'OPTION');

		this.#selectElement = selectElement;
	}

	/**
	 * Returns selectedIndex.
	 *
	 * @returns SelectedIndex.
	 */
	public get selectedIndex(): number {
		if (this.#selectedIndex !== null) {
			return this.#selectedIndex;
		}

		for (let i = 0, max = this[PropertySymbol.options].length; i < max; i++) {
			if ((<HTMLOptionElement>this[PropertySymbol.options][i])[PropertySymbol.selectedness]) {
				this.#selectedIndex = i;
				return i;
			}
		}
		this.#selectedIndex = -1;
		return -1;
	}

	/**
	 * Sets selectedIndex.
	 *
	 * @param selectedIndex SelectedIndex.
	 */
	public set selectedIndex(selectedIndex: number) {
		if (typeof selectedIndex !== 'number' || isNaN(selectedIndex)) {
			return;
		}

		for (let i = 0, max = this[PropertySymbol.options].length; i < max; i++) {
			(<HTMLOptionElement>this[PropertySymbol.options][i])[PropertySymbol.selectedness] = false;
		}

		const selectedOption = <HTMLOptionElement>this[PropertySymbol.options][selectedIndex];

		if (!selectedOption) {
			return;
		}

		selectedOption[PropertySymbol.selectedness] = true;
		selectedOption[PropertySymbol.dirtyness] = true;
		this.#selectedIndex = selectedIndex;
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

			const optionsElement = this[<number>before];

			if (!optionsElement) {
				throw new DOMException(
					"Failed to execute 'add' on 'DOMException': The node before which the new node is to be inserted is not a child of this node."
				);
			}

			this.#selectElement.insertBefore(element, optionsElement);
			return;
		}

		const index = this[PropertySymbol.indexOf](<HTMLOptionElement>before);

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

	/**
	 * @override
	 */
	public [PropertySymbol.addItem](item: HTMLOptionElement): boolean {
		const returnValue = super[PropertySymbol.addItem](item);
		if (returnValue) {
			this.#selectedIndex = null;
		}
		return returnValue;
	}

	/**
	 * @override
	 */
	public [PropertySymbol.insertItem](
		newItem: HTMLOptionElement,
		referenceItem: HTMLOptionElement | null
	): boolean {
		const returnValue = super[PropertySymbol.insertItem](newItem, referenceItem);
		if (returnValue) {
			this.#selectedIndex = null;
		}
		return returnValue;
	}

	/**
	 * @override
	 */
	public [PropertySymbol.removeItem](item: HTMLOptionElement): boolean {
		const returnValue = super[PropertySymbol.removeItem](item);
		if (returnValue) {
			this.#selectedIndex = null;
		}
		return returnValue;
	}
}
