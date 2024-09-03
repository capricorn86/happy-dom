import SVGGeometryElement from '../svg-geometry-element/SVGGeometryElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * SVG Animated Number.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedNumber
 */
export default class SVGAnimatedNumber {
	// Internal properties
	public [PropertySymbol.ownerElement]: SVGGeometryElement;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param ownerElement Owner element.
	 */
	constructor(illegalConstructorSymbol: symbol, ownerElement: SVGGeometryElement) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}
		this[PropertySymbol.ownerElement] = ownerElement;
	}

	/**
	 * Returns animated value.
	 *
	 * @returns Animated value.
	 */
	public get animVal(): number {
		return this.baseVal;
	}

	/**
	 * Returns animated value.
	 *
	 * @param value Animated value.
	 */
	public set animVal(_value) {
		// Do nothing
	}

	/**
	 * Returns base value.
	 *
	 * @returns Base value.
	 */
	public get baseVal(): number {
		const pathLength = this[PropertySymbol.ownerElement].getAttribute('pathLength');

		if (!pathLength) {
			return 0;
		}

		const pathLengthNumber = parseFloat(pathLength);

		if (isNaN(pathLengthNumber)) {
			return 0;
		}

		return pathLengthNumber;
	}

	/**
	 * Sets base value.
	 *
	 * @param value Base value.
	 */
	public set baseVal(value: number) {
		const pathLengthNumber =
			typeof value !== 'number' ? parseFloat(<string>(<unknown>value)) : value;

		if (isNaN(pathLengthNumber)) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
			);
		}

		this[PropertySymbol.ownerElement].setAttribute('pathLength', String(pathLengthNumber));
	}
}
