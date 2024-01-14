import IAttr from '../attr/IAttr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLScriptElement from './HTMLScriptElement.js';
import HTMLScriptElementScriptLoader from './HTMLScriptElementScriptLoader.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLScriptElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected [PropertySymbol.ownerElement]: HTMLScriptElement;
	#scriptLoader: HTMLScriptElementScriptLoader;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 * @param scriptLoader Script loader.
	 */
	constructor(ownerElement: HTMLScriptElement, scriptLoader: HTMLScriptElementScriptLoader) {
		super(ownerElement);
		this.#scriptLoader = scriptLoader;
	}

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedItem = super.setNamedItem(item);

		if (
			item[PropertySymbol.name] === 'src' &&
			item[PropertySymbol.value] !== null &&
			this[PropertySymbol.ownerElement][PropertySymbol.isConnected]
		) {
			this.#scriptLoader.loadScript(item[PropertySymbol.value]);
		}

		return replacedItem || null;
	}
}
