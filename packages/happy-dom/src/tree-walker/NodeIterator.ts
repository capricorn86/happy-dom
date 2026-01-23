import INodeFilter from './INodeFilter.js';
import TreeWalker from './TreeWalker.js';
import Node from '../nodes/node/Node.js';
import * as PropertySymbol from '../PropertySymbol.js';
import NodeFilter from './NodeFilter.js';

/**
 * The NodeIterator object represents the nodes of a document subtree and a position within them.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
 */
export default class NodeIterator {
	#root: Node;
	#whatToShow = -1;
	#filter: INodeFilter | null = null;
	#walker: TreeWalker;
	#referenceNode: Node;
	#pointerBeforeReferenceNode = true;

	/**
	 * Constructor.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	constructor(root: Node, whatToShow = -1, filter: INodeFilter | null = null) {
		this.#root = root;
		this.#whatToShow = whatToShow;
		this.#filter = filter;
		this.#walker = new TreeWalker(root, whatToShow, filter);
		this.#referenceNode = root;
	}

	/**
	 * Returns root.
	 *
	 * @returns Root.
	 */
	public get root(): Node | null {
		return this.#root;
	}

	/**
	 * Returns what to show.
	 *
	 * @returns What to show.
	 */
	public get whatToShow(): number {
		return this.#whatToShow;
	}

	/**
	 * Returns filter.
	 *
	 * @returns Filter.
	 */
	public get filter(): INodeFilter | null {
		return this.#filter;
	}

	/**
	 * Returns the reference node.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator/referenceNode
	 * @returns Reference node.
	 */
	public get referenceNode(): Node {
		return this.#referenceNode;
	}

	/**
	 * Returns whether the NodeIterator is anchored before the reference node.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator/pointerBeforeReferenceNode
	 * @returns Pointer before reference node.
	 */
	public get pointerBeforeReferenceNode(): boolean {
		return this.#pointerBeforeReferenceNode;
	}

	/**
	 * Moves the current Node to the next visible node in the document order.
	 *
	 * @returns Current node.
	 */
	public nextNode(): Node | null {
		if (this.#pointerBeforeReferenceNode) {
			this.#pointerBeforeReferenceNode = false;
			if (
				this.#walker[PropertySymbol.filterNode](this.#referenceNode) === NodeFilter.FILTER_ACCEPT
			) {
				return this.#referenceNode;
			}
		}

		const node = this.#walker.nextNode();
		if (node) {
			this.#referenceNode = node;
		}
		return node;
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): Node | null {
		if (!this.#pointerBeforeReferenceNode) {
			this.#pointerBeforeReferenceNode = true;
			if (
				this.#walker[PropertySymbol.filterNode](this.#referenceNode) === NodeFilter.FILTER_ACCEPT
			) {
				return this.#referenceNode;
			}
		}

		const node = this.#walker.previousNode();
		if (node) {
			this.#referenceNode = node;
		}
		return node;
	}

	/**
	 * This is a legacy method, and no longer has any effect.
	 *
	 * Previously it served to mark a NodeIterator as disposed, so it could be reclaimed by garbage collection.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator/detach
	 * @deprecated
	 */
	public detach(): void {
		// Do nothing as per the spec.
	}
}
