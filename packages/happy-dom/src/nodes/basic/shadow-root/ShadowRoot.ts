import DocumentFragment from '../document-fragment/DocumentFragment';
import HTMLParser from '../../../html-parser/HTMLParser';
import HTMLRenderer from '../../../html-renderer/HTMLRenderer';

/**
 * ShadowRoot.
 */
export default class ShadowRoot extends DocumentFragment {
	public mode = 'open';
	public _renderer: HTMLRenderer = null;

	/**
	 * Returns inner HTML.
	 *
	 * @return HTML.
	 */
	public get innerHTML(): string {
		return HTMLRenderer.getInnerHTML(this);
	}

	/**
	 * Sets inner HTML.
	 *
	 * @param html HTML.
	 * @return HTML.
	 */
	public set innerHTML(html: string) {
		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}
		for (const node of HTMLParser.parse(this.ownerDocument, html).childNodes.slice()) {
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
}
