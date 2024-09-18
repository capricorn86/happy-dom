import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserWindow from '../../window/BrowserWindow.js';

/**
 * SVG transform.
 *
 * TODO: Complete implementation.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransform
 */
export default class SVGTransform {
	public static SVG_TRANSFORM_UNKNOWN = 0;
	public static SVG_TRANSFORM_MATRIX = 1;
	public static SVG_TRANSFORM_TRANSLATE = 2;
	public static SVG_TRANSFORM_SCALE = 3;
	public static SVG_TRANSFORM_ROTATE = 4;
	public static SVG_TRANSFORM_SKEWX = 5;
	public static SVG_TRANSFORM_SKEWY = 6;

	// Internal properties
	public [PropertySymbol.window]: BrowserWindow;
	public [PropertySymbol.getAttribute]: () => string | null = null;
	public [PropertySymbol.setAttribute]: (value: string) => void | null = null;
	public [PropertySymbol.readOnly]: boolean = false;
	public [PropertySymbol.angle]: number = 0;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.readOnly] Read only.
	 * @param [options.getAttribute] Get attribute.
	 * @param [options.setAttribute] Set attribute.
	 */
	constructor(
		illegalConstructorSymbol: symbol,
		window: BrowserWindow,
		options?: {
			readOnly?: boolean;
			getAttribute?: () => string | null;
			setAttribute?: (value: string) => void;
		}
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		this[PropertySymbol.window] = window;

		if (options) {
			this[PropertySymbol.readOnly] = !!options.readOnly;
			this[PropertySymbol.getAttribute] = options.getAttribute || null;
			this[PropertySymbol.setAttribute] = options.setAttribute || null;
		}
	}

	/**
	 * Returns type.
	 *
	 * @returns Type.
	 */
	public get type(): number {
		return 0;
	}

	/**
	 * Returns angle.
	 *
	 * @returns Angle.
	 */
	public get angle(): number {
		return 0;
	}

	/**
	 * Set matrix.
	 */
	public setMatrix(): void {}
	/**
	 * Set translate.
	 */
	public setTranslate(): void {}
	/**
	 * Set scale.
	 */
	public setScale(): void {}
	/**
	 * Set rotate.
	 */
	public setRotate(): void {}
	/**
	 * Set skew x.
	 */
	public setSkewX(): void {}
	/**
	 * Set skew y.
	 */
	public setSkewY(): void {}
}
