import DOMRect from './DOMRect.js';

/**
 * DOMRectList.
 */
export default class DOMRectList extends Array<DOMRect> {
	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): DOMRect {
		return this[index] ?? null;
	}
}
