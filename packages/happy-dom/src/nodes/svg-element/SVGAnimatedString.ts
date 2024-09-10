import SVGElement from './SVGElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * SVG Animated String.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedString
 */
export default class SVGAnimatedString {
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
	public get animVal(): string {
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
	public get baseVal(): string {
		const attributeValue = this[PropertySymbol.ownerElement].getAttribute(
			this[PropertySymbol.attributeName]
		);

		if (!attributeValue) {
			return '';
		}

		return attributeValue;
	}

	/**
	 * Sets base value.
	 *
	 * @param value Base value.
	 */
	public set baseVal(value: string) {
		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			String(value)
		);
	}
}
