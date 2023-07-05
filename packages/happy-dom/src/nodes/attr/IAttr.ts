import IElement from '../element/IElement.js';
import INode from './../node/INode.js';

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
