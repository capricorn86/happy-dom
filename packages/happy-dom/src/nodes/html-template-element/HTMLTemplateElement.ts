import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IDocumentFragment from '../document-fragment/IDocumentFragment.js';
import INode from '../node/INode.js';
import IHTMLTemplateElement from './IHTMLTemplateElement.js';
import XMLSerializer from '../../xml-serializer/XMLSerializer.js';
import XMLParser from '../../xml-parser/XMLParser.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';

/**
 * HTML Template Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement.
 */
export default class HTMLTemplateElement extends HTMLElement implements IHTMLTemplateElement {
	// Internal properties
	public [PropertySymbol.content]: IDocumentFragment =
		this[PropertySymbol.ownerDocument].createDocumentFragment();

	/**
	 * Returns content.
	 *
	 * @returns Content.
	 */
	public get content(): IDocumentFragment {
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
	public get firstChild(): INode {
		return this[PropertySymbol.content].firstChild;
	}

	/**
	 * @override
	 */
	public get lastChild(): INode {
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
	public appendChild(node: INode): INode {
		return this[PropertySymbol.content].appendChild(node);
	}

	/**
	 * @override
	 */
	public removeChild(node: INode): INode {
		return this[PropertySymbol.content].removeChild(node);
	}

	/**
	 * @override
	 */
	public insertBefore(newNode: INode, referenceNode: INode): INode {
		return this[PropertySymbol.content].insertBefore(newNode, referenceNode);
	}

	/**
	 * @override
	 */
	public replaceChild(newChild: INode, oldChild: INode): INode {
		return this[PropertySymbol.content].replaceChild(newChild, oldChild);
	}

	/**
	 * @override
	 */
	public cloneNode(deep = false): IHTMLTemplateElement {
		const clone = <IHTMLTemplateElement>super.cloneNode(deep);
		clone[PropertySymbol.content] = this[PropertySymbol.content].cloneNode(deep);
		return clone;
	}
}
