import DocumentFragment from '../document-fragment/DocumentFragment';
import XMLParser from '../../xml-parser/XMLParser';
import XMLSerializer from '../../xml-serializer/XMLSerializer';
import Element from '../element/Element';
import CSSStyleSheet from '../../css/CSSStyleSheet';

/**
 * ShadowRoot.
 */
export default class ShadowRoot extends DocumentFragment {
	public readonly mode = 'open';
	public readonly host: Element = null;
	public adoptedStyleSheets: CSSStyleSheet[] = [];

	/**
	 * Returns inner HTML.
	 *
	 * @return HTML.
	 */
	public get innerHTML(): string {
		const xmlSerializer = new XMLSerializer();
		let xml = '';
		for (const node of this.childNodes) {
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
		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}

		for (const node of XMLParser.parse(this.ownerDocument, html).childNodes.slice()) {
			this.appendChild(node);
		}
	}

	/**
	 * Converts to string.
	 *
	 * @return String.
	 */
	public toString(): string {
		return this.innerHTML;
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): ShadowRoot {
		const clone = <ShadowRoot>super.cloneNode(deep);
		(<string>clone.mode) = this.mode;
		return clone;
	}
}
