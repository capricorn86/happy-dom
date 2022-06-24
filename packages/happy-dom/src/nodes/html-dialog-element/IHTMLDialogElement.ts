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
	close(returnValue?: string): void;
	showModal(): void;
	show(): void;
}
