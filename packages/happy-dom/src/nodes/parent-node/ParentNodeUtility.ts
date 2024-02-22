import XMLParser from '../../xml-parser/XMLParser.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IDocumentFragment from '../document-fragment/IDocumentFragment.js';
import IDocument from '../document/IDocument.js';
import IElement from '../element/IElement.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import INode from '../node/INode.js';
import HTMLCollection from '../element/HTMLCollection.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import NamespaceURI from '../../config/NamespaceURI.js';

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
		parentNode: IElement | IDocument | IDocumentFragment,
		...nodes: (INode | string)[]
	): void {
		for (const node of nodes) {
			if (typeof node === 'string') {
				XMLParser.parse(<IDocument>parentNode[PropertySymbol.ownerDocument], node, {
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
		parentNode: IElement | IDocument | IDocumentFragment,
		...nodes: (string | INode)[]
	): void {
		const firstChild = parentNode.firstChild;
		for (const node of nodes) {
			if (typeof node === 'string') {
				const newChildNodes = (<DocumentFragment>(
					XMLParser.parse(<IDocument>parentNode[PropertySymbol.ownerDocument], node)
				))[PropertySymbol.childNodes].slice();
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
	public static replaceChildren(
		parentNode: IElement | IDocument | IDocumentFragment,
		...nodes: (string | INode)[]
	): void {
		for (const node of (<DocumentFragment>parentNode)[PropertySymbol.childNodes].slice()) {
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
	public static getElementsByClassName(
		parentNode: IElement | IDocumentFragment | IDocument,
		className: string
	): IHTMLCollection<IElement> {
		let matches = new HTMLCollection<IElement>();

		for (const child of (<DocumentFragment>parentNode)[PropertySymbol.children]) {
			if (child.className.split(' ').includes(className)) {
				matches.push(child);
			}
			matches = <HTMLCollection<IElement>>(
				matches.concat(this.getElementsByClassName(<IElement>child, className))
			);
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
		parentNode: IElement | IDocumentFragment | IDocument,
		tagName: string
	): IHTMLCollection<IElement> {
		const upperTagName = tagName.toUpperCase();
		const includeAll = tagName === '*';
		let matches = new HTMLCollection<IElement>();

		for (const child of (<DocumentFragment>parentNode)[PropertySymbol.children]) {
			if (includeAll || child[PropertySymbol.tagName].toUpperCase() === upperTagName) {
				matches.push(child);
			}
			matches = <HTMLCollection<IElement>>(
				matches.concat(this.getElementsByTagName(<IElement>child, tagName))
			);
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
		parentNode: IElement | IDocumentFragment | IDocument,
		namespaceURI: string,
		tagName: string
	): IHTMLCollection<IElement> {
		// When the namespace is HTML, the tag name is case-insensitive.
		const formattedTagName = namespaceURI === NamespaceURI.html ? tagName.toUpperCase() : tagName;
		const includeAll = tagName === '*';
		let matches = new HTMLCollection<IElement>();

		for (const child of (<DocumentFragment>parentNode)[PropertySymbol.children]) {
			if (
				(includeAll || child[PropertySymbol.tagName] === formattedTagName) &&
				child[PropertySymbol.namespaceURI] === namespaceURI
			) {
				matches.push(child);
			}
			matches = <HTMLCollection<IElement>>(
				matches.concat(this.getElementsByTagNameNS(<IElement>child, namespaceURI, tagName))
			);
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
		parentNode: IElement | IDocumentFragment | IDocument,
		tagName: string
	): IElement {
		const upperTagName = tagName.toUpperCase();

		for (const child of (<DocumentFragment>parentNode)[PropertySymbol.children]) {
			if (child[PropertySymbol.tagName] === upperTagName) {
				return <IElement>child;
			}
			const match = this.getElementByTagName(<IElement>child, tagName);
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
		parentNode: IElement | IDocumentFragment | IDocument,
		id: string
	): IElement {
		id = String(id);
		for (const child of (<DocumentFragment>parentNode)[PropertySymbol.children]) {
			if (child.id === id) {
				return <IElement>child;
			}

			const match = this.getElementById(<IElement>child, id);

			if (match) {
				return match;
			}
		}

		return null;
	}
}
