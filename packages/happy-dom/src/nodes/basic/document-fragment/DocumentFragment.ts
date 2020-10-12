import Node from '../node/Node';
import Element from '../element/Element';
import QuerySelector from '../../../query-selector/QuerySelector';

/**
 * DocumentFragment.
 */
export default class DocumentFragment extends Node {
	public nodeType = Node.DOCUMENT_FRAGMENT_NODE;
	public mode = 'open';
	public children: Element[] = [];

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): Element[] {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @return Matching node.
	 */
	public querySelector(selector: string): Element {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @return Matching node.
	 */
	public getElementById(id: string): Element {
		return this.querySelector('#' + id);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching nodes.
	 */
	public getElementsByTagName(tagName: string): Element[] {
		return this.querySelectorAll(tagName);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching nodes.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): Element[] {
		return this.querySelectorAll(tagName).filter(element => element._namespaceURI === namespaceURI);
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching nodes.
	 */
	public getElementsByClassName(className: string): Element[] {
		return this.querySelectorAll('.' + className.split(' ').join('.'));
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): Node {
		const clone = <DocumentFragment>super.cloneNode(deep);

		if (deep) {
			clone.children = <Element[]>(
				clone.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)
			);
		}
		clone.mode = this.mode;

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
		if (node !== this && node instanceof Element) {
			this.children.push(node);
		}

		return super.appendChild(node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @override
	 * @param node Node to remove
	 */
	public removeChild(node: Node): void {
		if (node instanceof Element) {
			const index = this.children.indexOf(node);
			if (index !== -1) {
				this.children.splice(index, 1);
			}
		}

		super.removeChild(node);
	}
}
