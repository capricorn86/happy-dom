import Document from '../document/Document.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * Document.
 */
export default class HTMLDocument extends Document {
	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Default document elements
		const doctype = this[PropertySymbol.implementation].createDocumentType('html', '', '');
		const documentElement = this.createElement('html');
		const bodyElement = this.createElement('body');
		const headElement = this.createElement('head');

		this.appendChild(doctype);
		this.appendChild(documentElement);

		documentElement.appendChild(headElement);
		documentElement.appendChild(bodyElement);
	}
}
