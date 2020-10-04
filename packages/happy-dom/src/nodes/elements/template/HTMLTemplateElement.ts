import Node from '../../basic/node/Node';
import HTMLElement from '../../basic/html-element/HTMLElement';
import DocumentFragment from '../../basic/document-fragment/DocumentFragment';

/**
 * HTMLTemplateElement.
 */
export default class HTMLTemplateElement extends HTMLElement {
	private contentElement: DocumentFragment = null;

	/**
	 * Returns the content.
	 *
	 * @returns Content.
	 */
	public get content(): DocumentFragment {
		if (!this.contentElement) {
			this.contentElement = this.ownerDocument.createDocumentFragment();
		}
		return this.contentElement;
	}

	/**
	 * Previous sibling.
	 *
	 * @return Node.
	 */
	public get previousSibling(): Node {
		return this.content.previousSibling;
	}

	/**
	 * Next sibling.
	 *
	 * @return Node.
	 */
	public get nextSibling(): Node {
		return this.content.nextSibling;
	}

	/**
	 * First child.
	 *
	 * @return Node.
	 */
	public get firstChild(): Node {
		return this.content.firstChild;
	}

	/**
	 * Last child.
	 *
	 * @return Node.
	 */
	public get lastChild(): Node {
		return this.content.lastChild;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @param  node Node to append.
	 * @return Appended node.
	 */
	public appendChild(node: Node): Node {
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
	public insertBefore(newNode: Node, referenceNode: Node): Node {
		return this.content.insertBefore(newNode, referenceNode);
	}

	/**
	 * Replaces a node with another.
	 *
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @return Replaced node.
	 */
	public replaceChild(newChild: Node, oldChild: Node): Node {
		return this.content.replaceChild(newChild, oldChild);
	}
}
