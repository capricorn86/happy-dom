import Node from '../node/Node';
import HTMLElement from '../html-element/HTMLElement';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import INode from '../node/INode';
import IHTMLTemplateElement from './IHTMLTemplateElement';

/**
 * HTML Template Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement
 */
export default class HTMLTemplateElement extends HTMLElement implements IHTMLTemplateElement {
	private _contentElement: IDocumentFragment = null;

	/**
	 * Returns the content.
	 *
	 * @returns Content.
	 */
	public get content(): IDocumentFragment {
		if (!this._contentElement) {
			this._contentElement = this.ownerDocument.createDocumentFragment();
		}
		return this._contentElement;
	}

	/**
	 * Previous sibling.
	 *
	 * @return Node.
	 */
	public get previousSibling(): INode {
		return this.content.previousSibling;
	}

	/**
	 * Next sibling.
	 *
	 * @return Node.
	 */
	public get nextSibling(): INode {
		return this.content.nextSibling;
	}

	/**
	 * First child.
	 *
	 * @return Node.
	 */
	public get firstChild(): INode {
		return this.content.firstChild;
	}

	/**
	 * Last child.
	 *
	 * @return Node.
	 */
	public get lastChild(): INode {
		return this.content.lastChild;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @param  node Node to append.
	 * @return Appended node.
	 */
	public appendChild(node: INode): INode {
		return this.content.appendChild(node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param node Node to remove
	 */
	public removeChild(node: Node): void {
		return this.content.removeChild(node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @return Inserted node.
	 */
	public insertBefore(newNode: INode, referenceNode: INode): INode {
		return this.content.insertBefore(newNode, referenceNode);
	}

	/**
	 * Replaces a node with another.
	 *
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @return Replaced node.
	 */
	public replaceChild(newChild: INode, oldChild: INode): INode {
		return this.content.replaceChild(newChild, oldChild);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): IHTMLTemplateElement {
		return <IHTMLTemplateElement>super.cloneNode(deep);
	}
}
