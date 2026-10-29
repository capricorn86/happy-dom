import type { TNodeFilter } from './TNodeFilter.js';
import Node from '../nodes/node/Node.js';
import NodeUtility from '../nodes/node/NodeUtility.js';
import * as PropertySymbol from '../PropertySymbol.js';
import NodeFilter from './NodeFilter.js';
import NodeFilterMask from './NodeFilterMask.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import type Document from '../nodes/document/Document.js';

/**
 * The NodeIterator object represents the nodes of a document subtree and a position within them.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
 * @see https://dom.spec.whatwg.org/#interface-nodeiterator
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

		(root[PropertySymbol.ownerDocument] || <Document>root)[PropertySymbol.nodeIterators].add(
			new WeakRef(this)
		);
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
	public get filter(): TNodeFilter | null {
		return this.#filter;
	}

	/**
	 * Returns reference node.
	 *
	 * @returns Reference node.
	 */
	public get referenceNode(): Node {
		return this.#referenceNode;
	}

	/**
	 * Returns "true" if the iterator is anchored before the reference node.
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
	public nextNode(): Node | null {
		return this.#traverse(true);
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @returns Current node.
	 */
	public previousNode(): Node | null {
		return this.#traverse(false);
	}

	/**
	 * Does nothing. Kept for compatibility.
	 */
	public detach(): void {
		// Do nothing
	}

	/**
	 * Updates the reference node before a node is removed.
	 *
	 * @see https://dom.spec.whatwg.org/#nodeiterator-pre-removing-steps
	 * @param toBeRemovedNode Node that is about to be removed.
	 */
	public [PropertySymbol.preRemovingSteps](toBeRemovedNode: Node): void {
		const reference = this.#adjustNodePointer(
			this.#referenceNode,
			this.#pointerBeforeReferenceNode,
			toBeRemovedNode
		);

		this.#referenceNode = reference.node;
		this.#pointerBeforeReferenceNode = reference.pointerBefore;

		if (this.#candidateReferenceNode) {
			const candidate = this.#adjustNodePointer(
				this.#candidateReferenceNode,
				this.#candidatePointerBeforeReferenceNode,
				toBeRemovedNode
			);

			this.#candidateReferenceNode = candidate.node;
			this.#candidatePointerBeforeReferenceNode = candidate.pointerBefore;
		}
	}

	/**
	 * Traverses to the next or previous node.
	 *
	 * @see https://dom.spec.whatwg.org/#concept-nodeiterator-traverse
	 * @param next "true" to traverse to the next node, "false" to traverse to the previous node.
	 * @returns Node.
	 */
	#traverse(next: boolean): Node | null {
		if (this.#isActive) {
			throw new DOMException(
				'The NodeFilter is being run.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this.#candidateReferenceNode = this.#referenceNode;
		this.#candidatePointerBeforeReferenceNode = this.#pointerBeforeReferenceNode;

		let result: Node | null = null;

		while (true) {
			const node = <Node>this.#candidateReferenceNode;

			if (next) {
				if (!this.#candidatePointerBeforeReferenceNode) {
					const following = this.#following(node);
					if (!following) {
						break;
					}
					this.#candidateReferenceNode = following;
				}
				this.#candidatePointerBeforeReferenceNode = false;
			} else {
				if (this.#candidatePointerBeforeReferenceNode) {
					const preceding = this.#preceding(node);
					if (!preceding) {
						break;
					}
					this.#candidateReferenceNode = preceding;
				}
				this.#candidatePointerBeforeReferenceNode = true;
			}

			const candidate = <Node>this.#candidateReferenceNode;
			let filterResult: number;

			try {
				filterResult = this.#filterNode(candidate);
			} catch (error) {
				this.#candidateReferenceNode = null;
				throw error;
			}

			if (filterResult === NodeFilter.FILTER_ACCEPT) {
				// The filter may have removed nodes, which can have moved the candidate reference.
				this.#referenceNode = <Node>this.#candidateReferenceNode;
				this.#pointerBeforeReferenceNode = this.#candidatePointerBeforeReferenceNode;
				result = candidate;
				break;
			}
		}

		this.#candidateReferenceNode = null;

		return result;
	}

	/**
	 * Adjusts a node pointer for a node that is about to be removed.
	 *
	 * @see https://dom.spec.whatwg.org/#adjust-a-node-pointer
	 * @param node Node.
	 * @param pointerBefore Pointer before.
	 * @param toBeRemovedNode Node that is about to be removed.
	 * @returns Adjusted node pointer.
	 */
	#adjustNodePointer(
		node: Node,
		pointerBefore: boolean,
		toBeRemovedNode: Node
	): { node: Node; pointerBefore: boolean } {
		// Removing an inclusive ancestor of root keeps the pointer, as in browsers (the spec only checks root itself).
		if (
			!NodeUtility.isInclusiveAncestor(toBeRemovedNode, node) ||
			NodeUtility.isInclusiveAncestor(toBeRemovedNode, this.#root)
		) {
			return { node, pointerBefore };
		}

		if (pointerBefore) {
			// The first following node outside toBeRemovedNode that is still inside root.
			let current: Node = toBeRemovedNode;
			while (current !== this.#root && !current.nextSibling) {
				current = <Node>current[PropertySymbol.parentNode];
			}
			if (current !== this.#root) {
				return { node: <Node>current.nextSibling, pointerBefore: true };
			}
		}

		const previousSibling = toBeRemovedNode.previousSibling;

		if (!previousSibling) {
			return { node: <Node>toBeRemovedNode[PropertySymbol.parentNode], pointerBefore: false };
		}

		return { node: this.#lastInclusiveDescendant(previousSibling), pointerBefore: false };
	}

	/**
	 * Returns the node following a node within root, or null.
	 *
	 * The child node lists are read directly, as HTMLTemplateElement overrides "firstChild" and "lastChild" to return nodes in its content.
	 *
	 * @param node Node.
	 * @returns Following node.
	 */
	#following(node: Node): Node | null {
		const childNodes = node[PropertySymbol.nodeArray];

		if (childNodes.length) {
			return childNodes[0];
		}

		let current: Node | null = node;

		while (current && current !== this.#root) {
			const nextSibling = current.nextSibling;

			if (nextSibling) {
				return nextSibling;
			}

			current = current[PropertySymbol.parentNode];
		}

		return null;
	}

	/**
	 * Returns the node preceding a node within root, or null.
	 *
	 * @param node Node.
	 * @returns Preceding node.
	 */
	#preceding(node: Node): Node | null {
		if (node === this.#root) {
			return null;
		}

		const previousSibling = node.previousSibling;

		if (!previousSibling) {
			return node[PropertySymbol.parentNode];
		}

		return this.#lastInclusiveDescendant(previousSibling);
	}

	/**
	 * Returns the last inclusive descendant of a node.
	 *
	 * @param node Node.
	 * @returns Last inclusive descendant.
	 */
	#lastInclusiveDescendant(node: Node): Node {
		let current = node;
		let childNodes = current[PropertySymbol.nodeArray];

		while (childNodes.length) {
			current = childNodes[childNodes.length - 1];
			childNodes = current[PropertySymbol.nodeArray];
		}

		return current;
	}

	/**
	 * Filters a node.
	 *
	 * @param node Node.
	 * @returns Filter result.
	 */
	#filterNode(node: Node): number {
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
}
