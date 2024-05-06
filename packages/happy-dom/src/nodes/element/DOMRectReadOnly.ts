import * as PropertySymbol from '../../PropertySymbol.js';
import IDOMRectInit from './IDOMRectInit.js';

/* eslint-disable jsdoc/require-jsdoc */

/**
 * Bounding rect readonly object.
 *
 * @see https://drafts.fxtf.org/geometry/#DOMRect
 */
export default class DOMRectReadOnly implements IDOMRectInit {
	protected [PropertySymbol.x]: number = 0;
	protected [PropertySymbol.y]: number = 0;
	protected [PropertySymbol.width]: number = 0;
	protected [PropertySymbol.height]: number = 0;

	/**
	 * Constructor.
	 *
	 * @param [x] X position.
	 * @param [y] Y position.
	 * @param [width] Width.
	 * @param [height] Height.
	 */
	constructor(x?: number | null, y?: number | null, width?: number | null, height?: number | null) {
		this[PropertySymbol.x] = x !== undefined && x !== null ? Number(x) : 0;
		this[PropertySymbol.y] = y !== undefined && y !== null ? Number(y) : 0;
		this[PropertySymbol.width] = width !== undefined && width !== null ? Number(width) : 0;
		this[PropertySymbol.height] = height !== undefined && height !== null ? Number(height) : 0;
	}

	public get x(): number {
		return this[PropertySymbol.x];
	}

	public get y(): number {
		return this[PropertySymbol.y];
	}

	public get width(): number {
		return this[PropertySymbol.width];
	}

	public get height(): number {
		return this[PropertySymbol.height];
	}

	public get top(): number {
		return Math.min(this[PropertySymbol.y], this[PropertySymbol.y] + this[PropertySymbol.height]);
	}

	public get right(): number {
		return Math.max(this[PropertySymbol.x], this[PropertySymbol.x] + this[PropertySymbol.width]);
	}

	public get bottom(): number {
		return Math.max(this[PropertySymbol.y], this[PropertySymbol.y] + this[PropertySymbol.height]);
	}

	public get left(): number {
		return Math.min(this[PropertySymbol.x], this[PropertySymbol.x] + this[PropertySymbol.width]);
	}

	public toJSON(): object {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			top: this.top,
			right: this.right,
			bottom: this.bottom,
			left: this.left
		};
	}

	public static fromRect(other: IDOMRectInit): DOMRectReadOnly {
		return new DOMRectReadOnly(other.x, other.y, other.width, other.height);
	}
}
