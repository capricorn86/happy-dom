import DOMRect from './DOMRect.js';

/**
 * DOM Rect List.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMRectList
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
