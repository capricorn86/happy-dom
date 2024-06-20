import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import HTMLCollection from '../element/HTMLCollection.js';

/**
 * HTMLDataListElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDataListElement
 */
export default class HTMLDataListElement extends HTMLElement {
	public [PropertySymbol.options]: IHTMLCollection<HTMLOptionElement> | null = null;

	/**
	 * Returns options.
	 *
	 * @returns Options.
	 */
	public get options(): IHTMLCollection<HTMLOptionElement> {
		if (!this[PropertySymbol.options]) {
			this[PropertySymbol.options] = new HTMLCollection<HTMLOptionElement>({
				filter: (item) => item[PropertySymbol.tagName] === 'OPTION',
				observeNode: this
			});
		}
		return this[PropertySymbol.options];
	}
}
