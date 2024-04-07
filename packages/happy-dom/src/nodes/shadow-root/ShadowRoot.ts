import DocumentFragment from '../document-fragment/DocumentFragment.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import XMLParser from '../../xml-parser/XMLParser.js';
import XMLSerializer from '../../xml-serializer/XMLSerializer.js';
import Element from '../element/Element.js';
import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import HTMLElement from '../../nodes/html-element/HTMLElement.js';
import Event from '../../event/Event.js';
import SVGElement from '../svg-element/SVGElement.js';

/**
 * ShadowRoot.
 */
export default class ShadowRoot extends DocumentFragment {
	// Public properties
	public cloneNode: (deep?: boolean) => ShadowRoot;

	// Events
	public onslotchange: (event: Event) => void | null = null;

	// Internal properties
	public [PropertySymbol.adoptedStyleSheets]: CSSStyleSheet[] = [];
	public [PropertySymbol.mode] = 'open';
	public [PropertySymbol.host]: Element | null = null;

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
	public get host(): Element {
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
	public get activeElement(): HTMLElement | SVGElement | null {
		const activeElement: HTMLElement | SVGElement =
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
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): ShadowRoot {
		const clone = <ShadowRoot>super[PropertySymbol.cloneNode](deep);
		clone[PropertySymbol.mode] = this.mode;
		return clone;
	}
}
