import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import CSSConditionRule from './CSSConditionRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * CSSContainerRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSContainerRule
 */
export default class CSSContainerRule extends CSSConditionRule {
	public [PropertySymbol.type] = CSSRuleTypeEnum.containerRule;

	/**
	 * Returns css text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		let cssText = '';
		for (const cssRule of this[PropertySymbol.cssRules]) {
			cssText += cssRule.cssText;
		}
		return `@container ${this.conditionText} { ${cssText} }`;
	}
}
