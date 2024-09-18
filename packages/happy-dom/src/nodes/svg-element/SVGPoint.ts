import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserWindow from '../../window/BrowserWindow.js';

const ATTRIBUTE_SEPARATOR_REGEXP = /[\t\f\n\r ]+/;

/**
 * SVG point.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGPoint
 */
export default class SVGPoint {
	// Internal properties
	public [PropertySymbol.window]: BrowserWindow;
	public [PropertySymbol.getAttribute]: () => string | null = null;
	public [PropertySymbol.setAttribute]: (value: string) => void | null = null;
	public [PropertySymbol.readOnly]: boolean = false;
	public [PropertySymbol.x]: number = 0;
	public [PropertySymbol.y]: number = 0;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.readOnly] Read only.
	 * @param [options.getAttribute] Get attribute.
	 * @param [options.setAttribute] Set attribute
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
	 * Returns x.
	 *
	 * @returns X.
	 */
	public get x(): number {
		if (!this[PropertySymbol.getAttribute]) {
			return this[PropertySymbol.x];
		}
		const parts = this[PropertySymbol.getAttribute]().split(ATTRIBUTE_SEPARATOR_REGEXP);
		return parts.length > 0 ? parseFloat(parts[0]) : 0;
	}

	/**
	 * Sets x.
	 *
	 * @param value X.
	 */
	public set x(value: number) {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'x' property on 'SVGPoint': The object is read-only.`
			);
		}

		if (!this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.x] = Number(value);
			return;
		}

		this[PropertySymbol.setAttribute](`${value} ${this.y}`);
	}

	/**
	 * Returns y.
	 *
	 * @returns Y.
	 */
	public get y(): number {
		if (!this[PropertySymbol.getAttribute]) {
			return this[PropertySymbol.y];
		}
		const parts = this[PropertySymbol.getAttribute]().split(ATTRIBUTE_SEPARATOR_REGEXP);
		return parts.length > 1 ? parseFloat(parts[1]) : 0;
	}

	/**
	 * Sets y.
	 *
	 * @param value Y.
	 */
	public set y(value: number) {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'y' property on 'SVGPoint': The object is read-only.`
			);
		}

		if (!this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.y] = Number(value);
			return;
		}

		this[PropertySymbol.setAttribute](`${this.x} ${value}`);
	}
}
