import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import CSSConditionRule from './CSSConditionRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * CSSRule interface.
 */
export default class CSSSupportsRule extends CSSConditionRule {
	public [PropertySymbol.type] = CSSRuleTypeEnum.supportsRule;
	public [PropertySymbol.rulePrefix] = '';

	/**
	 * @override
	 */
	public override get type(): CSSRuleTypeEnum {
		return CSSRuleTypeEnum.supportsRule;
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
		return `@${this[PropertySymbol.rulePrefix]}supports ${this.conditionText} {${cssText}}`;
	}
}
