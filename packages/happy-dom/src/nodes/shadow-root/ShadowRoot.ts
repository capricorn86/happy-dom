import DocumentFragment from '../document-fragment/DocumentFragment.js';
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
	public readonly mode = 'open';
	public readonly host: IElement = null;
	public adoptedStyleSheets: CSSStyleSheet[] = [];

	// Events
	public onslotchange: (event: Event) => void | null = null;

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
		for (const node of this._childNodes) {
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
		for (const child of this._childNodes.slice()) {
			this.removeChild(child);
		}

		XMLParser.parse(this.ownerDocument, html, { rootNode: this });
	}

	/**
	 * Returns active element.
	 *
	 * @returns Active element.
	 */
	public get activeElement(): IHTMLElement | null {
		const activeElement: IHTMLElement = this.ownerDocument['_activeElement'];
		if (activeElement && activeElement.isConnected && activeElement.getRootNode() === this) {
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
		(<string>clone.mode) = this.mode;
		return clone;
	}
}
