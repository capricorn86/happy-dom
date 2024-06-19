import Element from '../element/Element.js';

export default interface ICachedQuerySelectorItem {
	result: WeakRef<Element | null> | null;
}
