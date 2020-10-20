import CSSRule from '../CSSRule';
import CSSStyleDeclaration from '../CSSStyleDeclaration';

/**
 * CSSRule interface.
 */
export default class CSSFontFaceRule extends CSSRule {
	public readonly type = CSSRule.FONT_FACE_RULE;
	public readonly style: CSSStyleDeclaration;
}
