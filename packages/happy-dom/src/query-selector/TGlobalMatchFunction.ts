import type DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import type Document from '../nodes/document/Document.js';
import type Element from '../nodes/element/Element.js';
import type ISelectorMatch from './ISelectorMatch.js';

type TGlobalMatchFunction = (
	element: Element,
	selector: string,
	options?: { scope?: Element | Document | DocumentFragment | null; ignoreErrors?: boolean }
) => ISelectorMatch | null;

export type { TGlobalMatchFunction };
