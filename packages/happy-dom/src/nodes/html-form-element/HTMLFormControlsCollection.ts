import IHTMLFormControlsCollection from './IHTMLFormControlsCollection';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement';
import IHTMLTextAreaElement from '../html-text-area-element/IHTMLTextAreaElement';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement';
import HTMLCollection from '../element/HTMLCollection';
import RadioNodeList from './RadioNodeList';
import IHTMLButtonElement from '../html-button-element/IHTMLButtonElement';
import IRadioNodeList from './IRadioNodeList';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection
	extends HTMLCollection<
		IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		| IHTMLInputElement
		| IHTMLTextAreaElement
		| IHTMLSelectElement
		| IHTMLButtonElement
		| IRadioNodeList
	>
	implements IHTMLFormControlsCollection
{
	protected _namedItems: { [k: string]: RadioNodeList } = {};

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public _appendNamedItem(
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		name: string
	): void {
		if (name) {
			this._namedItems[name] = this._namedItems[name] || new RadioNodeList();

			if (!this._namedItems[name].includes(node)) {
				this._namedItems[name].push(node);
			}

			this[name] =
				this._namedItems[name].length > 1 ? this._namedItems[name] : this._namedItems[name][0];
		}
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public _removeNamedItem(
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		name: string
	): void {
		if (name && this._namedItems[name]) {
			const index = this._namedItems[name].indexOf(node);

			if (index > -1) {
				this._namedItems[name].splice(index, 1);

				if (this._namedItems[name].length === 0) {
					delete this._namedItems[name];
					delete this[name];
				} else {
					this[name] =
						this._namedItems[name].length > 1 ? this._namedItems[name] : this._namedItems[name][0];
				}
			}
		}
	}
}
