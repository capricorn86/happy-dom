import DOMException from '../../exception/DOMException.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLSelectElement from './HTMLSelectElement.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import Element from '../element/Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElement from '../html-element/HTMLElement.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

/**
 * HTML Options Collection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection.
 */
export default class HTMLOptionsCollection extends HTMLCollection<HTMLOptionElement> {
	#selectedIndex: number = -1;
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
		return this.#selectedIndex;
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

		const selectedOption = <HTMLOptionElement>this[selectedIndex];

		if (!selectedOption) {
			this.#selectedIndex = -1;
			return;
		}

		selectedOption[PropertySymbol.selectedness] = true;
		selectedOption[PropertySymbol.dirtyness] = true;

		this[PropertySymbol.updateSelectedness](selectedOption);
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
			item[PropertySymbol.selectNode] = this.#selectElement;
			this[PropertySymbol.updateSelectedness]();
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
			newItem[PropertySymbol.selectNode] = this.#selectElement;
			this[PropertySymbol.updateSelectedness]();
		}
		return returnValue;
	}

	/**
	 * @override
	 */
	public [PropertySymbol.removeItem](item: HTMLOptionElement): boolean {
		const returnValue = super[PropertySymbol.removeItem](item);
		if (returnValue) {
			item[PropertySymbol.selectNode] = null;
			this[PropertySymbol.updateSelectedness]();
		}
		return returnValue;
	}

	/**
	 * Updates option item.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/HTMLSelectElement-impl.js
	 *
	 * @see https://html.spec.whatwg.org/multipage/form-elements.html#selectedness-setting-algorithm
	 * @param [selectedOption] Selected option.
	 */
	public [PropertySymbol.updateSelectedness](selectedOption?: HTMLOptionElement): void {
		const isMultiple = this.#selectElement.hasAttribute('multiple');
		const selectedOptions = this.#selectElement[PropertySymbol.selectedOptions];
		const selected: HTMLOptionElement[] = [];

		this.#selectedIndex = -1;

		for (let i = 0, max = this.length; i < max; i++) {
			const option = <HTMLOptionElement>this[i];
			if (!isMultiple) {
				if (selectedOption) {
					option[PropertySymbol.selectedness] = option === selectedOption;
				}

				if (option[PropertySymbol.selectedness]) {
					selected.push(option);

					if (this.#selectedIndex === null) {
						this.#selectedIndex = i;
					}

					if (!selectedOptions[PropertySymbol.includes](option)) {
						selectedOptions[PropertySymbol.addItem](option);
					}
				} else {
					selectedOptions[PropertySymbol.removeItem](option);
				}
			}
		}

		const size = this.#getDisplaySize();

		if (size === 1 && !selected.length) {
			for (let i = 0, max = this.length; i < max; i++) {
				const option = <HTMLOptionElement>this[i];
				const parentNode = <HTMLElement>option[PropertySymbol.parentNode];
				let disabled = option.hasAttributeNS(null, 'disabled');

				if (
					parentNode &&
					parentNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
					parentNode[PropertySymbol.tagName] === 'OPTGROUP' &&
					parentNode.hasAttributeNS(null, 'disabled')
				) {
					disabled = true;
				}

				if (!disabled) {
					this.#selectedIndex = i;
					option[PropertySymbol.selectedness] = true;
					break;
				}
			}
		} else if (selected.length >= 2) {
			for (let i = 0, max = this.length; i < max; i++) {
				(<HTMLOptionElement>this[i])[PropertySymbol.selectedness] = i === selected.length - 1;
			}
		}
	}

	/**
	 * Returns display size.
	 *
	 * @returns Display size.
	 */
	#getDisplaySize(): number {
		const selectElement = this.#selectElement;
		if (selectElement.hasAttributeNS(null, 'size')) {
			const size = parseInt(selectElement.getAttribute('size'));
			if (!isNaN(size) && size >= 0) {
				return size;
			}
		}
		return selectElement.hasAttributeNS(null, 'multiple') ? 4 : 1;
	}
}
