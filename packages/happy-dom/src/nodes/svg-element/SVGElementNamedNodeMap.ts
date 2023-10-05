import IAttr from '../attr/IAttr.js';
import ElementNamedNodeMap from '../element/ElementNamedNodeMap.js';
import SVGElement from './SVGElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class SVGElementNamedNodeMap extends ElementNamedNodeMap {
	protected _ownerElement: SVGElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (item.name === 'style' && this._ownerElement._style) {
			this._ownerElement._style.cssText = item.value;
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override _removeNamedItem(name: string): IAttr | null {
		const removedItem = super._removeNamedItem(name);

		if (removedItem && removedItem.name === 'style' && this._ownerElement._style) {
			this._ownerElement._style.cssText = '';
		}

		return removedItem;
	}
}
