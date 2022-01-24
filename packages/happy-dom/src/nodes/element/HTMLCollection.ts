import IHTMLCollection from './IHTMLCollection';
import INode from '../node/INode';

/**
 * Class list.
 */
export default class HTMLCollection extends Array implements IHTMLCollection<INode> {
	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): INode {
		return index >= 0 && this[index] ? this[index] : null;
	}
}
