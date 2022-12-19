import IRadioNodeList from './IRadioNodeList';
import IHTMLFormControlsCollection from './IHTMLFormControlsCollection';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement';
import IHTMLTextAreaElement from '../html-text-area-element/IHTMLTextAreaElement';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection
	extends Array<IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement>
	implements IHTMLFormControlsCollection
{
	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	public namedItem(
		name: string
	):
		| IHTMLInputElement
		| IHTMLTextAreaElement
		| IHTMLSelectElement
		| IRadioNodeList<IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement> {
		return this[name];
	}
}
