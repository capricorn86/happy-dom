import CSSRule from '../CSSRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSStyleSheet from '../CSSStyleSheet.js';
import CSSStyleRule from '../rules/CSSStyleRule.js';
import CSSKeyframeRule from '../rules/CSSKeyframeRule.js';
import CSSKeyframesRule from '../rules/CSSKeyframesRule.js';
import CSSMediaRule from '../rules/CSSMediaRule.js';
import CSSContainerRule from '../rules/CSSContainerRule.js';
import CSSSupportsRule from '../rules/CSSSupportsRule.js';
import CSSFontFaceRule from '../rules/CSSFontFaceRule.js';
import SelectorParser from '../../query-selector/SelectorParser.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';

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
		const window = parentStyleSheet[PropertySymbol.window];
		const css = cssText.replace(COMMENT_REGEXP, '');
		const cssRules = [];
		const regExp = /{|}/gm;
		const stack: CSSRule[] = [];
		let parentRule: CSSRule | null = null;
		let lastIndex = 0;
		let match: RegExpMatchArray;

		while ((match = regExp.exec(css))) {
			if (match[0] === '{') {
				const selectorText = css.substring(lastIndex, match.index).trim();

				if (selectorText[0] === '@') {
					const ruleParts = selectorText.split(' ');
					const ruleType = ruleParts[0];
					const ruleParameters = ruleParts.slice(1).join(' ').trim();

					switch (ruleType) {
						case '@keyframes':
						case '@-webkit-keyframes':
							const keyframesRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window);

							(<string>keyframesRule.name) = ruleParameters;
							keyframesRule.parentStyleSheet = parentStyleSheet;
							if (parentRule) {
								if (
									parentRule.type === CSSRuleTypeEnum.mediaRule ||
									parentRule.type === CSSRuleTypeEnum.containerRule ||
									parentRule.type === CSSRuleTypeEnum.supportsRule
								) {
									(<CSSMediaRule>parentRule).cssRules.push(keyframesRule);
								}
							} else {
								cssRules.push(keyframesRule);
							}
							parentRule = keyframesRule;
							break;
						case '@media':
							const mediums = ruleParameters.split(',');
							const mediaRule = new CSSMediaRule(PropertySymbol.illegalConstructor, window);

							for (const medium of mediums) {
								mediaRule.media.appendMedium(medium.trim());
							}

							mediaRule.parentStyleSheet = parentStyleSheet;
							if (parentRule) {
								if (
									parentRule.type === CSSRuleTypeEnum.mediaRule ||
									parentRule.type === CSSRuleTypeEnum.containerRule ||
									parentRule.type === CSSRuleTypeEnum.supportsRule
								) {
									(<CSSMediaRule>parentRule).cssRules.push(mediaRule);
								}
							} else {
								cssRules.push(mediaRule);
							}
							parentRule = mediaRule;
							break;
						case '@container':
						case '@-webkit-container':
							const containerRule = new CSSContainerRule(PropertySymbol.illegalConstructor, window);

							(<string>containerRule.conditionText) = ruleParameters;
							containerRule.parentStyleSheet = parentStyleSheet;

							if (parentRule) {
								if (
									parentRule.type === CSSRuleTypeEnum.mediaRule ||
									parentRule.type === CSSRuleTypeEnum.containerRule ||
									parentRule.type === CSSRuleTypeEnum.supportsRule
								) {
									(<CSSMediaRule>parentRule).cssRules.push(containerRule);
								}
							} else {
								cssRules.push(containerRule);
							}

							parentRule = containerRule;
							break;
						case '@supports':
						case '@-webkit-supports':
							const supportsRule = new CSSSupportsRule(PropertySymbol.illegalConstructor, window);

							(<string>supportsRule.conditionText) = ruleParameters;
							supportsRule.parentStyleSheet = parentStyleSheet;
							if (parentRule) {
								if (
									parentRule.type === CSSRuleTypeEnum.mediaRule ||
									parentRule.type === CSSRuleTypeEnum.containerRule ||
									parentRule.type === CSSRuleTypeEnum.supportsRule
								) {
									(<CSSMediaRule>parentRule).cssRules.push(supportsRule);
								}
							} else {
								cssRules.push(supportsRule);
							}
							parentRule = supportsRule;
							break;
						case '@font-face':
							const fontFaceRule = new CSSFontFaceRule(PropertySymbol.illegalConstructor, window);

							fontFaceRule[PropertySymbol.cssText] = ruleParameters;
							fontFaceRule.parentStyleSheet = parentStyleSheet;
							if (parentRule) {
								if (
									parentRule.type === CSSRuleTypeEnum.mediaRule ||
									parentRule.type === CSSRuleTypeEnum.containerRule ||
									parentRule.type === CSSRuleTypeEnum.supportsRule
								) {
									(<CSSMediaRule>parentRule).cssRules.push(fontFaceRule);
								}
							} else {
								cssRules.push(fontFaceRule);
							}
							parentRule = fontFaceRule;
							break;
						default:
							// Unknown rule.
							// We will create a new rule to let it grab its content, but we will not add it to the cssRules array.
							const newRule = new CSSRule(PropertySymbol.illegalConstructor, window);
							newRule.parentStyleSheet = parentStyleSheet;
							parentRule = newRule;
							break;
					}
				} else if (parentRule && parentRule.type === CSSRuleTypeEnum.keyframesRule) {
					const newRule = new CSSKeyframeRule(PropertySymbol.illegalConstructor, window);
					(<string>newRule.keyText) = selectorText.trim();
					newRule.parentStyleSheet = parentStyleSheet;
					newRule.parentRule = parentRule;

					(<CSSKeyframesRule>parentRule).cssRules.push(<CSSKeyframeRule>newRule);
					parentRule = newRule;
				} else if (
					parentRule &&
					(parentRule.type === CSSRuleTypeEnum.mediaRule ||
						parentRule.type === CSSRuleTypeEnum.containerRule ||
						parentRule.type === CSSRuleTypeEnum.supportsRule)
				) {
					if (this.validateSelectorText(selectorText)) {
						const newRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window);
						(<string>newRule.selectorText) = selectorText;
						newRule.parentStyleSheet = parentStyleSheet;
						newRule.parentRule = parentRule;
						(<CSSMediaRule>parentRule).cssRules.push(newRule);
						parentRule = newRule;
					}
				} else {
					if (this.validateSelectorText(selectorText)) {
						const newRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window);
						(<string>newRule.selectorText) = selectorText;
						newRule.parentStyleSheet = parentStyleSheet;
						newRule.parentRule = parentRule;

						if (!parentRule) {
							cssRules.push(newRule);
						}

						parentRule = newRule;
					}
				}

				stack.push(parentRule);
			} else {
				if (parentRule) {
					const cssText = css
						.substring(lastIndex, match.index)
						.trim()
						.replace(/([^;])$/, '$1;'); // Ensure last semicolon
					switch (parentRule.type) {
						case CSSRuleTypeEnum.fontFaceRule:
						case CSSRuleTypeEnum.keyframeRule:
						case CSSRuleTypeEnum.styleRule:
							(<CSSStyleRule>parentRule)[PropertySymbol.cssText] = cssText;
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

	/**
	 * Validates a selector text.
	 *
	 * @see https://www.w3.org/TR/CSS21/syndata.html#rule-sets
	 * @param selectorText Selector text.
	 * @returns True if valid, false otherwise.
	 */
	private static validateSelectorText(selectorText: string): boolean {
		try {
			SelectorParser.getSelectorGroups(selectorText);
		} catch (e) {
			return false;
		}
		return true;
	}
}
