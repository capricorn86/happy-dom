import CSSRule from '../CSSRule';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration';

/**
 * CSSRule interface.
 */
export default class CSSFontFaceRule extends CSSRule {
	public readonly type = CSSRule.FONT_FACE_RULE;
	public readonly style: CSSStyleDeclaration;
}
