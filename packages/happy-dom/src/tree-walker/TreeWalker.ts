import Node from '../nodes/node/Node';
import NodeFilter from './NodeFilter';
import INodeFilter from './INodeFilter';
import NodeFilterMask from './NodeFilterMask';
import DOMException from '../exception/DOMException';
import INode from '../nodes/node/INode';

/**
 * The TreeWalker object represents the nodes of a document subtree and a position within them.
 */
export default class TreeWalker {
	public root: INode = null;
	public whatToShow = -1;
	public filter: INodeFilter = null;
	public currentNode: INode = null;

	/**
	 * Constructor.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	constructor(root: INode, whatToShow = -1, filter: INodeFilter = null) {
		if (!(root instanceof Node)) {
			throw new DOMException('Parameter 1 was not of type Node.');
		}

		this.root = root;
		this.whatToShow = whatToShow;
		this.filter = filter;
		this.currentNode = root;
	}

	/**
	 * Moves the current Node to the next visible node in the document order.
	 *
	 * @returns Current node.
	 */
	public nextNode(): INode {
		if (!this.firstChild()) {
			while (!this.nextSibling() && this.parentNode()) {}
			this.currentNode = this.currentNode === this.root ? null : this.currentNode || null;
		}
		return this.currentNode;
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): INode {
		while (!this.previousSibling() && this.parentNode()) {}
		this.currentNode = this.currentNode === this.root ? null : this.currentNode || null;
		return this.currentNode;
	}

	/**
	 * Moves the current Node to the first visible ancestor node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public parentNode(): INode {
		if (this.currentNode !== this.root && this.currentNode && this.currentNode.parentNode) {
			this.currentNode = this.currentNode.parentNode;

			if (this.filterNode(this.currentNode) === NodeFilter.FILTER_ACCEPT) {
				return this.currentNode;
			}

			this.parentNode();
		}

		this.currentNode = null;

		return null;
	}

	/**
	 * Moves the current Node to the first visible child of the current node, and returns the found child. It also moves the current node to this child. If no such child exists, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public firstChild(): INode {
		const childNodes = this.currentNode ? this.currentNode.childNodes : [];

		if (childNodes.length > 0) {
			this.currentNode = childNodes[0];

			if (this.filterNode(this.currentNode) === NodeFilter.FILTER_ACCEPT) {
				return this.currentNode;
			}

			return this.nextSibling();
		}

		return null;
	}

	/**
	 * Moves the current Node to the last visible child of the current node, and returns the found child. It also moves the current node to this child. If no such child exists, null is returned and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public lastChild(): INode {
		const childNodes = this.currentNode ? this.currentNode.childNodes : [];

		if (childNodes.length > 0) {
			this.currentNode = childNodes[childNodes.length - 1];

			if (this.filterNode(this.currentNode) === NodeFilter.FILTER_ACCEPT) {
				return this.currentNode;
			}

			return this.previousSibling();
		}

		return null;
	}

	/**
	 * Moves the current Node to its previous sibling, if any, and returns the found sibling. If there is no such node, return null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousSibling(): INode {
		if (this.currentNode !== this.root && this.currentNode && this.currentNode.parentNode) {
			const siblings = this.currentNode.parentNode.childNodes;
			const index = siblings.indexOf(this.currentNode);

			if (index > 0) {
				this.currentNode = siblings[index - 1];

				if (this.filterNode(this.currentNode) === NodeFilter.FILTER_ACCEPT) {
					return this.currentNode;
				}

				return this.previousSibling();
			}
		}

		return null;
	}

	/**
	 * Moves the current Node to its next sibling, if any, and returns the found sibling. If there is no such node, null is returned and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public nextSibling(): INode {
		if (this.currentNode !== this.root && this.currentNode && this.currentNode.parentNode) {
			const siblings = this.currentNode.parentNode.childNodes;
			const index = siblings.indexOf(this.currentNode);

			if (index + 1 < siblings.length) {
				this.currentNode = siblings[index + 1];

				if (this.filterNode(this.currentNode) === NodeFilter.FILTER_ACCEPT) {
					return this.currentNode;
				}

				return this.nextSibling();
			}
		}

		return null;
	}

	/**
	 * Filters a node.
	 *
	 * Based on solution:
	 * https://gist.github.com/shawndumas/1132009.
	 *
	 * @param node Node.
	 * @returns Child nodes.
	 */
	private filterNode(node: INode): number {
		const mask = NodeFilterMask[node.nodeType];

		if (mask && (this.whatToShow & mask) == 0) {
			return NodeFilter.FILTER_SKIP;
		}
		if (typeof this.filter === 'function') {
			return this.filter(node);
		}
		if (this.filter) {
			return this.filter.acceptNode(node);
		}

		return NodeFilter.FILTER_ACCEPT;
	}
}
