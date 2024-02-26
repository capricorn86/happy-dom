import IEventTarget from '../../event/IEventTarget.js';
import IDocument from '../document/IDocument.js';
import IElement from '../element/IElement.js';
import INodeList from './INodeList.js';
import NodeTypeEnum from './NodeTypeEnum.js';
import NodeDocumentPositionEnum from './NodeDocumentPositionEnum.js';

export default interface INode extends IEventTarget {
	readonly ELEMENT_NODE: NodeTypeEnum;
	readonly ATTRIBUTE_NODE: NodeTypeEnum;
	readonly TEXT_NODE: NodeTypeEnum;
	readonly CDATA_SECTION_NODE: NodeTypeEnum;
	readonly COMMENT_NODE: NodeTypeEnum;
	readonly DOCUMENT_NODE: NodeTypeEnum;
	readonly DOCUMENT_TYPE_NODE: NodeTypeEnum;
	readonly DOCUMENT_FRAGMENT_NODE: NodeTypeEnum;
	readonly PROCESSING_INSTRUCTION_NODE: NodeTypeEnum;
	readonly DOCUMENT_POSITION_DISCONNECTED: NodeDocumentPositionEnum;
	readonly DOCUMENT_POSITION_PRECEDING: NodeDocumentPositionEnum;
	readonly DOCUMENT_POSITION_FOLLOWING: NodeDocumentPositionEnum;
	readonly DOCUMENT_POSITION_CONTAINS: NodeDocumentPositionEnum;
	readonly DOCUMENT_POSITION_CONTAINED_BY: NodeDocumentPositionEnum;
	readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: NodeDocumentPositionEnum;
	readonly ownerDocument: IDocument;
	readonly parentNode: INode | null;
	readonly parentElement: IElement | null;
	readonly nodeType: number;
	readonly childNodes: INodeList<INode>;
	readonly isConnected: boolean;
	readonly nodeName: string;
	readonly previousSibling: INode;
	readonly nextSibling: INode;
	readonly firstChild: INode;
	readonly lastChild: INode;
	readonly baseURI: string;
	nodeValue: string;
	textContent: string;
	connectedCallback?(): void;
	disconnectedCallback?(): void;
	getRootNode(options?: { composed: boolean }): INode;
	cloneNode(deep?: boolean): INode;
	appendChild(node: INode): INode;
	removeChild(node: INode): INode;
	hasChildNodes(): boolean;
	contains(otherNode: INode | null): boolean;
	insertBefore(newNode: INode, referenceNode?: INode | null): INode;
	replaceChild(newChild: INode, oldChild: INode): INode;
	toString(): string;
	compareDocumentPosition(otherNode: INode): number;
	normalize(): void;

	/**
	 * Determines whether the given node is equal to the current node.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/isSameNode
	 * @param node Node to check.
	 * @returns True if the given node is equal to the current node, otherwise false.
	 */
	isSameNode(node: INode): boolean;

	/**
	 * Compares two nodes.
	 *
	 * @param node Node to compare.
	 * @returns "true" if nodes are equal.
	 */
	isEqualNode(node: INode): boolean;
}
