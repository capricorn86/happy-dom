import * as PropertySymbol from '../../PropertySymbol.js';
import SVGLength from './SVGLength.js';
import SVGElement from './SVGElement.js';

/**
 * SVG Animated Length.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedLength
 */
export default class SVGAnimatedLength {
	// Internal properties
	public [PropertySymbol.ownerElement]: SVGElement;
	public [PropertySymbol.attributeName]: string;
	public [PropertySymbol.baseVal]: SVGLength | null = null;
	public [PropertySymbol.animVal]: SVGLength | null = null;

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
	public get animVal(): SVGLength {
		if (!this[PropertySymbol.animVal]) {
			this[PropertySymbol.animVal] = new SVGLength(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.ownerElement],
				true,
				this[PropertySymbol.attributeName]
			);
		}
		return this[PropertySymbol.animVal];
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
	public get baseVal(): SVGLength {
		if (!this[PropertySymbol.baseVal]) {
			this[PropertySymbol.baseVal] = new SVGLength(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.ownerElement],
				false,
				this[PropertySymbol.attributeName]
			);
		}
		return this[PropertySymbol.baseVal];
	}

	/**
	 * Returns base value.
	 *
	 * @param value Base value.
	 */
	public set baseVal(_value) {
		// Do nothing
	}
}
