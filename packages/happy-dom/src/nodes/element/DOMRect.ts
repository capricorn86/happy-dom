import DOMRectReadOnly from './DOMRectReadOnly.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IDOMRectInit from './IDOMRectInit.js';

/* eslint-disable jsdoc/require-jsdoc */

/**
 * Bounding rect object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
 */
export default class DOMRect extends DOMRectReadOnly {
	public set x(value: number) {
		this[PropertySymbol.x] = value;
	}

	public get x(): number {
		return this[PropertySymbol.x];
	}

	public set y(value: number) {
		this[PropertySymbol.y] = value;
	}

	public get y(): number {
		return this[PropertySymbol.y];
	}

	public set width(value: number) {
		this[PropertySymbol.width] = value;
	}

	public get width(): number {
		return this[PropertySymbol.width];
	}

	public set height(value: number) {
		this[PropertySymbol.height] = value;
	}

	public get height(): number {
		return this[PropertySymbol.height];
	}

	public static fromRect(other: IDOMRectInit): DOMRect {
		return new DOMRect(other.x, other.y, other.width, other.height);
	}
}
