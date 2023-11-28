import IAttr from '../attr/IAttr.js';
import ElementNamedNodeMap from '../element/ElementNamedNodeMap.js';
import SVGElement from './SVGElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class SVGElementNamedNodeMap extends ElementNamedNodeMap {
	protected __ownerElement__: SVGElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (item.name === 'style' && this.__ownerElement__.__style__) {
			this.__ownerElement__.__style__.cssText = item.value;
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override __removeNamedItem__(name: string): IAttr | null {
		const removedItem = super.__removeNamedItem__(name);

		if (removedItem && removedItem.name === 'style' && this.__ownerElement__.__style__) {
			this.__ownerElement__.__style__.cssText = '';
		}

		return removedItem;
	}
}
