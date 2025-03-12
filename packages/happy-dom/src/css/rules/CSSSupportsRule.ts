import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import CSSConditionRule from './CSSConditionRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * CSSRule interface.
 */
export default class CSSSupportsRule extends CSSConditionRule {
	public [PropertySymbol.type] = CSSRuleTypeEnum.supportsRule;

	/**
	 * Returns css text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		let cssText = '';
		for (const cssRule of this.cssRules) {
			cssText += cssRule.cssText;
		}
		return `@supports ${this.conditionText} { ${cssText} }`;
	}
}
