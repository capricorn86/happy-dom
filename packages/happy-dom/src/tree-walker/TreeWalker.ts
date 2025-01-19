import Node from '../nodes/node/Node.js';
import * as PropertySymbol from '../PropertySymbol.js';
import INodeFilter from './INodeFilter.js';
import DOMException from '../exception/DOMException.js';
import NodeFilter from './NodeFilter.js';
import NodeFilterUtility from './NodeFilterUtility.js';

/**
 * The TreeWalker object represents the nodes of a document subtree and a position within them.
 */
export default class TreeWalker {
	// Internal properties.
	public [PropertySymbol.currentNode]: Node | null = null;

	// Private properties.
	#root: Node;
	#filterOptions: {
		whatToShow: number;
		filter: INodeFilter | null;
	} = {
		whatToShow: -1,
		filter: null
	};

	/**
	 * Constructor.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	constructor(root: Node, whatToShow = -1, filter: INodeFilter = null) {
		if (!(root instanceof Node)) {
			throw new DOMException('Parameter 1 was not of type Node.');
		}

		this.#root = root;
		this.#filterOptions.whatToShow = whatToShow;
		this.#filterOptions.filter = filter;
		this[PropertySymbol.currentNode] = root;
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
	 * Returns current node.
	 *
	 * @returns Current node.
	 */
	public get currentNode(): Node {
		return this[PropertySymbol.currentNode];
	}

	/**
	 * Moves the current Node to the next visible node in the document order.
	 *
	 * @returns Current node.
	 */
	public nextNode(): Node {
		if (!this.firstChild()) {
			while (!this.nextSibling() && this.parentNode()) {}
			this[PropertySymbol.currentNode] =
				this.currentNode === this.root ? null : this.currentNode || null;
		}
		return this.currentNode;
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): Node {
		while (!this.previousSibling() && this.parentNode()) {}
		this[PropertySymbol.currentNode] =
			this.currentNode === this.root ? null : this.currentNode || null;
		return this.currentNode;
	}

	/**
	 * Moves the current Node to the first visible ancestor node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public parentNode(): Node {
		if (
			this.currentNode !== this.root &&
			this.currentNode &&
			this.currentNode[PropertySymbol.parentNode]
		) {
			this[PropertySymbol.currentNode] = this.currentNode[PropertySymbol.parentNode];

			if (
				NodeFilterUtility.filterNode(this.currentNode, this.#filterOptions) ===
				NodeFilter.FILTER_ACCEPT
			) {
				return this.currentNode;
			}

			this.parentNode();
		}

		this[PropertySymbol.currentNode] = null;

		return null;
	}

	/**
	 * Moves the current Node to the first visible child of the current node, and returns the found child. It also moves the current node to this child. If no such child exists, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public firstChild(): Node {
		const childNodes = this.currentNode ? (<Node>this.currentNode)[PropertySymbol.nodeArray] : [];

		if (childNodes.length > 0) {
			this[PropertySymbol.currentNode] = childNodes[0];

			if (
				NodeFilterUtility.filterNode(this.currentNode, this.#filterOptions) ===
				NodeFilter.FILTER_ACCEPT
			) {
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
	public lastChild(): Node {
		const childNodes = this.currentNode ? (<Node>this.currentNode)[PropertySymbol.nodeArray] : [];

		if (childNodes.length > 0) {
			this[PropertySymbol.currentNode] = childNodes[childNodes.length - 1];

			if (
				NodeFilterUtility.filterNode(this.currentNode, this.#filterOptions) ===
				NodeFilter.FILTER_ACCEPT
			) {
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
	public previousSibling(): Node {
		if (
			this.currentNode !== this.root &&
			this.currentNode &&
			this.currentNode[PropertySymbol.parentNode]
		) {
			const siblings = (<Node>this.currentNode[PropertySymbol.parentNode])[
				PropertySymbol.nodeArray
			];
			const index = siblings.indexOf(this.currentNode);

			if (index > 0) {
				this[PropertySymbol.currentNode] = siblings[index - 1];

				if (
					NodeFilterUtility.filterNode(this.currentNode, this.#filterOptions) ===
					NodeFilter.FILTER_ACCEPT
				) {
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
	public nextSibling(): Node {
		if (
			this.currentNode !== this.root &&
			this.currentNode &&
			this.currentNode[PropertySymbol.parentNode]
		) {
			const siblings = (<Node>this.currentNode[PropertySymbol.parentNode])[
				PropertySymbol.nodeArray
			];
			const index = siblings.indexOf(this.currentNode);

			if (index + 1 < siblings.length) {
				this[PropertySymbol.currentNode] = siblings[index + 1];

				if (
					NodeFilterUtility.filterNode(this.currentNode, this.#filterOptions) ===
					NodeFilter.FILTER_ACCEPT
				) {
					return this.currentNode;
				}

				return this.nextSibling();
			}
		}

		return null;
	}
}
