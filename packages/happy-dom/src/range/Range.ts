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
	public readonly startOffset: number = 0;
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
	 * @see https://dom.spec.whatwg.org/#dom-range-collapsed
	 * @returns Collapsed.
	 */
	public get collapsed(): boolean {
		return this.startContainer === this.endContainer && this.startOffset === this.endOffset;
	}

	/**
	 * Returns the deepest Node that contains the startContainer and endContainer nodes.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-commonancestorcontainer
	 * @returns Node.
	 */
	public get commonAncestorContainer(): INode {
		let container = this.startContainer;

		while (container) {
			if (NodeUtility.isInclusiveAncestor(container, this.endContainer)) {
				return container;
			}
			container = container.parentNode;
		}

		return null;
	}

	/**
	 * Returns -1, 0, or 1 depending on whether the referenceNode is before, the same as, or after the Range.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-collapse
	 * @param toStart A boolean value: true collapses the Range to its start, false to its end. If omitted, it defaults to false.
	 */
	public collapse(toStart = false): void {
		if (toStart) {
			this._setEndContainer(this.startContainer, this.startOffset);
		} else {
			this._setStartContainer(this.endContainer, this.endOffset);
		}
	}

	/**
	 * Compares the boundary points of the Range with those of another range.
	 *
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-compareboundarypoints
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
				`The comparison method provided must be one of '${RangeHowEnum.startToStart}', '${RangeHowEnum.startToEnd}', '${RangeHowEnum.endToEnd}' or '${RangeHowEnum.endToStart}'.`,
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
				thisPoint.offset = this.startOffset;
				sourcePoint.node = sourceRange.startContainer;
				sourcePoint.offset = sourceRange.startOffset;
				break;
			case RangeHowEnum.startToEnd:
				thisPoint.node = this.endContainer;
				thisPoint.offset = this.endOffset;
				sourcePoint.node = sourceRange.startContainer;
				sourcePoint.offset = sourceRange.startOffset;
				break;
			case RangeHowEnum.endToEnd:
				thisPoint.node = this.endContainer;
				thisPoint.offset = this.endOffset;
				sourcePoint.node = sourceRange.endContainer;
				sourcePoint.offset = sourceRange.endOffset;
				break;
			case RangeHowEnum.endToStart:
				thisPoint.node = this.startContainer;
				thisPoint.offset = this.startOffset;
				sourcePoint.node = sourceRange.endContainer;
				sourcePoint.offset = sourceRange.endOffset;
				break;
		}

		return RangeUtility.compareBoundaryPointsPosition(thisPoint, sourcePoint);
	}

	/**
	 * Returns -1, 0, or 1 depending on whether the referenceNode is before, the same as, or after the Range.
	 *
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-comparepoint
	 * @param node Reference node.
	 * @param offset Offset.
	 * @returns -1,0, or 1.
	 */
	public comparePoint(node: INode, offset): number {
		if (node.ownerDocument !== this._ownerDocument) {
			throw new DOMException(
				`The two Ranges are not in the same tree.`,
				DOMExceptionNameEnum.wrongDocumentError
			);
		}

		RangeUtility.validateBoundaryPoint({ node, offset });

		const boundaryPoint = { node, offset };

		if (
			RangeUtility.compareBoundaryPointsPosition(boundaryPoint, {
				node: this.startContainer,
				offset: this.startOffset
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
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
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
			clone['_data'] = clone.substringData(this.startOffset, this.endOffset - this.startOffset);
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

		for (const node of commonAncestor.childNodes) {
			if (RangeUtility.isContained(node, this)) {
				if (node.nodeType === NodeTypeEnum.documentTypeNode) {
					throw new DOMException(
						'Invalid document type element.',
						DOMExceptionNameEnum.hierarchyRequestError
					);
				}
				containedChildren.push(node);
			}
		}

		if (
			firstPartialContainedChild !== null &&
			(firstPartialContainedChild.nodeType === NodeTypeEnum.textNode ||
				firstPartialContainedChild.nodeType === NodeTypeEnum.processingInstructionNode ||
				firstPartialContainedChild.nodeType === NodeTypeEnum.commentNode)
		) {
			const clone = (<IText | IComment>this.startContainer).cloneNode(false);
			clone['_data'] = clone.substringData(
				this.startOffset,
				NodeUtility.getNodeLength(this.startContainer) - this.startOffset
			);

			fragment.appendChild(clone);
		} else if (firstPartialContainedChild !== null) {
			const clone = firstPartialContainedChild.cloneNode();
			fragment.appendChild(clone);

			const subRange = new Range();
			subRange._setStartContainer(this.startContainer, this.startOffset);
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
	 * @see https://dom.spec.whatwg.org/#dom-range-clonerange
	 * @returns Range.
	 */
	public cloneRange(): Range {
		const clone = new Range();

		clone._setStartContainer(this.startContainer, this.startOffset);
		clone._setEndContainer(this.endContainer, this.endOffset);

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
	 *
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-deletecontents
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
				this.startOffset,
				this.endOffset - this.startOffset,
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
			newOffset = this.startOffset;
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
				this.startOffset,
				NodeUtility.getNodeLength(this.startContainer) - this.startOffset,
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
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-extractcontents
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
			clone['_data'] = clone.substringData(this.startOffset, this.endOffset - this.startOffset);

			fragment.appendChild(clone);

			(<IText | IComment>this.startContainer).replaceData(
				this.startOffset,
				this.endOffset - this.startOffset,
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

		for (const node of commonAncestor.childNodes) {
			if (RangeUtility.isContained(node, this)) {
				if (node.nodeType === NodeTypeEnum.documentTypeNode) {
					throw new DOMException(
						'Invalid document type element.',
						DOMExceptionNameEnum.hierarchyRequestError
					);
				}
				containedChildren.push(node);
			}
		}

		let newNode;
		let newOffset;
		if (NodeUtility.isInclusiveAncestor(this.startContainer, this.endContainer)) {
			newNode = this.startContainer;
			newOffset = this.startOffset;
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
				this.startOffset,
				NodeUtility.getNodeLength(this.startContainer) - this.startOffset
			);

			fragment.appendChild(clone);

			(<IText | IComment>this.startContainer).replaceData(
				this.startOffset,
				NodeUtility.getNodeLength(this.startContainer) - this.startOffset,
				''
			);
		} else if (firstPartialContainedChild !== null) {
			const clone = firstPartialContainedChild.cloneNode(false);
			fragment.appendChild(clone);

			const subRange = new Range();
			subRange._setStartContainer(this.startContainer, this.startOffset);
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
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-ispointinrange
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
				offset: this.startOffset
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
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
	 *
	 * @see https://dom.spec.whatwg.org/#concept-range-insert
	 * @param newNode New node.
	 */
	public insertNode(newNode: INode): void {
		if (
			this.startContainer.nodeType === NodeTypeEnum.processingInstructionNode ||
			this.startContainer.nodeType === NodeTypeEnum.commentNode ||
			(this.startContainer.nodeType === NodeTypeEnum.textNode && !this.startContainer.parentNode) ||
			newNode === this.startContainer
		) {
			throw new DOMException('Invalid start node.', DOMExceptionNameEnum.hierarchyRequestError);
		}

		let referenceNode =
			this.startContainer.nodeType === NodeTypeEnum.textNode
				? this.startContainer
				: this.startContainer.childNodes[this.startOffset] || null;
		const parent = !referenceNode ? this.startContainer : referenceNode.parentNode;

		if (this.startContainer.nodeType === NodeTypeEnum.textNode) {
			referenceNode = (<IText>this.startContainer).splitText(this.startOffset);
		}

		if (newNode === referenceNode) {
			referenceNode = referenceNode.nextSibling;
		}

		const nodeParent = newNode.parentNode;
		if (nodeParent) {
			nodeParent.removeChild(newNode);
		}

		let newOffset = !referenceNode
			? NodeUtility.getNodeLength(parent)
			: referenceNode.parentNode.childNodes.indexOf(referenceNode);
		newOffset +=
			newNode.nodeType === NodeTypeEnum.documentFragmentNode
				? NodeUtility.getNodeLength(newNode)
				: 1;

		parent.insertBefore(newNode, referenceNode);

		if (this.collapsed) {
			this._setEndContainer(parent, newOffset);
		}
	}

	/**
	 * Returns a boolean indicating whether the given Node intersects the Range.
	 *
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-intersectsnode
	 * @param node Reference node.
	 * @returns "true" if it intersects.
	 */
	public intersectsNode(node: INode): boolean {
		if (node.ownerDocument !== this._ownerDocument) {
			return false;
		}

		const parent = node.parentNode;

		if (!parent) {
			return true;
		}

		const offset = parent.childNodes.indexOf(node);

		return (
			RangeUtility.compareBoundaryPointsPosition(
				{ node: parent, offset },
				{ node: this.endContainer, offset: this.endOffset }
			) === -1 &&
			RangeUtility.compareBoundaryPointsPosition(
				{ node: parent, offset: offset + 1 },
				{ node: this.startContainer, offset: this.startOffset }
			) === 1
		);
	}

	/**
	 * Sets the Range to contain the Node and its contents.
	 *
	 * @see https://dom.spec.whatwg.org/#concept-range-select
	 * @param node Reference node.
	 */
	public selectNode(node: INode): void {
		if (!node.parentNode) {
			throw new DOMException(
				`The given Node has no parent.`,
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}

		const index = node.parentNode.childNodes.indexOf(node);

		this._setStartContainer(node.parentNode, index);
		this._setEndContainer(node.parentNode, index + 1);
	}

	/**
	 * Sets the Range to contain the contents of a Node.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-selectnodecontents
	 * @param node Reference node.
	 */
	public selectNodeContents(node: INode): void {
		if (node.nodeType === NodeTypeEnum.documentTypeNode) {
			throw new DOMException(
				"DocumentType Node can't be used as boundary point.",
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}

		this._setStartContainer(node, 0);
		this._setEndContainer(node, NodeUtility.getNodeLength(node));
	}

	/**
	 * Sets the end position of a Range to be located at the given offset into the specified node x.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-setend
	 * @param node End node.
	 * @param offset End offset.
	 */
	public setEnd(node: INode, offset = 0): void {
		RangeUtility.validateBoundaryPoint({ node, offset });

		const boundaryPoint = { node, offset };

		if (
			node.ownerDocument !== this._ownerDocument ||
			RangeUtility.compareBoundaryPointsPosition(boundaryPoint, {
				node: this.startContainer,
				offset: this.startOffset
			}) === -1
		) {
			this._setStartContainer(node, offset);
		}

		this._setEndContainer(node, offset);
	}

	/**
	 * Sets the start position of a Range.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-setstart
	 * @param node Start node.
	 * @param offset Start offset.
	 */
	public setStart(node: INode, offset = 0): void {
		RangeUtility.validateBoundaryPoint({ node, offset });

		const boundaryPoint = { node, offset };

		if (
			node.ownerDocument !== this._ownerDocument ||
			RangeUtility.compareBoundaryPointsPosition(boundaryPoint, {
				node: this.endContainer,
				offset: this.endOffset
			}) === 1
		) {
			this._setEndContainer(node, offset);
		}

		this._setStartContainer(node, offset);
	}

	/**
	 * Sets the end position of a Range relative to another Node.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-setendafter
	 * @param node Reference node.
	 */
	public setEndAfter(node: INode): void {
		if (!node.parentNode) {
			throw new DOMException(
				'The given Node has no parent.',
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}
		this.setEnd(node.parentNode, node.parentNode.childNodes.indexOf(node) + 1);
	}

	/**
	 * Sets the end position of a Range relative to another Node.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-setendbefore
	 * @param node Reference node.
	 */
	public setEndBefore(node: INode): void {
		if (!node.parentNode) {
			throw new DOMException(
				'The given Node has no parent.',
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}
		this.setEnd(node.parentNode, node.parentNode.childNodes.indexOf(node));
	}

	/**
	 * Sets the start position of a Range relative to a Node.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-setstartafter
	 * @param node Reference node.
	 */
	public setStartAfter(node: INode): void {
		if (!node.parentNode) {
			throw new DOMException(
				'The given Node has no parent.',
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}
		this.setStart(node.parentNode, node.parentNode.childNodes.indexOf(node) + 1);
	}

	/**
	 * Sets the start position of a Range relative to another Node.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-setstartbefore
	 * @param node Reference node.
	 */
	public setStartBefore(node: INode): void {
		if (!node.parentNode) {
			throw new DOMException(
				'The given Node has no parent.',
				DOMExceptionNameEnum.invalidNodeTypeError
			);
		}
		this.setStart(node.parentNode, node.parentNode.childNodes.indexOf(node));
	}

	/**
	 * Moves content of the Range into a new node, placing the new node at the start of the specified range.
	 *
	 * Based on logic from:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-surroundcontents
	 * @param newParent New parent.
	 */
	public surroundContents(newParent: INode): void {
		let node = this.commonAncestorContainer;
		const endNode = NodeUtility.nextDecendantNode(node);
		while (node !== endNode) {
			if (
				node.nodeType !== NodeTypeEnum.textNode &&
				RangeUtility.isPartiallyContained(node, this)
			) {
				throw new DOMException(
					'The Range has partially contains a non-Text node.',
					DOMExceptionNameEnum.invalidStateError
				);
			}

			node = NodeUtility.following(node);
		}

		if (
			newParent.nodeType === NodeTypeEnum.documentNode ||
			newParent.nodeType === NodeTypeEnum.documentTypeNode ||
			newParent.nodeType === NodeTypeEnum.documentFragmentNode
		) {
			throw new DOMException('Invalid element type.', DOMExceptionNameEnum.invalidNodeTypeError);
		}

		const fragment = this.extractContents();

		while (newParent.firstChild) {
			newParent.removeChild(newParent.firstChild);
		}

		this.insertNode(newParent);

		newParent.appendChild(fragment);

		this.selectNode(newParent);
	}

	/**
	 * Returns the text of the Range.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-range-stringifier
	 */
	public toString(): string {
		let string = '';

		if (
			this.startContainer === this.endContainer &&
			this.startContainer.nodeType === NodeTypeEnum.textNode
		) {
			return (<IText>this.startContainer).data.slice(this.startOffset, this.endOffset);
		}

		if (this.startContainer.nodeType === NodeTypeEnum.textNode) {
			string += (<IText>this.startContainer).data.slice(this.startOffset);
		}

		const endNode = NodeUtility.nextDecendantNode(this.endContainer);
		let currentNode = this.startContainer;

		while (currentNode && currentNode !== endNode) {
			if (
				currentNode.nodeType === NodeTypeEnum.textNode &&
				RangeUtility.isContained(currentNode, this)
			) {
				string += (<IText>currentNode).data;
			}

			currentNode = NodeUtility.following(currentNode);
		}

		if (this.endContainer.nodeType === NodeTypeEnum.textNode) {
			string += (<IText>this.endContainer).data.slice(0, this.endOffset);
		}

		return string;
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
			(this.startContainer !== container || this.startOffset !== offset)
		) {
			(<Node>this.startContainer)._unobserve(this._startObserver);
		}

		(<INode>this.startContainer) = container;
		(<number>this.startOffset) = offset;

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
