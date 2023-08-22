import Node from '../node/Node.js';
import IElement from '../element/IElement.js';
import QuerySelector from '../../query-selector/QuerySelector.js';
import ParentNodeUtility from '../parent-node/ParentNodeUtility.js';
import IDocumentFragment from './IDocumentFragment.js';
import INode from '../node/INode.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import ElementUtility from '../element/ElementUtility.js';
import HTMLCollection from '../element/HTMLCollection.js';
import INodeList from '../node/INodeList.js';

/**
 * DocumentFragment.
 */
export default class DocumentFragment extends Node implements IDocumentFragment {
	public nodeType = Node.DOCUMENT_FRAGMENT_NODE;
	public readonly _children: IHTMLCollection<IElement> = new HTMLCollection();
	public _rootNode: INode = this;

	/**
	 * Returns the document fragment children.
	 */
	public get children(): IHTMLCollection<IElement> {
		return this._children;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this._children.length;
	}

	/**
	 * First element child.
	 *
	 * @returns Element.
	 */
	public get firstElementChild(): IElement {
		return this._children[0] ?? null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): IElement {
		return this._children[this._children.length - 1] ?? null;
	}

	/**
	 * Get text value of children.
	 *
	 * @returns Text content.
	 */
	public get textContent(): string {
		let result = '';
		for (const childNode of this._childNodes) {
			if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType === Node.TEXT_NODE) {
				result += childNode.textContent;
			}
		}
		return result;
	}

	/**
	 * Sets text content.
	 *
	 * @param textContent Text content.
	 */
	public set textContent(textContent: string) {
		for (const child of this._childNodes.slice()) {
			this.removeChild(child);
		}
		if (textContent) {
			this.appendChild(this.ownerDocument.createTextNode(textContent));
		}
	}

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public append(...nodes: (INode | string)[]): void {
		ParentNodeUtility.append(this, ...nodes);
	}

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public prepend(...nodes: (INode | string)[]): void {
		ParentNodeUtility.prepend(this, ...nodes);
	}

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceChildren(...nodes: (INode | string)[]): void {
		ParentNodeUtility.replaceChildren(this, ...nodes);
	}

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): INodeList<IElement> {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector(selector: string): IElement {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @returns Matching element.
	 */
	public getElementById(id: string): IElement {
		return ParentNodeUtility.getElementById(this, id);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IDocumentFragment {
		const clone = <DocumentFragment>super.cloneNode(deep);

		if (deep) {
			for (const node of clone._childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					clone._children.push(<IElement>node);
				}
			}
		}

		return <IDocumentFragment>clone;
	}

	/**
	 * @override
	 */
	public override appendChild(node: INode): INode {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.appendChild(this, node);
	}

	/**
	 * @override
	 */
	public override removeChild(node: INode): INode {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.removeChild(this, node);
	}

	/**
	 * @override
	 */
	public override insertBefore(newNode: INode, referenceNode: INode | null): INode {
		if (arguments.length < 2) {
			throw new TypeError(
				`Failed to execute 'insertBefore' on 'Node': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.insertBefore(this, newNode, referenceNode);
	}
}
