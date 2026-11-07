import * as PropertySymbol from '../../PropertySymbol.js';
import Node from '../node/Node.js';
import type IParentNode from '../parent-node/IParentNode.js';
import type IChildNode from './IChildNode.js';

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
			return;
		}

		// The viable next sibling is the first following sibling that is not one of the nodes to insert.
		// See: https://dom.spec.whatwg.org/#dom-childnode-replacewith
		const nodeSet = new Set(nodes.filter((node) => node instanceof Node));
		let viableNextSibling = childNode.nextSibling;
		while (viableNextSibling && nodeSet.has(viableNextSibling)) {
			viableNextSibling = viableNextSibling.nextSibling;
		}

		const fragment = parent[PropertySymbol.ownerDocument].createDocumentFragment();

		for (const node of nodes) {
			if (node instanceof Node) {
				fragment.appendChild(node);
			} else {
				fragment.appendChild(parent[PropertySymbol.ownerDocument].createTextNode(String(node)));
			}
		}

		// If the node itself was one of the nodes, it has been moved into the fragment and should not be removed from the parent.
		if (childNode[PropertySymbol.parentNode] === parent) {
			parent.removeChild(childNode);
		}

		if (viableNextSibling) {
			parent.insertBefore(fragment, viableNextSibling);
		} else {
			parent.appendChild(fragment);
		}
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
			if (node instanceof Node) {
				parent.insertBefore(node, childNode);
			} else {
				parent.insertBefore(
					parent[PropertySymbol.ownerDocument].createTextNode(String(node)),
					childNode
				);
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

		// The viable next sibling is the first following sibling that is not one of the nodes to insert.
		// See: https://dom.spec.whatwg.org/#dom-childnode-after
		const nodeSet = new Set(nodes.filter((node) => node instanceof Node));
		let viableNextSibling = childNode.nextSibling;
		while (viableNextSibling && nodeSet.has(viableNextSibling)) {
			viableNextSibling = viableNextSibling.nextSibling;
		}

		const fragment = parent[PropertySymbol.ownerDocument].createDocumentFragment();

		for (const node of nodes) {
			const nodeToInsert =
				node instanceof Node
					? node
					: parent[PropertySymbol.ownerDocument].createTextNode(String(node));
			fragment.appendChild(nodeToInsert);
		}

		if (viableNextSibling) {
			parent.insertBefore(fragment, viableNextSibling);
		} else {
			parent.appendChild(fragment);
		}
	}
}
