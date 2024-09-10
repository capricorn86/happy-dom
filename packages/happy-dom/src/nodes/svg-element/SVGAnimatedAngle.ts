import * as PropertySymbol from '../../PropertySymbol.js';
import SVGElement from './SVGElement.js';
import SVGAngle from './SVGAngle.js';

/**
 * SVG Animated Angle.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedAngle
 */
export default class SVGAnimatedAngle {
	// Internal properties
	public [PropertySymbol.ownerElement]: SVGElement;
	public [PropertySymbol.attributeName]: string;
	public [PropertySymbol.baseVal]: SVGAngle | null = null;
	public [PropertySymbol.animVal]: SVGAngle | null = null;

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
	public get animVal(): SVGAngle {
		if (!this[PropertySymbol.animVal]) {
			this[PropertySymbol.animVal] = new SVGAngle(
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
	public get baseVal(): SVGAngle {
		if (!this[PropertySymbol.baseVal]) {
			this[PropertySymbol.baseVal] = new SVGAngle(
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
