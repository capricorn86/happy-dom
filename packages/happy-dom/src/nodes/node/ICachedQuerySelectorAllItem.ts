import Element from '../element/Element.js';
import INodeList from './INodeList.js';

export default interface ICachedQuerySelectorAllItem {
	result: WeakRef<INodeList<Element>> | null;
}
