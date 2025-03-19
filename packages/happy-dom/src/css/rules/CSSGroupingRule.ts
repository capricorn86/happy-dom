import CSSRule from '../CSSRule.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * CSSGroupingRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSGroupingRule
 */
export default abstract class CSSGroupingRule extends CSSRule {
	public [PropertySymbol.cssRules]: CSSRule[] = [];

	/**
	 * Returns CSS rules.
	 *
	 * @returns CSS rules.
	 */
	public get cssRules(): CSSRule[] {
		return this[PropertySymbol.cssRules];
	}

	/**
	 * Inserts a new rule.
	 *
	 * @param rule Rule.
	 * @param [index] Index.
	 * @returns The index of the new rule.
	 */
	public insertRule(rule: string, index?: number): number {
		if (arguments.length === 0) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'insertRule' on '${this.constructor.name}': 1 argument required, but only 0 present.`
			);
		}

		const rules = this[PropertySymbol.cssParser].parseFromString(rule);

		if (rules.length === 0 || rules.length > 1) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'insertRule' on '${this.constructor.name}': Failed to parse the rule '${rule}'.`,
				DOMExceptionNameEnum.syntaxError
			);
		}

		if (index !== undefined) {
			index = Number(index);
			if (isNaN(index) || index > this.cssRules.length) {
				throw new this[PropertySymbol.window].DOMException(
					`Failed to execute 'insertRule' on '${this.constructor.name}': The index provided (${index}) is larger than the maximum index (${this.cssRules.length}).`,
					DOMExceptionNameEnum.indexSizeError
				);
			}
			this.cssRules.splice(index, 0, rules[0]);
			return index;
		}

		const newIndex = this.cssRules.length;

		this.cssRules.unshift(rules[0]);

		return newIndex;
	}

	/**
	 * Removes a rule.
	 *
	 * @param index Index.
	 */
	public deleteRule(index: number): void {
		if (arguments.length === 0) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'deleteRule' on '${this.constructor.name}': 1 argument required, but only 0 present.`
			);
		}
		index = Number(index);
		if (isNaN(index) || index < 0 || index >= this.cssRules.length) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'deleteRule' on '${this.constructor.name}': the index (${index}) is greater than the length of the rule list.`,
				DOMExceptionNameEnum.indexSizeError
			);
		}
		this.cssRules.splice(index, 1);
	}
}
