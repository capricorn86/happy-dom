import Node from '../node/Node';
import IElement from '../element/IElement';
import QuerySelector from '../../query-selector/QuerySelector';
import ParentNodeUtility from '../parent-node/ParentNodeUtility';
import IDocumentFragment from './IDocumentFragment';
import INode from '../node/INode';
import IHTMLCollection from '../element/IHTMLCollection';
import HTMLCollectionFactory from '../element/HTMLCollectionFactory';

/**
 * DocumentFragment.
 */
export default class DocumentFragment extends Node implements IDocumentFragment {
	public nodeType = Node.DOCUMENT_FRAGMENT_NODE;
	public readonly children: IHTMLCollection<IElement> = HTMLCollectionFactory.create();
	public _rootNode: INode = this;

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this.children.length;
	}

	/**
	 * First element child.
	 *
	 * @returns Element.
	 */
	public get firstElementChild(): IElement {
		return this.children ? this.children[0] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): IElement {
		return this.children ? this.children[this.children.length - 1] || null : null;
	}

	/**
	 * Get text value of children.
	 *
	 * @returns Text content.
	 */
	public get textContent(): string {
		let result = '';
		for (const childNode of this.childNodes) {
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
		for (const child of this.childNodes.slice()) {
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
	public querySelectorAll(selector: string): IElement[] {
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
		const clone = <IDocumentFragment>super.cloneNode(deep);

		if (deep) {
			for (const node of clone.childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					clone.children.push(<IElement>node);
				}
			}
		}

		return <IDocumentFragment>clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @override
	 * @param  node Node to append.
	 * @returns Appended node.
	 */
	public appendChild(node: INode): INode {
		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
			if (node.parentNode && node.parentNode['children']) {
				const index = node.parentNode['children'].indexOf(node);
				if (index !== -1) {
					node.parentNode['children'].splice(index, 1);
				}
			}

			if (node !== this && node.nodeType === Node.ELEMENT_NODE) {
				this.children.push(<IElement>node);
			}
		}

		return super.appendChild(<INode>node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @override
	 * @param node Node to remove.
	 */
	public removeChild(node: INode): INode {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const index = this.children.indexOf(<IElement>node);
			if (index !== -1) {
				this.children.splice(index, 1);
			}
		}

		return super.removeChild(<Node>node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @override
	 * @param newNode Node to insert.
	 * @param [referenceNode] Node to insert before.
	 * @returns Inserted node.
	 */
	public insertBefore(newNode: INode, referenceNode?: INode): INode {
		const returnValue = super.insertBefore(newNode, referenceNode);

		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (newNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
			if (newNode.parentNode && newNode.parentNode['children']) {
				const index = newNode.parentNode['children'].indexOf(newNode);
				if (index !== -1) {
					newNode.parentNode['children'].splice(index, 1);
				}
			}

			this.children.length = 0;

			for (const node of this.childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					this.children.push(<IElement>node);
				}
			}
		}

		return returnValue;
	}
}
