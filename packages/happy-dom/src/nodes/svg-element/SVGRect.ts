import * as PropertySymbol from '../../PropertySymbol.js';
import SVGElement from './SVGElement.js';

/**
 * Rect object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGRect
 */
export default class SVGRect {
	// Internal properties
	public [PropertySymbol.ownerElement]: SVGElement;
	public [PropertySymbol.attributeName]: string | null = null;
	public [PropertySymbol.x]: number = 0;
	public [PropertySymbol.y]: number = 0;
	public [PropertySymbol.width]: number = 0;
	public [PropertySymbol.height]: number = 0;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param ownerElement Owner element.
	 * @param [attributeName] Attribute name.
	 */
	constructor(
		illegalConstructorSymbol: symbol,
		ownerElement: SVGElement,
		attributeName: string | null = null
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}
		this[PropertySymbol.ownerElement] = ownerElement;
		this[PropertySymbol.attributeName] = attributeName;
	}

	/**
	 * Returns x value.
	 *
	 * @returns X value.
	 */
	public get x(): number {
		if (!this[PropertySymbol.attributeName]) {
			return this[PropertySymbol.x];
		}

		const parts = this[PropertySymbol.ownerElement]
			.getAttribute(this[PropertySymbol.attributeName])
			?.split(/\s+/);

		if (!parts) {
			return 0;
		}

		const value = Number(parts[0]);
		return isNaN(value) ? 0 : value;
	}

	/**
	 * Sets x value.
	 *
	 * @param value X value.
	 */
	public set x(value: number) {
		if (!this[PropertySymbol.attributeName]) {
			this[PropertySymbol.x] = Number(value);
			return;
		}

		const parts = this[PropertySymbol.ownerElement]
			.getAttribute(this[PropertySymbol.attributeName])
			?.split(/\s+/);

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			`${String(value)} ${parts[1] ?? 0} ${parts[2] ?? 0} ${parts[3] ?? 0}`
		);
	}

	/**
	 * Returns y value.
	 *
	 * @returns Y value.
	 */
	public get y(): number {
		if (!this[PropertySymbol.attributeName]) {
			return this[PropertySymbol.y];
		}

		const parts = this[PropertySymbol.ownerElement]
			.getAttribute(this[PropertySymbol.attributeName])
			?.split(/\s+/);

		if (!parts) {
			return 0;
		}

		const value = Number(parts[1]);
		return isNaN(value) ? 0 : value;
	}

	/**
	 * Sets y value.
	 *
	 * @param value Y value.
	 */
	public set y(value: number) {
		if (!this[PropertySymbol.attributeName]) {
			this[PropertySymbol.y] = Number(value);
			return;
		}

		const parts = this[PropertySymbol.ownerElement]
			.getAttribute(this[PropertySymbol.attributeName])
			?.split(/\s+/);

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			`${parts[0] ?? 0} ${String(value)} ${parts[2] ?? 0} ${parts[3] ?? 0}`
		);
	}

	/**
	 * Returns width value.
	 *
	 * @returns Width value.
	 */
	public get width(): number {
		if (!this[PropertySymbol.attributeName]) {
			return this[PropertySymbol.width];
		}

		const parts = this[PropertySymbol.ownerElement]
			.getAttribute(this[PropertySymbol.attributeName])
			?.split(/\s+/);

		if (!parts) {
			return 0;
		}

		const value = Number(parts[2]);
		return isNaN(value) ? 0 : value;
	}

	/**
	 * Sets width value.
	 *
	 * @param value Width value.
	 */
	public set width(value: number) {
		if (!this[PropertySymbol.attributeName]) {
			this[PropertySymbol.width] = Number(value);
			return;
		}

		const parts = this[PropertySymbol.ownerElement]
			.getAttribute(this[PropertySymbol.attributeName])
			?.split(/\s+/);

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			`${parts[0] ?? 0} ${parts[1] ?? 0} ${String(value)} ${parts[3] ?? 0}`
		);
	}

	/**
	 * Returns height value.
	 *
	 * @returns Height value.
	 */
	public get height(): number {
		if (!this[PropertySymbol.attributeName]) {
			return this[PropertySymbol.height];
		}

		const parts = this[PropertySymbol.ownerElement]
			.getAttribute(this[PropertySymbol.attributeName])
			?.split(/\s+/);

		if (!parts) {
			return 0;
		}

		const value = Number(parts[3]);
		return isNaN(value) ? 0 : value;
	}

	/**
	 * Sets height value.
	 *
	 * @param value Height value.
	 */
	public set height(value: number) {
		if (!this[PropertySymbol.attributeName]) {
			this[PropertySymbol.height] = Number(value);
			return;
		}

		const parts = this[PropertySymbol.ownerElement]
			.getAttribute(this[PropertySymbol.attributeName])
			?.split(/\s+/);

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			`${parts[0] ?? 0} ${parts[1] ?? 0} ${parts[2] ?? 0} ${String(value)}`
		);
	}
}
