import IElement from '../element/IElement';
import IParentNode from '../parent-node/IParentNode';

/**
 * ShadowRoot.
 */
export default interface IShadowRoot extends IParentNode {
	mode: string;
	innerHTML: string;
	host: IElement;
}
