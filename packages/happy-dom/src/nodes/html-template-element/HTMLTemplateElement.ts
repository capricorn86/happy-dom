import HTMLElement from '../html-element/HTMLElement.js';
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
	public readonly content: IDocumentFragment = this.ownerDocument.createDocumentFragment();

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
		for (const child of (<DocumentFragment>this.content)._childNodes.slice()) {
			this.content.removeChild(child);
		}

		XMLParser.parse(this.ownerDocument, html, { rootNode: this.content });
	}

	/**
	 * @override
	 */
	public get firstChild(): INode {
		return this.content.firstChild;
	}

	/**
	 * @override
	 */
	public get lastChild(): INode {
		return this.content.lastChild;
	}

	/**
	 * @override
	 */
	public getInnerHTML(options?: { includeShadowRoots?: boolean }): string {
		const xmlSerializer = new XMLSerializer({
			includeShadowRoots: options && options.includeShadowRoots,
			escapeEntities: false
		});
		let xml = '';
		for (const node of (<DocumentFragment>this.content)._childNodes) {
			xml += xmlSerializer.serializeToString(node);
		}
		return xml;
	}

	/**
	 * @override
	 */
	public appendChild(node: INode): INode {
		return this.content.appendChild(node);
	}

	/**
	 * @override
	 */
	public removeChild(node: INode): INode {
		return this.content.removeChild(node);
	}

	/**
	 * @override
	 */
	public insertBefore(newNode: INode, referenceNode: INode): INode {
		return this.content.insertBefore(newNode, referenceNode);
	}

	/**
	 * @override
	 */
	public replaceChild(newChild: INode, oldChild: INode): INode {
		return this.content.replaceChild(newChild, oldChild);
	}

	/**
	 * @override
	 */
	public cloneNode(deep = false): IHTMLTemplateElement {
		const clone = <IHTMLTemplateElement>super.cloneNode(deep);
		(<IDocumentFragment>clone.content) = this.content.cloneNode(deep);
		return clone;
	}
}
