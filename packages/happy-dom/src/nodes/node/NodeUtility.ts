import IText from '../text/IText';
import IComment from '../comment/IComment';
import INode from './INode';
import NodeTypeEnum from './NodeTypeEnum';

/**
 * Node utility.
 */
export default class NodeUtility {
	/**
	 * Returns boolean indicating if nodeB is an inclusive ancestor of nodeA.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/helpers/node.js
	 *
	 * @see https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor
	 * @param ancestorNode Ancestor node.
	 * @param referenceNode Reference node.
	 * @returns "true" if following.
	 */
	public static isInclusiveAncestor(ancestorNode: INode, referenceNode: INode): boolean {
		let parent: INode = referenceNode;
		while (parent) {
			if (ancestorNode === parent) {
				return true;
			}
			parent = parent.parentNode;
		}
		return false;
	}

	/**
	 * Returns boolean indicating if nodeB is following nodeA in the document tree.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/helpers/node.js
	 *
	 * @see https://dom.spec.whatwg.org/#concept-tree-following
	 * @param nodeA Node A.
	 * @param nodeB Node B.
	 * @returns "true" if following.
	 */
	public static isFollowing(nodeA: INode, nodeB: INode): boolean {
		if (nodeA === nodeB) {
			return false;
		}

		let current: INode = nodeB;

		while (current) {
			current = this.following(current);

			if (current === nodeA) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Node length.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/helpers/node.js
	 *
	 * @see https://dom.spec.whatwg.org/#concept-node-length
	 * @param node Node.
	 * @returns Node length.
	 */
	public static getNodeLength(node: INode): number {
		switch (node.nodeType) {
			case NodeTypeEnum.documentTypeNode:
				return 0;

			case NodeTypeEnum.textNode:
			case NodeTypeEnum.processingInstructionNode:
			case NodeTypeEnum.commentNode:
				return (<IText | IComment>node).data.length;

			default:
				return node.childNodes.length;
		}
	}

	/**
	 * Returns boolean indicating if nodeB is following nodeA in the document tree.
	 *
	 * Based on:
	 * https://github.com/jsdom/js-symbol-tree/blob/master/lib/SymbolTree.js#L220
	 *
	 * @param node Node.
	 * @param [root] Root.
	 * @returns Following node.
	 */
	public static following(node: INode, root?: INode): INode {
		const firstChild = node.firstChild;

		if (firstChild) {
			return firstChild;
		}

		let current = node;

		while (current) {
			if (current === root) {
				return null;
			}

			const nextSibling = current.nextSibling;

			if (nextSibling) {
				return nextSibling;
			}

			current = current.parentNode;
		}

		return null;
	}

	/**
	 * Returns the next sibling or parents sibling.
	 *
	 * @param node Node.
	 * @returns Next decentant node.
	 */
	public static nextDecendantNode(node: INode): INode {
		while (node && !node.nextSibling) {
			node = node.parentNode;
		}

		if (!node) {
			return null;
		}

		return node.nextSibling;
	}
}
