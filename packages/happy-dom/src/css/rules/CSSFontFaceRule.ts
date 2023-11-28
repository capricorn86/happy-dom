import CSSRule from '../CSSRule.js';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';

/**
 * CSSRule interface.
 */
export default class CSSFontFaceRule extends CSSRule {
	public readonly type = CSSRule.FONT_FACE_RULE;
	public __cssText__ = '';
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
			this.#style.cssText = this.__cssText__;
		}
		return this.#style;
	}
}
