import XMLParser from '../../xml-parser/XMLParser';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import IDocument from '../document/IDocument';
import IElement from '../element/IElement';
import IHTMLCollection from '../element/IHTMLCollection';
import INode from '../node/INode';
import HTMLCollection from '../element/HTMLCollection';

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
				XMLParser.parse(<IDocument>parentNode.ownerDocument, node, { rootNode: parentNode });
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
				const newChildNodes = XMLParser.parse(
					<IDocument>parentNode.ownerDocument,
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
	public static replaceChildren(
		parentNode: IElement | IDocument | IDocumentFragment,
		...nodes: (string | INode)[]
	): void {
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
	public static getElementsByClassName(
		parentNode: IElement | IDocumentFragment | IDocument,
		className: string
	): IHTMLCollection<IElement> {
		let matches = new HTMLCollection<IElement>();

		for (const child of parentNode.children) {
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

		for (const child of parentNode.children) {
			if (includeAll || child.tagName === upperTagName) {
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
		const upperTagName = tagName.toUpperCase();
		const includeAll = tagName === '*';
		let matches = new HTMLCollection<IElement>();

		for (const child of parentNode.children) {
			if ((includeAll || child.tagName === upperTagName) && child.namespaceURI === namespaceURI) {
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

		for (const child of parentNode.children) {
			if (child.tagName === upperTagName) {
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
		for (const child of parentNode.children) {
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
