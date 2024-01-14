import DocumentFragment from '../document-fragment/DocumentFragment.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import XMLParser from '../../xml-parser/XMLParser.js';
import XMLSerializer from '../../xml-serializer/XMLSerializer.js';
import IElement from '../element/IElement.js';
import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import IShadowRoot from './IShadowRoot.js';
import IHTMLElement from '../../nodes/html-element/IHTMLElement.js';
import Event from '../../event/Event.js';

/**
 * ShadowRoot.
 */
export default class ShadowRoot extends DocumentFragment implements IShadowRoot {
	// Events
	public onslotchange: (event: Event) => void | null = null;

	// Internal properties
	public [PropertySymbol.adoptedStyleSheets]: CSSStyleSheet[] = [];
	public [PropertySymbol.mode] = 'open';
	public [PropertySymbol.host]: IElement | null = null;

	/**
	 * Returns mode.
	 *
	 * @returns Mode.
	 */
	public get mode(): string {
		return this[PropertySymbol.mode];
	}

	/**
	 * Returns host.
	 *
	 * @returns Host.
	 */
	public get host(): IElement {
		return this[PropertySymbol.host];
	}

	/**
	 * Returns inner HTML.
	 *
	 * @returns HTML.
	 */
	public get innerHTML(): string {
		const xmlSerializer = new XMLSerializer({
			escapeEntities: false
		});
		let xml = '';
		for (const node of this[PropertySymbol.childNodes]) {
			xml += xmlSerializer.serializeToString(node);
		}
		return xml;
	}

	/**
	 * Sets inner HTML.
	 *
	 * @param html HTML.
	 */
	public set innerHTML(html: string) {
		for (const child of this[PropertySymbol.childNodes].slice()) {
			this.removeChild(child);
		}

		XMLParser.parse(this[PropertySymbol.ownerDocument], html, { rootNode: this });
	}

	/**
	 * Returns adopted style sheets.
	 *
	 * @returns Adopted style sheets.
	 */
	public get adoptedStyleSheets(): CSSStyleSheet[] {
		return this[PropertySymbol.adoptedStyleSheets];
	}

	/**
	 * Sets adopted style sheets.
	 *
	 * @param value Adopted style sheets.
	 */
	public set adoptedStyleSheets(value: CSSStyleSheet[]) {
		this[PropertySymbol.adoptedStyleSheets] = value;
	}

	/**
	 * Returns active element.
	 *
	 * @returns Active element.
	 */
	public get activeElement(): IHTMLElement | null {
		const activeElement: IHTMLElement =
			this[PropertySymbol.ownerDocument][PropertySymbol.activeElement];
		if (
			activeElement &&
			activeElement[PropertySymbol.isConnected] &&
			activeElement.getRootNode() === this
		) {
			return activeElement;
		}
		return null;
	}

	/**
	 * Converts to string.
	 *
	 * @returns String.
	 */
	public toString(): string {
		return this.innerHTML;
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IShadowRoot {
		const clone = <ShadowRoot>super.cloneNode(deep);
		clone[PropertySymbol.mode] = this.mode;
		return clone;
	}
}
