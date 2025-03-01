import Event from '../../event/Event.js';
import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import KeyboardEvent from 'src/event/events/KeyboardEvent.js';

/**
 * HTML Dialog Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
 */
export default class HTMLDialogElement extends HTMLElement {
	// Internal properties
	public [PropertySymbol.returnValue] = '';

	// Events
	public oncancel: ((event: Event) => void) | null = null;
	public onclose: ((event: Event) => void) | null = null;

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
		this[PropertySymbol.returnValue] = value;
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
	public close(returnValue = ''): void {
		const wasOpen = this.open;
		this.removeAttribute('open');
		this.returnValue = returnValue;
		if (wasOpen) {
			this.#removeKeydownListener();
			this.dispatchEvent(new Event('close'));
		}
	}

	#keydownHandler = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') {
			this.close();
		}
	};

	#addKeydownListener = (): void => {
		this[PropertySymbol.ownerDocument].addEventListener('keydown', this.#keydownHandler);
	};

	#removeKeydownListener = (): void => {
		this[PropertySymbol.ownerDocument].removeEventListener('keydown', this.#keydownHandler);
	};

	/**
	 * Shows the modal.
	 */
	public showModal(): void {
		this.setAttribute('open', '');
		this.#addKeydownListener();
	}

	/**
	 * Shows the dialog.
	 */
	public show(): void {
		this.setAttribute('open', '');
	}
}
