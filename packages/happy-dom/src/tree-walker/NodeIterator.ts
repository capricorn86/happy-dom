import INodeFilter from './INodeFilter.js';
import TreeWalker from './TreeWalker.js';
import Node from '../nodes/node/Node.js';

/**
 * The NodeIterator object represents the nodes of a document subtree and a position within them.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
 */
export default class NodeIterator {
	public root: Node = null;
	public whatToShow = -1;
	public filter: INodeFilter = null;

	readonly #walker: TreeWalker;

	/**
	 * Constructor.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	constructor(root: Node, whatToShow = -1, filter: INodeFilter = null) {
		this.root = root;
		this.whatToShow = whatToShow;
		this.filter = filter;
		this.#walker = new TreeWalker(root, whatToShow, filter);
	}

	/**
	 * Moves the current Node to the next visible node in the document order.
	 *
	 * @returns Current node.
	 */
	public nextNode(): Node {
		return this.#walker.nextNode();
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): Node {
		return this.#walker.previousNode();
	}
}
