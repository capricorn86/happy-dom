import * as PropertySymbol from '../PropertySymbol.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import type { TDOMMatrixInit } from './dom-matrix/TDOMMatrixInit.js';
import type IDOMPointInit from './IDOMPointInit.js';

/**
 * DOM Point Readonly.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMPointReadOnly
 */
export default class DOMPointReadOnly implements IDOMPointInit {
	// Injected by WindowContextClassExtender
	protected declare [PropertySymbol.window]: BrowserWindow;

	protected [PropertySymbol.x]: number = 0;
	protected [PropertySymbol.y]: number = 0;
	protected [PropertySymbol.z]: number = 0;
	protected [PropertySymbol.w]: number = 1;

	/**
	 * Constructor.
	 *
	 * @param [x] X position.
	 * @param [y] Y position.
	 * @param [z] Width.
	 * @param [w] Height.
	 */
	constructor(x?: number | null, y?: number | null, z?: number | null, w?: number | null) {
		this[PropertySymbol.x] = x !== undefined && x !== null ? Number(x) : 0;
		this[PropertySymbol.y] = y !== undefined && y !== null ? Number(y) : 0;
		this[PropertySymbol.z] = z !== undefined && z !== null ? Number(z) : 0;
		this[PropertySymbol.w] = w !== undefined && w !== null ? Number(w) : 1;
	}

	/**
	 * Returns x.
	 *
	 * @returns X.
	 */
	public get x(): number {
		return this[PropertySymbol.x];
	}

	/**
	 * Returns y.
	 *
	 * @returns Y.
	 */
	public get y(): number {
		return this[PropertySymbol.y];
	}

	/**
	 * Returns z.
	 *
	 * @returns Z.
	 */
	public get z(): number {
		return this[PropertySymbol.z];
	}

	/**
	 * Returns w.
	 *
	 * @returns W.
	 */
	public get w(): number {
		return this[PropertySymbol.w];
	}

	/**
	 * Returns the JSON representation of the object.
	 *
	 * @returns JSON representation.
	 */
	public toJSON(): object {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
			w: this.w
		};
	}

	/**
	 * Returns a new DOMPointReadOnly object.
	 *
	 * @param [otherPoint] Other point.
	 * @returns Cloned object.
	 */
	public static fromPoint(otherPoint?: IDOMPointInit): DOMPointReadOnly {
		if (!otherPoint) {
			return new this();
		}
		return new this(
			otherPoint.x ?? null,
			otherPoint.y ?? null,
			otherPoint.z ?? null,
			otherPoint.w ?? null
		);
	}

	/**
	 * The matrixTransform() method of the DOMPointReadOnly interface applies a matrix transform specified as an object to the DOMPointReadOnly object, creating and returning a new DOMPointReadOnly object.
	 *
	 * @param [init] DOM Matrix init.
	 * @returns DOMPointReadOnly object.
	 */
	public matrixTransform(init?: TDOMMatrixInit): DOMPointReadOnly {
		const matrix = new this[PropertySymbol.window].DOMMatrixReadOnly(init);
		const x = this.x * matrix.m11 + this.y * matrix.m21 + this.z * matrix.m31 + this.w * matrix.m41;
		const y = this.x * matrix.m12 + this.y * matrix.m22 + this.z * matrix.m32 + this.w * matrix.m42;
		const z = this.x * matrix.m13 + this.y * matrix.m23 + this.z * matrix.m33 + this.w * matrix.m43;
		const w = this.x * matrix.m14 + this.y * matrix.m24 + this.z * matrix.m34 + this.w * matrix.m44;
		return new (<typeof DOMPointReadOnly>this.constructor)(x, y, z, w);
	}
}
