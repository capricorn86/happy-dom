import INode from '../nodes/node/INode';

/**
 * MutationRecord is a model for a mutation.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
 */
export default class MutationRecord {
	public type: string = null;
	public target: INode = null;
	public addedNodes: INode[] = [];
	public removedNodes: INode[] = [];
	public previousSibling: INode = null;
	public nextSibling: INode = null;
	public attributeName: string = null;
	public attributeNamespace: string = null;
	public oldValue: string = null;
}
