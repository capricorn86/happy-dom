import IElement from '../element/IElement';
import IHTMLCollection from '../element/IHTMLCollection';
import IRadioNodeList from './IRadioNodeList';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default interface IHTMLFormControlsCollection<T> extends IHTMLCollection<T> {
	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 */
	namedItem(name: string): IElement | IRadioNodeList<T>;
}
