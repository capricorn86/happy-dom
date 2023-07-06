import CSSRule from '../CSSRule.js';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';

/**
 * CSSRule interface.
 */
export default class CSSKeyframeRule extends CSSRule {
	public readonly type = CSSRule.KEYFRAME_RULE;
	public readonly keyText: string;
	public _cssText = '';
	private _style: CSSStyleDeclaration = null;

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this._style) {
			this._style = new CSSStyleDeclaration();
			(<CSSRule>this._style.parentRule) = this;
			this._style.cssText = this._cssText;
		}
		return this._style;
	}

	/**
	 * Returns css text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		return `${this.keyText} { ${this.style.cssText} }`;
	}
}
