import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type DocumentFragment from '../document-fragment/DocumentFragment.js';
import type ShadowRoot from '../shadow-root/ShadowRoot.js';
import HTMLSerializer from '../../html-serializer/HTMLSerializer.js';
import HTMLParser from '../../html-parser/HTMLParser.js';

/**
 * HTML Template Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement.
 */
export default class HTMLTemplateElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLTemplateElement;

	// Internal properties
	public [PropertySymbol.content]: DocumentFragment =
		this[PropertySymbol.ownerDocument].createDocumentFragment();

	/**
	 * Returns content.
	 *
	 * @returns Content.
	 */
	public get content(): DocumentFragment {
		return this[PropertySymbol.content];
	}

	/**
	 * @override
	 */
	public override get innerHTML(): string {
		return this.getHTML();
	}

	/**
	 * @override
	 */
	public override set innerHTML(html: string) {
		const content = <DocumentFragment>this[PropertySymbol.content];
		const childNodes = content[PropertySymbol.nodeArray];

		while (childNodes.length) {
			content.removeChild(childNodes[0]);
		}

		new HTMLParser(this[PropertySymbol.window], { isTemplateDocumentFragment: true }).parse(
			html,
			this[PropertySymbol.content]
		);
	}

	/**
	 * @deprecated
	 * @override
	 */
	public override getInnerHTML(_options?: { includeShadowRoots?: boolean }): string {
		const serializer = new HTMLSerializer();

		// Options should be ignored as shadow roots should not be serialized for HTMLTemplateElement.

		const content = <DocumentFragment>this[PropertySymbol.content];
		let html = '';

		for (const node of content[PropertySymbol.nodeArray]) {
			html += serializer.serializeToString(node);
		}

		return html;
	}

	/**
	 * @override
	 */
	public override getHTML(_options?: {
		serializableShadowRoots?: boolean;
		shadowRoots?: ShadowRoot[];
	}): string {
		const serializer = new HTMLSerializer();

		// Options should be ignored as shadow roots should not be serialized for HTMLTemplateElement.

		const content = <DocumentFragment>this[PropertySymbol.content];
		let html = '';

		for (const node of content[PropertySymbol.nodeArray]) {
			html += serializer.serializeToString(node);
		}

		return html;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLTemplateElement {
		const clone = <HTMLTemplateElement>super[PropertySymbol.cloneNode](deep);
		clone[PropertySymbol.content] = <DocumentFragment>this[PropertySymbol.content].cloneNode(deep);
		return clone;
	}
}
