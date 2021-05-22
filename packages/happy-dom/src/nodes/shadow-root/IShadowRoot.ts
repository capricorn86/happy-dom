import IDocumentFragment from '../document-fragment/IDocumentFragment';
import IElement from '../element/IElement';

/**
 * ShadowRoot.
 */
export default interface IShadowRoot extends IDocumentFragment {
	mode: string;
	innerHTML: string;
	host: IElement;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep: boolean): IShadowRoot;
}
