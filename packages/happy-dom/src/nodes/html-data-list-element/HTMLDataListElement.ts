import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLCollection from '../element/HTMLCollection.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import Node from '../node/Node.js';

/**
 * HTMLDataListElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDataListElement
 */
export default class HTMLDataListElement extends HTMLElement {
	public [PropertySymbol.options] = new HTMLCollection<HTMLOptionElement>(
		(item: Node) => item[PropertySymbol.tagName] === 'OPTION'
	);

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor() {
		super();
		// Child nodes listeners
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener]('add', (item: Node) => {
			this[PropertySymbol.elements][PropertySymbol.addItem](<HTMLOptionElement>item);
		});
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener](
			'insert',
			(newItem: Node, referenceItem: Node | null) => {
				this[PropertySymbol.elements][PropertySymbol.insertItem](
					<HTMLOptionElement>newItem,
					<HTMLOptionElement>referenceItem
				);
			}
		);
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener](
			'remove',
			(item: Node) => {
				(<HTMLOptionElement>item)[PropertySymbol.formNode] = null;
				this[PropertySymbol.elements][PropertySymbol.removeItem](<HTMLOptionElement>item);
			}
		);
	}

	/**
	 * Returns options.
	 *
	 * @returns Options.
	 */
	public get options(): IHTMLCollection<HTMLOptionElement> {
		return this[PropertySymbol.options];
	}
}
