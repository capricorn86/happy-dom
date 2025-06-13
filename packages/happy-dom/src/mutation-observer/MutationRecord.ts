import Node from '../nodes/node/Node.js';
import MutationTypeEnum from './MutationTypeEnum.js';

/**
 * MutationRecord is a model for a mutation.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
 */
export default class MutationRecord {
	public type: string;
	public target: Node;
	public addedNodes: Node[];
	public removedNodes: Node[];
	public previousSibling: Node | null;
	public nextSibling: Node | null;
	public attributeName: string | null;
	public attributeNamespace: string | null;
	public oldValue: string | null;

	/**
	 * Constructor.
	 *
	 * @param init Options to initialize the mutation record.
	 * @param init.type Type.
	 * @param init.target Target node.
	 * @param init.addedNodes Nodes added.
	 * @param init.removedNodes Nodes removed.
	 * @param init.previousSibling Previous sibling node.
	 * @param init.nextSibling Next sibling node.
	 * @param init.attributeName Name of the attribute.
	 * @param init.attributeNamespace Namespace of the attribute.
	 * @param init.oldValue Previous value of the attribute.
	 */
	constructor(init: {
		type: MutationTypeEnum;
		target: Node;
		addedNodes?: Node[];
		removedNodes?: Node[];
		previousSibling?: Node | null;
		nextSibling?: Node | null;
		attributeName?: string | null;
		attributeNamespace?: string | null;
		oldValue?: string | null;
	}) {
		this.type = init.type;
		this.target = init.target;
		this.addedNodes = init.addedNodes || [];
		this.removedNodes = init.removedNodes || [];
		this.previousSibling = init.previousSibling || null;
		this.nextSibling = init.nextSibling || null;
		this.attributeName = init.attributeName || null;
		this.attributeNamespace = init.attributeNamespace || null;
		this.oldValue = init.oldValue || null;
	}
}
