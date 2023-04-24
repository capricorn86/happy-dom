import FocusEvent from '../../event/events/FocusEvent';
import IHTMLElement from '../html-element/IHTMLElement';
import ISVGElement from '../svg-element/ISVGElement';

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

		element.ownerDocument['_activeElement'] = null;

		element.dispatchEvent(
			new FocusEvent('blur', {
				bubbles: false,
				composed: true
			})
		);
		element.dispatchEvent(
			new FocusEvent('focusout', {
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

		if (element.ownerDocument['_activeElement'] !== null) {
			element.ownerDocument['_activeElement'].blur();
		}

		element.ownerDocument['_activeElement'] = element;

		element.dispatchEvent(
			new FocusEvent('focus', {
				bubbles: false,
				composed: true
			})
		);
		element.dispatchEvent(
			new FocusEvent('focusin', {
				bubbles: true,
				composed: true
			})
		);
	}
}
