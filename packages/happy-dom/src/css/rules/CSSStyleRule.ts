import CSSRule from '../CSSRule.js';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';

/**
 * CSSRule interface.
 */
export default class CSSStyleRule extends CSSRule {
	public readonly type = CSSRule.STYLE_RULE;
	public readonly selectorText = '';
	public readonly styleMap = new Map();
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

	/**
	 * Returns css text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		return `${this.selectorText} { ${this.style.cssText} }`;
	}
}
