import Node from '../node/Node.js';

/**
 * DocumentType.
 */
export default class DocumentType extends Node {
	public readonly nodeType = Node.DOCUMENT_TYPE_NODE;
	public name: string = null;
	public publicId = '';
	public systemId = '';

	/**
	 * Node name.
	 *
	 * @returns Node name.
	 */
	public get nodeName(): string {
		return this.name;
	}

	/**
	 * Converts to string.
	 *
	 * @returns String.
	 */
	public toString(): string {
		return '[object DocumentType]';
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): DocumentType {
		const clone = <DocumentType>super.cloneNode(deep);
		clone.name = this.name;
		clone.publicId = this.publicId;
		clone.systemId = this.systemId;
		return clone;
	}
}
