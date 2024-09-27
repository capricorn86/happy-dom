import * as PropertySymbol from '../PropertySymbol.js';

/**
 * SVG number.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGNumber
 */
export default class SVGNumber {
	public [PropertySymbol.value]: number = 0;

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): number {
		return this[PropertySymbol.value];
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: number) {
		this[PropertySymbol.value] = Number(value);
	}
}
