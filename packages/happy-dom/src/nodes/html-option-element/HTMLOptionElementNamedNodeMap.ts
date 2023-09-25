import IAttr from '../attr/IAttr.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import HTMLOptionElement from './HTMLOptionElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLOptionElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected _ownerElement: HTMLOptionElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			!this._ownerElement._dirtyness &&
			item.name === 'selected' &&
			replacedItem?.value !== item.value
		) {
			const selectNode = <HTMLSelectElement>this._ownerElement._selectNode;

			this._ownerElement._selectedness = true;

			if (selectNode) {
				selectNode._updateOptionItems(this._ownerElement);
			}
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override _removeNamedItem(name: string): IAttr | null {
		const removedItem = super._removeNamedItem(name);

		if (removedItem && !this._ownerElement._dirtyness && removedItem.name === 'selected') {
			const selectNode = <HTMLSelectElement>this._ownerElement._selectNode;

			this._ownerElement._selectedness = false;

			if (selectNode) {
				selectNode._updateOptionItems();
			}
		}

		return removedItem;
	}
}
