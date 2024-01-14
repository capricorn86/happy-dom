import IAttr from '../attr/IAttr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLLinkElement from './HTMLLinkElement.js';
import HTMLLinkElementStyleSheetLoader from './HTMLLinkElementStyleSheetLoader.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLLinkElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: HTMLLinkElement;
	#styleSheetLoader: HTMLLinkElementStyleSheetLoader;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 * @param stylesheetLoader Stylesheet loader.
	 * @param styleSheetLoader
	 */
	constructor(ownerElement: HTMLLinkElement, styleSheetLoader: HTMLLinkElementStyleSheetLoader) {
		super(ownerElement);
		this.#styleSheetLoader = styleSheetLoader;
	}

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
		}

		if (item[PropertySymbol.name] === 'rel') {
			this.#styleSheetLoader.loadStyleSheet(
				this[PropertySymbol.ownerElement].getAttribute('href'),
				item[PropertySymbol.value]
			);
		} else if (item[PropertySymbol.name] === 'href') {
			this.#styleSheetLoader.loadStyleSheet(
				item[PropertySymbol.value],
				this[PropertySymbol.ownerElement].getAttribute('rel')
			);
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeNamedItem](name: string): IAttr | null {
		const removedItem = super[PropertySymbol.removeNamedItem](name);

		if (
			removedItem &&
			removedItem[PropertySymbol.name] === 'rel' &&
			this[PropertySymbol.ownerElement][PropertySymbol.relList]
		) {
			this[PropertySymbol.ownerElement][PropertySymbol.relList][PropertySymbol.updateIndices]();
		}

		return removedItem;
	}
}
