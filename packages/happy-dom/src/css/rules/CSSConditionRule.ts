import * as PropertySymbol from '../../PropertySymbol.js';
import CSSGroupingRule from './CSSGroupingRule.js';

/**
 * CSSConditionRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSConditionRule
 */
export default abstract class CSSConditionRule extends CSSGroupingRule {
	public [PropertySymbol.conditionText] = '';

	/**
	 * Returns condition text.
	 *
	 * @returns Condition text.
	 */
	public get conditionText(): string {
		return this[PropertySymbol.conditionText];
	}
}
