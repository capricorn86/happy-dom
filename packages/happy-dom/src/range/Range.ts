import INode from '../nodes/node/INode';
import IDocument from '../nodes/document/IDocument';
import IDocumentFragment from '../nodes/document-fragment/IDocumentFragment';
import DOMRect from '../nodes/element/DOMRect';
import RangeHowEnum from './RangeHowEnum';

/**
 * Range.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Range.
 */
export default class Range {
	public static _ownerDocument: IDocument = null;
	public static readonly END_TO_END: number = RangeHowEnum.endToEnd;
	public static readonly END_TO_START: number = RangeHowEnum.endToStart;
	public static readonly START_TO_END: number = RangeHowEnum.startToEnd;
	public static readonly START_TO_START: number = RangeHowEnum.startToStart;
	public readonly END_TO_END: number = RangeHowEnum.endToEnd;
	public readonly END_TO_START: number = RangeHowEnum.endToStart;
	public readonly START_TO_END: number = RangeHowEnum.startToEnd;
	public readonly START_TO_START: number = RangeHowEnum.startToStart;
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
		if (this.startContainer === this.endContainer) {
			return this.startContainer;
		}

		const endAncestors = [];
		let parent = this.endContainer;

		while (parent) {
			endAncestors.push(parent);
			parent = parent.parentNode;
		}

		parent = this.startContainer;

		while (parent) {
			if (endAncestors.includes(parent)) {
				return parent;
			}
			parent = parent.parentNode;
		}

		return this.endContainer || this.startContainer;
	}

	/**
	 * Returns -1, 0, or 1 depending on whether the referenceNode is before, the same as, or after the Range.
	 *
	 * @param toStart A boolean value: true collapses the Range to its start, false to its end. If omitted, it defaults to false.
	 */
	public collapse(toStart = false): void {
		if (toStart) {
			(<INode>this.endContainer) = this.startContainer;
			(<number>this.endOffset) = this.startOffset;
		} else {
			(<INode>this.startContainer) = this.endContainer;
			(<number>this.startOffset) = this.endOffset;
		}
	}

	/**
	 * Compares the boundary points of the Range with those of another range.
	 *
	 * @param _how How.
	 * @param _sourceRange Range.
	 * @returns A number, -1, 0, or 1, indicating whether the corresponding boundary-point of the Range is respectively before, equal to, or after the corresponding boundary-point of sourceRange.
	 */
	public compareBoundaryPoints(_how: RangeHowEnum, _sourceRange: Range): number {
		// TODO: Implement
		return 0;
	}

	/**
	 * Returns -1, 0, or 1 depending on whether the referenceNode is before, the same as, or after the Range.
	 *
	 * @param _referenceNode Reference node.
	 * @param [_offset=0] Offset.
	 * @returns -1,0, or 1.
	 */
	public comparePoint(_referenceNode: INode, _offset = 0): number {
		// TODO: Implement
		return 0;
	}

	/**
	 * Returns a DocumentFragment copying the objects of type Node included in the Range.
	 *
	 * @returns Document fragment.
	 */
	public cloneContents(): IDocumentFragment {
		// TODO: Implement
		return null;
	}

	/**
	 * Returns a Range object with boundary points identical to the cloned Range.
	 *
	 * @returns Range.
	 */
	public cloneRange(): Range {
		// TODO: Implement
		return null;
	}

	/**
	 * Returns a DocumentFragment by invoking the HTML fragment parsing algorithm or the XML fragment parsing algorithm with the start of the range (the parent of the selected node) as the context node. The HTML fragment parsing algorithm is used if the range belongs to a Document whose HTMLness bit is set. In the HTML case, if the context node would be html, for historical reasons the fragment parsing algorithm is invoked with body as the context instead.
	 *
	 * @param _tagString Tag string.
	 * @returns Document fragment.
	 */
	public createContextualFragment(_tagString: string): IDocumentFragment {
		// TODO: Implement
		return null;
	}

	/**
	 * Removes the contents of the Range from the Document.
	 */
	public deleteContents(): void {
		// TODO: Implement
	}

	/**
	 * Does nothing. It used to disable the Range object and enable the browser to release associated resources. The method has been kept for compatibility.
	 */
	public detach(): void {
		// Do nothing
	}

	/**
	 * Moves contents of the Range from the document tree into a DocumentFragment.
	 *
	 * @returns Document fragment.
	 */
	public extractContents(): IDocumentFragment {
		// TODO: Implement
		return null;
	}

	/**
	 * Returns a DOMRect object that bounds the contents of the range; this is a rectangle enclosing the union of the bounding rectangles for all the elements in the range.
	 *
	 * @returns DOMRect object.
	 */
	public getBoundingClientRect(): DOMRect {
		// TODO: Implement
		return null;
	}

	/**
	 * The Range.getClientRects() method returns a list of DOMRect objects representing the area of the screen occupied by the range. This is created by aggregating the results of calls to Element.getClientRects() for all the elements in the range.
	 *
	 * @returns DOMRect objects.
	 */
	public getClientRects(): DOMRect[] {
		// TODO: Implement
		return null;
	}

	/**
	 * Returns a boolean indicating whether the given point is in the Range.
	 *
	 * @param _referenceNode Reference node.
	 * @param _offset Offset.
	 * @returns "true" if in range.
	 */
	public isPointInRange(_referenceNode: INode, _offset = 0): boolean {
		// TODO: Implement
		return false;
	}

	/**
	 * Inserts a node at the start of the Range.
	 *
	 * @param _newNode New node.
	 */
	public insertNode(_newNode: INode): void {
		// TODO: Implement
		return null;
	}

	/**
	 * Returns a boolean indicating whether the given Node intersects the Range.
	 *
	 * @param _referenceNode Reference node.
	 * @returns "true" if it intersects.
	 */
	public intersectsNode(_referenceNode: INode): boolean {
		// TODO: Implement
		return false;
	}

	/**
	 * Sets the Range to contain the Node and its contents.
	 *
	 * @param _referenceNode Reference node.
	 */
	public selectNode(_referenceNode: INode): void {
		// TODO: Implement
	}

	/**
	 * Sets the Range to contain the contents of a Node.
	 *
	 * @param referenceNode Reference node.
	 */
	public selectNodeContents(referenceNode: INode): void {
		(<INode>this.startContainer) = referenceNode;
		(<INode>this.endContainer) = referenceNode;
		(<number>this.startOffset) = 0;
		(<number>this.endOffset) = referenceNode.textContent.length > 0 ? 1 : 0;
	}

	/**
	 * Sets the end position of a Range to be located at the given offset into the specified node x.
	 *
	 * @param endNode End node.
	 * @param endOffset End offset.
	 */
	public setEnd(endNode: INode, endOffset = 0): void {
		(<INode>this.endContainer) = endNode;
		(<number>this.endOffset) = endOffset;
	}

	/**
	 * Sets the start position of a Range.
	 *
	 * @param startNode Start node.
	 * @param startOffset Start offset.
	 */
	public setStart(startNode: INode, startOffset = 0): void {
		(<INode>this.startContainer) = startNode;
		(<number>this.startOffset) = startOffset;
	}

	/**
	 * Sets the end position of a Range relative to another Node.
	 *
	 * @param referenceNode Reference node.
	 */
	public setEndAfter(referenceNode: INode): void {
		const sibling = referenceNode.nextSibling;
		if (!sibling) {
			throw new Error(
				'Failed to set range end. "referenceNode" does not have any nodes after itself.'
			);
		}
		this.setEnd(sibling);
	}

	/**
	 * Sets the end position of a Range relative to another Node.
	 *
	 * @param referenceNode Reference node.
	 */
	public setEndBefore(referenceNode: INode): void {
		const sibling = referenceNode.previousSibling;
		if (!sibling) {
			throw new Error(
				'Failed to set range end. "referenceNode" does not have any nodes before itself.'
			);
		}
		this.setEnd(sibling);
	}

	/**
	 * Sets the start position of a Range relative to a Node.
	 *
	 * @param referenceNode Reference node.
	 */
	public setStartAfter(referenceNode: INode): void {
		const sibling = referenceNode.nextSibling;
		if (!sibling) {
			throw new Error(
				'Failed to set range start. "referenceNode" does not have any nodes after itself.'
			);
		}
		this.setStart(sibling);
	}

	/**
	 * Sets the start position of a Range relative to another Node.
	 *
	 * @param referenceNode Reference node.
	 */
	public setStartBefore(referenceNode: INode): void {
		const sibling = referenceNode.previousSibling;
		if (!sibling) {
			throw new Error(
				'Failed to set range start. "referenceNode" does not have any nodes before itself.'
			);
		}
		this.setStart(sibling);
	}

	/**
	 * Moves content of the Range into a new node, placing the new node at the start of the specified range.
	 *
	 * @param _newParent New parent.
	 */
	public surroundContents(_newParent: INode): void {
		// TODO: Implement
	}

	/**
	 * Returns the text of the Range.
	 */
	public toString(): string {
		return '';
	}
}
