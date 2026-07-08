import type Node from '../nodes/node/Node.js';

/**
 * XPath result types.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XPathResult
 */
export default class XPathResult {
	public static readonly ANY_TYPE = 0;
	public static readonly NUMBER_TYPE = 1;
	public static readonly STRING_TYPE = 2;
	public static readonly BOOLEAN_TYPE = 3;
	public static readonly UNORDERED_NODE_ITERATOR_TYPE = 4;
	public static readonly ORDERED_NODE_ITERATOR_TYPE = 5;
	public static readonly UNORDERED_NODE_SNAPSHOT_TYPE = 6;
	public static readonly ORDERED_NODE_SNAPSHOT_TYPE = 7;
	public static readonly ANY_UNORDERED_NODE_TYPE = 8;
	public static readonly FIRST_ORDERED_NODE_TYPE = 9;

	public readonly resultType: number;
	public readonly numberValue: number;
	public readonly stringValue: string;
	public readonly booleanValue: boolean;
	public readonly invalidIteratorState: boolean;
	public readonly singleNodeValue: Node | null;
	public readonly snapshotLength: number;

	readonly #nodes: Node[];
	#iteratorIndex = 0;

	/**
	 *
	 * @param resultType
	 * @param nodes
	 */
	constructor(resultType: number, nodes: Node[] = []) {
		this.resultType = resultType;
		this.#nodes = nodes;
		this.numberValue = NaN;
		this.stringValue = '';
		this.booleanValue = false;
		this.invalidIteratorState = false;
		this.singleNodeValue = nodes.length > 0 ? nodes[0] : null;
		this.snapshotLength = nodes.length;
	}

	/**
	 * Returns the next node in the iterator.
	 *
	 * @returns Next node or null.
	 */
	public iterateNext(): Node | null {
		if (this.#iteratorIndex < this.#nodes.length) {
			return this.#nodes[this.#iteratorIndex++];
		}
		return null;
	}

	/**
	 * Returns a snapshot item by index.
	 *
	 * @param index Index.
	 * @returns Node or null.
	 */
	public snapshotItem(index: number): Node | null {
		return this.#nodes[index] || null;
	}
}
