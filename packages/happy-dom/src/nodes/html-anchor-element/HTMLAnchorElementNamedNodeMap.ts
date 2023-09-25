import IAttr from '../attr/IAttr.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLAnchorElement from './HTMLAnchorElement.js';
import HTMLAnchorElementUtility from './HTMLAnchorElementUtility.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLAnchorElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected _ownerElement: HTMLAnchorElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (item.name === 'rel' && this._ownerElement._relList) {
			this._ownerElement._relList._updateIndices();
		} else if (item.name === 'href') {
			this._ownerElement._url = HTMLAnchorElementUtility.getUrl(
				this._ownerElement.ownerDocument,
				item.value
			);
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override _removeNamedItem(name: string): IAttr | null {
		const removedItem = super._removeNamedItem(name);

		if (removedItem) {
			if (removedItem.name === 'rel' && this._ownerElement._relList) {
				this._ownerElement._relList._updateIndices();
			} else if (removedItem.name === 'href') {
				this._ownerElement._url = null;
			}
		}

		return removedItem;
	}
}
