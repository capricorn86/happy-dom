import CSSRule from '../CSSRule.js';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';
import CSSKeyframeRule from './CSSKeyframeRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';

const CSS_RULE_REGEXP = /([^{]+){([^}]+)}/;

/**
 * CSSKeyframesRule interface.
 */
export default class CSSKeyframesRule extends CSSRule {
	public [PropertySymbol.type] = CSSRuleTypeEnum.keyframesRule;
	public [PropertySymbol.cssRules]: CSSKeyframeRule[] = [];
	public [PropertySymbol.name]: string = null;

	/**
	 * Returns css text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		let cssText = '';
		for (const cssRule of this[PropertySymbol.cssRules]) {
			cssText += cssRule.cssText + ' ';
		}
		return `@keyframes ${this[PropertySymbol.name]} { ${cssText}}`;
	}

	/**
	 * Returns CSS rules.
	 *
	 * @returns CSS rules.
	 */
	public get cssRules(): CSSRule[] {
		return this[PropertySymbol.cssRules];
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this[PropertySymbol.name];
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.cssRules].length;
	}

	/**
	 * Appends a rule.
	 *
	 * @param rule Rule. E.g. "0% { transform: rotate(360deg); }".
	 */
	public appendRule(rule: string): void {
		const match = rule.match(CSS_RULE_REGEXP);
		if (match) {
			const cssRule = new CSSKeyframeRule(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				this[PropertySymbol.cssParser]
			);
			const style = new CSSStyleDeclaration(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window]
			);

			(<CSSRule>cssRule.parentRule) = this;
			(<string>cssRule[PropertySymbol.keyText]) = match[1].trim();

			style.cssText = match[2].trim();

			(<CSSRule>style.parentRule) = this;
			(<CSSStyleDeclaration>cssRule.style) = style;

			this[PropertySymbol.cssRules].push(cssRule);
		}
	}

	/**
	 * Removes a rule.
	 *
	 * @param rule Rule. E.g. "0%".
	 */
	public deleteRule(rule: string): void {
		for (let i = 0, max = this[PropertySymbol.cssRules].length; i < max; i++) {
			if (this[PropertySymbol.cssRules][i][PropertySymbol.keyText] === rule) {
				this[PropertySymbol.cssRules].splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Finds a rule.
	 *
	 * @param rule Rule. E.g. "0%".
	 * @returns Rule.
	 */
	public findRule(rule: string): CSSKeyframeRule {
		for (let i = 0, max = this[PropertySymbol.cssRules].length; i < max; i++) {
			if (this[PropertySymbol.cssRules][i][PropertySymbol.keyText] === rule) {
				return this[PropertySymbol.cssRules][i];
			}
		}
		return null;
	}
}
