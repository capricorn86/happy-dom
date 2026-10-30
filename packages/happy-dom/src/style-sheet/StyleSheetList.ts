import type CSSStyleSheet from '../css/CSSStyleSheet.js';

/**
 * StyleSheetList.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/StyleSheetList
 */
export default class StyleSheetList extends Array<CSSStyleSheet> {
	/**
	 * Constructor.
	 */
	constructor() {
		super(0);
	}

	/**
	 * @param index
	 */
	public item(index: number): CSSStyleSheet | null {
		return this[index] || null;
	}
}
