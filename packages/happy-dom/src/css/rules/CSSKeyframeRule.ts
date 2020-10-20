import CSSRule from '../CSSRule';
import CSSStyleDeclaration from '../CSSStyleDeclaration';

/**
 * CSSRule interface.
 */
export default class CSSKeyframeRule extends CSSRule {
	public readonly type = CSSRule.KEYFRAME_RULE;
	public readonly style: CSSStyleDeclaration;
	public readonly keyText: string;

	/**
	 * Returns css text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		return `${this.keyText} { ${this.style.cssText} }`;
	}
}
