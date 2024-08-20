import Event from '../../event/Event.js';
import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Attr from '../attr/Attr.js';

/**
 * HTMLDetailsElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement
 */
export default class HTMLDetailsElement extends HTMLElement {
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

	/**
	 * @override
	 */
	public override [PropertySymbol.onSetAttribute](
		attribute: Attr,
		replacedAttribute: Attr | null
	): void {
		super[PropertySymbol.onSetAttribute](attribute, replacedAttribute);
		if (attribute[PropertySymbol.name] === 'open') {
			if (attribute[PropertySymbol.value] !== replacedAttribute?.[PropertySymbol.value]) {
				this.dispatchEvent(new Event('toggle'));
			}
		}
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.onRemoveAttribute](removedAttribute: Attr): void {
		super[PropertySymbol.onRemoveAttribute](removedAttribute);
		if (removedAttribute && removedAttribute[PropertySymbol.name] === 'open') {
			this.dispatchEvent(new Event('toggle'));
		}
	}
}
