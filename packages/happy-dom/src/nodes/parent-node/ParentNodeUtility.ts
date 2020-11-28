import DocumentFragment from '../../nodes/document-fragment/DocumentFragment';
import Element from '../../nodes/element/Element';
import Node from '../../nodes/node/Node';
import QuerySelector from '../../query-selector/QuerySelector';
import XMLParser from '../../xml-parser/XMLParser';
import Document from '../document/Document';

/**
 * Parent node utility.
 */
export default class ParentNodeUtility {
	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param parentNode Parent node.
	 * @param nodes List of Node or DOMString.
	 */
	public static append(parentNode: Node, ...nodes: (Node | string)[]): void {
		for (const node of nodes) {
			if (typeof node === 'string') {
				const newChildNodes = XMLParser.parse(
					<Document>parentNode.ownerDocument,
					node
				).childNodes.slice();
				for (const newChildNode of newChildNodes) {
					parentNode.appendChild(newChildNode);
				}
			} else {
				parentNode.appendChild(node);
			}
		}
	}

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param parentNode Parent node.
	 * @param nodes List of Node or DOMString.
	 */
	public static prepend(parentNode: Node, ...nodes: (string | Node)[]): void {
		const firstChild = parentNode.firstChild;

		for (const node of nodes) {
			if (typeof node === 'string') {
				const newChildNodes = XMLParser.parse(
					<Document>parentNode.ownerDocument,
					node
				).childNodes.slice();
				for (const newChildNode of newChildNodes) {
					parentNode.insertBefore(newChildNode, firstChild);
				}
			} else {
				parentNode.insertBefore(node, firstChild);
			}
		}
	}

	/**
	 * Replaces the existing children of a ParentNode with a specified new set of children.
	 *
	 * @param parentNode Parent node.
	 * @param nodes List of Node or DOMString.
	 */
	public static replaceChildren(parentNode: Node, ...nodes: (string | Node)[]): void {
		for (const node of parentNode.childNodes.slice()) {
			parentNode.removeChild(node);
		}

		this.append(parentNode, ...nodes);
	}
	/**
	 * Returns an elements by class name.
	 *
	 * @param parentNode Parent node.
	 * @param className Tag name.
	 * @returns Matching element.
	 */
	public static getElementsByClassName(parentNode: Node, className: string): Element[] {
		return QuerySelector.querySelectorAll(parentNode, '.' + className.split(' ').join('.'));
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param parentNode Parent node.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public static getElementsByTagName(
		parentNode: Element | DocumentFragment | Document,
		tagName: string
	): Element[] {
		const upperTagName = tagName.toUpperCase();
		let matches = [];

		for (const child of parentNode.children) {
			if (child.tagName === upperTagName) {
				matches.push(child);
			}
			matches = matches.concat(this.getElementsByTagName(<Element>child, tagName));
		}

		return matches;
	}

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param parentNode Parent node.
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public static getElementsByTagNameNS(
		parentNode: Element | DocumentFragment | Document,
		namespaceURI: string,
		tagName: string
	): Element[] {
		const upperTagName = tagName.toUpperCase();
		let matches = [];

		for (const child of parentNode.children) {
			if (child.tagName === upperTagName && child.namespaceURI === namespaceURI) {
				matches.push(child);
			}
			matches = matches.concat(this.getElementsByTagNameNS(<Element>child, namespaceURI, tagName));
		}

		return matches;
	}

	/**
	 * Returns the first element matching a tag name.
	 * This is not part of the browser standard and is only used internally in the document.
	 *
	 * @param parentNode Parent node.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public static getElementByTagName(
		parentNode: Element | DocumentFragment | Document,
		tagName: string
	): Element {
		const upperTagName = tagName.toUpperCase();

		for (const child of parentNode.children) {
			if (child.tagName === upperTagName) {
				return <Element>child;
			}
			const match = this.getElementByTagName(<Element>child, tagName);
			if (match) {
				return match;
			}
		}

		return null;
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param parentNode Parent node.
	 * @param id ID.
	 * @return Matching element.
	 */
	public static getElementById(
		parentNode: Element | DocumentFragment | Document,
		id: string
	): Element {
		for (const child of parentNode.children) {
			if (child.id === id) {
				return <Element>child;
			}

			const match = this.getElementById(<Element>child, id);

			if (match) {
				return match;
			}
		}

		return null;
	}
}
