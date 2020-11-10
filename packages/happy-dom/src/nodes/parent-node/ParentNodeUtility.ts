import XMLParser from '../../xml-parser/XMLParser';
import Document from '../document/Document';
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
}
