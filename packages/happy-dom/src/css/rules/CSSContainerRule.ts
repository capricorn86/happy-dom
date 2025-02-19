import CSSRule from '../CSSRule.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';

/**
 * CSSRule interface.
 */
export default class CSSContainerRule extends CSSRule {
	public readonly type = CSSRuleTypeEnum.containerRule;
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
		return `@container ${this.conditionText} { ${cssText} }`;
	}
}
