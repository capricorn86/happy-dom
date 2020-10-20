import CSSRule from './CSSRule';
import CSSStyleDeclarationFactory from './CSSStyleDeclarationFactory';
import CSSStyleSheet from './CSSStyleSheet';
import CSSStyleRule from './rules/CSSStyleRule';
import CSSKeyframeRule from './rules/CSSKeyframeRule';
import CSSKeyframesRule from './rules/CSSKeyframesRule';
import CSSMediaRule from './rules/CSSMediaRule';

const COMMENT_REGEXP = /\/\*[^*]*\*\//gm;

/**
 * CSS parser.
 */
export default class CSSParser {
	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param parentStyleSheet parent style sheet.
	 * @param cssText CSS code.
	 * @return Root element.
	 */
	public static parseFromString(parentStyleSheet: CSSStyleSheet, cssText: string): CSSRule[] {
		const css = cssText.replace(COMMENT_REGEXP, '');
		const cssRules = [];
		const regExp = /{|}/gm;
		const stack: CSSRule[] = [];
		let parentRule: CSSRule = null;
		let lastIndex = 0;
		let match: RegExpMatchArray;

		while ((match = regExp.exec(css))) {
			if (match[0] === '{') {
				const selectorText = css.substring(lastIndex, match.index).trim();

				if (selectorText.startsWith('@keyframes')) {
					const newRule = new CSSKeyframesRule();

					// @ts-ignore
					newRule.name = selectorText.replace('@keyframes ', '');
					newRule.parentStyleSheet = parentStyleSheet;
					cssRules.push(newRule);
					parentRule = newRule;
				} else if (selectorText.startsWith('@media')) {
					const mediums = selectorText.replace('@media', '').split(',');
					const newRule = new CSSMediaRule();

					for (const medium of mediums) {
						newRule.media.appendMedium(medium.trim());
					}

					newRule.parentStyleSheet = parentStyleSheet;
					cssRules.push(newRule);
					parentRule = newRule;
				} else if (parentRule && parentRule.type === CSSRule.KEYFRAMES_RULE) {
					const newRule = new CSSKeyframeRule();
					// @ts-ignore
					newRule.keyText = selectorText.trim();
					newRule.parentStyleSheet = parentStyleSheet;
					newRule.parentRule = parentRule;

					(<CSSKeyframesRule>parentRule).cssRules.push(<CSSKeyframeRule>newRule);
					parentRule = newRule;
				} else if (parentRule && parentRule.type === CSSRule.MEDIA_RULE) {
					const newRule = new CSSStyleRule();
					// @ts-ignore
					newRule.selectorText = selectorText;
					newRule.parentStyleSheet = parentStyleSheet;
					newRule.parentRule = parentRule;
					(<CSSMediaRule>parentRule).cssRules.push(newRule);
					parentRule = newRule;
				} else {
					const newRule = new CSSStyleRule();
					// @ts-ignore
					newRule.selectorText = selectorText;
					newRule.parentStyleSheet = parentStyleSheet;
					newRule.parentRule = parentRule;

					if (!parentRule) {
						cssRules.push(newRule);
					}

					parentRule = newRule;
				}

				stack.push(parentRule);
			} else {
				if (parentRule) {
					const cssText = css.substring(lastIndex, match.index).trim();
					switch (parentRule.type) {
						case CSSRule.FONT_FACE_RULE:
						case CSSRule.KEYFRAME_RULE:
						case CSSRule.STYLE_RULE:
							// @ts-ignore
							parentRule.style = CSSStyleDeclarationFactory.createCSSStyleDeclaration(
								cssText,
								parentRule
							);
							break;
					}
				}

				stack.pop();
				parentRule = stack[stack.length - 1] || null;
			}

			lastIndex = match.index + 1;
		}

		return cssRules;
	}
}
