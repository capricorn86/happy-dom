import Event from '../event/Event.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import IDocument from '../nodes/document/IDocument.js';
import INode from '../nodes/node/INode.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import NodeUtility from '../nodes/node/NodeUtility.js';
import Range from '../range/Range.js';
import RangeUtility from '../range/RangeUtility.js';
import SelectionDirectionEnum from './SelectionDirectionEnum.js';

/**
 * Selection.
 *
 * Based on logic from:
 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/selection/Selection-impl.js
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Selection.
 */
export default class Selection {
	private readonly _ownerDocument: IDocument = null;
	private _range: Range = null;
	private _direction: SelectionDirectionEnum = SelectionDirectionEnum.directionless;

	/**
	 * Constructor.
	 *
	 * @param ownerDocument Owner document.
	 */
	constructor(ownerDocument: IDocument) {
		this._ownerDocument = ownerDocument;
	}

	/**
	 * Returns range count.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-rangecount
	 * @returns Range count.
	 */
	public get rangeCount(): number {
		return this._range ? 1 : 0;
	}

	/**
	 * Returns collapsed state.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-iscollapsed
	 * @returns "true" if collapsed.
	 */
	public get isCollapsed(): boolean {
		return this._range === null || this._range.collapsed;
	}

	/**
	 * Returns type.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-type
	 * @returns Type.
	 */
	public get type(): string {
		if (!this._range) {
			return 'None';
		} else if (this._range.collapsed) {
			return 'Caret';
		}

		return 'Range';
	}

	/**
	 * Returns anchor node.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-anchornode
	 * @returns Node.
	 */
	public get anchorNode(): INode {
		if (!this._range) {
			return null;
		}
		return this._direction === SelectionDirectionEnum.forwards
			? this._range.startContainer
			: this._range.endContainer;
	}

	/**
	 * Returns anchor offset.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-anchoroffset
	 * @returns Node.
	 */
	public get anchorOffset(): number {
		if (!this._range) {
			return null;
		}
		return this._direction === SelectionDirectionEnum.forwards
			? this._range.startOffset
			: this._range.endOffset;
	}

	/**
	 * Returns anchor node.
	 *
	 * @deprecated
	 * @alias anchorNode
	 * @returns Node.
	 */
	public get baseNode(): INode {
		return this.anchorNode;
	}

	/**
	 * Returns anchor offset.
	 *
	 * @deprecated
	 * @alias anchorOffset
	 * @returns Node.
	 */
	public get baseOffset(): number {
		return this.anchorOffset;
	}

	/**
	 * Returns focus node.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-focusnode
	 * @returns Node.
	 */
	public get focusNode(): INode {
		return this.anchorNode;
	}

	/**
	 * Returns focus offset.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-focusoffset
	 * @returns Node.
	 */
	public get focusOffset(): number {
		return this.anchorOffset;
	}

	/**
	 * Returns focus node.
	 *
	 * @deprecated
	 * @alias focusNode
	 * @returns Node.
	 */
	public get extentNode(): INode {
		return this.focusNode;
	}

	/**
	 * Returns focus offset.
	 *
	 * @deprecated
	 * @alias focusOffset
	 * @returns Node.
	 */
	public get extentOffset(): number {
		return this.focusOffset;
	}

	/**
	 * Adds a range.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-addrange
	 * @param newRange Range.
	 */
	public addRange(newRange: Range): void {
		if (!newRange) {
			throw new Error('Failed to execute addRange on Selection. Parameter 1 is not of type Range.');
		}
		if (!this._range && newRange._ownerDocument === this._ownerDocument) {
			this._associateRange(newRange);
		}
	}

	/**
	 * Returns Range.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-getrangeat
	 * @param index Index.
	 * @returns Range.
	 */
	public getRangeAt(index: number): Range {
		if (!this._range || index !== 0) {
			throw new DOMException('Invalid range index.', DOMExceptionNameEnum.indexSizeError);
		}

		return this._range;
	}

	/**
	 * Removes a range from a selection.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-removerange
	 * @param range Range.
	 */
	public removeRange(range: Range): void {
		if (this._range !== range) {
			throw new DOMException('Invalid range.', DOMExceptionNameEnum.notFoundError);
		}
		this._associateRange(null);
	}

	/**
	 * Removes all ranges.
	 */
	public removeAllRanges(): void {
		this._associateRange(null);
	}

	/**
	 * Removes all ranges.
	 *
	 * @alias removeAllRanges()
	 */
	public empty(): void {
		this.removeAllRanges();
	}

	/**
	 * Collapses the current selection to a single point.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-collapse
	 * @param node Node.
	 * @param offset Offset.
	 */
	public collapse(node: INode, offset: number): void {
		if (node === null) {
			this.removeAllRanges();
			return;
		}

		if (node.nodeType === NodeTypeEnum.documentTypeNode) {
			throw new DOMException(
				"DocumentType Node can't be used as boundary point.",
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}

		if (offset > NodeUtility.getNodeLength(node)) {
			throw new DOMException('Invalid range index.', DOMExceptionNameEnum.indexSizeError);
		}

		if (node.ownerDocument !== this._ownerDocument) {
			return;
		}

		const newRange = new Range();

		newRange._start.node = node;
		newRange._start.offset = offset;
		newRange._end.node = node;
		newRange._end.offset = offset;

		this._associateRange(newRange);
	}

	/**
	 * Collapses the current selection to a single point.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-setposition
	 * @alias collapse()
	 * @param node Node.
	 * @param offset Offset.
	 */
	public setPosition(node: INode, offset: number): void {
		this.collapse(node, offset);
	}

	/**
	 * Collapses the selection to the end.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-collapsetoend
	 */
	public collapseToEnd(): void {
		if (this._range === null) {
			throw new DOMException(
				'There is no selection to collapse.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const { node, offset } = this._range._end;
		const newRange = new Range();

		newRange._start.node = node;
		newRange._start.offset = offset;
		newRange._end.node = node;
		newRange._end.offset = offset;

		this._associateRange(newRange);
	}

	/**
	 * Collapses the selection to the start.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-collapsetostart
	 */
	public collapseToStart(): void {
		if (!this._range) {
			throw new DOMException(
				'There is no selection to collapse.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const { node, offset } = this._range._start;
		const newRange = new Range();

		newRange._start.node = node;
		newRange._start.offset = offset;
		newRange._end.node = node;
		newRange._end.offset = offset;

		this._associateRange(newRange);
	}

	/**
	 * Indicates whether a specified node is part of the selection.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-containsnode
	 * @param node Node.
	 * @param [allowPartialContainment] Set to "true" to allow partial containment.
	 * @returns Always returns "true" for now.
	 */
	public containsNode(node: INode, allowPartialContainment = false): boolean {
		if (!this._range || node.ownerDocument !== this._ownerDocument) {
			return false;
		}

		const { _start, _end } = this._range;

		const startIsBeforeNode =
			RangeUtility.compareBoundaryPointsPosition(_start, { node, offset: 0 }) === -1;
		const endIsAfterNode =
			RangeUtility.compareBoundaryPointsPosition(_end, {
				node,
				offset: NodeUtility.getNodeLength(node)
			}) === 1;

		return allowPartialContainment
			? startIsBeforeNode || endIsAfterNode
			: startIsBeforeNode && endIsAfterNode;
	}

	/**
	 * Deletes the selected text from the document's DOM.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-deletefromdocument
	 */
	public deleteFromDocument(): void {
		if (this._range) {
			this._range.deleteContents();
		}
	}

	/**
	 * Moves the focus of the selection to a specified point.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-extend
	 * @param node Node.
	 * @param offset Offset.
	 */
	public extend(node: INode, offset: number): void {
		if (node.ownerDocument !== this._ownerDocument) {
			return;
		}

		if (!this._range) {
			throw new DOMException(
				'There is no selection to extend.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const anchorNode = this.anchorNode;
		const anchorOffset = this.anchorOffset;
		const newRange = new Range();
		newRange._start.node = node;
		newRange._start.offset = 0;
		newRange._end.node = node;
		newRange._end.offset = 0;

		if (node.ownerDocument !== this._range._ownerDocument) {
			newRange._start.offset = offset;
			newRange._end.offset = offset;
		} else if (
			RangeUtility.compareBoundaryPointsPosition(
				{ node: anchorNode, offset: anchorOffset },
				{ node, offset }
			) <= 0
		) {
			newRange._start.node = anchorNode;
			newRange._start.offset = anchorOffset;
			newRange._end.node = node;
			newRange._end.offset = offset;
		} else {
			newRange._start.node = node;
			newRange._start.offset = offset;
			newRange._end.node = anchorNode;
			newRange._end.offset = anchorOffset;
		}

		this._associateRange(newRange);
		this._direction =
			RangeUtility.compareBoundaryPointsPosition(
				{ node, offset },
				{ node: anchorNode, offset: anchorOffset }
			) === -1
				? SelectionDirectionEnum.backwards
				: SelectionDirectionEnum.forwards;
	}

	/**
	 * Selects all children.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-selectallchildren
	 * @param node
	 * @param _parentNode Parent node.
	 */
	public selectAllChildren(node: INode): void {
		if (node.nodeType === NodeTypeEnum.documentTypeNode) {
			throw new DOMException(
				"DocumentType Node can't be used as boundary point.",
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}

		if (node.ownerDocument !== this._ownerDocument) {
			return;
		}

		const length = node.childNodes.length;
		const newRange = new Range();

		newRange._start.node = node;
		newRange._start.offset = 0;
		newRange._end.node = node;
		newRange._end.offset = length;

		this._associateRange(newRange);
	}

	/**
	 * Sets the selection to be a range including all or parts of two specified DOM nodes, and any content located between them.
	 *
	 * @see https://w3c.github.io/selection-api/#dom-selection-setbaseandextent
	 * @param anchorNode Anchor node.
	 * @param anchorOffset Anchor offset.
	 * @param focusNode Focus node.
	 * @param focusOffset Focus offset.
	 */
	public setBaseAndExtent(
		anchorNode: INode,
		anchorOffset: number,
		focusNode: INode,
		focusOffset: number
	): void {
		if (
			anchorOffset > NodeUtility.getNodeLength(anchorNode) ||
			focusOffset > NodeUtility.getNodeLength(focusNode)
		) {
			throw new DOMException(
				'Invalid anchor or focus offset.',
				DOMExceptionNameEnum.indexSizeError
			);
		}

		if (
			anchorNode.ownerDocument !== this._ownerDocument ||
			focusNode.ownerDocument !== this._ownerDocument
		) {
			return;
		}

		const anchor = { node: anchorNode, offset: anchorOffset };
		const focus = { node: focusNode, offset: focusOffset };
		const newRange = new Range();

		if (RangeUtility.compareBoundaryPointsPosition(anchor, focus) === -1) {
			newRange._start = anchor;
			newRange._end = focus;
		} else {
			newRange._start = focus;
			newRange._end = anchor;
		}

		this._associateRange(newRange);
		this._direction =
			RangeUtility.compareBoundaryPointsPosition(focus, anchor) === -1
				? SelectionDirectionEnum.backwards
				: SelectionDirectionEnum.forwards;
	}

	/**
	 * Returns string currently being represented by the selection object.
	 *
	 * @returns Selection as string.
	 */
	public toString(): string {
		return this._range ? this._range.toString() : '';
	}

	/**
	 * Sets the current range.
	 *
	 * @param range Range.
	 */
	protected _associateRange(range: Range): void {
		const oldRange = this._range;
		this._range = range;
		this._direction =
			range === null ? SelectionDirectionEnum.directionless : SelectionDirectionEnum.forwards;

		if (oldRange !== this._range) {
			// https://w3c.github.io/selection-api/#selectionchange-event
			this._ownerDocument.dispatchEvent(new Event('selectionchange'));
		}
	}
}
