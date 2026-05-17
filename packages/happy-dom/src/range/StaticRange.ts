/**
 * StaticRange.
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
	 * @param init Init options.
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
	 * Returns true if the range is collapsed (start and end are the same point).
	 *
	 * @returns True if collapsed.
	 */
	public get collapsed(): boolean {
		return this.startContainer === this.endContainer && this.startOffset === this.endOffset;
	}
}
