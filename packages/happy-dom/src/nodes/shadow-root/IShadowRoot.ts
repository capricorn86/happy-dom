import IDocumentFragment from '../document-fragment/IDocumentFragment';
import IElement from '../element/IElement';
import Event from '../../event/Event';

/**
 * ShadowRoot.
 */
export default interface IShadowRoot extends IDocumentFragment {
	mode: string;
	innerHTML: string;
	host: IElement;
	readonly activeElement: IElement | null;

	// Events
	onslotchange: (event: Event) => void | null;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IShadowRoot;
}
