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
	protected __ownerElement__: HTMLAnchorElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (item.name === 'rel' && this.__ownerElement__.__relList__) {
			this.__ownerElement__.__relList__.__updateIndices__();
		} else if (item.name === 'href') {
			this.__ownerElement__.__url__ = HTMLAnchorElementUtility.getUrl(
				this.__ownerElement__.ownerDocument,
				item.value
			);
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override __removeNamedItem__(name: string): IAttr | null {
		const removedItem = super.__removeNamedItem__(name);

		if (removedItem) {
			if (removedItem.name === 'rel' && this.__ownerElement__.__relList__) {
				this.__ownerElement__.__relList__.__updateIndices__();
			} else if (removedItem.name === 'href') {
				this.__ownerElement__.__url__ = null;
			}
		}

		return removedItem;
	}
}
