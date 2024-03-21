import Attr from '../attr/Attr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import HTMLTextAreaElement from './HTMLTextAreaElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLTextAreaElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: HTMLTextAreaElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: Attr): Attr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			(item[PropertySymbol.name] === 'id' || item[PropertySymbol.name] === 'name') &&
			this[PropertySymbol.ownerElement][PropertySymbol.formNode]
		) {
			if (replacedItem && replacedItem[PropertySymbol.value]) {
				(<HTMLFormElement>this[PropertySymbol.ownerElement][PropertySymbol.formNode])[
					PropertySymbol.removeFormControlItem
				](this[PropertySymbol.ownerElement], replacedItem[PropertySymbol.value]);
			}
			if (item[PropertySymbol.value]) {
				(<HTMLFormElement>this[PropertySymbol.ownerElement][PropertySymbol.formNode])[
					PropertySymbol.appendFormControlItem
				](this[PropertySymbol.ownerElement], item[PropertySymbol.value]);
			}
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeNamedItem](name: string): Attr | null {
		const removedItem = super[PropertySymbol.removeNamedItem](name);

		if (
			removedItem &&
			(removedItem[PropertySymbol.name] === 'id' || removedItem[PropertySymbol.name] === 'name') &&
			this[PropertySymbol.ownerElement][PropertySymbol.formNode]
		) {
			(<HTMLFormElement>this[PropertySymbol.ownerElement][PropertySymbol.formNode])[
				PropertySymbol.removeFormControlItem
			](this[PropertySymbol.ownerElement], removedItem[PropertySymbol.value]);
		}

		return removedItem;
	}
}
