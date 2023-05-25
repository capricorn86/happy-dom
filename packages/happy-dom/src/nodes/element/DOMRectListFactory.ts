import DOMRect from './DOMRect.js';
import IDOMRectList from './IDOMRectList.js';

/**
 * DOM rect list factory.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects
 */
export default class DOMRectListFactory {
	/**
	 * Creates an HTMLCollection.
	 *
	 * @param list Nodes.
	 * @returns HTMLCollection.
	 */
	public static create(list?: DOMRect[]): IDOMRectList<DOMRect> {
		list = list ? list.slice() : [];
		Object.defineProperty(list, 'item', {
			value: this.getItem.bind(null, list)
		});
		return <IDOMRectList<DOMRect>>list;
	}

	/**
	 * Returns node by index.
	 *
	 * @param list
	 * @param index Index.
	 */
	private static getItem(list: DOMRect[], index: number): DOMRect {
		return list[index] || null;
	}
}
