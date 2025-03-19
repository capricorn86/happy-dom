import CSSRule from '../CSSRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';

/**
 * CSSKeyframeRule interface.
 */
export default class CSSKeyframeRule extends CSSRule {
	public [PropertySymbol.keyText] = '';
	public [PropertySymbol.cssText] = '';
	#style: CSSStyleDeclaration | null = null;

	/**
	 * @override
	 */
	public override get type(): CSSRuleTypeEnum {
		return CSSRuleTypeEnum.keyframeRule;
	}

	/**
	 * @override
	 */
	public override get cssText(): string {
		return `${this[PropertySymbol.keyText]} { ${this.style.cssText} }`;
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

	/**
	 * Returns key text.
	 *
	 * @returns Key text.
	 */
	public get keyText(): string {
		return this[PropertySymbol.keyText];
	}
}
