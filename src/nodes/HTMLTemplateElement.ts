import Node from './Node';
import HTMLElement from './HTMLElement';
import DocumentFragment from './DocumentFragment';

/**
 * HTMLTemplateElement.
 */
export default class HTMLTemplateElement extends HTMLElement {
	private contentElement: DocumentFragment = null;

	/**
	 * Returns the content.
	 *
	 * @return {DocumentFragment} Content.
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
	 * @return {Node} Node.
	 */
	public get previousSibling(): Node {
		return this.content.previousSibling;
	}

	/**
	 * Next sibling.
	 *
	 * @return {Node} Node.
	 */
	public get nextSibling(): Node {
		return this.content.nextSibling;
	}

	/**
	 * First child.
	 *
	 * @return {Node} Node.
	 */
	public get firstChild(): Node {
		return this.content.firstChild;
	}

	/**
	 * Last child.
	 *
	 * @return {Node} Node.
	 */
	public get lastChild(): Node {
		return this.content.lastChild;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @param  {Node} node Node to append.
	 * @return {Node} Appended node.
	 */
	public appendChild(node: Node): Node {
		return this.content.appendChild(node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param {Node} node Node to remove
	 */
	public removeChild(node: Node): void {
		return this.content.removeChild(node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param {Node} newNode Node to insert.
	 * @param {Node} referenceNode Node to insert before.
	 * @return {Node} Inserted node.
	 */
	public insertBefore(newNode: Node, referenceNode: Node): Node {
		return this.content.insertBefore(newNode, referenceNode);
	}

	/**
	 * Replaces a node with another.
	 *
	 * @param {Node} newChild New child.
	 * @param {Node} oldChild Old child.
	 * @return {Node} Replaced node.
	 */
	public replaceChild(newChild: Node, oldChild: Node): Node {
		return this.content.replaceChild(newChild, oldChild);
	}
}
