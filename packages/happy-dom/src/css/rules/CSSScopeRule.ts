import * as PropertySymbol from '../../PropertySymbol.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import CSSGroupingRule from './CSSGroupingRule.js';

/**
 * CSSScopeRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSScopeRule
 */
export default class CSSScopeRule extends CSSGroupingRule {
	public [PropertySymbol.start] = '';
	public [PropertySymbol.end] = '';
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
		return `@${this[PropertySymbol.rulePrefix]}scope${
			this[PropertySymbol.start] ? ` (${this[PropertySymbol.start]})` : ''
		}${this[PropertySymbol.end] ? ` to (${this[PropertySymbol.end]})` : ''} {${cssText}}`;
	}

	/**
	 * Returns start.
	 *
	 * @returns Start.
	 */
	public get start(): string {
		return this[PropertySymbol.start];
	}

	/**
	 * Returns end.
	 *
	 * @returns End.
	 */
	public get end(): string {
		return this[PropertySymbol.end];
	}
}
