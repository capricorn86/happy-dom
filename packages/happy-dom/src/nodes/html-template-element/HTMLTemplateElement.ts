import Node from '../node/Node';
import HTMLElement from '../html-element/HTMLElement';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import INode from '../node/INode';
import IHTMLTemplateElement from './IHTMLTemplateElement';
import XMLParser from '../../xml-parser/XMLParser';
import XMLSerializer from '../../xml-serializer/XMLSerializer';
import DOMException from '../../exception/DOMException';

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
	 * Sets inner HTML.
	 *
	 * @param html HTML.
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
	 * Returns outer HTML.
	 *
	 * @returns HTML.
	 */
	public get outerHTML(): string {
		return new XMLSerializer().serializeToString(this);
	}

	/**
	 * Returns outer HTML.
	 *
	 * @param html HTML.
	 */
	public set outerHTML(_html: string) {
		throw new DOMException(
			`Failed to set the 'outerHTML' property on 'Element': This element has no parent node.`
		);
	}

	/**
	 * Previous sibling.
	 *
	 * @returns Node.
	 */
	public get previousSibling(): INode {
		return this.content.previousSibling;
	}

	/**
	 * Next sibling.
	 *
	 * @returns Node.
	 */
	public get nextSibling(): INode {
		return this.content.nextSibling;
	}

	/**
	 * First child.
	 *
	 * @returns Node.
	 */
	public get firstChild(): INode {
		return this.content.firstChild;
	}

	/**
	 * Last child.
	 *
	 * @returns Node.
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
	 * Append a child node to childNodes.
	 *
	 * @param  node Node to append.
	 * @returns Appended node.
	 */
	public appendChild(node: INode): INode {
		return this.content.appendChild(node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param node Node to remove.
	 */
	public removeChild(node: Node): INode {
		return this.content.removeChild(node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @returns Inserted node.
	 */
	public insertBefore(newNode: INode, referenceNode: INode): INode {
		return this.content.insertBefore(newNode, referenceNode);
	}

	/**
	 * Replaces a node with another.
	 *
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @returns Replaced node.
	 */
	public replaceChild(newChild: INode, oldChild: INode): INode {
		return this.content.replaceChild(newChild, oldChild);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLTemplateElement {
		const clone = <IHTMLTemplateElement>super.cloneNode(deep);
		(<IDocumentFragment>clone.content) = this.content.cloneNode(deep);
		return clone;
	}
}
