import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import IComment from '../nodes/comment/IComment';
import IDocumentFragment from '../nodes/document-documentFragment/IDocumentFragment';
import INode from '../nodes/node/INode';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum';
import NodeUtility from '../nodes/node/NodeUtility';
import IText from '../nodes/text/IText';
import Range from './Range';

type BoundaryPoint = { node: INode; offset: number };

/**
 * Range utility.
 */
export default class RangeUtility {
	/**
	 * Compares boundary points.
	 *
	 * @see https://dom.spec.whatwg.org/#concept-range-bp-after
	 * @param pointA Point A.
	 * @param pointB Point B.
	 * @returns A number, -1, 0, or 1, indicating whether the corresponding boundary-point of the Range is respectively before, equal to, or after the corresponding boundary-point of sourceRange.
	 */
	public static compareBoundaryPointsPosition(
		pointA: BoundaryPoint,
		pointB: BoundaryPoint
	): number {
		if (pointA.node === pointB.node) {
			if (pointA.offset === pointB.offset) {
				return 0;
			} else if (pointA.offset < pointB.offset) {
				return -1;
			}

			return 1;
		}

		if (NodeUtility.isFollowing(pointA.node, pointB.node)) {
			return this.compareBoundaryPointsPosition(pointB, pointA) === -1 ? 1 : -1;
		}

		if (NodeUtility.isInclusiveAncestor(pointA.node, pointB.node)) {
			let child = pointB.node;

			while (child.parentNode !== pointA.node) {
				child = child.parentNode;
			}

			const index = child.parentNode.childNodes.indexOf(child);

			if (index < pointA.offset) {
				return 1;
			}
		}

		return -1;
	}

	/** ..............................
	 * Returns a DocumentFragment copying the objects of type Node included in the Range.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/range/Range-impl.js#L306
	 *
	 * @see https://dom.spec.whatwg.org/#concept-range-clone
	 * @param range Range.
	 * @returns Document documentFragment.
	 */
	/**
	 *
	 * @param range
	 */
	public static cloneRangeContent(range: Range): IDocumentFragment {
		const documentFragment = range._ownerDocument.createDocumentFragment();

		if (range.collapsed) {
			return documentFragment;
		}

		if (
			range.startContainer === range.endContainer &&
			(range.startContainer.nodeType === NodeTypeEnum.textNode ||
				range.startContainer.nodeType === NodeTypeEnum.processingInstructionNode ||
				range.startContainer.nodeType === NodeTypeEnum.commentNode)
		) {
			const clone = (<IText | IComment>range.startContainer).cloneNode(false);
			clone['_data'] = clone.substringData(range.startOffset, range.endOffset - range.startOffset);
			documentFragment.appendChild(clone);
			return documentFragment;
		}

		let commonAncestor = range.startContainer;
		while (!NodeUtility.isInclusiveAncestor(commonAncestor, range.endContainer)) {
			commonAncestor = commonAncestor.parentNode;
		}

		let firstPartialContainedChild = null;
		if (!NodeUtility.isInclusiveAncestor(range.startContainer, range.endContainer)) {
			let candidate = commonAncestor.firstChild;
			while (!firstPartialContainedChild) {
				if (isPartiallyContained(candidate, range)) {
					firstPartialContainedChild = candidate;
				}

				candidate = candidate.nextSibling;
			}
		}

		let lastPartiallyContainedChild = null;
		if (!NodeUtility.isInclusiveAncestor(range.endContainer, range.startContainer)) {
			let candidate = commonAncestor.lastChild;
			while (!lastPartiallyContainedChild) {
				if (isPartiallyContained(candidate, range)) {
					lastPartiallyContainedChild = candidate;
				}

				candidate = candidate.previousSibling;
			}
		}

		const containedChildren = [];
		let hasDoctypeChildren = false;

		for (const node of commonAncestor.childNodes) {
			if (this._isContained(node, range)) {
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
			const clone = (<IText | IComment>range.startContainer).cloneNode(false);
			clone['_data'] = clone.substringData(
				range.startOffset,
				range.startContainer.childNodes.length - range.startOffset
			);

			documentFragment.appendChild(clone);
		} else if (firstPartialContainedChild !== null) {
			const cloned = clone(firstPartialContainedChild);
			documentFragment.appendChild(cloned);

			const subrange = Range.createImpl(_globalObject, [], {
				start: { node: range.startContainer, offset: range.startOffset },
				end: { node: firstPartialContainedChild, offset: nodeLength(firstPartialContainedChild) }
			});

			const subdocumentFragment = cloneRange(subrange);
			cloned.appendChild(subdocumentFragment);
		}

		for (const containedChild of containedChildren) {
			const cloned = clone(containedChild, undefined, true);
			documentFragment.appendChild(cloned);
		}

		if (
			lastPartiallyContainedChild !== null &&
			(lastPartiallyContainedChild.nodeType === NodeTypeEnum.textNode ||
				lastPartiallyContainedChild.nodeType === NodeTypeEnum.processingInstructionNode ||
				lastPartiallyContainedChild.nodeType === NodeTypeEnum.commentNode)
		) {
			const cloned = clone(range.endContainer);
			cloned._data = cloned.substringData(0, range.endOffset);

			documentFragment.appendChild(cloned);
		} else if (lastPartiallyContainedChild !== null) {
			const cloned = clone(lastPartiallyContainedChild);
			documentFragment.appendChild(cloned);

			const subrange = Range.createImpl(_globalObject, [], {
				start: { node: lastPartiallyContainedChild, offset: 0 },
				end: { node: range.endContainer, offset: range.endOffset }
			});

			const subdocumentFragment = cloneRange(subrange);
			cloned.appendChild(subdocumentFragment);
		}

		return documentFragment;
	}

	/**
	 * Returns "true" if contained.
	 *
	 * @param node Node.
	 * @param range Range.
	 * @returns "true" if contained.
	 */
	private static _isContained(node: INode, range: Range): boolean {
		return (
			this.compareBoundaryPointsPosition(
				{ node, offset: 0 },
				{ node: range.startContainer, offset: range.startOffset }
			) === 1 &&
			this.compareBoundaryPointsPosition(
				{ node, offset: node.childNodes.length },
				{ node: range.endContainer, offset: range.endOffset }
			) === -1
		);
	}
}
