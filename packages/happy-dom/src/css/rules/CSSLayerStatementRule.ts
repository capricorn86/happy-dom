import * as PropertySymbol from '../../PropertySymbol.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import CSSRule from '../CSSRule.js';

/**
 * CSSLayerStatementRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSLayerStatementRule
 */
export default class CSSLayerStatementRule extends CSSRule {
	public [PropertySymbol.nameList]: string[] = [];

	/**
	 * @override
	 */
	public override get type(): CSSRuleTypeEnum {
		return CSSRuleTypeEnum.containerRule;
	}

	/**
	 * Returns name list.
	 *
	 * @returns Names of the layers the rule declares, in the order declared.
	 */
	public get nameList(): readonly string[] {
		return Object.freeze(this[PropertySymbol.nameList].slice());
	}

	/**
	 * @override
	 */
	public override get cssText(): string {
		return `@layer ${this[PropertySymbol.nameList].join(', ')};`;
	}
}
