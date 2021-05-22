import Node from '../node/Node';
import DocumentFragment from '../document-fragment/DocumentFragment';
import DOMRect from './DOMRect';

/**
 * Range object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Range
 */
export default class Range {
	private _startContainer: Node = null;
	private _endContainer: Node = null;
	private _startOffset = -1;
	private _endOffset = -1;
	private _collapsed = false;

	/**
	 * Returns collapsed.
	 *
	 * @returns "true" if collapsed.
	 */
	public get collapsed(): boolean {
		return this._collapsed;
	}

	/**
	 * Returns common ancestor container.
	 *
	 * @returns Node.
	 */
	public get commonAncestorContainer(): Node {
		return null;
	}

	/**
	 * Returns end container.
	 *
	 * @returns Node.
	 */
	public get endContainer(): Node {
		return this._endContainer;
	}

	/**
	 * Returns start container.
	 *
	 * @returns Node.
	 */
	public get startContainer(): Node {
		return this._startContainer;
	}

	/**
	 * Returns end offset.
	 *
	 * @returns Offset.
	 */
	public get endOffset(): number {
		return this._endOffset;
	}

	/**
	 * Returns start offset.
	 *
	 * @returns Offset.
	 */
	public get startOffset(): number {
		return this._startOffset;
	}

	/**
	 * Sets start.
	 *
	 * @param startNode Start node.
	 * @param startOffset Start offset.
	 */
	public setStart(startNode: Node, startOffset: number): void {
		this._startContainer = startNode;
		this._startOffset = startOffset;
	}

	/**
	 * Sets end.
	 *
	 * @param endNode End node.
	 * @param endOffset End offset.
	 */
	public setEnd(endNode: Node, endOffset: number): void {
		this._endContainer = endNode;
		this._endOffset = endOffset;
	}

	/**
	 * Sets start before.
	 */
	public setStartBefore(): void {}

	/**
	 * Sets start after.
	 */
	public setStartAfter(): void {}

	/**
	 * Sets end before.
	 */
	public setEndBefore(): void {}

	/**
	 * Sets end after.
	 */
	public setEndAfter(): void {}

	/**
	 * Selects a node.
	 */
	public selectNode(): void {}

	/**
	 * Selects node content.
	 */
	public selectNodeContents(): void {}

	/**
	 * Collapses the Range to one of its boundary points.
	 */
	public collapse(): void {
		this._collapsed = true;
	}

	/**
	 * Removes the contents of a Range from the Document.
	 */
	public deleteContents(): void {}

	/**
	 * Moves contents of a Range from the document tree into a DocumentFragment.
	 */
	public extractContents(): DocumentFragment {
		return new DocumentFragment();
	}

	/**
	 * Insert a Node at the start of a Range.
	 */
	public insertNode(): void {}

	/**
	 * Moves content of a Range into a new Node.
	 */
	public surroundContents(): void {}

	/**
	 * Compares the boundary points of the Range with another Range.
	 *
	 * @returns "true" when equal.
	 */
	public compareBoundaryPoints(): boolean {
		return false;
	}

	/**
	 * Clones the range.
	 *
	 * @returns Range.
	 */
	public cloneRange(): Range {
		return new Range();
	}

	/**
	 * Releases the Range from use to improve performance.
	 */
	public detach(): void {}

	/**
	 * Returns the text of the Range.
	 *
	 * @returns Text.
	 */
	public toString(): string {
		return '';
	}

	/**
	 * Returns -1, 0, or 1 indicating whether the point occurs before, inside, or after the Range.
	 *
	 * @returns Number.
	 */
	public comparePoint(): number {
		return 0;
	}

	/**
	 * Returns a DocumentFragment created from a given string of code.
	 *
	 * @returns Document fragment.
	 */
	public createContextualFragment(): DocumentFragment {
		return new DocumentFragment();
	}

	/**
	 * Returns a DOMRect object which bounds the entire contents of the Range; this would be the union of all the rectangles returned by range.getClientRects().
	 *
	 * @returns DOM rect.
	 */
	public getBoundingClientRect(): DOMRect {
		return new DOMRect();
	}

	/**
	 * Returns a list of DOMRect objects that aggregates the results of Element.getClientRects() for all the elements in the Range.
	 *
	 * @returns DOM rect.
	 */
	public getClientRects(): DOMRect {
		return new DOMRect();
	}

	/**
	 * Returns a boolean indicating whether the given node intersects the Range.
	 *
	 * @returns "true" when intersecting.
	 */
	public intersectsNode(): boolean {
		return false;
	}

	/**
	 * Returns a boolean indicating whether the given point is in the Range.
	 *
	 * @returns "true" when in range.
	 */
	public isPointInRange(): boolean {
		return false;
	}
}
