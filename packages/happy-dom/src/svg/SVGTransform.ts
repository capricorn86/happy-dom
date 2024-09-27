import * as PropertySymbol from '../PropertySymbol.js';
import BrowserWindow from '../window/BrowserWindow.js';
import SVGMatrix from './SVGMatrix.js';

const TRANSFORM_REGEXP = /([a-z0-9]+)\(([^)]+)\)/gm;
const TRANSFORM_PARAMETER_SPLIT_REGEXP = /[\s,]+/;

/**
 * SVG transform.
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
	public [PropertySymbol.getAttribute]: () => string;
	public [PropertySymbol.setAttribute]: (value: string) => void;
	public [PropertySymbol.attributeValue]: string | null = null;
	public [PropertySymbol.readOnly]: boolean = false;
	public [PropertySymbol.matrix]: SVGMatrix | null = null;

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
		const attributeValue = this[PropertySymbol.getAttribute]
			? this[PropertySymbol.getAttribute]()
			: this[PropertySymbol.attributeValue];
		const match = attributeValue?.match(TRANSFORM_REGEXP);

		if (!match) {
			return 0;
		}

		switch (match[1]) {
			case 'matrix':
				return SVGTransform.SVG_TRANSFORM_MATRIX;
			case 'translate':
				return SVGTransform.SVG_TRANSFORM_TRANSLATE;
			case 'rotate':
				return SVGTransform.SVG_TRANSFORM_ROTATE;
			case 'scale':
				return SVGTransform.SVG_TRANSFORM_SCALE;
			case 'skewX':
				return SVGTransform.SVG_TRANSFORM_SKEWX;
			case 'skewY':
				return SVGTransform.SVG_TRANSFORM_SKEWY;
		}

		return 0;
	}

	/**
	 * Returns angle.
	 *
	 * @returns Angle.
	 */
	public get angle(): number {
		const attributeValue = this[PropertySymbol.getAttribute]
			? this[PropertySymbol.getAttribute]()
			: this[PropertySymbol.attributeValue];
		const match = attributeValue?.match(TRANSFORM_REGEXP);

		if (!match) {
			return 0;
		}

		switch (match[1]) {
			case 'rotate':
				const rotate = parseFloat(match[2].split(TRANSFORM_PARAMETER_SPLIT_REGEXP)[0]);
				return isNaN(rotate) ? 0 : rotate;
			case 'rotateX':
				const rotateX = parseFloat(match[2]);
				return isNaN(rotateX) ? 0 : rotateX;
			case 'rotateY':
				const rotateY = parseFloat(match[2]);
				return isNaN(rotateY) ? 0 : rotateY;
			case 'skewX':
				const skewX = parseFloat(match[2]);
				return isNaN(skewX) ? 0 : skewX;
			case 'skewY':
				const skewY = parseFloat(match[2]);
				return isNaN(skewY) ? 0 : skewY;
		}

		return 0;
	}

	/**
	 * Returns matrix.
	 *
	 * @returns Matrix.
	 */
	public get matrix(): SVGMatrix {
		if (!this[PropertySymbol.matrix]) {
			this[PropertySymbol.matrix] = new SVGMatrix(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					readOnly: this[PropertySymbol.readOnly],
					getAttribute: () => {
						if (this[PropertySymbol.getAttribute]) {
							return this[PropertySymbol.getAttribute]();
						}
						return this[PropertySymbol.attributeValue];
					},
					setAttribute: (value: string) => {
						this[PropertySymbol.attributeValue] = value;

						if (this[PropertySymbol.setAttribute]) {
							this[PropertySymbol.setAttribute](value);
							return;
						}
					}
				}
			);
		}
		return this[PropertySymbol.matrix];
	}

	/**
	 * Set matrix.
	 *
	 * @param matrix Matrix.
	 */
	public setMatrix(matrix: SVGMatrix): void {
		if (!(matrix instanceof SVGMatrix)) {
			throw new TypeError(
				'Failed to set the "matrix" property on "SVGTransform": The provided value is not of type "SVGMatrix".'
			);
		}

		if (this[PropertySymbol.readOnly]) {
			return;
		}

		if (this[PropertySymbol.matrix]) {
			this[PropertySymbol.matrix][PropertySymbol.getAttribute] = null;
			this[PropertySymbol.matrix][PropertySymbol.setAttribute] = null;
		}

		matrix[PropertySymbol.getAttribute] = () => {
			if (this[PropertySymbol.getAttribute]) {
				return this[PropertySymbol.getAttribute]();
			}
			return this[PropertySymbol.attributeValue];
		};

		matrix[PropertySymbol.setAttribute] = (value: string) => {
			this[PropertySymbol.attributeValue] = value;

			if (this[PropertySymbol.setAttribute]) {
				this[PropertySymbol.setAttribute](value);
				return;
			}
		};

		this[PropertySymbol.matrix] = matrix;

		if (matrix[PropertySymbol.attributeValue]) {
			this[PropertySymbol.attributeValue] = matrix[PropertySymbol.attributeValue];

			if (this[PropertySymbol.setAttribute]) {
				this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
			}
		}
	}

	/**
	 * Set translate.
	 *
	 * @param x X.
	 * @param y Y.
	 */
	public setTranslate(x: number, y: number): void {
		if (arguments.length < 2) {
			throw new TypeError(
				`Failed to execute 'setTranslate' on 'SVGTransform': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		x = Number(x);
		y = Number(y);

		if (isNaN(x) || isNaN(y)) {
			throw new TypeError(
				`Failed to execute 'setTranslate' on 'SVGTransform':  The provided float value is non-finite.`
			);
		}

		if (this[PropertySymbol.readOnly]) {
			return;
		}

		this[PropertySymbol.attributeValue] = `translate(${x} ${y})`;

		if (this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
		}
	}

	/**
	 * Set scale.
	 *
	 * @param x X.
	 * @param y Y.
	 */
	public setScale(x: number, y: number): void {
		if (arguments.length < 2) {
			throw new TypeError(
				`Failed to execute 'setScale' on 'SVGTransform': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		x = Number(x);
		y = Number(y);

		if (isNaN(x) || isNaN(y)) {
			throw new TypeError(
				`Failed to execute 'setScale' on 'SVGTransform':  The provided float value is non-finite.`
			);
		}

		if (this[PropertySymbol.readOnly]) {
			return;
		}

		this[PropertySymbol.attributeValue] = `scale(${x} ${y})`;

		if (this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
		}
	}

	/**
	 * Set rotate.
	 * @param angle
	 * @param x
	 * @param y
	 */
	public setRotate(angle: number, x: number, y: number): void {
		if (arguments.length < 3) {
			throw new TypeError(
				`Failed to execute 'setRotate' on 'SVGTransform': 3 arguments required, but only ${arguments.length} present.`
			);
		}

		angle = Number(angle);
		x = Number(x);
		y = Number(y);

		if (isNaN(angle) || isNaN(x) || isNaN(y)) {
			throw new TypeError(
				`Failed to execute 'setRotate' on 'SVGTransform':  The provided float value is non-finite.`
			);
		}

		if (this[PropertySymbol.readOnly]) {
			return;
		}

		this[PropertySymbol.attributeValue] = `rotate(${angle} ${x} ${y})`;

		if (this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
		}
	}

	/**
	 * Set skew x.
	 *
	 * @param angle Angle.
	 */
	public setSkewX(angle: number): void {
		if (arguments.length < 1) {
			throw new TypeError(
				`Failed to execute 'setSkewX' on 'SVGTransform': 1 arguments required, but only ${arguments.length} present.`
			);
		}

		angle = Number(angle);

		if (isNaN(angle)) {
			throw new TypeError(
				`Failed to execute 'setSkewX' on 'SVGTransform':  The provided float value is non-finite.`
			);
		}

		if (this[PropertySymbol.readOnly]) {
			return;
		}

		this[PropertySymbol.attributeValue] = `skewX(${angle})`;

		if (this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
		}
	}

	/**
	 * Set skew y.
	 *
	 * @param angle Angle.
	 */
	public setSkewY(angle: number): void {
		if (arguments.length < 1) {
			throw new TypeError(
				`Failed to execute 'setSkewY' on 'SVGTransform': 1 arguments required, but only ${arguments.length} present.`
			);
		}

		angle = Number(angle);

		if (isNaN(angle)) {
			throw new TypeError(
				`Failed to execute 'setSkewY' on 'SVGTransform':  The provided float value is non-finite.`
			);
		}

		if (this[PropertySymbol.readOnly]) {
			return;
		}

		this[PropertySymbol.attributeValue] = `skewY(${angle})`;

		if (this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
		}
	}
}
