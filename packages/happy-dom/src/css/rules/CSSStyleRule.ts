import CSSRule from '../CSSRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import CSSGroupingRule from './CSSGroupingRule.js';
import StylePropertyMap from '../style-property-map/StylePropertyMap.js';

/**
 * CSSStyleRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule
 */
export default class CSSStyleRule extends CSSGroupingRule {
	public [PropertySymbol.styleMap]: StylePropertyMap | null = null;
	public [PropertySymbol.selectorText] = '';
	public [PropertySymbol.cssText] = '';
	#style: CSSStyleDeclaration | null = null;

	/**
	 * @override
	 */
	public override get type(): CSSRuleTypeEnum {
		return CSSRuleTypeEnum.styleRule;
	}

	/**
	 * @override
	 */
	public override get cssText(): string {
		return `${this[PropertySymbol.selectorText]} { ${this.style.cssText} }`;
	}

	/**
	 * Returns style map.
	 *
	 * @returns Style map.
	 */
	public get styleMap(): StylePropertyMap {
		if (!this[PropertySymbol.styleMap]) {
			this[PropertySymbol.styleMap] = new StylePropertyMap(
				PropertySymbol.illegalConstructor,
				this.style
			);
		}
		return this[PropertySymbol.styleMap];
	}

	/**
	 * Returns selector text.
	 *
	 * @returns Selector text.
	 */
	public get selectorText(): string {
		return this[PropertySymbol.selectorText];
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this.#style) {
			this.#style = new CSSStyleDeclaration(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window]
			);
			(<CSSRule>this.#style.parentRule) = this;
			this.#style.cssText = this[PropertySymbol.cssText];
		}
		return this.#style;
	}
}
