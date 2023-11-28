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
	protected __ownerElement__: HTMLOptionElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			!this.__ownerElement__.__dirtyness__ &&
			item.name === 'selected' &&
			replacedItem?.value !== item.value
		) {
			const selectNode = <HTMLSelectElement>this.__ownerElement__.__selectNode__;

			this.__ownerElement__.__selectedness__ = true;

			if (selectNode) {
				selectNode.__updateOptionItems__(this.__ownerElement__);
			}
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override __removeNamedItem__(name: string): IAttr | null {
		const removedItem = super.__removeNamedItem__(name);

		if (removedItem && !this.__ownerElement__.__dirtyness__ && removedItem.name === 'selected') {
			const selectNode = <HTMLSelectElement>this.__ownerElement__.__selectNode__;

			this.__ownerElement__.__selectedness__ = false;

			if (selectNode) {
				selectNode.__updateOptionItems__();
			}
		}

		return removedItem;
	}
}
