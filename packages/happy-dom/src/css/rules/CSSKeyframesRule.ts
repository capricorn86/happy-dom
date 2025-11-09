import CSSRule from '../CSSRule.js';
import CSSKeyframeRule from './CSSKeyframeRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSRuleTypeEnum from '../CSSRuleTypeEnum.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';

const CSS_RULE_REGEXP = /^(from|to|[0-9]{1,3}%)\s*{([^}]*)}$/;

/**
 * CSSKeyframesRule interface.
 */
export default class CSSKeyframesRule extends CSSRule {
	public [PropertySymbol.cssRules]: CSSKeyframeRule[] = [];
	public [PropertySymbol.name]: string = '';
	public [PropertySymbol.rulePrefix] = '';

	/**
	 * @override
	 */
	public override get type(): CSSRuleTypeEnum {
		return CSSRuleTypeEnum.keyframesRule;
	}

	/**
	 * @override
	 */
	public override get cssText(): string {
		let cssText = '';
		for (const cssRule of this[PropertySymbol.cssRules]) {
			cssText += '\n  ' + cssRule.cssText;
		}
		cssText += '\n';
		return `@${this[PropertySymbol.rulePrefix]}keyframes ${
			this[PropertySymbol.name]
		} { ${cssText}}`;
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
		if (arguments.length === 0) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'appendRule' on 'CSSKeyframesRule': 1 argument required, but only 0 present.`
			);
		}

		const match = String(rule).trim().match(CSS_RULE_REGEXP);

		if (!match) {
			throw new this[PropertySymbol.window].DOMException(
				`Invalid or unexpected token`,
				DOMExceptionNameEnum.syntaxError
			);
		}

		const cssRule = new CSSKeyframeRule(
			PropertySymbol.illegalConstructor,
			this[PropertySymbol.window],
			this[PropertySymbol.cssParser]
		);

		let keyText = match[1].trim();

		if (keyText === 'from') {
			keyText = '0%';
		} else if (keyText === 'to') {
			keyText = '100%';
		}

		cssRule[PropertySymbol.parentRule] = this;
		cssRule[PropertySymbol.keyText] = keyText;
		cssRule[PropertySymbol.cssText] = match[2].trim();

		this[PropertySymbol.cssRules].push(cssRule);
	}

	/**
	 * Removes a rule.
	 *
	 * @param rule Rule. E.g. "0%".
	 */
	public deleteRule(rule: string): void {
		if (arguments.length === 0) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'deleteRule' on 'CSSKeyframesRule': 1 argument required, but only 0 present.`
			);
		}

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
	public findRule(rule: string): CSSKeyframeRule | null {
		if (arguments.length === 0) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'findRule' on 'CSSKeyframesRule': 1 argument required, but only 0 present.`
			);
		}

		for (let i = 0, max = this[PropertySymbol.cssRules].length; i < max; i++) {
			if (this[PropertySymbol.cssRules][i][PropertySymbol.keyText] === rule) {
				return this[PropertySymbol.cssRules][i];
			}
		}
		return null;
	}
}
