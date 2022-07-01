import HTMLElement from '../html-element/HTMLElement';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import INode from '../node/INode';
import IHTMLTemplateElement from './IHTMLTemplateElement';
import XMLParser from '../../xml-parser/XMLParser';
import XMLSerializer from '../../xml-serializer/XMLSerializer';

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
		for (const child of this.content.childNodes.slice()) {
			this.content.removeChild(child);
		}

		for (const node of XMLParser.parse(this.ownerDocument, html).childNodes.slice()) {
			this.content.appendChild(node);
		}
	}

	/**
	 * @override
	 */
	public get previousSibling(): INode {
		return null;
	}

	/**
	 * @override
	 */
	public get nextSibling(): INode {
		return null;
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
		const xmlSerializer = new XMLSerializer();
		let xml = '';
		for (const node of this.content.childNodes) {
			xml += xmlSerializer.serializeToString(node, options);
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
