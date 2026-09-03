import type Node from '../nodes/node/Node.js';

/**
 * Range object that does not update when the node tree mutates.
 *
 * @see https://dom.spec.whatwg.org/#staticrange
 */
export default class StaticRange {
	public readonly startContainer: Node;
	public readonly startOffset: number;
	public readonly endContainer: Node;
	public readonly endOffset: number;

	/**
	 * Constructor.
	 *
	 * @param init Initialization options.
	 * @param init.startContainer Node containing the start of the range.
	 * @param init.startOffset Start offset.
	 * @param init.endContainer Node containing the end of the range.
	 * @param init.endOffset End offset.
	 */
	constructor(init: {
		startContainer: Node;
		startOffset: number;
		endContainer: Node;
		endOffset: number;
	}) {
		this.startContainer = init.startContainer;
		this.startOffset = init.startOffset;
		this.endContainer = init.endContainer;
		this.endOffset = init.endOffset;
	}

	/**
	 * Returns true if this range is collapsed (start and end are the same point).
	 *
	 * @returns True if collapsed; otherwise false.
	 */
	public get collapsed(): boolean {
		return this.startContainer === this.endContainer && this.startOffset === this.endOffset;
	}
}
