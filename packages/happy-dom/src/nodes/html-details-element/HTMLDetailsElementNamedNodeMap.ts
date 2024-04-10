import Attr from '../attr/Attr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import Event from '../../event/Event.js';
import HTMLDetailsElement from './HTMLDetailsElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLDetailsElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: HTMLDetailsElement;

	/**
	 * @override
	 */
	public override [PropertySymbol.setNamedItem](item: Attr): Attr | null {
		const replacedItem = super[PropertySymbol.setNamedItem](item);

		if (item[PropertySymbol.name] === 'open') {
			if (item[PropertySymbol.value] !== replacedItem?.[PropertySymbol.value]) {
				this[PropertySymbol.ownerElement].dispatchEvent(new Event('toggle'));
			}
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeNamedItem](name: string): Attr | null {
		const removedItem = super[PropertySymbol.removeNamedItem](name);

		if (removedItem && removedItem[PropertySymbol.name] === 'open') {
			this[PropertySymbol.ownerElement].dispatchEvent(new Event('toggle'));
		}

		return removedItem;
	}
}
