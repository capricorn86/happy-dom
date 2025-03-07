import Event from '../../event/Event.js';
import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';

/**
 * HTML Dialog Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
 */
export default class HTMLDialogElement extends HTMLElement {
	// Internal properties
	public [PropertySymbol.returnValue] = '';

	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get oncancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncancel');
	}

	public set oncancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncancel', value);
	}

	public get onclose(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onclose');
	}

	public set onclose(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onclose', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Returns return value.
	 *
	 * @returns Return value.
	 */
	public get returnValue(): string {
		return this[PropertySymbol.returnValue];
	}

	/**
	 * Sets return value.
	 *
	 * @param value Return value.
	 */
	public set returnValue(value: string) {
		this[PropertySymbol.returnValue] = String(value);
	}

	/**
	 * Sets the "open" attribute.
	 *
	 * @param open Open.
	 */
	public set open(open: boolean) {
		if (open) {
			this.setAttribute('open', '');
		} else {
			this.removeAttribute('open');
		}
	}

	/**
	 * Returns open.
	 *
	 * @returns Open.
	 */
	public get open(): boolean {
		return this.getAttribute('open') !== null;
	}

	/**
	 * Closes the dialog.
	 *
	 * @param [returnValue] ReturnValue.
	 */
	public close(returnValue?: string): void {
		const wasOpen = this.open;
		this.removeAttribute('open');
		this.returnValue = returnValue !== undefined ? String(returnValue) : '';
		if (wasOpen) {
			this.dispatchEvent(new Event('close'));
		}
	}

	/**
	 * Shows the modal.
	 */
	public showModal(): void {
		this.setAttribute('open', '');
	}

	/**
	 * Shows the dialog.
	 */
	public show(): void {
		this.setAttribute('open', '');
	}
}
