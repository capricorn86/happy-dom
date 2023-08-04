import IAttr from '../attr/IAttr.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import HTMLButtonElement from './HTMLButtonElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLButtonElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected _ownerElement: HTMLButtonElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if ((item.name === 'id' || item.name === 'name') && this._ownerElement._formNode) {
			if (replacedItem?.value) {
				(<HTMLFormElement>this._ownerElement._formNode)._removeFormControlItem(
					this._ownerElement,
					replacedItem.value
				);
			}
			if (item.value) {
				(<HTMLFormElement>this._ownerElement._formNode)._appendFormControlItem(
					this._ownerElement,
					item.value
				);
			}
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override removeNamedItem(name: string): IAttr | null {
		const removedItem = super.removeNamedItem(name);

		if (
			removedItem &&
			(removedItem.name === 'id' || removedItem.name === 'name') &&
			this._ownerElement._formNode
		) {
			(<HTMLFormElement>this._ownerElement._formNode)._removeFormControlItem(
				this._ownerElement,
				removedItem.value
			);
		}

		return removedItem;
	}
}
