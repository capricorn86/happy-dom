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
import CSSScopeRule from '../rules/CSSScopeRule.js';

const COMMENT_REGEXP = /\/\*[\s\S]*?\*\//gm;

/**
 * CSS parser.
 */
export default class CSSParser {
	#parentStyleSheet: CSSStyleSheet;

	/**
	 * Constructor.
	 *
	 * @param parentStyleSheet Parent style sheet.
	 */
	constructor(parentStyleSheet: CSSStyleSheet) {
		this.#parentStyleSheet = parentStyleSheet;
	}
	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param cssText CSS code.
	 * @returns CSS rules.
	 */
	public parseFromString(cssText: string): CSSRule[] {
		const parentStyleSheet = this.#parentStyleSheet;
		const window = parentStyleSheet[PropertySymbol.window];
		const css = cssText.replace(COMMENT_REGEXP, '');
		const cssRules = [];
		const regExp = /{|}/gm;
		const stack: CSSRule[] = [];
		let parentRule: CSSRule | null = null;
		let lastIndex = 0;
		let match: RegExpMatchArray | null;

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
							const keyframesRule = new CSSKeyframesRule(
								PropertySymbol.illegalConstructor,
								window,
								this
							);

							keyframesRule[PropertySymbol.rulePrefix] =
								ruleType === '@-webkit-keyframes' ? '-webkit-' : '';
							keyframesRule[PropertySymbol.name] = ruleParameters;
							keyframesRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;
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
							const mediaRule = new CSSMediaRule(PropertySymbol.illegalConstructor, window, this);

							for (const medium of mediums) {
								mediaRule.media.appendMedium(medium.trim());
							}

							mediaRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;
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
							const containerRule = new CSSContainerRule(
								PropertySymbol.illegalConstructor,
								window,
								this
							);
							containerRule[PropertySymbol.rulePrefix] =
								ruleType === '@-webkit-container' ? '-webkit-' : '';
							containerRule[PropertySymbol.conditionText] = ruleParameters;
							containerRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;

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
							const supportsRule = new CSSSupportsRule(
								PropertySymbol.illegalConstructor,
								window,
								this
							);

							supportsRule[PropertySymbol.rulePrefix] =
								ruleType === '@-webkit-supports' ? '-webkit-' : '';
							supportsRule[PropertySymbol.conditionText] = ruleParameters;
							supportsRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;
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
							const fontFaceRule = new CSSFontFaceRule(
								PropertySymbol.illegalConstructor,
								window,
								this
							);

							fontFaceRule[PropertySymbol.cssText] = ruleParameters;
							fontFaceRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;
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
						case '@scope':
						case '@-webkit-scope':
							const scopeRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, this);

							scopeRule[PropertySymbol.rulePrefix] =
								ruleType === '@-webkit-scope' ? '-webkit-' : '';
							scopeRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;

							if (ruleParameters) {
								const scopeRuleParts = ruleParameters.split(/\s+to\s+/);
								if (
									scopeRuleParts[0] &&
									scopeRuleParts[0][0] === '(' &&
									scopeRuleParts[0][scopeRuleParts[0].length - 1] === ')'
								) {
									scopeRule[PropertySymbol.start] = scopeRuleParts[0].slice(1, -1);
								}
								if (
									scopeRuleParts[1] &&
									scopeRuleParts[1][0] === '(' &&
									scopeRuleParts[1][scopeRuleParts[1].length - 1] === ')'
								) {
									scopeRule[PropertySymbol.end] = scopeRuleParts[1].slice(1, -1);
								}
							}

							if (parentRule) {
								if (
									parentRule.type === CSSRuleTypeEnum.mediaRule ||
									parentRule.type === CSSRuleTypeEnum.containerRule ||
									parentRule.type === CSSRuleTypeEnum.supportsRule
								) {
									(<CSSMediaRule>parentRule).cssRules.push(scopeRule);
								}
							} else {
								cssRules.push(scopeRule);
							}
							parentRule = scopeRule;
							break;
						default:
							// Unknown rule.
							// We will create a new rule to let it grab its content, but we will not add it to the cssRules array.
							const newRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, this);
							newRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;
							parentRule = newRule;
							break;
					}
				} else if (parentRule && parentRule.type === CSSRuleTypeEnum.keyframesRule) {
					const newRule = new CSSKeyframeRule(PropertySymbol.illegalConstructor, window, this);
					let keyText = selectorText.trim();
					if (keyText === 'from') {
						keyText = '0%';
					} else if (keyText === 'to') {
						keyText = '100%';
					}
					newRule[PropertySymbol.keyText] = keyText;
					newRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;
					newRule[PropertySymbol.parentRule] = parentRule;

					(<CSSKeyframesRule>parentRule).cssRules.push(<CSSKeyframeRule>newRule);
					parentRule = newRule;
				} else if (
					parentRule &&
					(parentRule.type === CSSRuleTypeEnum.mediaRule ||
						parentRule.type === CSSRuleTypeEnum.containerRule ||
						parentRule.type === CSSRuleTypeEnum.supportsRule)
				) {
					if (this.validateSelectorText(selectorText)) {
						const newRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, this);
						newRule[PropertySymbol.selectorText] = selectorText;
						newRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;
						newRule[PropertySymbol.parentRule] = parentRule;
						(<CSSMediaRule>parentRule).cssRules.push(newRule);
						parentRule = newRule;
					}
				} else {
					if (this.validateSelectorText(selectorText)) {
						const newRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, this);
						newRule[PropertySymbol.selectorText] = selectorText;
						newRule[PropertySymbol.parentStyleSheet] = parentStyleSheet;
						newRule[PropertySymbol.parentRule] = parentRule;

						if (!parentRule) {
							cssRules.push(newRule);
						}

						parentRule = newRule;
					}
				}

				if (parentRule) {
					stack.push(parentRule);
				}
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

			lastIndex = match.index! + 1;
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
	private validateSelectorText(selectorText: string): boolean {
		try {
			SelectorParser.getSelectorGroups(selectorText);
		} catch (e) {
			return false;
		}
		return true;
	}
}
