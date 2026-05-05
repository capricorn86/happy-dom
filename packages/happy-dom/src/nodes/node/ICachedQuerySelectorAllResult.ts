import type Element from '../element/Element.js';
import type ICachedResult from './ICachedResult.js';
import type NodeList from './NodeList.js';

export default interface ICachedQuerySelectorAllResult extends ICachedResult {
	result: WeakRef<NodeList<Element>> | null;
}
