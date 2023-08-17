import CSSUnitValue from './CSSUnitValue.js';
import CSSUnits from './CSSUnits.js';
import CSSEscape from 'css.escape';

/**
 * The CSS interface holds useful CSS-related methods.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/CSS.
 */
export default class CSS {
	/**
	 * Constructor.
	 */
	constructor() {
		for (const unit of CSSUnits) {
			this[unit] = (value: number) => new CSSUnitValue(value, unit);
		}
	}

	/**
	 * Returns a Boolean indicating if the pair property-value, or the condition, given in parameter is supported.
	 *
	 * TODO: Always returns "true" for now, but it should probably be improved in the future.
	 *
	 * @param _condition Property name or condition.
	 * @param [_value] Value when using property name.
	 * @returns "true" if supported.
	 */
	public supports(_condition: string, _value?: string): boolean {
		return true;
	}

	/**
	 * Escapes a value.
	 *
	 * @param value Value to escape.
	 * @returns Escaped string.
	 */
	public escape(value: string): string {
		return CSSEscape(value);
	}
}
