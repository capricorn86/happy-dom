import CSSRule from '../CSSRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';

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
		return CSSRuleTypeEnum.layerStatementRule;
	}

	/**
	 * @override
	 */
	public override get cssText(): string {
		return `@layer ${this[PropertySymbol.nameList].join(', ')};`;
	}

	/**
	 * Returns the list of layer names.
	 *
	 * @returns Layer name list.
	 */
	public get nameList(): string[] {
		return this[PropertySymbol.nameList];
	}
}
