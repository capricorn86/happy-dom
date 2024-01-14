import IAttr from '../attr/IAttr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import HTMLOptionElement from './HTMLOptionElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLOptionElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: HTMLOptionElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			!this[PropertySymbol.ownerElement][PropertySymbol.dirtyness] &&
			item[PropertySymbol.name] === 'selected' &&
			replacedItem?.[PropertySymbol.value] !== item[PropertySymbol.value]
		) {
			const selectNode = <HTMLSelectElement>(
				this[PropertySymbol.ownerElement][PropertySymbol.selectNode]
			);

			this[PropertySymbol.ownerElement][PropertySymbol.selectedness] = true;

			if (selectNode) {
				selectNode[PropertySymbol.updateOptionItems](this[PropertySymbol.ownerElement]);
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
			!this[PropertySymbol.ownerElement][PropertySymbol.dirtyness] &&
			removedItem[PropertySymbol.name] === 'selected'
		) {
			const selectNode = <HTMLSelectElement>(
				this[PropertySymbol.ownerElement][PropertySymbol.selectNode]
			);

			this[PropertySymbol.ownerElement][PropertySymbol.selectedness] = false;

			if (selectNode) {
				selectNode[PropertySymbol.updateOptionItems]();
			}
		}

		return removedItem;
	}
}
