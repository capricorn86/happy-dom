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
	public [PropertySymbol.rulePrefix] = '';

	/**
	 * @override
	 */
	public override get type(): CSSRuleTypeEnum {
		return CSSRuleTypeEnum.containerRule;
	}

	/**
	 * @override
	 */
	public override get cssText(): string {
		let cssText = '';
		for (const cssRule of this[PropertySymbol.cssRules]) {
			cssText += '\n  ' + cssRule.cssText;
		}
		cssText += '\n';
		return `@${this[PropertySymbol.rulePrefix]}container ${
			this[PropertySymbol.conditionText]
		} {${cssText}}`;
	}
}
