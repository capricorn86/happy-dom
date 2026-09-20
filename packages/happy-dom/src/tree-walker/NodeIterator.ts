import type { TNodeFilter } from './TNodeFilter.js';
import Node from '../nodes/node/Node.js';
import type Document from '../nodes/document/Document.js';
import * as PropertySymbol from '../PropertySymbol.js';
import NodeFilter from './NodeFilter.js';
import NodeFilterMask from './NodeFilterMask.js';
import NodeUtility from '../nodes/node/NodeUtility.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';

/**
 * The NodeIterator object represents the nodes of a document subtree and a position within them.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
 * https://dom.spec.whatwg.org/#interface-nodeiterator
 */
export default class NodeIterator {
	#root: Node;
	#whatToShow = -1;
	#filter: TNodeFilter | null = null;
	#referenceNode: Node;
	#pointerBeforeReferenceNode = true;
	#candidateReferenceNode: Node | null = null;
	#candidatePointerBeforeReferenceNode = false;
	#isActive = false;

	/**
	 * Constructor.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	constructor(root: Node, whatToShow = -1, filter: TNodeFilter | null = null) {
		if (!(root instanceof Node)) {
			throw new DOMException('Parameter 1 was not of type Node.');
		}

		this.#root = root;
		this.#whatToShow = whatToShow;
		this.#filter = filter;
		this.#referenceNode = root;

		const nodeDocument =
			root[PropertySymbol.nodeType] === NodeTypeEnum.documentNode
				? <Document>root
				: root[PropertySymbol.ownerDocument];

		if (nodeDocument) {
			nodeDocument[PropertySymbol.nodeIterators].add(new WeakRef(this));
		}
	}

	/**
	 * Returns root.
	 *
	 * @returns Root.
	 */
	public get root(): Node {
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
	public get filter(): TNodeFilter | null {
		return this.#filter;
	}

	/**
	 * Returns the current reference node.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-nodeiterator-referencenode
	 * @returns Reference node.
	 */
	public get referenceNode(): Node {
		return this.#referenceNode;
	}

	/**
	 * Returns whether the iterator pointer is before the reference node.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-nodeiterator-pointerbeforereferencenode
	 * @returns "true" if the pointer is before the reference node.
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
		return this.#traverse('next');
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): Node | null {
		return this.#traverse('previous');
	}

	/**
	 * Disconnects the NodeIterator from the set of Nodes it currently iterates over.
	 * This method is a no-op and exists for compatibility.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-nodeiterator-detach
	 */
	public detach(): void {
		// Intentionally do nothing, per spec.
	}

	/**
	 * DOM NodeIterator pre-removing steps.
	 *
	 * @see https://dom.spec.whatwg.org/#nodeiterator-pre-removing-steps
	 * @param toBeRemovedNode Node that is about to be removed.
	 */
	public [PropertySymbol.nodeIteratorPreRemove](toBeRemovedNode: Node): void {
		[this.#referenceNode, this.#pointerBeforeReferenceNode] = this.#adjustNodePointer(
			this.#referenceNode,
			this.#pointerBeforeReferenceNode,
			toBeRemovedNode
		);

		if (this.#candidateReferenceNode !== null) {
			[this.#candidateReferenceNode, this.#candidatePointerBeforeReferenceNode] =
				this.#adjustNodePointer(
					this.#candidateReferenceNode,
					this.#candidatePointerBeforeReferenceNode,
					toBeRemovedNode
				);
		}
	}

	/**
	 * Adjusts a node pointer when a node is removed.
	 *
	 * @see https://dom.spec.whatwg.org/#concept-nodeiterator-adjust
	 * @param referenceNode Reference node.
	 * @param pointerBeforeReferenceNode Pointer before reference.
	 * @param toBeRemovedNode Node that is about to be removed.
	 * @returns Adjusted node pointer.
	 */
	#adjustNodePointer(
		referenceNode: Node,
		pointerBeforeReferenceNode: boolean,
		toBeRemovedNode: Node
	): [Node, boolean] {
		if (
			!NodeUtility.isInclusiveAncestor(toBeRemovedNode, referenceNode) ||
			NodeUtility.isInclusiveAncestor(toBeRemovedNode, this.#root)
		) {
			return [referenceNode, pointerBeforeReferenceNode];
		}

		if (pointerBeforeReferenceNode) {
			const next = this.#followingAfterSubtree(toBeRemovedNode);
			if (next !== null) {
				return [next, true];
			}
		}

		const previousSibling = toBeRemovedNode.previousSibling;
		const newNode =
			previousSibling === null
				? toBeRemovedNode.parentNode || this.#root
				: this.#lastInclusiveDescendant(previousSibling);

		return [newNode, false];
	}

	/**
	 * Traverses to the next or previous accepted node.
	 *
	 * @see https://dom.spec.whatwg.org/#concept-nodeiterator-traverse
	 * @param direction Direction.
	 * @returns Node.
	 */
	#traverse(direction: 'next' | 'previous'): Node | null {
		this.#candidateReferenceNode = this.#referenceNode;
		this.#candidatePointerBeforeReferenceNode = this.#pointerBeforeReferenceNode;
		let result: Node | null = null;

		try {
			while (true) {
				if (direction === 'next') {
					if (!this.#candidatePointerBeforeReferenceNode) {
						const following = NodeUtility.following(this.#candidateReferenceNode, this.#root);

						if (!following) {
							break;
						}

						this.#candidateReferenceNode = following;
					}

					this.#candidatePointerBeforeReferenceNode = false;
				} else {
					if (this.#candidatePointerBeforeReferenceNode) {
						const preceding = this.#preceding(this.#candidateReferenceNode);

						if (!preceding) {
							break;
						}

						this.#candidateReferenceNode = preceding;
					}

					this.#candidatePointerBeforeReferenceNode = true;
				}

				const node = this.#candidateReferenceNode;
				const filterResult = this.#filterNode(node);

				if (filterResult === NodeFilter.FILTER_ACCEPT) {
					this.#referenceNode = this.#candidateReferenceNode;
					this.#pointerBeforeReferenceNode = this.#candidatePointerBeforeReferenceNode;
					result = node;
					break;
				}
			}
		} catch (error) {
			this.#candidateReferenceNode = null;
			throw error;
		}

		this.#candidateReferenceNode = null;
		return result;
	}

	/**
	 * Filters a node.
	 *
	 * @see https://dom.spec.whatwg.org/#concept-node-filter
	 * @param node Node.
	 * @returns Filter result.
	 */
	#filterNode(node: Node): number {
		if (this.#isActive) {
			throw new this.#root[PropertySymbol.window].DOMException(
				'Failed to execute a NodeFilter: The NodeIterator is currently filtering a node.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const mask = NodeFilterMask[<1>node.nodeType];

		if (mask && (this.#whatToShow & mask) == 0) {
			return NodeFilter.FILTER_SKIP;
		}
		if (!this.#filter) {
			return NodeFilter.FILTER_ACCEPT;
		}

		this.#isActive = true;

		try {
			if (typeof this.#filter === 'function') {
				return this.#filter(node);
			}
			return this.#filter.acceptNode(node);
		} finally {
			this.#isActive = false;
		}
	}

	/**
	 * First node following the subtree rooted at "node", constrained to this iterator's root.
	 *
	 * @param node Node.
	 * @returns Following node.
	 */
	#followingAfterSubtree(node: Node): Node | null {
		let current: Node | null = node;

		while (current) {
			if (current === this.#root) {
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
	 * First node preceding "node" in this iterator's collection.
	 *
	 * @param node Node.
	 * @returns Preceding node.
	 */
	#preceding(node: Node): Node | null {
		if (node === this.#root) {
			return null;
		}

		const previousSibling = node.previousSibling;

		if (previousSibling) {
			return this.#lastInclusiveDescendant(previousSibling);
		}

		return node.parentNode;
	}

	/**
	 * Inclusive descendant of "node" that appears last in tree order.
	 *
	 * @param node Node.
	 * @returns Last inclusive descendant.
	 */
	#lastInclusiveDescendant(node: Node): Node {
		let current = node;

		while (current.lastChild) {
			current = current.lastChild;
		}

		return current;
	}
}
