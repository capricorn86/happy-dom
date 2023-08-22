import IAttr from '../attr/IAttr.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLIFrameElement from './HTMLIFrameElement.js';
import HTMLIFrameUtility from './HTMLIFrameUtility.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLIFrameElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected _ownerElement: HTMLIFrameElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedAttribute = super.setNamedItem(item);

		if (item.name === 'src' && item.value && item.value !== replacedAttribute?.value) {
			HTMLIFrameUtility.loadPage(this._ownerElement);
		}

		return replacedAttribute || null;
	}
}
