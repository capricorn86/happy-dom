import Event from '../../event/Event.js';
import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import HTMLDetailsElementNamedNodeMap from './HTMLDetailsElementNamedNodeMap.js';

/**
 * HTMLDetailsElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement
 */
export default class HTMLDetailsElement extends HTMLElement {
	public override [PropertySymbol.attributes]: NamedNodeMap = new HTMLDetailsElementNamedNodeMap(
		this
	);

	// Events
	public ontoggle: (event: Event) => void | null = null;

	/**
	 * Returns the open attribute.
	 */
	public get open(): boolean {
		return this.getAttribute('open') !== null;
	}

	/**
	 * Sets the open attribute.
	 *
	 * @param open New value.
	 */
	public set open(open: boolean) {
		if (open) {
			this.setAttribute('open', '');
		} else {
			this.removeAttribute('open');
		}
	}
}
