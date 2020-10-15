import IElement from '../element/IElement';
import INode from '../node/INode';

export default interface INonDocumentTypeChildNode extends INode {
	readonly previousElementSibling: IElement;
	readonly nextElementSibling: IElement;
}
