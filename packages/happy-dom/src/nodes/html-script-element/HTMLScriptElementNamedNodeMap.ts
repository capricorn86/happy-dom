import IAttr from '../attr/IAttr.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLScriptElement from './HTMLScriptElement.js';
import HTMLScriptElementUtility from './HTMLScriptElementUtility.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLScriptElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected __ownerElement__: HTMLScriptElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (item.name === 'src' && item.value !== null && this.__ownerElement__.isConnected) {
			HTMLScriptElementUtility.loadExternalScript(this.__ownerElement__);
		}

		return replacedItem || null;
	}
}
