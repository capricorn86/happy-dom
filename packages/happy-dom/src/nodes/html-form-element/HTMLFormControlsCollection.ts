import IHTMLFormControlsCollection from './IHTMLFormControlsCollection.js';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement.js';
import IHTMLTextAreaElement from '../html-text-area-element/IHTMLTextAreaElement.js';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement.js';
import RadioNodeList from './RadioNodeList.js';
import IHTMLButtonElement from '../html-button-element/IHTMLButtonElement.js';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection
	extends Array<IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement>
	implements IHTMLFormControlsCollection
{
	public __namedItems__: { [k: string]: RadioNodeList } = {};

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
		if (this.__namedItems__[name] && this.__namedItems__[name].length) {
			if (this.__namedItems__[name].length === 1) {
				return this.__namedItems__[name][0];
			}
			return this.__namedItems__[name];
		}
		return null;
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public __appendNamedItem__(
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		name: string
	): void {
		if (name) {
			this.__namedItems__[name] = this.__namedItems__[name] || new RadioNodeList();

			if (!this.__namedItems__[name].includes(node)) {
				this.__namedItems__[name].push(node);
			}

			if (this.__isValidPropertyName__(name)) {
				this[name] =
					this.__namedItems__[name].length > 1
						? this.__namedItems__[name]
						: this.__namedItems__[name][0];
			}
		}
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public __removeNamedItem__(
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		name: string
	): void {
		if (name && this.__namedItems__[name]) {
			const index = this.__namedItems__[name].indexOf(node);

			if (index > -1) {
				this.__namedItems__[name].splice(index, 1);

				if (this.__namedItems__[name].length === 0) {
					delete this.__namedItems__[name];
					if (this.hasOwnProperty(name) && this.__isValidPropertyName__(name)) {
						delete this[name];
					}
				} else if (this.__isValidPropertyName__(name)) {
					this[name] =
						this.__namedItems__[name].length > 1
							? this.__namedItems__[name]
							: this.__namedItems__[name][0];
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
	protected __isValidPropertyName__(name: string): boolean {
		return (
			!this.constructor.prototype.hasOwnProperty(name) &&
			!Array.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}
}
