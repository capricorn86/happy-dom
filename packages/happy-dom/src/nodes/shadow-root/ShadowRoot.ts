import DocumentFragment from '../document-fragment/DocumentFragment';
import XMLParser from '../../xml-parser/XMLParser';
import XMLSerializer from '../../xml-serializer/XMLSerializer';
import IElement from '../element/IElement';
import CSSStyleSheet from '../../css/CSSStyleSheet';
import IShadowRoot from './IShadowRoot';
import IHTMLElement from '../../nodes/html-element/IHTMLElement';
import Event from '../../event/Event';

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
