import Document from '../document/Document.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import NamespaceURI from '../../config/NamespaceURI.js';
import type HTMLElement from '../html-element/HTMLElement.js';

/**
 * Document.
 */
export default class XMLDocument extends Document {
	// Internal properties
	public [PropertySymbol.contentType]: string = 'application/xml';

	/* eslint-disable jsdoc/valid-types */
	/**
	 * Creates an element. Preserves case for XML documents (element names are case-sensitive in XML).
	 *
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public override createElement(qualifiedName: string, options?: { is?: string }): HTMLElement {
		return <HTMLElement>this.createElementNS(NamespaceURI.html, String(qualifiedName), options);
	}
}
