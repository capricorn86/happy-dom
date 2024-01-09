import IHTMLFormControlsCollection from './IHTMLFormControlsCollection.js';
import * as PropertySymbol from '../../PropertySymbol.js';
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
	public [PropertySymbol.namedItems]: { [k: string]: RadioNodeList } = {};

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
		if (this[PropertySymbol.namedItems][name] && this[PropertySymbol.namedItems][name].length) {
			if (this[PropertySymbol.namedItems][name].length === 1) {
				return this[PropertySymbol.namedItems][name][0];
			}
			return this[PropertySymbol.namedItems][name];
		}
		return null;
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public [PropertySymbol.appendNamedItem](
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		name: string
	): void {
		if (name) {
			this[PropertySymbol.namedItems][name] =
				this[PropertySymbol.namedItems][name] || new RadioNodeList();

			if (!this[PropertySymbol.namedItems][name].includes(node)) {
				this[PropertySymbol.namedItems][name].push(node);
			}

			if (this[PropertySymbol.isValidPropertyName](name)) {
				this[name] =
					this[PropertySymbol.namedItems][name].length > 1
						? this[PropertySymbol.namedItems][name]
						: this[PropertySymbol.namedItems][name][0];
			}
		}
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public [PropertySymbol.removeNamedItem](
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		name: string
	): void {
		if (name && this[PropertySymbol.namedItems][name]) {
			const index = this[PropertySymbol.namedItems][name].indexOf(node);

			if (index > -1) {
				this[PropertySymbol.namedItems][name].splice(index, 1);

				if (this[PropertySymbol.namedItems][name].length === 0) {
					delete this[PropertySymbol.namedItems][name];
					if (this.hasOwnProperty(name) && this[PropertySymbol.isValidPropertyName](name)) {
						delete this[name];
					}
				} else if (this[PropertySymbol.isValidPropertyName](name)) {
					this[name] =
						this[PropertySymbol.namedItems][name].length > 1
							? this[PropertySymbol.namedItems][name]
							: this[PropertySymbol.namedItems][name][0];
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
	protected [PropertySymbol.isValidPropertyName](name: string): boolean {
		return (
			!this.constructor.prototype.hasOwnProperty(name) &&
			!Array.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}
}
