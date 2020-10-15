import Node from '../node/Node';
import IElement from '../element/IElement';
import QuerySelector from '../../../query-selector/QuerySelector';
import IParentNode from '../parent-node/IParentNode';
import ParentNodeUtility from '../parent-node/ParentNodeUtility';
import Element from '../element/Element';

/**
 * DocumentFragment.
 */
export default class DocumentFragment extends Node implements IParentNode {
	public nodeType = Node.DOCUMENT_FRAGMENT_NODE;
	public readonly children: IElement[] = [];

	/**
	 * Last element child.
	 *
	 * @return Element.
	 */
	public get childElementCount(): number {
		return this.children.length;
	}

	/**
	 * First element child.
	 *
	 * @return Element.
	 */
	public get firstElementChild(): IElement {
		return this.children ? this.children[0] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @return Element.
	 */
	public get lastElementChild(): IElement {
		return this.children ? this.children[this.children.length - 1] || null : null;
	}

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public append(...nodes: (Node | string)[]): void {
		ParentNodeUtility.append(this, ...nodes);
	}

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public prepend(...nodes: (Node | string)[]): void {
		ParentNodeUtility.prepend(this, ...nodes);
	}

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceChildren(...nodes: (Node | string)[]): void {
		ParentNodeUtility.replaceChildren(this, ...nodes);
	}

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): IElement[] {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @return Matching element.
	 */
	public querySelector(selector: string): IElement {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @return Matching element.
	 */
	public getElementById(id: string): IElement {
		return this.querySelector('#' + id);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): DocumentFragment {
		const clone = <DocumentFragment>super.cloneNode(deep);

		if (deep) {
			const children = <Element[]>(
				clone.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)
			);

			// @ts-ignore;
			clone.children = children;
		}

		return clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @override
	 * @param  node Node to append.
	 * @return Appended node.
	 */
	public appendChild(node: Node): Node {
		if (node.parentNode && node.parentNode['children']) {
			const index = node.parentNode['children'].indexOf(node);
			if (index !== -1) {
				node.parentNode['children'].splice(index, 1);
			}
		}

		if (node !== this && node.nodeType === Node.ELEMENT_NODE) {
			this.children.push(<Element>node);
		}

		return super.appendChild(<Node>node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @override
	 * @param node Node to remove
	 */
	public removeChild(node: Node): void {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const index = this.children.indexOf(<Element>node);
			if (index !== -1) {
				this.children.splice(index, 1);
			}
		}

		super.removeChild(<Node>node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @override
	 * @param newNode Node to insert.
	 * @param [referenceNode] Node to insert before.
	 * @return Inserted node.
	 */
	public insertBefore(newNode: Node, referenceNode?: Node): Node {
		if (newNode.parentNode && newNode.parentNode['children']) {
			const index = newNode.parentNode['children'].indexOf(newNode);
			if (index !== -1) {
				newNode.parentNode['children'].splice(index, 1);
			}
		}
		return super.insertBefore(newNode, referenceNode);
	}
}
