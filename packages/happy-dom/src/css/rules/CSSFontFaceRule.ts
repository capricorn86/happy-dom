import CSSRule from '../CSSRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';

/**
 * CSSRule interface.
 */
export default class CSSFontFaceRule extends CSSRule {
	public readonly type = CSSRuleTypeEnum.fontFaceRule;
	public [PropertySymbol.cssText] = '';
	#style: CSSStyleDeclaration | null = null;

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
	 * Returns css text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		return `@font-face { ${this.style.cssText} }`;
	}
}
