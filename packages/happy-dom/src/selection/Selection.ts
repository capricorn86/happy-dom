import INode from '../nodes/node/INode';

/**
 * Selection.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Selection.
 */
export default class Selection {
	public readonly anchorNode: INode = null;
	public readonly anchorOffset: number = 0;
	public readonly baseNode: INode = null;
	public readonly baseOffset: number = 0;
	public readonly extentNode: INode = null;
	public readonly extentOffset: number = 0;
	public readonly focusNode: INode = null;
	public readonly focusOffset: number = 0;
	public readonly isCollapsed: boolean = true;
	public readonly rangeCount: number = 0;
	public readonly type: string = 'None';

	/**
	 * Adds a range.
	 *
	 * @param _range Range.
	 */
	public addRange(_range: object): void {
		// Do nothing.
	}

	/**
	 * Collapses the current selection to a single point.
	 *
	 * @param _node Node.
	 * @param _offset Offset.
	 */
	public collapse(_node: INode, _offset?: number): void {
		// Do nothing.
	}

	/**
	 * Collapses the selection to the end.
	 */
	public collapseToEnd(): void {
		// Do nothing.
	}

	/**
	 * Collapses the selection to the start.
	 */
	public collapseToStart(): void {
		// Do nothing.
	}

	/**
	 * Indicates whether a specified node is part of the selection.
	 *
	 * @param _node Node.
	 * @param _partialContainer Partial container.
	 * @returns Always returns "true" for now.
	 */
	public containsNode(_node: INode, _partialContainer?: INode): boolean {
		return true;
	}

	/**
	 * Deletes the selected text from the document's DOM.
	 */
	public deleteFromDocument(): void {
		// Do nothing.
	}

	/**
	 * Moves the focus of the selection to a specified point.
	 *
	 * @param _node Node.
	 * @param _offset Offset.
	 */
	public extend(_node: INode, _offset?: number): void {
		// Do nothing.
	}

	/**
	 * Moves the focus of the selection to a specified point.
	 *
	 * @param _index Index.
	 */
	public getRangeAt(_index: number): object {
		throw new Error('Not a valid index.');
	}

	/**
	 * Removes a range from a selection.
	 *
	 * @param _range Range.
	 */
	public removeRange(_range: object): void {
		// Do nothing.
	}

	/**
	 * Removes all ranges.
	 */
	public removeAllRanges(): void {
		// Do nothing.
	}

	/**
	 * Selects all children.
	 *
	 * @param _parentNode Parent node.
	 */
	public selectAllChildren(_parentNode: INode): void {
		// Do nothing.
	}

	/**
	 * Sets the selection to be a range including all or parts of two specified DOM nodes, and any content located between them.
	 *
	 * @param _anchorNode Anchor node.
	 * @param _anchorOffset Anchor offset.
	 * @param _focusNode Focus node.
	 * @param _focusOffset Focus offset.
	 */
	public setBaseAndExtent(
		_anchorNode: INode,
		_anchorOffset: number,
		_focusNode: INode,
		_focusOffset: number
	): void {
		// Do nothing.
	}

	/**
	 * Returns string currently being represented by the selection object.
	 */
	public toString(): string {
		return '';
	}
}
