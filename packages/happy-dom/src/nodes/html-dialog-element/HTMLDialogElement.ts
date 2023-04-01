import Event from '../../event/Event';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLDialogElement from './IHTMLDialogElement';

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
	 * Returns open.
	 *
	 * @returns Open.
	 */
	public get open(): boolean {
		return this.hasAttributeNS(null, 'open');
	}

	/**
	 * Closes the dialog.
	 *
	 * @param [returnValue] ReturnValue.
	 */
	public close(returnValue = ''): void {
		this.removeAttribute('open');
		this.returnValue = returnValue;
		this.dispatchEvent(new Event('close'));
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
