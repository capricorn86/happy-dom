import CSSRule from '../CSSRule';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration';

/**
 * CSSRule interface.
 */
export default class CSSFontFaceRule extends CSSRule {
	public readonly type = CSSRule.FONT_FACE_RULE;
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
}
