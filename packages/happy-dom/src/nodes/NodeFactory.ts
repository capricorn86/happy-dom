import Document from '../nodes/document/Document.js';

/**
 * Node factory used for setting the owner document to nodes.
 */
export default class NodeFactory {
	public static ownerDocuments: Document[] = [];

	/**
	 * Creates a node instance with the given owner document.
	 *
	 * @param ownerDocument Owner document.
	 * @param nodeClass Node class.
	 * @param [args] Node arguments.
	 * @returns Node instance.
	 */
	public static createNode<T>(
		ownerDocument: Document,
		nodeClass: new (...args) => T,
		...args: any[]
	): T {
		this.ownerDocuments.push(ownerDocument);
		return new nodeClass(...args);
	}

	/**
	 * Pulls an owner document from the queue.
	 *
	 * @returns Document.
	 */
	public static pullOwnerDocument(): Document {
		return this.ownerDocuments.pop();
	}
}
