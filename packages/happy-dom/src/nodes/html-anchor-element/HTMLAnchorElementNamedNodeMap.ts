import IAttr from '../attr/IAttr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLAnchorElement from './HTMLAnchorElement.js';
import HTMLAnchorElementUtility from './HTMLAnchorElementUtility.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLAnchorElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: HTMLAnchorElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			item[PropertySymbol.name] === 'rel' &&
			this[PropertySymbol.ownerElement][PropertySymbol.relList]
		) {
			this[PropertySymbol.ownerElement][PropertySymbol.relList][PropertySymbol.updateIndices]();
		} else if (item[PropertySymbol.name] === 'href') {
			this[PropertySymbol.ownerElement][PropertySymbol.url] = HTMLAnchorElementUtility.getUrl(
				this[PropertySymbol.ownerElement].ownerDocument,
				item[PropertySymbol.value]
			);
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeNamedItem](name: string): IAttr | null {
		const removedItem = super[PropertySymbol.removeNamedItem](name);

		if (removedItem) {
			if (
				removedItem[PropertySymbol.name] === 'rel' &&
				this[PropertySymbol.ownerElement][PropertySymbol.relList]
			) {
				this[PropertySymbol.ownerElement][PropertySymbol.relList][PropertySymbol.updateIndices]();
			} else if (removedItem[PropertySymbol.name] === 'href') {
				this[PropertySymbol.ownerElement][PropertySymbol.url] = null;
			}
		}

		return removedItem;
	}
}
