import Event from '../../event/Event';
import IHTMLButtonElement from '../html-button-element/IHTMLButtonElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement';
import IHTMLFormControlsCollection from './IHTMLFormControlsCollection';

/**
 * HTML Form Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement.
 */
export default interface IHTMLFormElement extends IHTMLElement {
	name: string;
	method: string;
	target: string;
	action: string;
	encoding: string;
	enctype: string;
	autocomplete: string;
	acceptCharset: string;
	noValidate: boolean;
	readonly elements: IHTMLFormControlsCollection;
	readonly length: number;

	// Events
	onformdata: (event: Event) => void | null;
	onreset: (event: Event) => void | null;
	onsubmit: (event: Event) => void | null;

	/**
	 * Submits form. No submit event is raised. In particular, the form's "submit" event handler is not run.
	 *
	 * In Happy DOM this means that nothing happens.
	 */
	submit(): void;

	/**
	 * Submits form, reports validity and raises submit event.
	 *
	 * @param [submitter] Submitter.
	 */
	requestSubmit(submitter?: IHTMLInputElement | IHTMLButtonElement): void;

	/**
	 * Resets form.
	 */
	reset(): void;

	/**
	 * Reports validity.
	 */
	reportValidity(): boolean;

	/**
	 * Checks validity.
	 *
	 * @returns "true" if validation does'nt fail.
	 */
	checkValidity(): boolean;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IHTMLFormElement;
}
