import IHTMLElement from '../html-element/IHTMLElement';

/**
 * HTML Dialog Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement.
 */
export default interface IHTMLDialogElement extends IHTMLElement {
	open: boolean;
	returnValue: string;

	/**
	 * Closes the dialog.
	 *
	 * @param [returnValue] ReturnValue.
	 */
	close(returnValue?: string): void;

	/**
	 * Shows the modal.
	 */
	showModal(): void;

	/**
	 * Shows the dialog.
	 */
	show(): void;
}
