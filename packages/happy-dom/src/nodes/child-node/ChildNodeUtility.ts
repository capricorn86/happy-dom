import DOMException from '../../exception/DOMException.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import XMLParser from '../../xml-parser/XMLParser.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Document from '../document/Document.js';
import Node from '../node/Node.js';
import IParentNode from '../parent-node/IParentNode.js';
import IChildNode from './IChildNode.js';

/**
 * Child node utility.
 */
export default class ChildNodeUtility {
	/**
	 * Removes the node from its parent.
	 *
	 * @param childNode Child node.
	 */
	public static remove(childNode: IChildNode): void {
		if (childNode[PropertySymbol.parentNode]) {
			childNode[PropertySymbol.parentNode].removeChild(childNode);
		}
	}

	/**
	 * The Node.replaceWith() method replaces this Node in the children list of its parent with a set of Node or DOMString objects.
	 *
	 * @param childNode Child node.
	 * @param nodes List of Node or DOMString.
	 */
	public static replaceWith(childNode: IChildNode, ...nodes: (Node | string)[]): void {
		const parent = <IParentNode>childNode[PropertySymbol.parentNode];

		if (!parent) {
			throw new DOMException('This element has no parent node.');
		}

		for (const node of nodes) {
			if (typeof node === 'string') {
				const newChildNodes = (<DocumentFragment>(
					XMLParser.parse(<Document>childNode[PropertySymbol.ownerDocument], node)
				))[PropertySymbol.childNodes].slice();
				for (const newChildNode of newChildNodes) {
					parent.insertBefore(newChildNode, childNode);
				}
			} else {
				parent.insertBefore(node, childNode);
			}
		}

		parent.removeChild(childNode);
	}

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param childNode Child node.
	 * @param nodes List of Node or DOMString.
	 */
	public static before(childNode: IChildNode, ...nodes: (string | Node)[]): void {
		const parent = <IParentNode>childNode[PropertySymbol.parentNode];

		if (!parent) {
			return;
		}

		for (const node of nodes) {
			if (typeof node === 'string') {
				const newChildNodes = (<DocumentFragment>(
					XMLParser.parse(<Document>childNode[PropertySymbol.ownerDocument], node)
				))[PropertySymbol.childNodes].slice();
				for (const newChildNode of newChildNodes) {
					parent.insertBefore(newChildNode, childNode);
				}
			} else {
				parent.insertBefore(node, childNode);
			}
		}
	}

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param childNode Child node.
	 * @param nodes List of Node or DOMString.
	 */
	public static after(childNode: IChildNode, ...nodes: (string | Node)[]): void {
		const parent = <IParentNode>childNode[PropertySymbol.parentNode];

		if (!parent) {
			return;
		}

		const nextSibling = childNode.nextSibling;

		for (const node of nodes) {
			if (typeof node === 'string') {
				const newChildNodes = (<DocumentFragment>(
					XMLParser.parse(<Document>childNode[PropertySymbol.ownerDocument], node)
				))[PropertySymbol.childNodes].slice();
				for (const newChildNode of newChildNodes) {
					if (!nextSibling) {
						parent.appendChild(newChildNode);
					} else {
						parent.insertBefore(newChildNode, nextSibling);
					}
				}
			} else if (!nextSibling) {
				parent.appendChild(node);
			} else {
				parent.insertBefore(node, nextSibling);
			}
		}
	}
}
