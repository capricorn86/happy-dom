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
	 * Constructor.
	 */
	constructor() {
		super();
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'set',
			this.#onSetAttribute.bind(this)
		);
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'remove',
			this.#onRemoveAttribute.bind(this)
		);
	}

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
	 * Triggered when an attribute is set.
	 *
	 * @param attribute Attribute
	 * @param replacedAttribute Replaced item
	 */
	#onSetAttribute(attribute: Attr, replacedAttribute: Attr | null): void {
		if (attribute[PropertySymbol.name] === 'open') {
			if (attribute[PropertySymbol.value] !== replacedAttribute?.[PropertySymbol.value]) {
				this.dispatchEvent(new Event('toggle'));
			}
		}
	}

	/**
	 * Triggered when an attribute is removed.
	 *
	 * @param removedAttribute Removed attribute.
	 */
	#onRemoveAttribute(removedAttribute: Attr): void {
		if (removedAttribute && removedAttribute[PropertySymbol.name] === 'open') {
			this.dispatchEvent(new Event('toggle'));
		}
	}
}
