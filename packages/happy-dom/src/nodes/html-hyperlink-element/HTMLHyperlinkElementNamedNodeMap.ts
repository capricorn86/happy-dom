import Attr from '../attr/Attr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLAnchorElement from '../html-anchor-element/HTMLAnchorElement.js';
import HTMLAreaElement from '../html-area-element/HTMLAreaElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLHyperlinkElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: HTMLAnchorElement | HTMLAreaElement;

	/**
	 * @override
	 */
	public override setNamedItem(item: Attr): Attr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			item[PropertySymbol.name] === 'rel' &&
			this[PropertySymbol.ownerElement][PropertySymbol.relList]
		) {
			this[PropertySymbol.ownerElement][PropertySymbol.relList][PropertySymbol.updateIndices]();
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeNamedItem](name: string): Attr | null {
		const removedItem = super[PropertySymbol.removeNamedItem](name);

		if (
			removedItem?.[PropertySymbol.name] === 'rel' &&
			this[PropertySymbol.ownerElement][PropertySymbol.relList]
		) {
			this[PropertySymbol.ownerElement][PropertySymbol.relList][PropertySymbol.updateIndices]();
		}

		return removedItem;
	}
}
