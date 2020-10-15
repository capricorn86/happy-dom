import INode from '../node/INode';

/**
 * DocumentType.
 */
export default interface IDocumentType extends INode {
	name: string;
	publicId: string;
	systemId: string;
}
