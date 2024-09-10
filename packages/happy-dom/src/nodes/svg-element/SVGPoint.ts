import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * SVG point.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGPoint
 */
export default class SVGPoint {
	// Internal properties
	public [PropertySymbol.x]: number = 0;
	public [PropertySymbol.y]: number;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 */
	constructor(illegalConstructorSymbol: symbol) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}
	}

	/**
	 * Returns x.
	 *
	 * @returns X.
	 */
	public get x(): number {
		return 0;
	}

	/**
	 * Sets x.
	 *
	 * @param value X.
	 */
	public set x(value: number) {
		this[PropertySymbol.x] = Number(value);
	}

	/**
	 * Returns y.
	 *
	 * @returns Y.
	 */
	public get y(): number {
		return 0;
	}

	/**
	 * Sets y.
	 *
	 * @param value Y.
	 */
	public set y(value: number) {
		this[PropertySymbol.y] = Number(value);
	}
}
