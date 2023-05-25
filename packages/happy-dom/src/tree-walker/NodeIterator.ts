import INodeFilter from './INodeFilter.js';
import TreeWalker from './TreeWalker.js';
import INode from '../nodes/node/INode.js';

/**
 * The NodeIterator object represents the nodes of a document subtree and a position within them.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
 */
export default class NodeIterator {
	public root: INode = null;
	public whatToShow = -1;
	public filter: INodeFilter = null;

	private readonly _walker: TreeWalker;

	/**
	 * Constructor.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	constructor(root: INode, whatToShow = -1, filter: INodeFilter = null) {
		this.root = root;
		this.whatToShow = whatToShow;
		this.filter = filter;
		this._walker = new TreeWalker(root, whatToShow, filter);
	}

	/**
	 * Moves the current Node to the next visible node in the document order.
	 *
	 * @returns Current node.
	 */
	public nextNode(): INode {
		return this._walker.nextNode();
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): INode {
		return this._walker.previousNode();
	}
}
