import IMutationListener from '../../mutation-observer/IMutationListener.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Document from '../document/Document.js';
import Element from './Element.js';

export default interface IHTMLCollectionObservedNode {
	node: Element | DocumentFragment | Document;
	filter: (item: Element) => boolean | null;
	mutationListener: IMutationListener;
}
