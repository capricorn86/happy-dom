import DOMException from '../../exception/DOMException';
import HTMLCollection from '../element/HTMLCollection';
import HTMLOptGroupElement from '../html-opt-group-element/HTMLOptGroupElement';
import HTMLOptionElement from './HTMLOptionElement';
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
	/**
	 * Returns selectedIndex.
	 *
	 * @returns SelectedIndex.
	 */
	public get selectedIndex(): number {
		for (let i = 0; i < this.length; i++) {
			const item = this[i];
			if (item instanceof HTMLOptionElement && item.selected) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Sets selectedIndex.
	 *
	 * @param selectedIndex SelectedIndex.
	 */
	public set selectedIndex(selectedIndex: number) {
		for (let i = 0; i < this.length; i++) {
			const item = this[i];
			if (item instanceof HTMLOptionElement) {
				this[i].selected = i === selectedIndex;
			}
		}
	}

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): HTMLOptionElement | HTMLOptGroupElement {
		return this[index];
	}

	/**
	 *
	 * @param element
	 * @param before
	 */
	public add(
		element: HTMLOptionElement | HTMLOptGroupElement,
		before?: number | HTMLOptionElement | HTMLOptGroupElement
	): void {
		if (!before && before !== 0) {
			this.push(element);
			return;
		}

		if (!Number.isNaN(Number(before))) {
			if (before < 0) {
				return;
			}

			this.splice(<number>before, 0, element);
			return;
		}

		const idx = this.findIndex((element) => element === before);
		if (idx === -1) {
			throw new DOMException(
				"Failed to execute 'add' on 'DOMException': The node before which the new node is to be inserted is not a child of this node."
			);
		}

		this.splice(idx, 0, element);
	}

	/**
	 * Removes indexed element from collection.
	 *
	 * @param index Index.
	 */
	public remove(index: number): void {
		const prevSelectedIndex = this.selectedIndex;

		this.splice(index, 1);

		if (index === prevSelectedIndex) {
			if (this.length) {
				this.selectedIndex = 0;
			} else {
				this.selectedIndex = -1;
			}
		}
	}
}
