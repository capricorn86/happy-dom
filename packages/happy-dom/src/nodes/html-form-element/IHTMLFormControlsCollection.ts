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
	extends Array<IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement> {
	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	item(index: number): IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | null;

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
		| IRadioNodeList<IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement>
		| null;
}
