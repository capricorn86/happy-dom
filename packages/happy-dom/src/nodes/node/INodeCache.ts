import type ICachedQuerySelectorAllResult from './ICachedQuerySelectorAllResult.js';
import type ICachedQuerySelectorResult from './ICachedQuerySelectorResult.js';
import type ICachedMatchesResult from './ICachedMatchesResult.js';
import type ICachedElementsByTagNameResult from './ICachedElementsByTagNameResult.js';
import type ICachedElementByTagNameResult from './ICachedElementByTagNameResult.js';
import type ICachedElementByIdResult from './ICachedElementByIdResult.js';
import type ICachedComputedStyleResult from './ICachedComputedStyleResult.js';

export default interface INodeCache {
	querySelector: Map<string, ICachedQuerySelectorResult>;
	querySelectorAll: Map<string, ICachedQuerySelectorAllResult>;
	matches: Map<string, ICachedMatchesResult>;
	elementsByTagName: Map<string, ICachedElementsByTagNameResult>;
	elementsByTagNameNS: Map<string, ICachedElementsByTagNameResult>;
	elementByTagName: Map<string, ICachedElementByTagNameResult>;
	elementById: Map<string, ICachedElementByIdResult>;
	computedStyle: ICachedComputedStyleResult | null;
}
