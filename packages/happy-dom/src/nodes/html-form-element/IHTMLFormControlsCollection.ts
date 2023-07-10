import IHTMLButtonElement from '../html-button-element/IHTMLButtonElement.js';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement.js';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement.js';
import IHTMLTextAreaElement from '../html-text-area-element/IHTMLTextAreaElement.js';
import IRadioNodeList from './IRadioNodeList.js';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default interface IHTMLFormControlsCollection
	extends Array<
		IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement
	> {
	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	item(
		index: number
	): IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement | null;

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 */
	namedItem(
		name: string
	):
		| IHTMLInputElement
		| IHTMLTextAreaElement
		| IHTMLSelectElement
		| IHTMLButtonElement
		| IRadioNodeList
		| null;
}
