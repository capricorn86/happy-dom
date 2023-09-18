import Event from '../../event/Event.js';
import HTMLElement from '../html-element/HTMLElement.js';
import IHTMLDialogElement from './IHTMLDialogElement.js';

/**
 * HTML Dialog Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement.
 */
export default class HTMLDialogElement extends HTMLElement implements IHTMLDialogElement {
	public returnValue = '';

	// Events
	public oncancel: (event: Event) => void | null = null;
	public onclose: (event: Event) => void | null = null;

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
	public close(returnValue = ''): void {
		const wasOpen = this.open;
		this.removeAttribute('open');
		this.returnValue = returnValue;
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
