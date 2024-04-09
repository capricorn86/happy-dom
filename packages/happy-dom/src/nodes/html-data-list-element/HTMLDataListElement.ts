import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import Node from '../node/Node.js';

/**
 * HTMLDataListElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDataListElement
 */
export default class HTMLDataListElement extends HTMLElement {
	public [PropertySymbol.options] = new HTMLCollection<HTMLOptionElement>();
	public [PropertySymbol.dataListNode]: Node = this;

	/**
	 * Returns options.
	 *
	 * @returns Options.
	 */
	public get options(): HTMLCollection<HTMLOptionElement> {
		return this[PropertySymbol.options];
	}
}
