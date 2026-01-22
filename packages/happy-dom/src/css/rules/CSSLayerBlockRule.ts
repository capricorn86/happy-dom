import * as PropertySymbol from '../../PropertySymbol.js';
import CSSGroupingRule from './CSSGroupingRule.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';

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
		return CSSRuleTypeEnum.layerBlockRule;
	}

	/**
	 * @override
	 */
	public override get cssText(): string {
		let cssText = '';
		for (const cssRule of this[PropertySymbol.cssRules]) {
			cssText += '\n  ' + cssRule.cssText;
		}
		cssText += cssText ? '\n' : '';
		const name = this[PropertySymbol.name];
		return `@layer${name ? ` ${name}` : ''} {${cssText}}`;
	}

	/**
	 * Returns the name of the layer.
	 *
	 * @returns Layer name.
	 */
	public get name(): string {
		return this[PropertySymbol.name];
	}
}
