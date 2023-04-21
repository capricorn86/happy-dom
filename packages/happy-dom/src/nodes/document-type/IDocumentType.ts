import INode from '../node/INode';

/**
 * DocumentType.
 */
export default interface IDocumentType extends INode {
	name: string;
	publicId: string;
	systemId: string;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IDocumentType;
}
