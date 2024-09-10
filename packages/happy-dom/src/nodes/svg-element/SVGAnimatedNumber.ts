import SVGElement from './SVGElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * SVG Animated Number.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedNumber
 */
export default class SVGAnimatedNumber {
	// Internal properties
	public [PropertySymbol.ownerElement]: SVGElement;
	public [PropertySymbol.attributeName]: string;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param ownerElement Owner element.
	 * @param attributeName Attribute name.
	 */
	constructor(illegalConstructorSymbol: symbol, ownerElement: SVGElement, attributeName: string) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}
		this[PropertySymbol.ownerElement] = ownerElement;
		this[PropertySymbol.attributeName] = attributeName;
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
		const attributeValue = this[PropertySymbol.ownerElement].getAttribute(
			this[PropertySymbol.attributeName]
		);

		if (!attributeValue) {
			return 0;
		}

		const value = parseFloat(attributeValue);

		if (isNaN(value)) {
			return 0;
		}

		return value;
	}

	/**
	 * Sets base value.
	 *
	 * @param value Base value.
	 */
	public set baseVal(value: number) {
		const parsedValue = typeof value !== 'number' ? parseFloat(<string>(<unknown>value)) : value;

		if (isNaN(parsedValue)) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
			);
		}

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			String(parsedValue)
		);
	}
}
