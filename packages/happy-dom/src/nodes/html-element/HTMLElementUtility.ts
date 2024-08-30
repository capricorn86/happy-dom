import FocusEvent from '../../event/events/FocusEvent.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElement from '../html-element/HTMLElement.js';
import SVGElement from '../svg-element/SVGElement.js';

/**
 * HTMLElement utility.
 */
export default class HTMLElementUtility {
	/**
	 * Triggers a blur event.
	 *
	 * @param element Element.
	 */
	public static blur(element: HTMLElement | SVGElement): void {
		const document = element[PropertySymbol.ownerDocument];

		if (
			document[PropertySymbol.activeElement] !== element ||
			!element[PropertySymbol.isConnected]
		) {
			return;
		}

		const relatedTarget = document[PropertySymbol.nextActiveElement] ?? null;

		document[PropertySymbol.activeElement] = null;

		document[PropertySymbol.clearCache]();

		element.dispatchEvent(
			new FocusEvent('blur', {
				relatedTarget,
				bubbles: false,
				composed: true,
				cancelable: true
			})
		);
		element.dispatchEvent(
			new FocusEvent('focusout', {
				relatedTarget,
				bubbles: true,
				composed: true,
				cancelable: true
			})
		);
	}

	/**
	 * Triggers a focus event.
	 *
	 * @param element Element.
	 */
	public static focus(element: HTMLElement | SVGElement): void {
		const document = element[PropertySymbol.ownerDocument];

		if (
			document[PropertySymbol.activeElement] === element ||
			!element[PropertySymbol.isConnected]
		) {
			return;
		}

		// Set the next active element so `blur` can use it for `relatedTarget`.
		document[PropertySymbol.nextActiveElement] = element;

		const relatedTarget = document[PropertySymbol.activeElement];

		if (document[PropertySymbol.activeElement] !== null) {
			document[PropertySymbol.activeElement].blur();
		}

		// Clean up after blur, so it does not affect next blur call.
		document[PropertySymbol.nextActiveElement] = null;

		document[PropertySymbol.activeElement] = element;

		document[PropertySymbol.clearCache]();

		element.dispatchEvent(
			new FocusEvent('focus', {
				relatedTarget,
				bubbles: false,
				composed: true
			})
		);
		element.dispatchEvent(
			new FocusEvent('focusin', {
				relatedTarget,
				bubbles: true,
				composed: true
			})
		);
	}
}
