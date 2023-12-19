import IAttr from '../attr/IAttr.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLLinkElement from './HTMLLinkElement.js';
import HTMLLinkElementStyleSheetLoader from './HTMLLinkElementStyleSheetLoader.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLLinkElementNamedNodeMap extends HTMLElementNamedNodeMap {
	protected __ownerElement__: HTMLLinkElement;
	#styleSheetLoader: HTMLLinkElementStyleSheetLoader;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 * @param stylesheetLoader Stylesheet loader.
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

		if (item.name === 'rel' && this.__ownerElement__.__relList__) {
			this.__ownerElement__.__relList__.__updateIndices__();
		}

		if (item.name === 'rel') {
			this.#styleSheetLoader.loadStyleSheet(this.__ownerElement__.getAttribute('href'), item.value);
		} else if (item.name === 'href') {
			this.#styleSheetLoader.loadStyleSheet(item.value, this.__ownerElement__.getAttribute('rel'));
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override __removeNamedItem__(name: string): IAttr | null {
		const removedItem = super.__removeNamedItem__(name);

		if (removedItem && removedItem.name === 'rel' && this.__ownerElement__.__relList__) {
			this.__ownerElement__.__relList__.__updateIndices__();
		}

		return removedItem;
	}
}
