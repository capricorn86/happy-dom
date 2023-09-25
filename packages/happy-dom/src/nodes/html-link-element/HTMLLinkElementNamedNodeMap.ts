import IAttr from '../attr/IAttr.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLLinkElement from './HTMLLinkElement.js';
import HTMLLinkElementUtility from './HTMLLinkElementUtility.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLLinkElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected _ownerElement: HTMLLinkElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (item.name === 'rel' && this._ownerElement._relList) {
			this._ownerElement._relList._updateIndices();
		}

		if (item.name === 'rel' || item.name === 'href') {
			HTMLLinkElementUtility.loadExternalStylesheet(this._ownerElement);
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override _removeNamedItem(name: string): IAttr | null {
		const removedItem = super._removeNamedItem(name);

		if (removedItem && removedItem.name === 'rel' && this._ownerElement._relList) {
			this._ownerElement._relList._updateIndices();
		}

		return removedItem;
	}
}
