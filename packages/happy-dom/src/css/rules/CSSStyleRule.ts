import CSSRule from '../CSSRule';
import CSSStyleDeclaration from '../CSSStyleDeclaration';

/**
 * CSSRule interface.
 */
export default class CSSStyleRule extends CSSRule {
	public readonly type = CSSRule.STYLE_RULE;
	public readonly style: CSSStyleDeclaration;
	public readonly selectorText = '';
	public readonly styleMap = new Map();

	/**
	 * Returns css text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		return `${this.selectorText} { ${this.style.cssText} }`;
	}
}
