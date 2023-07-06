import IElement from '../element/IElement.js';
import INode from '../node/INode.js';

export default interface INonDocumentTypeChildNode extends INode {
	readonly previousElementSibling: IElement;
	readonly nextElementSibling: IElement;
}
