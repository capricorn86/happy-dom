import FocusEvent from '../../event/events/FocusEvent.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import ISVGElement from '../svg-element/ISVGElement.js';

/**
 * HTMLElement utility.
 */
export default class HTMLElementUtility {
	/**
	 * Triggers a blur event.
	 *
	 * @param element Element.
	 */
	public static blur(element: IHTMLElement | ISVGElement): void {
		if (element.ownerDocument['_activeElement'] !== element || !element.isConnected) {
			return;
		}

		const relatedTarget = element.ownerDocument['_nextActiveElement'] ?? null;

		element.ownerDocument['_activeElement'] = null;

		element.dispatchEvent(
			new FocusEvent('blur', {
				relatedTarget,
				bubbles: false,
				composed: true
			})
		);
		element.dispatchEvent(
			new FocusEvent('focusout', {
				relatedTarget,
				bubbles: true,
				composed: true
			})
		);
	}

	/**
	 * Triggers a focus event.
	 *
	 * @param element Element.
	 */
	public static focus(element: IHTMLElement | ISVGElement): void {
		if (element.ownerDocument['_activeElement'] === element || !element.isConnected) {
			return;
		}

		// Set the next active element so `blur` can use it for `relatedTarget`.
		element.ownerDocument['_nextActiveElement'] = element;

		const relatedTarget = element.ownerDocument['_activeElement'];

		if (element.ownerDocument['_activeElement'] !== null) {
			element.ownerDocument['_activeElement'].blur();
		}

		// Clean up after blur, so it does not affect next blur call.
		element.ownerDocument['_nextActiveElement'] = null;

		element.ownerDocument['_activeElement'] = element;

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
