import IElement from '../element/IElement';
import IHTMLElement from '../html-element/IHTMLElement';

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
	noValidate: string;
	elements: IElement[];
	length: number;

	/**
	 * Submits form.
	 */
	submit(): void;

	/**
	 * Resets form.
	 */
	reset(): void;

	/**
	 * Reports validity.
	 */
	reportValidity(): void;

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
	cloneNode(deep: boolean): IHTMLFormElement;
}
