import IAttr from '../attr/IAttr.js';
import Element from '../element/Element.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLIFrameElementPageLoader from './HTMLIFrameElementPageLoader.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLIFrameElementNamedNodeMap extends HTMLElementNamedNodeMap {
	#pageLoader: HTMLIFrameElementPageLoader;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 * @param pageLoader
	 */
	constructor(ownerElement: Element, pageLoader: HTMLIFrameElementPageLoader) {
		super(ownerElement);
		this.#pageLoader = pageLoader;
	}

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedAttribute = super.setNamedItem(item);

		if (
			item[PropertySymbol.name] === 'src' &&
			item[PropertySymbol.value] &&
			item[PropertySymbol.value] !== replacedAttribute?.[PropertySymbol.value]
		) {
			this.#pageLoader.loadPage();
		}

		return replacedAttribute || null;
	}
}
