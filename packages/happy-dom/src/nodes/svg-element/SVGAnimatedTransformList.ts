import BrowserWindow from '../../window/BrowserWindow.js';
import SVGTransformList from './SVGTransformList.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * The SVGAnimatedTransformList interface is used for attributes which take a list of numbers and which can be animated.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedTransformList
 */
export default class SVGAnimatedTransformList {
	// Internal properties
	public [PropertySymbol.baseVal]: SVGTransformList | null = null;
	public [PropertySymbol.animVal]: SVGTransformList | null = null;
	public [PropertySymbol.window]: BrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param window Window.
	 */
	constructor(illegalConstructorSymbol: symbol, window: BrowserWindow) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		this[PropertySymbol.window] = window;
	}

	/**
	 * Returns base value.
	 *
	 * @returns Base value.
	 */
	public get baseVal(): SVGTransformList {
		if (!this[PropertySymbol.baseVal]) {
			this[PropertySymbol.baseVal] = new SVGTransformList(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window]
			);
		}
		return this[PropertySymbol.baseVal];
	}

	/**
	 * Returns animated value.
	 *
	 * @returns Animated value.
	 */
	public get animVal(): SVGTransformList {
		if (!this[PropertySymbol.animVal]) {
			this[PropertySymbol.animVal] = new SVGTransformList(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window]
			);
		}
		return this[PropertySymbol.animVal];
	}
}
