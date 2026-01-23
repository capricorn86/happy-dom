import CSSEscaper from './utilities/CSSEscaper.js';
import CSSUnitValue from './CSSUnitValue.js';

/**
 * The CSS interface holds useful CSS-related methods.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/CSS.
 */
export default class CSS {
	public readonly Hz = (value: number): CSSUnitValue => new CSSUnitValue(value, 'Hz');
	public readonly Q = (value: number): CSSUnitValue => new CSSUnitValue(value, 'Q');
	public readonly ch = (value: number): CSSUnitValue => new CSSUnitValue(value, 'ch');
	public readonly cm = (value: number): CSSUnitValue => new CSSUnitValue(value, 'cm');
	public readonly deg = (value: number): CSSUnitValue => new CSSUnitValue(value, 'deg');
	public readonly dpcm = (value: number): CSSUnitValue => new CSSUnitValue(value, 'dpcm');
	public readonly dpi = (value: number): CSSUnitValue => new CSSUnitValue(value, 'dpi');
	public readonly dppx = (value: number): CSSUnitValue => new CSSUnitValue(value, 'dppx');
	public readonly em = (value: number): CSSUnitValue => new CSSUnitValue(value, 'em');
	public readonly ex = (value: number): CSSUnitValue => new CSSUnitValue(value, 'ex');
	public readonly fr = (value: number): CSSUnitValue => new CSSUnitValue(value, 'fr');
	public readonly grad = (value: number): CSSUnitValue => new CSSUnitValue(value, 'grad');
	public readonly in = (value: number): CSSUnitValue => new CSSUnitValue(value, 'in');
	public readonly kHz = (value: number): CSSUnitValue => new CSSUnitValue(value, 'kHz');
	public readonly mm = (value: number): CSSUnitValue => new CSSUnitValue(value, 'mm');
	public readonly ms = (value: number): CSSUnitValue => new CSSUnitValue(value, 'ms');
	public readonly number = (value: number): CSSUnitValue => new CSSUnitValue(value, 'number');
	public readonly pc = (value: number): CSSUnitValue => new CSSUnitValue(value, 'pc');
	public readonly percent = (value: number): CSSUnitValue => new CSSUnitValue(value, 'percent');
	public readonly pt = (value: number): CSSUnitValue => new CSSUnitValue(value, 'pt');
	public readonly px = (value: number): CSSUnitValue => new CSSUnitValue(value, 'px');
	public readonly rad = (value: number): CSSUnitValue => new CSSUnitValue(value, 'rad');
	public readonly rem = (value: number): CSSUnitValue => new CSSUnitValue(value, 'rem');
	public readonly s = (value: number): CSSUnitValue => new CSSUnitValue(value, 's');
	public readonly turn = (value: number): CSSUnitValue => new CSSUnitValue(value, 'turn');
	public readonly vh = (value: number): CSSUnitValue => new CSSUnitValue(value, 'vh');
	public readonly vmax = (value: number): CSSUnitValue => new CSSUnitValue(value, 'vmax');
	public readonly vmin = (value: number): CSSUnitValue => new CSSUnitValue(value, 'vmin');
	public readonly vw = (value: number): CSSUnitValue => new CSSUnitValue(value, 'vw');

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
		return CSSEscaper.escape(value);
	}
}
