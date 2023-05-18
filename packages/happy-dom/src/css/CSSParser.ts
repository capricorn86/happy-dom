import CSSRule from './CSSRule';
import CSSStyleSheet from './CSSStyleSheet';
import CSSStyleRule from './rules/CSSStyleRule';
import CSSKeyframeRule from './rules/CSSKeyframeRule';
import CSSKeyframesRule from './rules/CSSKeyframesRule';
import CSSMediaRule from './rules/CSSMediaRule';
import CSSContainerRule from './rules/CSSContainerRule';
import CSSSupportsRule from './rules/CSSSupportsRule';

const COMMENT_REGEXP = /\/\*[\s\S]*?\*\//gm;

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

				if (
					selectorText.startsWith('@keyframes') ||
					selectorText.startsWith('@-webkit-keyframes')
				) {
					const newRule = new CSSKeyframesRule();

					(<string>newRule.name) = selectorText.replace(/@(-webkit-){0,1}keyframes +/, '');
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
				} else if (
					selectorText.startsWith('@container') ||
					selectorText.startsWith('@-webkit-container')
				) {
					const conditionText = selectorText.replace(/@(-webkit-){0,1}container +/, '');
					const newRule = new CSSContainerRule();

					(<string>newRule.conditionText) = conditionText;
					newRule.parentStyleSheet = parentStyleSheet;
					cssRules.push(newRule);
					parentRule = newRule;
				} else if (
					selectorText.startsWith('@supports') ||
					selectorText.startsWith('@-webkit-supports')
				) {
					const conditionText = selectorText.replace(/@(-webkit-){0,1}supports +/, '');
					const newRule = new CSSSupportsRule();

					(<string>newRule.conditionText) = conditionText;
					newRule.parentStyleSheet = parentStyleSheet;
					cssRules.push(newRule);
					parentRule = newRule;
				} else if (selectorText.startsWith('@')) {
					// Unknown rule.
					// We will create a new rule to let it grab its content, but we will not add it to the cssRules array.
					const newRule = new CSSRule();
					newRule.parentStyleSheet = parentStyleSheet;
					parentRule = newRule;
				} else if (parentRule && parentRule.type === CSSRule.KEYFRAMES_RULE) {
					const newRule = new CSSKeyframeRule();
					(<string>newRule.keyText) = selectorText.trim();
					newRule.parentStyleSheet = parentStyleSheet;
					newRule.parentRule = parentRule;

					(<CSSKeyframesRule>parentRule).cssRules.push(<CSSKeyframeRule>newRule);
					parentRule = newRule;
				} else if (
					parentRule &&
					(parentRule.type === CSSRule.MEDIA_RULE ||
						parentRule.type === CSSRule.CONTAINER_RULE ||
						parentRule.type === CSSRule.SUPPORTS_RULE)
				) {
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
							(<CSSStyleRule>parentRule)._cssText = cssText;
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
