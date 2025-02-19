import CSSRule from '../CSSRule.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';

/**
 * CSSRule interface.
 */
export default class CSSSupportsRule extends CSSRule {
	public readonly type = CSSRuleTypeEnum.supportsRule;
	public readonly cssRules: CSSRule[] = [];
	public readonly conditionText = '';

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
