import DOMRectReadOnly, { IDOMRectInit } from './DOMRectReadOnly.js';

/* eslint-disable jsdoc/require-jsdoc */

/**
 * Bounding rect object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
 */
export default class DOMRect extends DOMRectReadOnly {
	public set x(value: number) {
		this._x = value;
	}

	public get x(): number {
		return this._x;
	}

	public set y(value: number) {
		this._y = value;
	}

	public get y(): number {
		return this._y;
	}

	public set width(value: number) {
		this._width = value;
	}

	public get width(): number {
		return this._width;
	}

	public set height(value: number) {
		this._height = value;
	}

	public get height(): number {
		return this._height;
	}

	public static fromRect(other: IDOMRectInit): DOMRect {
		return new DOMRect(other.x, other.y, other.width, other.height);
	}
}
