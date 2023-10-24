import IAttr from '../attr/IAttr.js';
import Element from '../element/Element.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLIframePageLoader from './HTMLIframePageLoader.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLIFrameElementNamedNodeMap extends HTMLElementNamedNodeMap {
	#pageLoader: HTMLIframePageLoader;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 */
	constructor(ownerElement: Element, pageLoader: HTMLIframePageLoader) {
		super(ownerElement);
		this.#pageLoader = pageLoader;
	}

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		const replacedAttribute = super.setNamedItem(item);

		if (item.name === 'src' && item.value && item.value !== replacedAttribute?.value) {
			this.#pageLoader.loadPage();
		}

		return replacedAttribute || null;
	}
}
