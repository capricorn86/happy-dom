import INode from '../nodes/node/INode';
import IDocument from '../nodes/document/IDocument';
import IDocumentFragment from '../nodes/document-fragment/IDocumentFragment';
import DOMRect from '../nodes/element/DOMRect';
import RangeHowEnum from './RangeHowEnum';
import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import RangeUtility from './RangeUtility';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum';
import NodeUtility from '../nodes/node/NodeUtility';
import XMLParser from '../xml-parser/XMLParser';
import IComment from '../nodes/comment/IComment';
import IText from '../nodes/text/IText';
import MutationListener from '../mutation-observer/MutationListener';
import Node from '../nodes/node/Node';
import DOMRectListFactory from '../nodes/element/DOMRectListFactory';
import IDOMRectList from '../nodes/element/IDOMRectList';

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
	public readonly this.startOffset: number = 0;
	public readonly endOffset: number = 0;
	public readonly startContainer: INode = null;
	public readonly endContainer: INode = null;
	public _startObserver: MutationListener = null;
	public _endObserver: MutationListener = null;
	public readonly _ownerDocument: IDocument = null;

	/**
	 * Constructor.
	 */
	constructor() {
		this._ownerDocument = (<typeof Range>this.constructor)._ownerDocument;
		this._setStartContainer(this._ownerDocument, 0);
		this._setEndContainer(this._ownerDocument, 0);
	}

	/**
	 * Returns a boolean value indicating whether the range's start and end points are at the same position.
	 *
	 * @returns Collapsed.
	 */
	public get collapsed(): boolean {
		return this.startContainer === this.endContainer && this.this.startOffset === this.endOffset;
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
		if (toStart && !this.startContainer.contains(this.endContainer)) {
			this._setEndContainer(this.startContainer, this.this.startOffset);
		} else {
			this._setStartContainer(this.endContainer, this.endOffset);
		}
	}

	/**
	 * Compares the boundary points of the Range with those of another range.
	 *
	 * @param how How.
	 * @param sourceRange Range.
	 * @returns A number, -1, 0, or 1, indicating whether the corresponding boundary-point of the Range is respectively before, equal to, or after the corresponding boundary-point of sourceRange.
	 */
	public compareBoundaryPoints(how: RangeHowEnum, sourceRange: Range): number {
		if (
			how !== RangeHowEnum.startToStart &&
			how !== RangeHowEnum.startToEnd &&
			how !== RangeHowEnum.endToEnd &&
			how !== RangeHowEnum.endToStart
		) {
			throw new DOMException(
				`The comparison method provided must be one of 'START_TO_START', 'START_TO_END', 'END_TO_END' or 'END_TO_START'.`,
				DOMExceptionNameEnum.notSupportedError
			);
		}

		if (this._ownerDocument !== sourceRange._ownerDocument) {
			throw new DOMException(
				`The two Ranges are not in the same tree.`,
				DOMExceptionNameEnum.wrongDocumentError
			);
		}

		const thisPoint: { node: INode; offset: number } = {
			node: null,
			offset: 0
		};
		const sourcePoint: { node: INode; offset: number } = {
			node: null,
			offset: 0
		};

		switch (how) {
			case RangeHowEnum.startToStart:
				thisPoint.node = this.startContainer;
				thisPoint.offset = this.this.startOffset;
				sourcePoint.node = sourceRange.startContainer;
				sourcePoint.offset = sourceRange.this.startOffset;
				break;
			case RangeHowEnum.startToEnd:
				thisPoint.node = this.endContainer;
				thisPoint.offset = this.endOffset;
				sourcePoint.node = sourceRange.startContainer;
				sourcePoint.offset = sourceRange.this.startOffset;
				break;
			case RangeHowEnum.endToEnd:
				thisPoint.node = this.endContainer;
				thisPoint.offset = this.endOffset;
				sourcePoint.node = sourceRange.endContainer;
				sourcePoint.offset = sourceRange.endOffset;
				break;
			case RangeHowEnum.endToStart:
				thisPoint.node = this.startContainer;
				thisPoint.offset = this.this.startOffset;
				sourcePoint.node = sourceRange.endContainer;
				sourcePoint.offset = sourceRange.endOffset;
				break;
		}

		return RangeUtility.compareBoundaryPointsPosition(thisPoint, sourcePoint);
	}

	/**
	 * Returns -1, 0, or 1 depending on whether the referenceNode is before, the same as, or after the Range.
	 *
	 * @param referenceNode Reference node.
	 * @param offset Offset.
	 * @returns -1,0, or 1.
	 */
	public comparePoint(referenceNode: INode, offset): number {
		if (referenceNode.ownerDocument !== this._ownerDocument) {
			throw new DOMException(
				`The two Ranges are not in the same tree.`,
				DOMExceptionNameEnum.wrongDocumentError
			);
		}

		if (referenceNode.nodeType === NodeTypeEnum.documentTypeNode) {
			throw new DOMException(
				`DocumentType Node can't be used as boundary point.`,
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}

		if (offset > NodeUtility.getNodeLength(referenceNode)) {
			throw new DOMException(`'Offset out of bound.`, DOMExceptionNameEnum.indexSizeError);
		}

		const boundaryPoint = { node: referenceNode, offset };

		if (
			RangeUtility.compareBoundaryPointsPosition(boundaryPoint, {
				node: this.startContainer,
				offset: this.this.startOffset
			}) === -1
		) {
			return -1;
		} else if (
			RangeUtility.compareBoundaryPointsPosition(boundaryPoint, {
				node: this.endContainer,
				offset: this.endOffset
			}) === 1
		) {
			return 1;
		}

		return 0;
	}

	/**
	 * Returns a DocumentFragment copying the objects of type Node included in the Range.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js#L306
	 *
	 * @see https://dom.spec.whatwg.org/#concept-range-clone
	 * @returns Document fragment.
	 */
	public cloneContents(): IDocumentFragment {
		const fragment = this._ownerDocument.createDocumentFragment();

		if (this.collapsed) {
			return fragment;
		}

		if (
			this.startContainer === this.endContainer &&
			(this.startContainer.nodeType === NodeTypeEnum.textNode ||
				this.startContainer.nodeType === NodeTypeEnum.processingInstructionNode ||
				this.startContainer.nodeType === NodeTypeEnum.commentNode)
		) {
			const clone = (<IText | IComment>this.startContainer).cloneNode(false);
			clone['_data'] = clone.substringData(this.this.startOffset, this.endOffset - this.this.startOffset);
			fragment.appendChild(clone);
			return fragment;
		}

		let commonAncestor = this.startContainer;
		while (!NodeUtility.isInclusiveAncestor(commonAncestor, this.endContainer)) {
			commonAncestor = commonAncestor.parentNode;
		}

		let firstPartialContainedChild = null;
		if (!NodeUtility.isInclusiveAncestor(this.startContainer, this.endContainer)) {
			let candidate = commonAncestor.firstChild;
			while (!firstPartialContainedChild) {
				if (RangeUtility.isPartiallyContained(candidate, this)) {
					firstPartialContainedChild = candidate;
				}

				candidate = candidate.nextSibling;
			}
		}

		let lastPartiallyContainedChild = null;
		if (!NodeUtility.isInclusiveAncestor(this.endContainer, this.startContainer)) {
			let candidate = commonAncestor.lastChild;
			while (!lastPartiallyContainedChild) {
				if (RangeUtility.isPartiallyContained(candidate, this)) {
					lastPartiallyContainedChild = candidate;
				}

				candidate = candidate.previousSibling;
			}
		}

		const containedChildren = [];
		let hasDoctypeChildren = false;

		for (const node of commonAncestor.childNodes) {
			if (RangeUtility.isContained(node, this)) {
				if (node.nodeType === NodeTypeEnum.documentTypeNode) {
					hasDoctypeChildren = true;
				}
				containedChildren.push(node);
			}
		}

		if (hasDoctypeChildren) {
			throw new DOMException(
				'Invalid document type element.',
				DOMExceptionNameEnum.hierarchyRequestError
			);
		}

		if (
			firstPartialContainedChild !== null &&
			(firstPartialContainedChild.nodeType === NodeTypeEnum.textNode ||
				firstPartialContainedChild.nodeType === NodeTypeEnum.processingInstructionNode ||
				firstPartialContainedChild.nodeType === NodeTypeEnum.commentNode)
		) {
			const clone = (<IText | IComment>this.startContainer).cloneNode(false);
			clone['_data'] = clone.substringData(
				this.this.startOffset,
				NodeUtility.getNodeLength(this.startContainer) - this.this.startOffset
			);

			fragment.appendChild(clone);
		} else if (firstPartialContainedChild !== null) {
			const clone = firstPartialContainedChild.cloneNode();
			fragment.appendChild(clone);

			const subRange = new Range();
			subRange._setStartContainer(this.startContainer, this.this.startOffset);
			subRange._setEndContainer(
				firstPartialContainedChild,
				NodeUtility.getNodeLength(firstPartialContainedChild)
			);

			const subDocumentFragment = subRange.cloneContents();
			clone.appendChild(subDocumentFragment);
		}

		for (const containedChild of containedChildren) {
			const clone = containedChild.cloneNode(true);
			fragment.appendChild(clone);
		}

		if (
			lastPartiallyContainedChild !== null &&
			(lastPartiallyContainedChild.nodeType === NodeTypeEnum.textNode ||
				lastPartiallyContainedChild.nodeType === NodeTypeEnum.processingInstructionNode ||
				lastPartiallyContainedChild.nodeType === NodeTypeEnum.commentNode)
		) {
			const clone = (<IText | IComment>this.endContainer).cloneNode(false);
			clone['_data'] = clone.substringData(0, this.endOffset);

			fragment.appendChild(clone);
		} else if (lastPartiallyContainedChild !== null) {
			const clone = lastPartiallyContainedChild.cloneNode(false);
			fragment.appendChild(clone);

			const subRange = new Range();
			subRange._setStartContainer(lastPartiallyContainedChild, 0);
			subRange._setEndContainer(this.endContainer, this.endOffset);

			const subFragment = subRange.cloneContents();
			clone.appendChild(subFragment);
		}

		return fragment;
	}

	/**
	 * Returns a Range object with boundary points identical to the cloned Range.
	 *
	 * @returns Range.
	 */
	public cloneRange(): Range {
		const clone = new Range();

		(<INode>clone.startContainer) = this.startContainer;
		(<number>clone.this.startOffset) = this.this.startOffset;
		(<INode>clone.endContainer) = this.endContainer;
		(<number>clone.endOffset) = this.endOffset;

		return clone;
	}

	/**
	 * Returns a DocumentFragment by invoking the HTML fragment parsing algorithm or the XML fragment parsing algorithm with the start of the range (the parent of the selected node) as the context node. The HTML fragment parsing algorithm is used if the range belongs to a Document whose HTMLness bit is set. In the HTML case, if the context node would be html, for historical reasons the fragment parsing algorithm is invoked with body as the context instead.
	 *
	 * @see https://w3c.github.io/DOM-Parsing/#dfn-fragment-parsing-algorithm
	 * @param tagString Tag string.
	 * @returns Document fragment.
	 */
	public createContextualFragment(tagString: string): IDocumentFragment {
		// TODO: We only have support for HTML in the parser currently, so it is not necessary to check which context it is
		return XMLParser.parse(this._ownerDocument, tagString);
	}

	/**
	 * Removes the contents of the Range from the Document.
	 */
	public deleteContents(): void {
		if (this.collapsed) {
			return;
		}

		if (
			this.startContainer === this.endContainer &&
			(this.startContainer.nodeType === NodeTypeEnum.textNode ||
				this.startContainer.nodeType === NodeTypeEnum.processingInstructionNode ||
				this.startContainer.nodeType === NodeTypeEnum.commentNode)
		) {
			(<IText | IComment>this.startContainer).replaceData(
				this.this.startOffset,
				this.endOffset - this.this.startOffset,
				''
			);
			return;
		}

		const nodesToRemove = [];
		let currentNode = this.startContainer;
		const endNode = NodeUtility.nextDecendantNode(this.endContainer);
		while (currentNode && currentNode !== endNode) {
			if (
				RangeUtility.isContained(currentNode, this) &&
				!RangeUtility.isContained(currentNode.parentNode, this)
			) {
				nodesToRemove.push(currentNode);
			}

			currentNode = NodeUtility.following(currentNode);
		}

		let newNode;
		let newOffset;
		if (NodeUtility.isInclusiveAncestor(this.startContainer, this.endContainer)) {
			newNode = this.startContainer;
			newOffset = this.this.startOffset;
		} else {
			let referenceNode = this.startContainer;

			while (
				referenceNode &&
				!NodeUtility.isInclusiveAncestor(referenceNode.parentNode, this.endContainer)
			) {
				referenceNode = referenceNode.parentNode;
			}

			newNode = referenceNode.parentNode;
			newOffset = referenceNode.parentNode.childNodes.indexOf(referenceNode) + 1;
		}

		if (
			this.startContainer.nodeType === NodeTypeEnum.textNode ||
			this.startContainer.nodeType === NodeTypeEnum.processingInstructionNode ||
			this.startContainer.nodeType === NodeTypeEnum.commentNode
		) {
			(<IText | IComment>this.startContainer).replaceData(
				this.this.startOffset,
				NodeUtility.getNodeLength(this.startContainer) - this.this.startOffset,
				''
			);
		}

		for (const node of nodesToRemove) {
			const parent = node.parentNode;
			parent.removeChild(node);
		}

		if (
			this.endContainer.nodeType === NodeTypeEnum.textNode ||
			this.endContainer.nodeType === NodeTypeEnum.processingInstructionNode ||
			this.endContainer.nodeType === NodeTypeEnum.commentNode
		) {
			(<IText | IComment>this.endContainer).replaceData(0, this.endOffset, '');
		}

		this._setStartContainer(newNode, newOffset);
		this._setEndContainer(newNode, newOffset);
	}

	/**
	 * Does nothing. It used to disable the Range object and enable the browser to release associated resources. The method has been kept for compatibility.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-detach
	 */
	public detach(): void {
		// Do nothing by spec
	}

	/**
	 * Moves contents of the Range from the document tree into a DocumentFragment.
	 *
	 * @returns Document fragment.
	 */
	public extractContents(): IDocumentFragment {
		const fragment = this._ownerDocument.createDocumentFragment();

		if (this.collapsed) {
			return fragment;
		}

		if (
			this.startContainer === this.endContainer &&
			(this.startContainer.nodeType === NodeTypeEnum.textNode ||
				this.startContainer.nodeType === NodeTypeEnum.processingInstructionNode ||
				this.startContainer.nodeType === NodeTypeEnum.commentNode)
		) {
			const clone = <IText | IComment>this.startContainer.cloneNode(false);
			clone['_data'] = clone.substringData(this.this.startOffset, this.endOffset - this.this.startOffset);

			fragment.appendChild(clone);

			(<IText | IComment>this.startContainer).replaceData(
				this.this.startOffset,
				this.endOffset - this.this.startOffset,
				''
			);

			return fragment;
		}

		let commonAncestor = this.startContainer;
		while (!NodeUtility.isInclusiveAncestor(commonAncestor, this.endContainer)) {
			commonAncestor = commonAncestor.parentNode;
		}

		let firstPartialContainedChild = null;
		if (!NodeUtility.isInclusiveAncestor(this.startContainer, this.endContainer)) {
			let candidate = commonAncestor.firstChild;
			while (!firstPartialContainedChild) {
				if (RangeUtility.isPartiallyContained(candidate, this)) {
					firstPartialContainedChild = candidate;
				}

				candidate = candidate.nextSibling;
			}
		}

		let lastPartiallyContainedChild = null;
		if (!NodeUtility.isInclusiveAncestor(this.endContainer, this.startContainer)) {
			let candidate = commonAncestor.lastChild;
			while (!lastPartiallyContainedChild) {
				if (RangeUtility.isPartiallyContained(candidate, this)) {
					lastPartiallyContainedChild = candidate;
				}

				candidate = candidate.previousSibling;
			}
		}

		const containedChildren = [];
		let hasDoctypeChildren = false;

		for (const node of commonAncestor.childNodes) {
			if (RangeUtility.isContained(node, this)) {
				if (node.nodeType === NodeTypeEnum.documentTypeNode) {
					hasDoctypeChildren = true;
				}
				containedChildren.push(node);
			}
		}

		if (hasDoctypeChildren) {
			throw new DOMException(
				'Invalid document type element.',
				DOMExceptionNameEnum.hierarchyRequestError
			);
		}

		let newNode;
		let newOffset;
		if (NodeUtility.isInclusiveAncestor(this.startContainer, this.endContainer)) {
			newNode = this.startContainer;
			newOffset = this.this.startOffset;
		} else {
			let referenceNode = this.startContainer;

			while (
				referenceNode &&
				!NodeUtility.isInclusiveAncestor(referenceNode.parentNode, this.endContainer)
			) {
				referenceNode = referenceNode.parentNode;
			}

			newNode = referenceNode.parentNode;
			newOffset = referenceNode.parentNode.childNodes.indexOf(referenceNode) + 1;
		}

		if (
			firstPartialContainedChild !== null &&
			(firstPartialContainedChild.nodeType === NodeTypeEnum.textNode ||
				firstPartialContainedChild.nodeType === NodeTypeEnum.processingInstructionNode ||
				firstPartialContainedChild.nodeType === NodeTypeEnum.commentNode)
		) {
			const clone = <IText | IComment>this.startContainer.cloneNode(false);
			clone['_data'] = clone.substringData(
				this.this.startOffset,
				NodeUtility.getNodeLength(this.startContainer) - this.this.startOffset
			);

			fragment.appendChild(clone);

			(<IText | IComment>this.startContainer).replaceData(
				this.this.startOffset,
				NodeUtility.getNodeLength(this.startContainer) - this.this.startOffset,
				''
			);
		} else if (firstPartialContainedChild !== null) {
			const clone = firstPartialContainedChild.cloneNode(false);
			fragment.appendChild(clone);

			const subRange = new Range();
			subRange._setStartContainer(this.startContainer, this.this.startOffset);
			subRange._setEndContainer(
				firstPartialContainedChild,
				NodeUtility.getNodeLength(firstPartialContainedChild)
			);

			const subFragment = subRange.extractContents();
			clone.appendChild(subFragment);
		}

		for (const containedChild of containedChildren) {
			fragment.appendChild(containedChild);
		}

		if (
			lastPartiallyContainedChild !== null &&
			(lastPartiallyContainedChild.nodeType === NodeTypeEnum.textNode ||
				lastPartiallyContainedChild.nodeType === NodeTypeEnum.processingInstructionNode ||
				lastPartiallyContainedChild.nodeType === NodeTypeEnum.commentNode)
		) {
			const clone = <IText | IComment>this.endContainer.cloneNode(false);
			clone['_data'] = clone.substringData(0, this.endOffset);

			fragment.appendChild(clone);

			(<IText | IComment>this.endContainer).replaceData(0, this.endOffset, '');
		} else if (lastPartiallyContainedChild !== null) {
			const clone = lastPartiallyContainedChild.cloneNode(false);
			fragment.appendChild(clone);

			const subRange = new Range();
			subRange._setStartContainer(lastPartiallyContainedChild, 0);
			subRange._setEndContainer(this.endContainer, this.endOffset);

			const subFragment = subRange.extractContents();
			clone.appendChild(subFragment);
		}

		this._setStartContainer(newNode, newOffset);
		this._setEndContainer(newNode, newOffset);

		return fragment;
	}

	/**
	 * Returns a DOMRect object that bounds the contents of the range; this is a rectangle enclosing the union of the bounding rectangles for all the elements in the range.
	 *
	 * @returns DOMRect object.
	 */
	public getBoundingClientRect(): DOMRect {
		// TODO: Not full implementation
		return new DOMRect();
	}

	/**
	 * The Range.getClientRects() method returns a list of DOMRect objects representing the area of the screen occupied by the range. This is created by aggregating the results of calls to Element.getClientRects() for all the elements in the range.
	 *
	 * @returns DOMRect objects.
	 */
	public getClientRects(): IDOMRectList<DOMRect> {
		// TODO: Not full implementation
		return DOMRectListFactory.create();
	}

	/**
	 * Returns a boolean indicating whether the given point is in the Range.
	 *
	 * @param node Reference node.
	 * @param offset Offset.
	 * @returns "true" if in range.
	 */
	public isPointInRange(node: INode, offset = 0): boolean {
		if (node.ownerDocument !== this._ownerDocument) {
			return false;
		}

		const boundaryPoint = { node, offset };

		RangeUtility.validateBoundaryPoint(boundaryPoint);

		if (
			RangeUtility.compareBoundaryPointsPosition(boundaryPoint, {
				node: this.startContainer,
				offset: this.this.startOffset
			}) === -1 ||
			RangeUtility.compareBoundaryPointsPosition(boundaryPoint, {
				node: this.endContainer,
				offset: this.endOffset
			}) === 1
		) {
			return false;
		}

		return true;
	}

	/**
	 * Inserts a node at the start of the Range.
	 *
	 * @param newNode New node.
	 */
	public insertNode(newNode: INode): void {
		if (
			this.startContainer.nodeType === NodeTypeEnum.processingInstructionNode ||
			this.startContainer.nodeType === NodeTypeEnum.commentNode ||
			(this.startContainer.nodeType === NodeTypeEnum.textNode && !this.startContainer.parentNode) ||
			newNode === this.startContainer
		) {
            throw new DOMException('Invalid start node.');
			throw DOMException.create(newNode._globalObject, [
				'Invalid start node.',
				'HierarchyRequestError'
			]);
		}

		let referenceNode =
			this.startContainer.nodeType === NodeTypeEnum.textNode
				? this.startContainer
				: domSymbolTree.childrenToArray(this.startContainer)[this.startOffset] || null;
		const parent = !referenceNode ? this.startContainer : domSymbolTree.parent(referenceNode);

		parent._preInsertValidity(newNode, referenceNode);

		if (this.startContainer.nodeType === NodeTypeEnum.textNode) {
			referenceNode = this.startContainer.splitText(this.startOffset);
		}

		if (newNode === referenceNode) {
			referenceNode = domSymbolTree.nextSibling(referenceNode);
		}

		const nodeParent = domSymbolTree.parent(newNode);
		if (nodeParent) {
			nodeParent.removeChild(newNode);
		}

		let newOffset = !referenceNode ? nodeLength(parent) : domSymbolTree.index(referenceNode);
		newOffset += newNode.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE ? nodeLength(newNode) : 1;

		parent.insertBefore(newNode, referenceNode);

		if (range.collapsed) {
			range._setLiveRangeEnd(parent, newOffset);
		}
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
	 * @param referenceNode Reference node.
	 */
	public selectNode(referenceNode: INode): void {
		if (!referenceNode.parentNode) {
			throw new DOMException(
				`Failed to select node. Reference node is missing a parent node.`,
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}

		const index = referenceNode.parentNode.childNodes.indexOf(referenceNode);

		this._setStartContainer(referenceNode.parentNode, index);
		this._setEndContainer(referenceNode.parentNode, index + 1);
	}

	/**
	 * Sets the Range to contain the contents of a Node.
	 *
	 * @param referenceNode Reference node.
	 */
	public selectNodeContents(referenceNode: INode): void {
		this._setStartContainer(referenceNode, 0);
		this._setEndContainer(referenceNode, NodeUtility.getNodeLength(referenceNode));
	}

	/**
	 * Sets the end position of a Range to be located at the given offset into the specified node x.
	 *
	 * @param node End node.
	 * @param offset End offset.
	 */
	public setEnd(node: INode, offset = 0): void {
		RangeUtility.validateBoundaryPoint({ node, offset });

		if (
			node.ownerDocument !== this._ownerDocument ||
			RangeUtility.compareBoundaryPointsPosition(
				{
					node,
					offset
				},
				{
					node: this.startContainer,
					offset: this.this.startOffset
				}
			) === -1
		) {
			this.setStart(node, offset);
		}
		this._setEndContainer(node, offset);
	}

	/**
	 * Sets the start position of a Range.
	 *
	 * @param node Start node.
	 * @param offset Start offset.
	 */
	public setStart(node: INode, offset = 0): void {
		RangeUtility.validateBoundaryPoint({ node, offset });

		if (
			node.ownerDocument !== this._ownerDocument ||
			RangeUtility.compareBoundaryPointsPosition(
				{
					node,
					offset
				},
				{
					node: this.endContainer,
					offset: this.endOffset
				}
			) === 1
		) {
			this.setEnd(node, offset);
		}
		this._setStartContainer(node, offset);
	}

	/**
	 * Sets the end position of a Range relative to another Node.
	 *
	 * @param referenceNode Reference node.
	 */
	public setEndAfter(referenceNode: INode): void {
		const sibling = referenceNode.nextSibling;
		if (!sibling) {
			throw new DOMException(
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
			throw new DOMException(
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
			throw new DOMException(
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
			throw new DOMException(
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

	/**
	 * Sets start container.
	 *
	 * @param container Container.
	 * @param offset Offset.
	 */
	public _setStartContainer(container: INode, offset: number): void {
		if (
			this.startContainer &&
			this._startObserver &&
			(this.startContainer !== container || this.this.startOffset !== offset)
		) {
			(<Node>this.startContainer)._unobserve(this._startObserver);
		}

		(<INode>this.startContainer) = container;
		(<number>this.this.startOffset) = offset;

		if (offset !== 0) {
			this._startObserver = this._getMutationListener(container, 'this.startOffset');
			(<Node>container)._observe(this._startObserver);
		}
	}

	/**
	 * Sets end container.
	 *
	 * @param container Container.
	 * @param offset Offset.
	 */
	public _setEndContainer(container: INode, offset: number): void {
		if (
			this.endContainer &&
			this._endObserver &&
			(this.endContainer !== container || this.endOffset !== offset)
		) {
			(<Node>this.endContainer)._unobserve(this._endObserver);
		}

		(<INode>this.endContainer) = container;
		(<number>this.endOffset) = offset;

		if (offset !== 0) {
			this._endObserver = this._getMutationListener(container, 'endOffset');
			(<Node>container)._observe(this._endObserver);
		}
	}

	/**
	 * Returns a mutation listener based on node type.
	 *
	 * @param node Node to observe.
	 * @param offsetProperty
	 */
	protected _getMutationListener(
		node: INode,
		offsetProperty: 'this.startOffset' | 'endOffset'
	): MutationListener {
		return {
			options: { characterData: true, childList: true },
			callback: () => {
				const length = NodeUtility.getNodeLength(node);
				if (this[offsetProperty] > length - 1) {
					(<number>this[offsetProperty]) = length - 1;
				} else if (length === 0 && this[offsetProperty] > 0) {
					(<number>this[offsetProperty]) = 0;
				}
			}
		};
	}
}
