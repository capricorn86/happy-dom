import IAttr from '../attr/IAttr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import HTMLSelectElement from './HTMLSelectElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLSelectElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: HTMLSelectElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			(item.name === 'id' || item.name === 'name') &&
			this[PropertySymbol.ownerElement][PropertySymbol.formNode]
		) {
			if (replacedItem && replacedItem.value) {
				(<HTMLFormElement>this[PropertySymbol.ownerElement][PropertySymbol.formNode])[
					PropertySymbol.removeFormControlItem
				](this[PropertySymbol.ownerElement], replacedItem.value);
			}
			if (item.value) {
				(<HTMLFormElement>this[PropertySymbol.ownerElement][PropertySymbol.formNode])[
					PropertySymbol.appendFormControlItem
				](this[PropertySymbol.ownerElement], item.value);
			}
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeNamedItem](name: string): IAttr | null {
		const removedItem = super[PropertySymbol.removeNamedItem](name);

		if (
			removedItem &&
			(removedItem.name === 'id' || removedItem.name === 'name') &&
			this[PropertySymbol.ownerElement][PropertySymbol.formNode]
		) {
			(<HTMLFormElement>this[PropertySymbol.ownerElement][PropertySymbol.formNode])[
				PropertySymbol.removeFormControlItem
			](this[PropertySymbol.ownerElement], removedItem.value);
		}

		return removedItem;
	}
}
