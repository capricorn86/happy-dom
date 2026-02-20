import type Element from '../element/Element.js';
import type ICachedResult from './ICachedResult.js';

export default interface ICachedQuerySelectorResult extends ICachedResult {
	result: { element: WeakRef<Element> | null } | null;
}
