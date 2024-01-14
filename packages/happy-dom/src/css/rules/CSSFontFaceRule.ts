import CSSRule from '../CSSRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';

/**
 * CSSRule interface.
 */
export default class CSSFontFaceRule extends CSSRule {
	public readonly type = CSSRule.FONT_FACE_RULE;
	public [PropertySymbol.cssText] = '';
	#style: CSSStyleDeclaration = null;

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this.#style) {
			this.#style = new CSSStyleDeclaration();
			(<CSSRule>this.#style.parentRule) = this;
			this.#style.cssText = this[PropertySymbol.cssText];
		}
		return this.#style;
	}
}
