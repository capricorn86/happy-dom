import type DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import type Document from '../nodes/document/Document.js';
import type Element from '../nodes/element/Element.js';
import type ISelectorMatch from './ISelectorMatch.js';
import type ICachedResult from '../nodes/node/ICachedResult.js';
import type SelectorItem from './SelectorItem.js';

type TGlobalMatchFunction = (
	element: Element,
	selector: string | SelectorItem[][],
	options?: {
		scope?: Element | Document | DocumentFragment | null;
		ignoreErrors?: boolean;
		cachedItem?: ICachedResult;
	}
) => ISelectorMatch | null;

export type { TGlobalMatchFunction };
