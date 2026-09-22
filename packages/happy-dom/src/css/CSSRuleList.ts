import type CSSRule from './CSSRule.js';

/**
 * CSSRuleList.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/CSSRuleList
 */
export default class CSSRuleList extends Array<CSSRule> {
	/**
	 * Constructor.
	 */
	constructor() {
		super(0);
	}

	/**
	 * @param index
	 */
	public item(index: number): CSSRule | null {
		return this[index] || null;
	}
}
