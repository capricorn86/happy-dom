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
	public [PropertySymbol.media] = new MediaList(PropertySymbol.illegalConstructor, this);

	/**
	 * @override
	 */
	public override get type(): CSSRuleTypeEnum {
		return CSSRuleTypeEnum.mediaRule;
	}

	/**
	 * @override
	 */
	public override get cssText(): string {
		let cssText = '';
		for (const cssRule of this[PropertySymbol.cssRules]) {
			cssText += '\n  ' + cssRule.cssText;
		}
		cssText += cssText ? '\n' : '  ';
		return `@media ${this.conditionText} {${cssText}}`;
	}

	/**
	 * Returns media.
	 *
	 * @returns Media.
	 */
	public get media(): MediaList {
		return this[PropertySymbol.media];
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
