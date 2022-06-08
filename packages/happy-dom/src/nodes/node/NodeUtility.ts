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
	 * @see https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor
	 * @param nodeA Node A.
	 * @param nodeB Node B.
	 * @returns "true" if following.
	 */
	public static isInclusiveAncestor(nodeA: INode, nodeB: INode): boolean {
		let parent: INode = nodeA;
		while (parent) {
			if (parent === nodeB) {
				return true;
			}
			parent = parent.parentNode;
		}
		return false;
	}

	/**
	 * Returns boolean indicating if nodeB is following nodeA in the document tree.
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
			const nextSibling = current.nextSibling;

			if (nextSibling === nodeA) {
				return true;
			}

			current = nextSibling ? nextSibling : current.parentNode;
		}

		return false;
	}

	/**
	 * Node length.
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
}
