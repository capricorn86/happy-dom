/* eslint-disable jsdoc/require-jsdoc */

/**
 * Bounding rect readonly object.
 *
 * @see https://drafts.fxtf.org/geometry/#DOMRect
 */
export default class DOMRectReadOnly implements IDOMRectInit {
	protected _x: number = 0;
	protected _y: number = 0;
	protected _width: number = 0;
	protected _height: number = 0;

	/**
	 * Constructor.
	 *
	 * @param [x] X position.
	 * @param [y] Y position.
	 * @param [width] Width.
	 * @param [height] Height.
	 */
	constructor(x?: number, y?: number, width?: number, height?: number) {
		this._x = x || 0;
		this._y = y || 0;
		this._width = width || 0;
		this._height = height || 0;
	}

	public get x(): number {
		return this._x;
	}

	public get y(): number {
		return this._y;
	}

	public get width(): number {
		return this._width;
	}

	public get height(): number {
		return this._height;
	}

	public get top(): number {
		return Math.min(this._y, this._y + this._height);
	}

	public get right(): number {
		return Math.max(this._x, this._x + this._width);
	}

	public get bottom(): number {
		return Math.max(this._y, this._y + this._height);
	}

	public get left(): number {
		return Math.min(this._x, this._x + this._width);
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

export interface IDOMRectInit {
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
}
