import DOMException from '../../exception/DOMException.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLSelectElement from './HTMLSelectElement.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import Element from '../element/Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElement from '../html-element/HTMLElement.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import Node from '../node/Node.js';
import EventTarget from '../../event/EventTarget.js';
import IHTMLCollectionObservedNode from '../element/IHTMLCollectionObservedNode.js';

/**
 * HTML Options Collection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection.
 */
export default class HTMLOptionsCollection extends HTMLCollection<HTMLOptionElement> {
	#selectedIndex: number = -1;
	#selectElement: HTMLSelectElement;
	#observedSelectElement: IHTMLCollectionObservedNode | null = null;

	/**
	 * Constructor.
	 *
	 * @param selectElement Select element.
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

		if (selectedIndex < 0 || !this[selectedIndex]) {
			const selectedOptions = this.#selectElement[PropertySymbol.selectedOptions];
			for (let i = 0, max = this.length; i < max; i++) {
				const option = <HTMLOptionElement>this[i];
				option[PropertySymbol.selectedness] = false;
				selectedOptions?.[PropertySymbol.removeItem](option);
			}
			this.#selectedIndex = -1;
			return;
		}

		const selectedOption = <HTMLOptionElement>this[selectedIndex];

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
		if (!super[PropertySymbol.addItem](item)) {
			return false;
		}

		this.#selectElement[this.length - 1] = item;

		item[PropertySymbol.selectNode] = this.#selectElement;
		this[PropertySymbol.updateSelectedness](item[PropertySymbol.selectedness] ? item : null);

		return true;
	}

	/**
	 * @override
	 */
	public [PropertySymbol.insertItem](
		newItem: HTMLOptionElement,
		referenceItem: HTMLOptionElement | null
	): boolean {
		if (!super[PropertySymbol.insertItem](newItem, referenceItem)) {
			return false;
		}

		newItem[PropertySymbol.selectNode] = this.#selectElement;

		const index = this[PropertySymbol.indexOf](newItem);

		for (let i = index, max = this.length; i < max; i++) {
			this.#selectElement[i] = this[i];
		}

		this[PropertySymbol.updateSelectedness](newItem[PropertySymbol.selectedness] ? newItem : null);

		return true;
	}

	/**
	 * @override
	 */
	public [PropertySymbol.removeItem](item: HTMLOptionElement): boolean {
		const index = this[PropertySymbol.indexOf](item);

		if (!super[PropertySymbol.removeItem](item)) {
			return false;
		}

		item[PropertySymbol.selectNode] = null;

		for (let i = index, max = this.length; i < max; i++) {
			this.#selectElement[i] = this[i];
		}

		delete this.#selectElement[this.length];

		this[PropertySymbol.updateSelectedness]();

		return true;
	}

	/**
	 * Observes node.
	 *
	 * @returns Observed node.
	 */
	public [PropertySymbol.observe](): IHTMLCollectionObservedNode {
		if (this.#observedSelectElement) {
			return;
		}
		const observedNode = super[PropertySymbol.observe](this.#selectElement, {
			subtree: true,
			filter: (item) => item[PropertySymbol.tagName] === 'OPTION'
		});

		this.#observedSelectElement = observedNode;

		return observedNode;
	}

	/**
	 * Unobserves node.
	 *
	 * @param observedNode Observed node.
	 */
	public [PropertySymbol.unobserve](): void {
		if (!this.#observedSelectElement) {
			return;
		}
		super[PropertySymbol.unobserve](this.#observedSelectElement);
	}

	/**
	 * Sets named item property.
	 *
	 * @param name Name.
	 */
	protected [PropertySymbol.updateNamedItemProperty](name: string): void {
		super[PropertySymbol.updateNamedItemProperty](name);

		if (this[name]) {
			Object.defineProperty(this.#selectElement, name, {
				value: this[name],
				writable: false,
				enumerable: true,
				configurable: true
			});
		} else {
			delete this.#selectElement[name];
		}
	}

	/**
	 * Returns "true" if the property name is valid.
	 *
	 * @param name Name.
	 * @returns True if the property name is valid.
	 */
	protected [PropertySymbol.isValidPropertyName](name: string): boolean {
		return (
			!HTMLCollection.prototype.hasOwnProperty(name) &&
			!this.#selectElement.constructor.prototype.hasOwnProperty(name) &&
			!HTMLElement.constructor.prototype.hasOwnProperty(name) &&
			!Element.constructor.prototype.hasOwnProperty(name) &&
			!Node.constructor.hasOwnProperty(name) &&
			!EventTarget.constructor.hasOwnProperty(name) &&
			super[PropertySymbol.isValidPropertyName](name)
		);
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

		if (selectedOptions) {
			while (selectedOptions.length) {
				selectedOptions[PropertySymbol.removeItem](selectedOptions[selectedOptions.length - 1]);
			}
		}

		this.#selectedIndex = -1;

		if (isMultiple) {
			if (selectedOptions) {
				for (let i = 0, max = this.length; i < max; i++) {
					const option = <HTMLOptionElement>this[i];
					if (option[PropertySymbol.selectedness]) {
						selectedOptions[PropertySymbol.addItem](option);
					}
				}
			}
		} else {
			for (let i = 0, max = this.length; i < max; i++) {
				const option = <HTMLOptionElement>this[i];
				if (selectedOption) {
					option[PropertySymbol.selectedness] = option === selectedOption;
				}

				if (option[PropertySymbol.selectedness]) {
					selected.push(option);

					if (this.#selectedIndex === -1) {
						this.#selectedIndex = i;
					}

					selectedOptions?.[PropertySymbol.addItem](option);
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
