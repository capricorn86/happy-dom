import XMLParser from '../../xml-parser/XMLParser.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Document from '../document/Document.js';
import Element from '../element/Element.js';
import HTMLCollection from '../element/HTMLCollection.js';
import Node from '../node/Node.js';
import NamespaceURI from '../../config/NamespaceURI.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

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
	public static append(
		parentNode: Element | Document | DocumentFragment,
		...nodes: (Node | string)[]
	): void {
		for (const node of nodes) {
			if (typeof node === 'string') {
				XMLParser.parse(<Document>parentNode[PropertySymbol.ownerDocument], node, {
					rootNode: parentNode
				});
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
	public static prepend(
		parentNode: Element | Document | DocumentFragment,
		...nodes: (string | Node)[]
	): void {
		const firstChild = parentNode.firstChild;
		for (const node of nodes) {
			if (typeof node === 'string') {
				const childNodes = XMLParser.parse(
					<Document>parentNode[PropertySymbol.ownerDocument],
					node
				)[PropertySymbol.childNodes];

				while (childNodes.length) {
					parentNode.insertBefore(childNodes[0], firstChild);
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
	public static replaceChildren(
		parentNode: Element | Document | DocumentFragment,
		...nodes: (string | Node)[]
	): void {
		const childNodes = (<DocumentFragment>parentNode)[PropertySymbol.childNodes];

		while (childNodes.length) {
			parentNode.removeChild(childNodes[0]);
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
	public static getElementsByClassName(
		parentNode: Element | DocumentFragment | Document,
		className: string
	): IHTMLCollection<Element> {
		const childNodes = parentNode[PropertySymbol.childNodesFlatten];
		const matches: IHTMLCollection<Element> = new HTMLCollection<Element>((item) =>
			(<Element>item).className.split(' ').includes(className)
		);

		childNodes[PropertySymbol.addEventListener]('add', (item: Node) => {
			matches[PropertySymbol.addItem](<Element>item);
		});

		childNodes[PropertySymbol.addEventListener]('insert', (item: Node, referenceItem?: Node) => {
			matches[PropertySymbol.insertItem](<Element>item, <Element>referenceItem);
		});
		childNodes[PropertySymbol.addEventListener]('remove', (item: Node) => {
			matches[PropertySymbol.removeItem](<Element>item);
		});

		for (const childNode of childNodes) {
			if (
				childNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				(<Element>childNode).className.split(' ').includes(className)
			) {
				matches[PropertySymbol.addItem](<Element>childNode);
			}
		}

		return matches;
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
	): IHTMLCollection<Element> {
		const upperTagName = tagName.toUpperCase();
		const includeAll = tagName === '*';
		const childNodes = parentNode[PropertySymbol.childNodesFlatten];
		const matches: IHTMLCollection<Element> = new HTMLCollection<Element>(
			!includeAll && ((item) => item[PropertySymbol.tagName] === upperTagName)
		);

		childNodes[PropertySymbol.addEventListener]('add', (item: Node) => {
			matches[PropertySymbol.addItem](<Element>item);
		});

		childNodes[PropertySymbol.addEventListener]('insert', (item: Node, referenceItem?: Node) => {
			matches[PropertySymbol.insertItem](<Element>item, <Element>referenceItem);
		});

		childNodes[PropertySymbol.addEventListener]('remove', (item: Node) => {
			matches[PropertySymbol.removeItem](<Element>item);
		});

		for (const childNode of childNodes) {
			if (
				(includeAll || childNode[PropertySymbol.tagName] === upperTagName) &&
				childNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode
			) {
				matches[PropertySymbol.addItem](<Element>childNode);
			}
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
	): IHTMLCollection<Element> {
		// When the namespace is HTML, the tag name is case-insensitive.
		const formattedTagName = namespaceURI === NamespaceURI.html ? tagName.toUpperCase() : tagName;
		const includeAll = tagName === '*';
		const childNodes = parentNode[PropertySymbol.childNodesFlatten];
		const matches: IHTMLCollection<Element> = new HTMLCollection<Element>(
			!includeAll &&
				((item) =>
					item[PropertySymbol.tagName] === formattedTagName &&
					item[PropertySymbol.namespaceURI] === namespaceURI)
		);

		childNodes[PropertySymbol.addEventListener]('add', (item: Node) => {
			matches[PropertySymbol.addItem](<Element>item);
		});

		childNodes[PropertySymbol.addEventListener]('insert', (item: Node, referenceItem?: Node) => {
			matches[PropertySymbol.insertItem](<Element>item, <Element>referenceItem);
		});

		childNodes[PropertySymbol.addEventListener]('remove', (item: Node) => {
			matches[PropertySymbol.removeItem](<Element>item);
		});

		for (const childNode of childNodes) {
			if (
				(includeAll || childNode[PropertySymbol.tagName] === formattedTagName) &&
				childNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				childNode[PropertySymbol.namespaceURI] === namespaceURI
			) {
				matches[PropertySymbol.addItem](<Element>childNode);
			}
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

		for (const child of (<DocumentFragment>parentNode)[PropertySymbol.children]) {
			if (child[PropertySymbol.tagName] === upperTagName) {
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
	 * @returns Matching element.
	 */
	public static getElementById(
		parentNode: Element | DocumentFragment | Document,
		id: string
	): Element | null {
		id = String(id);
		for (const child of (<DocumentFragment>parentNode)[PropertySymbol.children]) {
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
