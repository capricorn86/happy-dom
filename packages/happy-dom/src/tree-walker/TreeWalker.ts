import Node from '../nodes/node/Node.js';
import * as PropertySymbol from '../PropertySymbol.js';
import INodeFilter from './INodeFilter.js';
import NodeFilterMask from './NodeFilterMask.js';
import DOMException from '../exception/DOMException.js';
import NodeFilter from './NodeFilter.js';

enum TraverseChildrenTypeEnum {
	first = 'first',
	last = 'last'
}

enum TraverseSiblingsTypeEnum {
	next = 'next',
	previous = 'previous'
}

/**
 * The TreeWalker object represents the nodes of a document subtree and a position within them.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * @see https://dom.spec.whatwg.org/#interface-treewalker
 */
export default class TreeWalker {
	public root: Node = null;
	public whatToShow = -1;
	public filter: INodeFilter = null;
	public currentNode: Node = null;

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

		this.root = root;
		this.whatToShow = whatToShow;
		this.filter = filter;
		this.currentNode = root;
	}

	/**
	 * Moves the current Node to the first visible ancestor node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public parentNode(): Node {
		let node = this.currentNode;
		while (node !== null && node !== this.root) {
			node = node.parentNode;
			if (node !== null && this[PropertySymbol.filterNode](node) === NodeFilter.FILTER_ACCEPT) {
				this.currentNode = node;
				return this.currentNode;
			}
		}
		return null;
	}

	/**
	 * Moves the current Node to the first visible child of the current node, and returns the found child. It also moves the current node to this child. If no such child exists, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public firstChild(): Node {
		return this.#traverseChildren(TraverseChildrenTypeEnum.first);
	}

	/**
	 * Moves the current Node to the last visible child of the current node, and returns the found child. It also moves the current node to this child. If no such child exists, null is returned and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public lastChild(): Node {
		return this.#traverseChildren(TraverseChildrenTypeEnum.last);
	}

	/**
	 * Moves the current Node to its next sibling, if any, and returns the found sibling. If there is no such node, null is returned and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public nextSibling(): Node {
		return this.#traverseSiblings(TraverseSiblingsTypeEnum.next);
	}

	/**
	 * Moves the current Node to its previous sibling, if any, and returns the found sibling. If there is no such node, return null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousSibling(): Node {
		return this.#traverseSiblings(TraverseSiblingsTypeEnum.previous);
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): Node {
		let node = this.currentNode;

		while (node !== this.root) {
			let sibling = node.previousSibling;

			while (sibling !== null) {
				let node = sibling;
				let result = this[PropertySymbol.filterNode](node);

				while (result !== NodeFilter.FILTER_REJECT && node[PropertySymbol.nodeArray].length) {
					node = node.lastChild;
					result = this[PropertySymbol.filterNode](node);
				}

				if (result === NodeFilter.FILTER_ACCEPT) {
					this.currentNode = node;
					return node;
				}

				sibling = node.previousSibling;
			}

			if (node === this.root || node.parentNode === null) {
				return null;
			}

			node = node.parentNode;

			if (this[PropertySymbol.filterNode](node) === NodeFilter.FILTER_ACCEPT) {
				this.currentNode = node;
				return node;
			}
		}

		return null;
	}

	/**
	 * Moves the current Node to the next visible node in the document order.
	 *
	 * @returns Current node.
	 */
	public nextNode(): Node | null {
		let node = this.currentNode;
		let result = NodeFilter.FILTER_ACCEPT;

		while (true) {
			while (result !== NodeFilter.FILTER_REJECT && node[PropertySymbol.nodeArray].length) {
				node = node.firstChild;
				result = this[PropertySymbol.filterNode](node);

				if (result === NodeFilter.FILTER_ACCEPT) {
					this.currentNode = node;
					return node;
				}
			}

			while (node !== null) {
				if (node === this.root) {
					return null;
				}

				const sibling = node.nextSibling;

				if (sibling !== null) {
					node = sibling;
					break;
				}

				node = node.parentNode;
			}

			if (node === null) {
				return null;
			}

			result = this[PropertySymbol.filterNode](node);

			if (result === NodeFilter.FILTER_ACCEPT) {
				this.currentNode = node;
				return node;
			}
		}
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
	public [PropertySymbol.filterNode](node: Node): number {
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

	/**
	 * Traverses children.
	 *
	 * @param type Type.
	 * @returns Node.
	 */
	#traverseChildren(type: TraverseChildrenTypeEnum): Node | null {
		let node: Node = this.currentNode;
		node = type === TraverseChildrenTypeEnum.first ? node.firstChild : node.lastChild;

		while (node !== null) {
			const result = this[PropertySymbol.filterNode](node);

			if (result === NodeFilter.FILTER_ACCEPT) {
				this.currentNode = node;
				return node;
			}

			if (result === NodeFilter.FILTER_SKIP) {
				const child = type === TraverseChildrenTypeEnum.first ? node.firstChild : node.lastChild;

				if (child !== null) {
					node = child;
					continue;
				}
			}

			while (node !== null) {
				const sibling =
					type === TraverseChildrenTypeEnum.first ? node.nextSibling : node.previousSibling;
				if (sibling !== null) {
					node = sibling;
					break;
				}
				const parent = node.parentNode;
				if (parent === null || parent === this.root || parent === this.currentNode) {
					return null;
				}
				node = parent;
			}
		}

		return null;
	}

	/**
	 * Traverses siblings.
	 *
	 * @param type Type.
	 * @returns Node.
	 */
	#traverseSiblings(type: TraverseSiblingsTypeEnum): Node | null {
		let node: Node = this.currentNode;

		if (node === this.root) {
			return null;
		}

		while (true) {
			let sibling =
				type === TraverseSiblingsTypeEnum.next ? node.nextSibling : node.previousSibling;

			while (sibling !== null) {
				const node = sibling;
				const result = this[PropertySymbol.filterNode](node);

				if (result === NodeFilter.FILTER_ACCEPT) {
					this.currentNode = node;
					return node;
				}

				sibling = type === TraverseSiblingsTypeEnum.next ? node.firstChild : node.lastChild;

				if (result === NodeFilter.FILTER_REJECT || sibling === null) {
					sibling =
						type === TraverseSiblingsTypeEnum.next ? node.nextSibling : node.previousSibling;
				}
			}

			node = node.parentNode;

			if (node === null || node === this.root) {
				return null;
			}

			if (this[PropertySymbol.filterNode](node) === NodeFilter.FILTER_ACCEPT) {
				return null;
			}
		}
	}
}
