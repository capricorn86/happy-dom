import CSSRule from './CSSRule';
import CSSStyleSheet from './CSSStyleSheet';
import CSSStyleRule from './rules/CSSStyleRule';
import CSSKeyframeRule from './rules/CSSKeyframeRule';
import CSSKeyframesRule from './rules/CSSKeyframesRule';
import CSSMediaRule from './rules/CSSMediaRule';
import CSSStyleDeclaration from './CSSStyleDeclaration';

const COMMENT_REGEXP = /\/\*[^*]*\*\//gm;

/**
 * CSS parser.
 */
export default class CSSParser {
	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param parentStyleSheet Parent style sheet.
	 * @param cssText CSS code.
	 * @returns Root element.
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

					(<string>newRule.name) = selectorText.replace('@keyframes ', '');
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
					(<string>newRule.keyText) = selectorText.trim();
					newRule.parentStyleSheet = parentStyleSheet;
					newRule.parentRule = parentRule;

					(<CSSKeyframesRule>parentRule).cssRules.push(<CSSKeyframeRule>newRule);
					parentRule = newRule;
				} else if (parentRule && parentRule.type === CSSRule.MEDIA_RULE) {
					const newRule = new CSSStyleRule();
					(<string>newRule.selectorText) = selectorText;
					newRule.parentStyleSheet = parentStyleSheet;
					newRule.parentRule = parentRule;
					(<CSSMediaRule>parentRule).cssRules.push(newRule);
					parentRule = newRule;
				} else {
					const newRule = new CSSStyleRule();
					(<string>newRule.selectorText) = selectorText;
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
							const style = new CSSStyleDeclaration();
							style.cssText = cssText;
							(<CSSRule>style.parentRule) = parentRule;
							(<CSSStyleDeclaration>(<CSSStyleRule>parentRule).style) = style;
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
