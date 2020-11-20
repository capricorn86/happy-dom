import QuerySelector from '../../query-selector/QuerySelector';
import XMLParser from '../../xml-parser/XMLParser';
import Document from '../document/Document';
import Element from '../element/Element';
import IElement from '../element/IElement';
import INode from '../node/INode';
import IParentNode from './IParentNode';

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
	public static append(parentNode: IParentNode, ...nodes: (INode | string)[]): void {
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
	public static prepend(parentNode: IParentNode, ...nodes: (string | INode)[]): void {
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
	public static replaceChildren(parentNode: IParentNode, ...nodes: (string | INode)[]): void {
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
	public getElementsByClassName(parentNode: IParentNode, className: string): IElement[] {
		return QuerySelector.querySelectorAll(
			<Document | Element>parentNode,
			'.' + className.split(' ').join('.')
		);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param parentNode Parent node.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName(parentNode: IParentNode, tagName: string): IElement[] {
		const upperTagName = tagName.toUpperCase();
		let matches = [];

		for (const child of parentNode.children) {
			if (child.tagName === upperTagName) {
				matches.push(child);
			}
			matches = matches.concat(this.getElementsByTagName(child, tagName));
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
	public getElementsByTagNameNS(
		parentNode: IParentNode,
		namespaceURI: string,
		tagName: string
	): IElement[] {
		const upperTagName = tagName.toUpperCase();
		let matches = [];

		for (const child of parentNode.children) {
			if (child.tagName === upperTagName && child.namespaceURI === namespaceURI) {
				matches.push(child);
			}
			matches = matches.concat(this.getElementsByTagNameNS(child, namespaceURI, tagName));
		}

		return matches;
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param parentNode Parent node.
	 * @param id ID.
	 * @return Matching element.
	 */
	public getElementById(parentNode: IParentNode, id: string): IElement {
		for (const child of parentNode.children) {
			if (child.id === id) {
				return child;
			}

			const match = this.getElementById(child, id);

			if (match) {
				return match;
			}
		}

		return null;
	}
}
