import INode from '../nodes/node/INode';
import IDocument from '../nodes/document/IDocument';

/**
 * Range.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Range.
 */
export default class Range {
	public static _ownerDocument: IDocument = null;
	public readonly startOffset: number = 0;
	public readonly endOffset: number = 0;
	public readonly startContainer: INode = null;
	public readonly endContainer: INode = null;

	/**
	 * Constructor.
	 */
	constructor() {
		this.startContainer = (<typeof Range>this.constructor)._ownerDocument;
		this.endContainer = (<typeof Range>this.constructor)._ownerDocument;
	}

	/**
	 * Returns a boolean value indicating whether the range's start and end points are at the same position.
	 *
	 * @returns Collapsed.
	 */
	public get collapsed(): boolean {
		return this.startContainer === this.endContainer && this.startOffset === this.endOffset;
	}

	/**
	 * Returns the deepest Node that contains the startContainer and endContainer nodes.
	 *
	 * @returns Node.
	 */
	public get commonAncestorContainer(): INode {
		// TODO: Implement
		return null;
	}

	/**
	 * Collapses the current selection.
	 *
	 * @param _toStart To start.
	 */
	public collapse(_toStart?: boolean): void {
		// TODO: Implement
	}

	/**
	 * Returns string currently being represented by the selection object.
	 */
	public toString(): string {
		return '';
	}
}
