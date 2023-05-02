import IHTMLFormControlsCollection from './IHTMLFormControlsCollection';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement';
import IHTMLTextAreaElement from '../html-text-area-element/IHTMLTextAreaElement';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement';
import RadioNodeList from './RadioNodeList';
import IHTMLButtonElement from '../html-button-element/IHTMLButtonElement';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection
	extends Array<IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement>
	implements IHTMLFormControlsCollection
{
	public _namedItems: { [k: string]: RadioNodeList } = {};

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(
		index: number
	): IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement | null {
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
		| IHTMLButtonElement
		| RadioNodeList
		| null {
		if (this._namedItems[name] && this._namedItems[name].length) {
			if (this._namedItems[name].length === 1) {
				return this._namedItems[name][0];
			}
			return this._namedItems[name];
		}
		return null;
	}

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

			if (this._isValidPropertyName(name)) {
				this[name] =
					this._namedItems[name].length > 1 ? this._namedItems[name] : this._namedItems[name][0];
			}
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
					if (this.hasOwnProperty(name) && this._isValidPropertyName(name)) {
						delete this[name];
					}
				} else if (this._isValidPropertyName(name)) {
					this[name] =
						this._namedItems[name].length > 1 ? this._namedItems[name] : this._namedItems[name][0];
				}
			}
		}
	}

	/**
	 * Returns "true" if the property name is valid.
	 *
	 * @param name Name.
	 * @returns True if the property name is valid.
	 */
	protected _isValidPropertyName(name: string): boolean {
		return (
			!this.constructor.prototype.hasOwnProperty(name) &&
			!Array.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}
}
