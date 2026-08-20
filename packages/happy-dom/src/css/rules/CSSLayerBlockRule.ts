import * as PropertySymbol from '../../PropertySymbol.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import CSSGroupingRule from './CSSGroupingRule.js';

/**
 * CSSLayerBlockRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSLayerBlockRule
 */
export default class CSSLayerBlockRule extends CSSGroupingRule {
	public [PropertySymbol.name] = '';

	/**
	 * @override
	 */
	public override get type(): CSSRuleTypeEnum {
		return CSSRuleTypeEnum.containerRule;
	}

	/**
	 * Returns name.
	 *
	 * @returns Name. An anonymous layer has an empty name.
	 */
	public get name(): string {
		return this[PropertySymbol.name];
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
		return `@layer${this[PropertySymbol.name] ? ` ${this[PropertySymbol.name]}` : ''} {${cssText}}`;
	}
}
