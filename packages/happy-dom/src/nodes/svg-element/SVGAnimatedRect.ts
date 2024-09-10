import * as PropertySymbol from '../../PropertySymbol.js';
import SVGRect from './SVGRect.js';
import SVGElement from './SVGElement.js';

/**
 * SVG Animated Number.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedRect
 */
export default class SVGAnimatedRect {
	// Internal properties
	public [PropertySymbol.ownerElement]: SVGElement;
	public [PropertySymbol.baseVal]: SVGRect | null = null;
	public [PropertySymbol.animVal]: SVGRect | null = null;

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
	public get animVal(): SVGRect {
		if (!this[PropertySymbol.animVal]) {
			this[PropertySymbol.animVal] = new SVGRect(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.ownerElement],
				'viewBox'
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
	public get baseVal(): SVGRect {
		if (!this[PropertySymbol.baseVal]) {
			this[PropertySymbol.baseVal] = new SVGRect(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.ownerElement],
				'viewBox'
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
