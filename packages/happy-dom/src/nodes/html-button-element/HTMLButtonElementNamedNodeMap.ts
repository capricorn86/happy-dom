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
	protected __ownerElement__: HTMLButtonElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if ((item.name === 'id' || item.name === 'name') && this.__ownerElement__.__formNode__) {
			if (replacedItem?.value) {
				(<HTMLFormElement>this.__ownerElement__.__formNode__).__removeFormControlItem__(
					this.__ownerElement__,
					replacedItem.value
				);
			}
			if (item.value) {
				(<HTMLFormElement>this.__ownerElement__.__formNode__).__appendFormControlItem__(
					this.__ownerElement__,
					item.value
				);
			}
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override __removeNamedItem__(name: string): IAttr | null {
		const removedItem = super.__removeNamedItem__(name);

		if (
			removedItem &&
			(removedItem.name === 'id' || removedItem.name === 'name') &&
			this.__ownerElement__.__formNode__
		) {
			(<HTMLFormElement>this.__ownerElement__.__formNode__).__removeFormControlItem__(
				this.__ownerElement__,
				removedItem.value
			);
		}

		return removedItem;
	}
}
