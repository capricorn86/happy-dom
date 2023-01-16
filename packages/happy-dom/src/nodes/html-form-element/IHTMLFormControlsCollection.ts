import IHTMLCollection from '../element/IHTMLCollection';
import IHTMLButtonElement from '../html-button-element/IHTMLButtonElement';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement';
import IHTMLTextAreaElement from '../html-text-area-element/IHTMLTextAreaElement';
import IRadioNodeList from './IRadioNodeList';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default interface IHTMLFormControlsCollection
	extends IHTMLCollection<
		IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		| IHTMLInputElement
		| IHTMLTextAreaElement
		| IHTMLSelectElement
		| IHTMLButtonElement
		| IRadioNodeList
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
