import INode from './INode';

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
		let current: INode = nodeA.nextSibling;
		while (current) {
			if (current === nodeB) {
				return true;
			}
			const nextSibling = current.nextSibling;
			current = nextSibling ? nextSibling : current.parentNode;
		}
		return false;
	}
}
