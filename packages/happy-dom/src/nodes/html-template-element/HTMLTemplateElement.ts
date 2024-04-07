import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Node from '../node/Node.js';
import XMLSerializer from '../../xml-serializer/XMLSerializer.js';
import XMLParser from '../../xml-parser/XMLParser.js';

/**
 * HTML Template Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement.
 */
export default class HTMLTemplateElement extends HTMLElement {
	// Public properties
	public cloneNode: (deep?: boolean) => HTMLTemplateElement;

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
	public get innerHTML(): string {
		return this.getInnerHTML();
	}

	/**
	 * @override
	 */
	public set innerHTML(html: string) {
		const content = <DocumentFragment>this[PropertySymbol.content];

		for (const child of content[PropertySymbol.childNodes].slice()) {
			this[PropertySymbol.content].removeChild(child);
		}

		XMLParser.parse(this[PropertySymbol.ownerDocument], html, {
			rootNode: this[PropertySymbol.content]
		});
	}

	/**
	 * @override
	 */
	public get firstChild(): Node {
		return this[PropertySymbol.content].firstChild;
	}

	/**
	 * @override
	 */
	public get lastChild(): Node {
		return this[PropertySymbol.content].lastChild;
	}

	/**
	 * @override
	 */
	public getInnerHTML(options?: { includeShadowRoots?: boolean }): string {
		const xmlSerializer = new XMLSerializer({
			includeShadowRoots: options && options.includeShadowRoots,
			escapeEntities: false
		});
		const content = <DocumentFragment>this[PropertySymbol.content];
		let xml = '';
		for (const node of content[PropertySymbol.childNodes]) {
			xml += xmlSerializer.serializeToString(node);
		}
		return xml;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.appendChild](node: Node): Node {
		return this[PropertySymbol.content].appendChild(node);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeChild](node: Node): Node {
		return this[PropertySymbol.content].removeChild(node);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.insertBefore](newNode: Node, referenceNode: Node): Node {
		return this[PropertySymbol.content].insertBefore(newNode, referenceNode);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.replaceChild](newChild: Node, oldChild: Node): Node {
		return this[PropertySymbol.content].replaceChild(newChild, oldChild);
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
