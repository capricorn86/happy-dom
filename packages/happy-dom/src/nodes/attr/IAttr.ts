import IElement from '../element/IElement';
import INode from './../node/INode';

/**
 * Attr.
 */
export default interface IAttr extends INode {
	value: string;
	name: string;
	namespaceURI: string;
	readonly ownerElement: IElement;
	readonly specified: boolean;
	readonly localName: string;
	readonly prefix: string;
}
