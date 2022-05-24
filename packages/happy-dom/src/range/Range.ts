import INode from '../nodes/node/INode';
import IDocument from '../nodes/document/IDocument';
import IDocumentFragment from '../nodes/document-fragment/IDocumentFragment';

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
	 * Returns string currently being represented by the selection object.
	 */
	public toString(): string {
		return '';
	}
}
