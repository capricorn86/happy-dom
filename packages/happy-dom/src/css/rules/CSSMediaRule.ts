import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import MediaList from '../MediaList.js';
import CSSConditionRule from './CSSConditionRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * CSSMediaRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSMediaRule
 */
export default class CSSMediaRule extends CSSConditionRule {
	public [PropertySymbol.type] = CSSRuleTypeEnum.mediaRule;
	public [PropertySymbol.media] = new MediaList();

	/**
	 * Returns media.
	 *
	 * @returns Media.
	 */
	public get media(): MediaList {
		return this[PropertySymbol.media];
	}

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
		return `@media ${this.conditionText} { ${cssText} }`;
	}

	/**
	 * Returns conditional text.
	 *
	 * @returns Conditional text.
	 */
	public get conditionText(): string {
		return this.media.mediaText;
	}
}
