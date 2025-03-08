import SVGElement from '../svg-element/SVGElement.js';
import SVGStringList from '../../svg/SVGStringList.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';

/**
 * SVG Animation Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimationElement
 */
export default class SVGAnimationElement extends SVGElement {
	// Internal properties
	public [PropertySymbol.requiredExtensions]: SVGStringList | null = null;
	public [PropertySymbol.systemLanguage]: SVGStringList | null = null;

	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get onbegin(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onbegin');
	}

	public set onbegin(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbegin', value);
	}

	public get onend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onend');
	}

	public set onend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onend', value);
	}

	public get onrepeat(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onrepeat');
	}

	public set onrepeat(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onrepeat', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Returns required extensions.
	 *
	 * @returns Required extensions.
	 */
	public get requiredExtensions(): SVGStringList {
		if (!this[PropertySymbol.requiredExtensions]) {
			this[PropertySymbol.requiredExtensions] = new SVGStringList(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('requiredExtensions'),
					setAttribute: (value) => this.setAttribute('requiredExtensions', value)
				}
			);
		}
		return this[PropertySymbol.requiredExtensions];
	}

	/**
	 * Returns system language.
	 *
	 * @returns System language.
	 */
	public get systemLanguage(): SVGStringList {
		if (!this[PropertySymbol.systemLanguage]) {
			this[PropertySymbol.systemLanguage] = new SVGStringList(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('systemLanguage'),
					setAttribute: (value) => this.setAttribute('systemLanguage', value)
				}
			);
		}
		return this[PropertySymbol.systemLanguage];
	}

	/**
	 * Returns target element.
	 *
	 * @returns Target element.
	 */
	public get targetElement(): SVGElement | null {
		// TODO: Implement targetElement
		return null;
	}
}
