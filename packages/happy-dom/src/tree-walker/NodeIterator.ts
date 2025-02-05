import INodeFilter from './INodeFilter.js';
import Node from '../nodes/node/Node.js';
import NodeFilter from './NodeFilter.js';
import NodeFilterUtility from './NodeFilterUtility.js';
import * as PropertySymbol from '../PropertySymbol.js';

/**
 * The NodeIterator object represents the nodes of a document subtree and a position within them.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
 */
export default class NodeIterator {
	#root: Node;
	#referenceNode: Node;
	#filterOptions: {
		whatToShow: number;
		filter: INodeFilter | null;
	} = {
		whatToShow: -1,
		filter: null
	};
	#index = -1;
	#pointerBeforeReferenceNode = true;

	/**
	 * Constructor.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	constructor(root: Node, whatToShow = -1, filter: INodeFilter = null) {
		this.#root = root;
		this.#referenceNode = root;
		this.#filterOptions.whatToShow = whatToShow;
		this.#filterOptions.filter = filter;
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
		return this.#filterOptions.whatToShow;
	}

	/**
	 * Returns filter.
	 *
	 * @returns Filter.
	 */
	public get filter(): INodeFilter {
		return this.#filterOptions.filter;
	}

	/**
	 * Returns reference node.
	 *
	 * @returns Reference node.
	 */
	public get referenceNode(): Node | null {
		return this.#referenceNode || null;
	}

	/**
	 * Returns pointer before reference node.
	 *
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
	public nextNode(): Node {
		const nodes = this.#getNodes(this.#root);

		// If the current node has been removed we need to step back one node.
		if (this.#index !== -1 && this.#referenceNode !== nodes[this.#index]) {
			this.#index--;
		}

		this.#pointerBeforeReferenceNode = false;

		while (this.#index < nodes.length - 1) {
			this.#index++;

			const node = nodes[this.#index];

			if (NodeFilterUtility.filterNode(node, this.#filterOptions) === NodeFilter.FILTER_ACCEPT) {
				this.#referenceNode = node;
				return node;
			}
		}

		return null;
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): Node {
		const nodes = this.#getNodes(this.#root);

		if (this.#index !== -1 && this.#referenceNode !== nodes[this.#index]) {
			this.#index++;
		}

		this.#pointerBeforeReferenceNode = true;

		while (this.#index > 0) {
			this.#index--;

			const node = nodes[this.#index];

			if (NodeFilterUtility.filterNode(node, this.#filterOptions) === NodeFilter.FILTER_ACCEPT) {
				this.#referenceNode = node;
				return node;
			}
		}

		return null;
	}

	/**
	 * This is a legacy method, and no longer has any effect.
	 *
	 * Previously it served to mark a NodeIterator as disposed, so it could be reclaimed by garbage collection.
	 */
	public detach(): void {
		// Do nothing as per the spec.
	}

	/**
	 * Returns the nodes of the iterator.
	 *
	 * @param root Root.
	 * @param [nodes] Nodes.
	 */
	#getNodes(root: Node, nodes?: Node[]): Node[] {
		nodes = nodes || [root];

		for (const node of root[PropertySymbol.nodeArray]) {
			nodes.push(node);
			this.#getNodes(node, nodes);
		}

		return nodes;
	}
}
