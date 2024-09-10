import * as PropertySymbol from '../../PropertySymbol.js';
import SVGElement from './SVGElement.js';
import SVGPreserveAspectRatio from './SVGPreserveAspectRatio.js';

/**
 * SVG Animated Preserve Aspect Ratio
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedPreserveAspectRatio
 */
export default class SVGAnimatedPreserveAspectRatio {
	// Internal properties
	public [PropertySymbol.ownerElement]: SVGElement;
	public [PropertySymbol.baseVal]: SVGPreserveAspectRatio | null = null;
	public [PropertySymbol.animVal]: SVGPreserveAspectRatio | null = null;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param ownerElement Owner element.
	 */
	constructor(illegalConstructorSymbol: symbol, ownerElement: SVGElement) {
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
	public get animVal(): SVGPreserveAspectRatio {
		if (!this[PropertySymbol.animVal]) {
			this[PropertySymbol.animVal] = new SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.ownerElement],
				true
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
	public get baseVal(): SVGPreserveAspectRatio {
		if (!this[PropertySymbol.baseVal]) {
			this[PropertySymbol.baseVal] = new SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.ownerElement],
				false
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
