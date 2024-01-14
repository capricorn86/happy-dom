import IAttr from '../attr/IAttr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import ElementNamedNodeMap from '../element/ElementNamedNodeMap.js';
import SVGElement from './SVGElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class SVGElementNamedNodeMap extends ElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: SVGElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			item[PropertySymbol.name] === 'style' &&
			this[PropertySymbol.ownerElement][PropertySymbol.style]
		) {
			this[PropertySymbol.ownerElement][PropertySymbol.style].cssText = item[PropertySymbol.value];
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
			removedItem[PropertySymbol.name] === 'style' &&
			this[PropertySymbol.ownerElement][PropertySymbol.style]
		) {
			this[PropertySymbol.ownerElement][PropertySymbol.style].cssText = '';
		}

		return removedItem;
	}
}
