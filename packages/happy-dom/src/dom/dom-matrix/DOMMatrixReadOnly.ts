import DOMPoint from '../DOMPoint.js';
import IDOMPointInit from '../IDOMPointInit.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import TDOMMatrixInit from './TDOMMatrixInit.js';
import TDOMMatrix2DArray from './TDOMMatrix2DArray.js';
import TDOMMatrix3DArray from './TDOMMatrix3DArray.js';
import IDOMMatrixJSON from './IDOMMatrixJSON.js';
import IDOMMatrixCompatibleObject from './IDOMMatrixCompatibleObject.js';

const DEFAULT_MATRIX_JSON: IDOMMatrixJSON = {
	a: 1,
	b: 0,
	c: 0,
	d: 1,
	e: 0,
	f: 0,
	m11: 1,
	m12: 0,
	m13: 0,
	m14: 0,
	m21: 0,
	m22: 1,
	m23: 0,
	m24: 0,
	m31: 0,
	m32: 0,
	m33: 1,
	m34: 0,
	m41: 0,
	m42: 0,
	m43: 0,
	m44: 1,
	is2D: true,
	isIdentity: true
};

const TRANSFORM_REGEXP = /([a-z0-9]+)\(([^)]+)\)/gm;
const TRANSFORM_PARAMETER_SPLIT_REGEXP = /[\s,]+/;

/**
 * DOM Matrix.
 *
 * Based on:
 * - https://github.com/trusktr/geometry-interfaces
 * - https://github.com/thednp/dommatrix/tree/master
 *
 *
 * 3D Matrix:
 * _________________________
 * | m11 | m21 | m31 | m41 |
 * | m12 | m22 | m32 | m42 |
 * | m13 | m23 | m33 | m43 |
 * | m14 | m24 | m34 | m44 |
 * -------------------------̣
 *
 * 2D Matrix:
 * _________________________
 * | m11 | m21 | 0   | m41 |
 * | m12 | m22 | 0   | m42 |
 * | 0   | 0   | 1   | 0   |
 * | 0   | 0   | 0   | 1   |
 * -------------------------
 *
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly
 */
export default class DOMMatrixReadOnly {
	public [PropertySymbol.m11]: number = 1;
	public [PropertySymbol.m12]: number = 0;
	public [PropertySymbol.m13]: number = 0;
	public [PropertySymbol.m14]: number = 0;
	public [PropertySymbol.m21]: number = 0;
	public [PropertySymbol.m22]: number = 1;
	public [PropertySymbol.m23]: number = 0;
	public [PropertySymbol.m24]: number = 0;
	public [PropertySymbol.m31]: number = 0;
	public [PropertySymbol.m32]: number = 0;
	public [PropertySymbol.m33]: number = 1;
	public [PropertySymbol.m34]: number = 0;
	public [PropertySymbol.m41]: number = 0;
	public [PropertySymbol.m42]: number = 0;
	public [PropertySymbol.m43]: number = 0;
	public [PropertySymbol.m44]: number = 1;

	/**
	 * Constructor.
	 *
	 * @param init Init parameter.
	 */
	constructor(init?: TDOMMatrixInit) {
		if (init) {
			this[PropertySymbol.setMatrixValue](init);
		}
	}

	/**
	 * Returns the `a` value of the matrix.
	 */
	public get a(): number {
		return this[PropertySymbol.m11];
	}

	/**
	 * Returns the `b` value of the matrix.
	 */
	public get b(): number {
		return this[PropertySymbol.m12];
	}

	/**
	 * Returns the `c` value of the matrix.
	 */
	public get c(): number {
		return this[PropertySymbol.m21];
	}

	/**
	 * Returns the `d` value of the matrix.
	 */
	public get d(): number {
		return this[PropertySymbol.m22];
	}

	/**
	 * Returns the `e` value of the matrix.
	 */
	public get e(): number {
		return this[PropertySymbol.m41];
	}

	/**
	 * Returns the `f` value of the matrix.
	 */
	public get f(): number {
		return this[PropertySymbol.m42];
	}

	/**
	 * Returns the `m11` value of the matrix.
	 */
	public get m11(): number {
		return this[PropertySymbol.m11];
	}

	/**
	 * Returns the `m12` value of the matrix.
	 */
	public get m12(): number {
		return this[PropertySymbol.m12];
	}

	/**
	 * Returns the `m13` value of the matrix.
	 */
	public get m13(): number {
		return this[PropertySymbol.m13];
	}

	/**
	 * Returns the `m14` value of the matrix.
	 */
	public get m14(): number {
		return this[PropertySymbol.m14];
	}

	/**
	 * Returns the `m21` value of the matrix.
	 */
	public get m21(): number {
		return this[PropertySymbol.m21];
	}

	/**
	 * Returns the `m22` value of the matrix.
	 */
	public get m22(): number {
		return this[PropertySymbol.m22];
	}

	/**
	 * Returns the `m23` value of the matrix.
	 */
	public get m23(): number {
		return this[PropertySymbol.m23];
	}

	/**
	 * Returns the `m24` value of the matrix.
	 */
	public get m24(): number {
		return this[PropertySymbol.m24];
	}

	/**
	 * Returns the `m31` value of the matrix.
	 */
	public get m31(): number {
		return this[PropertySymbol.m31];
	}

	/**
	 * Returns the `m32` value of the matrix.
	 */
	public get m32(): number {
		return this[PropertySymbol.m32];
	}

	/**
	 * Returns the `m33` value of the matrix.
	 */
	public get m33(): number {
		return this[PropertySymbol.m33];
	}

	/**
	 * Returns the `m34` value of the matrix.
	 */
	public get m34(): number {
		return this[PropertySymbol.m34];
	}

	/**
	 * Returns the `m41` value of the matrix.
	 */
	public get m41(): number {
		return this[PropertySymbol.m41];
	}

	/**
	 * Returns the `m42` value of the matrix.
	 */
	public get m42(): number {
		return this[PropertySymbol.m42];
	}

	/**
	 * Returns the `m43` value of the matrix.
	 */
	public get m43(): number {
		return this[PropertySymbol.m43];
	}

	/**
	 * Returns the `m44` value of the matrix.
	 */
	public get m44(): number {
		return this[PropertySymbol.m44];
	}

	/**
	 * A `Boolean` whose value is `true` if the matrix is the identity matrix.
	 *
	 * The identity matrix is one in which every value is 0 except those on the main diagonal from top-left to bottom-right corner (in other words, where the offsets in each direction are equal).
	 *
	 * @returns "true" if the matrix is the identity matrix.
	 */
	public get isIdentity(): boolean {
		return (
			this[PropertySymbol.m11] === 1 &&
			this[PropertySymbol.m12] === 0 &&
			this[PropertySymbol.m13] === 0 &&
			this[PropertySymbol.m14] === 0 &&
			this[PropertySymbol.m21] === 0 &&
			this[PropertySymbol.m22] === 1 &&
			this[PropertySymbol.m23] === 0 &&
			this[PropertySymbol.m24] === 0 &&
			this[PropertySymbol.m31] === 0 &&
			this[PropertySymbol.m32] === 0 &&
			this[PropertySymbol.m33] === 1 &&
			this[PropertySymbol.m34] === 0 &&
			this[PropertySymbol.m41] === 0 &&
			this[PropertySymbol.m42] === 0 &&
			this[PropertySymbol.m43] === 0 &&
			this[PropertySymbol.m44] === 1
		);
	}

	/**
	 * A `Boolean` flag whose value is `true` if the matrix is a 2D matrix and `false` if the matrix is 3D.
	 *
	 * @returns "true" if the matrix is a 2D matrix.
	 */
	public get is2D(): boolean {
		return (
			this[PropertySymbol.m31] === 0 &&
			this[PropertySymbol.m32] === 0 &&
			this[PropertySymbol.m33] === 1 &&
			this[PropertySymbol.m34] === 0 &&
			this[PropertySymbol.m43] === 0 &&
			this[PropertySymbol.m44] === 1
		);
	}

	/**
	 * Returns a *Float32Array* containing elements which comprise the matrix.
	 *
	 * The method can return either the 16 elements or the 6 elements depending on the value of the `is2D` parameter.
	 *
	 * @param [is2D] Set to `true` to return a 2D matrix.
	 * @returns An *Array* representation of the matrix.
	 */
	public toFloat32Array(is2D?: boolean): Float32Array {
		return Float32Array.from(this[PropertySymbol.toArray](is2D));
	}

	/**
	 * Returns a *Float64Array* containing elements which comprise the matrix.
	 *
	 * The method can return either the 16 elements or the 6 elements depending on the value of the `is2D` parameter.
	 *
	 * @param [is2D] Set to `true` to return a 2D matrix.
	 * @returns An *Array* representation of the matrix
	 */
	public toFloat64Array(is2D?: boolean): Float64Array {
		return Float64Array.from(this[PropertySymbol.toArray](is2D));
	}

	/**
	 * Returns a string representation of the matrix in `CSS` matrix syntax, using the appropriate `CSS` matrix notation.
	 *
	 * Examples:
	 * - `matrix3d(m11, m12, m13, m14, m21, ...)`
	 * - `matrix(a, b, c, d, e, f)`
	 *
	 * @returns A string representation of the matrix.
	 */
	public toString(): string {
		const is2D = this.is2D;
		const values = this[PropertySymbol.toArray](is2D).join(', ');
		const type = is2D ? 'matrix' : 'matrix3d';
		return `${type}(${values})`;
	}

	/**
	 * Returns an Object that can be serialized to a JSON string.
	 *
	 * The result can be used as a second parameter for the `fromMatrix` static method to load values into another matrix instance.
	 *
	 * @returns An *Object* with matrix values.
	 */
	public toJSON(): IDOMMatrixJSON {
		const { is2D, isIdentity } = this;
		return {
			m11: this[PropertySymbol.m11],
			m12: this[PropertySymbol.m12],
			m13: this[PropertySymbol.m13],
			m14: this[PropertySymbol.m14],
			m21: this[PropertySymbol.m21],
			m22: this[PropertySymbol.m22],
			m23: this[PropertySymbol.m23],
			m24: this[PropertySymbol.m24],
			m31: this[PropertySymbol.m31],
			m32: this[PropertySymbol.m32],
			m33: this[PropertySymbol.m33],
			m34: this[PropertySymbol.m34],
			m41: this[PropertySymbol.m41],
			m42: this[PropertySymbol.m42],
			m43: this[PropertySymbol.m43],
			m44: this[PropertySymbol.m44],
			a: this[PropertySymbol.m11],
			b: this[PropertySymbol.m12],
			c: this[PropertySymbol.m21],
			d: this[PropertySymbol.m22],
			e: this[PropertySymbol.m41],
			f: this[PropertySymbol.m42],
			is2D,
			isIdentity
		};
	}

	/**
	 * Returns a new DOMMatrix instance which is the result of this matrix multiplied by the passed matrix.
	 *
	 * @param secondMatrix DOMMatrix
	 * @returns A new DOMMatrix object.
	 */
	public multiply(secondMatrix: IDOMMatrixCompatibleObject): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.multiplySelf](secondMatrix);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by a translation matrix containing the passed values.
	 *
	 * @param [x=0] X component of the translation value.
	 * @param [y=0] Y component of the translation value.
	 * @param [z=0] Z component of the translation value.
	 * @returns The resulted matrix
	 */
	public translate(x: number = 0, y: number = 0, z: number = 0): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.translateSelf](x, y, z);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by a scale 2D matrix containing the passed values.
	 *
	 * @param [scaleX] X-Axis scale.
	 * @param [scaleY] Y-Axis scale.
	 * @param [scaleZ] Z-Axis scale.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @param [originZ] Z-Axis scale.
	 * @returns The resulted matrix
	 */
	public scale(
		scaleX = 1,
		scaleY = 1,
		scaleZ = 1,
		originX = 0,
		originY = 0,
		originZ = 0
	): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.scaleSelf](scaleX, scaleY, scaleZ, originX, originY, originZ);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by a scale 3D matrix containing the passed values.
	 *
	 * @param [scale] The scale factor.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @param [originZ] Z-Axis scale.
	 * @returns The resulted matrix
	 */
	public scale3d(scale = 1, originX = 0, originY = 0, originZ = 0): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.scale3dSelf](scale, originX, originY, originZ);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by a scale 3D matrix containing the passed values.
	 *
	 * @param [scaleX] X-Axis scale.
	 * @param [scaleY] Y-Axis scale.
	 * @returns The resulted matrix
	 */
	public scaleNonUniform(scaleX = 1, scaleY = 1): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.scaleNonUniformSelf](scaleX, scaleY);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
	 *
	 * @param [x] X component of the rotation, or Z if Y and Z are null.
	 * @param [y] Y component of the rotation value.
	 * @param [z] Z component of the rotation value.
	 * @returns The resulted matrix
	 */
	public rotate(x = 0, y?: number, z?: number): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.rotateSelf](x, y, z);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by a rotation matrix with the given axis and `angle`.
	 *
	 * @param x The X component of the axis vector.
	 * @param y The Y component of the axis vector.
	 * @param z The Z component of the axis vector.
	 * @param angle Angle of rotation about the axis vector, in degrees.
	 * @returns The resulted matrix
	 */
	public rotateAxisAngle(x: number, y: number, z: number, angle: number): DOMMatrixReadOnly {
		if (arguments.length !== 4) {
			throw new TypeError(
				`Failed to execute 'rotateAxisAngle' on 'DOMMatrix': 4 arguments required, but only ${arguments.length} present.`
			);
		}

		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.rotateAxisAngleSelf](x, y, z, angle);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by a skew matrix along the X axis by the given angle.
	 *
	 * Not implemented in Happy DOM yet.
	 *
	 * @param [_x] X-Axis skew.
	 * @param [_y] Y-Axis skew.
	 */
	public rotateFromVector(_x: number = 0, _y: number = 0): DOMMatrixReadOnly {
		throw new TypeError(
			`Failed to execute 'rotateFromVector' on '${this.constructor.name}': Method has not been implemented in Happy DOM yet.`
		);
	}

	/**
	 * Returns a new DOMMatrix instance that specifies a skew transformation along X-Axis by the given angle.
	 *
	 * @param angle Angle amount in degrees to skew.
	 * @returns The resulted matrix
	 */
	public skewX(angle: number): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.skewXSelf](angle);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance that specifies a skew transformation along Y-Axis by the given angle.
	 *
	 * @param angle Angle amount in degrees to skew.
	 * @returns The resulted matrix
	 */
	public skewY(angle: number): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.skewYSelf](angle);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix flipped on X-axis.
	 */
	public flipX(): DOMMatrixReadOnly {
		throw new TypeError(
			`Failed to execute 'flipX' on '${this.constructor.name}': Method has not been implemented in Happy DOM yet.`
		);
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix flipped on Y-axis.
	 */
	public flipY(): DOMMatrixReadOnly {
		throw new TypeError(
			`Failed to execute 'flipY' on '${this.constructor.name}': Method has not been implemented in Happy DOM yet.`
		);
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix inverted.
	 */
	public inverse(): DOMMatrixReadOnly {
		throw new TypeError(
			`Failed to execute 'inverse' on '${this.constructor.name}': Method has not been implemented in Happy DOM yet.`
		);
	}

	/**
	 * Returns a new DOMPoint instance with the vector transformed using the matrix.
	 *
	 * @param domPoint DOM point compatible object.
	 * @returns A new DOMPoint object.
	 */
	public transformPoint(domPoint: IDOMPointInit): IDOMPointInit {
		const xPoint = domPoint.x ?? 0;
		const yPoint = domPoint.y ?? 0;
		const zPoint = domPoint.z ?? 0;
		const wPoint = domPoint.w ?? 1;

		const x =
			this[PropertySymbol.m11] * xPoint +
			this[PropertySymbol.m21] * yPoint +
			this[PropertySymbol.m31] * zPoint +
			this[PropertySymbol.m41] * wPoint;
		const y =
			this[PropertySymbol.m12] * xPoint +
			this[PropertySymbol.m22] * yPoint +
			this[PropertySymbol.m32] * zPoint +
			this[PropertySymbol.m42] * wPoint;
		const z =
			this[PropertySymbol.m13] * xPoint +
			this[PropertySymbol.m23] * yPoint +
			this[PropertySymbol.m33] * zPoint +
			this[PropertySymbol.m43] * wPoint;
		const w =
			this[PropertySymbol.m14] * xPoint +
			this[PropertySymbol.m24] * yPoint +
			this[PropertySymbol.m34] * zPoint +
			this[PropertySymbol.m44] * wPoint;

		return new DOMPoint(x, y, z, w);
	}

	/**
	 * The `setMatrixValue` method replaces the existing matrix with one computed in the browser (e.g.`matrix(1,0.25,-0.25,1,0,0)`).
	 *
	 * @param source A `DOMMatrix`, `Float32Array`, `Float64Array`, `Array`, or DOMMatrix compatible object to set the matrix values from.
	 */
	public [PropertySymbol.setMatrixValue](source?: TDOMMatrixInit): void {
		let matrix: DOMMatrixReadOnly;

		// String
		if (typeof source === 'string' && source.length && source !== 'none') {
			matrix = (<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromString](source);
		}
		// Array
		else if (
			Array.isArray(source) ||
			source instanceof Float64Array ||
			source instanceof Float32Array
		) {
			matrix = (<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromArray](source);
		}
		// DOMMatrixReadOnly or IDOMMatrixCompatibleObject
		else if (typeof source === 'object') {
			matrix = (<typeof DOMMatrixReadOnly>this.constructor).fromMatrix(
				<IDOMMatrixCompatibleObject>source
			);
		}

		this[PropertySymbol.m11] = matrix[PropertySymbol.m11];
		this[PropertySymbol.m12] = matrix[PropertySymbol.m12];
		this[PropertySymbol.m13] = matrix[PropertySymbol.m13];
		this[PropertySymbol.m14] = matrix[PropertySymbol.m14];
		this[PropertySymbol.m21] = matrix[PropertySymbol.m21];
		this[PropertySymbol.m22] = matrix[PropertySymbol.m22];
		this[PropertySymbol.m23] = matrix[PropertySymbol.m23];
		this[PropertySymbol.m24] = matrix[PropertySymbol.m24];
		this[PropertySymbol.m31] = matrix[PropertySymbol.m31];
		this[PropertySymbol.m32] = matrix[PropertySymbol.m32];
		this[PropertySymbol.m33] = matrix[PropertySymbol.m33];
		this[PropertySymbol.m34] = matrix[PropertySymbol.m34];
		this[PropertySymbol.m41] = matrix[PropertySymbol.m41];
		this[PropertySymbol.m42] = matrix[PropertySymbol.m42];
		this[PropertySymbol.m43] = matrix[PropertySymbol.m43];
		this[PropertySymbol.m44] = matrix[PropertySymbol.m44];
	}

	/**
	 * Applies a rotation to the matrix.
	 *
	 * This method is equivalent to the CSS `rotate3d()` function.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param [x] X-Axis vector length.
	 * @param [y] Y-Axis vector length.
	 * @param [z] Z-Axis vector length.
	 * @param [angle] Angle in degrees of the rotation.
	 */
	public [PropertySymbol.rotateAxisAngleSelf](
		x: number = 0,
		y: number = 0,
		z: number = 0,
		angle: number = 0
	): void {
		x = Number(x);
		y = Number(y);
		z = Number(z);
		angle = Number(angle);

		if (isNaN(x) || isNaN(y) || isNaN(z) || isNaN(angle)) {
			throw new TypeError(
				`Failed to execute 'rotateAxisAngleSelf' on 'DOMMatrix': The arguments must be numbers.`
			);
		}
		const length = Math.sqrt(x * x + y * y + z * z);

		// Bad vector length
		if (length === 0) {
			// TODO: Should this throw an error?
			return;
		}

		x = x / length;
		y = y / length;
		z = z / length;

		const alpha = (angle * Math.PI) / 180;

		const sc = Math.sin(alpha / 2) * Math.cos(alpha / 2);
		const sq = Math.sin(alpha / 2) * Math.sin(alpha / 2);

		/**
		 * 3D Matrix:
		 * _________________________
		 * | m11 | m21 | m31 | m41 |
		 * | m12 | m22 | m32 | m42 |
		 * | m13 | m23 | m33 | m43 |
		 * | m14 | m24 | m34 | m44 |
		 * -------------------------̣
		 */

		const m11 = 1 - 2 * (y * y + z * z) * sq;
		const m12 = 2 * (x * y * sq + z * sc);
		const m13 = 2 * (x * z * sq - y * sc);
		const m21 = 2 * (x * y * sq - z * sc);
		const m22 = 1 - 2 * (x * x + z * z) * sq;
		const m23 = 2 * (y * z * sq + x * sc);
		const m31 = 2 * (x * z * sq + y * sc);
		const m32 = 2 * (y * z * sq - x * sc);
		const m33 = 1 - 2 * (x * x + y * y) * sq;

		// prettier-ignore
		const matrix = (<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromArray]([
            m11, m21, m31, 0,
            m12, m22, m32, 0,
            m13, m23, m33, 0,
            0,   0,   0,   1
        ]);

		this[PropertySymbol.multiplySelf](matrix);
	}

	/**
	 * Applies a rotation to the matrix.
	 *
	 * @see http://en.wikipedia.org/wiki/Rotation_matrix
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param [x] X-Axis rotation.
	 * @param [y] Y-Axis rotation.
	 * @param [z] Z-Axis rotation.
	 */
	public [PropertySymbol.rotateSelf](x: number = 0, y?: number, z?: number): void {
		// If Y and Z are both missing, set Z to the value of X and set X and Y to 0.
		if (y === undefined && z === undefined) {
			z = x;
			x = 0;
			y = 0;
		}

		// If Y is still missing, set Y to 0.
		if (y === undefined) {
			y = 0;
		}

		// If Z is still missing, set Z to 0
		if (z === undefined) {
			y = 0;
		}

		x = Number(x);
		y = Number(y);
		z = Number(z);

		if (isNaN(x) || isNaN(y) || isNaN(z)) {
			throw new TypeError(
				`Failed to execute 'rotateSelf' on 'DOMMatrix': The arguments must be numbers.`
			);
		}

		this[PropertySymbol.rotateAxisAngleSelf](0, 0, 1, z);
		this[PropertySymbol.rotateAxisAngleSelf](0, 1, 0, y);
		this[PropertySymbol.rotateAxisAngleSelf](1, 0, 0, x);
	}

	/**
	 * Applies translate to the matrix.
	 *
	 * This method is equivalent to the CSS `translate3d()` function.
	 *
	 * @see https://drafts.csswg.org/css-transforms-1/#TranslateDefined
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param [x] X-Axis position.
	 * @param [y] Y-Axis position.
	 * @param [z] Z-Axis position.
	 */
	public [PropertySymbol.translateSelf](x: number = 0, y: number = 0, z: number = 0): void {
		// prettier-ignore
		const translationMatrix = (<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromArray]([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ]);

		this[PropertySymbol.multiplySelf](translationMatrix);
	}

	/**
	 * Applies a scale to the matrix.
	 *
	 * This method is equivalent to the CSS `scale()` function.
	 *
	 * @see https://drafts.csswg.org/css-transforms-1/#ScaleDefined
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param [scaleX] X-Axis scale.
	 * @param [scaleY] Y-Axis scale.
	 * @param [scaleZ] Z-Axis scale.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @param [originZ] Z-Axis scale.
	 */
	public [PropertySymbol.scaleSelf](
		scaleX: number,
		scaleY: number,
		scaleZ = 1,
		originX = 0,
		originY = 0,
		originZ = 0
	): void {
		// If scaleY is missing, set scaleY to the value of scaleX.
		scaleX = scaleX === undefined ? 1 : Number(scaleX);
		scaleY = scaleY === undefined ? scaleX : Number(scaleY);

		this[PropertySymbol.translateSelf](originX, originY, originZ);

		// prettier-ignore
		this[PropertySymbol.multiplySelf]((<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromArray]([
            scaleX, 0,      0,      0,
            0,      scaleY, 0,      0,
            0,      0,      scaleZ, 0,
            0,      0,      0,      1,
        ]))

		this[PropertySymbol.translateSelf](-originX, -originY, -originZ);
	}

	/**
	 * Applies a scale to the matrix.
	 *
	 * This method is equivalent to the CSS `scale()` function.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param [scale] The scale factor.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @param [originZ] Z-Axis scale.
	 */
	public [PropertySymbol.scale3dSelf](scale = 1, originX = 0, originY = 0, originZ = 0): void {
		this[PropertySymbol.translateSelf](originX, originY, originZ);

		// prettier-ignore
		this[PropertySymbol.multiplySelf]((<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromArray]([
            scale, 0,     0,     0,
            0,     scale, 0,     0,
            0,     0,     scale, 0,
            0,     0,     0,     1,
        ]))

		this[PropertySymbol.translateSelf](-originX, -originY, -originZ);
	}

	/**
	 * Applies a scale to the matrix.
	 *
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param [scaleX] X-Axis scale.
	 * @param [scaleY] Y-Axis scale.
	 */
	public [PropertySymbol.scaleNonUniformSelf](scaleX = 1, scaleY = 1): void {
		// prettier-ignore
		this[PropertySymbol.multiplySelf]((<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromArray]([
            scaleX, 0,      0,      0,
            0,      scaleY, 0,      0,
            0,      0,      1,      0,
            0,      0,      0,      1,
        ]));
	}

	/**
	 * Applies a skew operation to the matrix on the X axis.
	 *
	 * This method is equivalent to the CSS `skewX()` function.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param angle Angle in degrees.
	 */
	public [PropertySymbol.skewXSelf](angle: number): void {
		const matrix = Object.assign({}, DEFAULT_MATRIX_JSON);
		const radX = (angle * Math.PI) / 180;
		const tX = Math.tan(radX);

		matrix.m21 = tX;
		matrix.c = tX;

		this[PropertySymbol.multiplySelf](matrix);
	}

	/**
	 * Applies a skew operation to the matrix on the Y axis.
	 *
	 * This method is equivalent to the CSS `skewY()` function.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param angle Angle in degrees.
	 */
	public [PropertySymbol.skewYSelf](angle: number): void {
		const matrix = Object.assign({}, DEFAULT_MATRIX_JSON);
		const radY = (angle * Math.PI) / 180;
		const tY = Math.tan(radY);

		matrix.m12 = tY;
		matrix.b = tY;

		this[PropertySymbol.multiplySelf](matrix);
	}

	/**
	 * Applies a multiply operation to the current matrix.
	 *
	 * @param matrix Second matrix.
	 */
	public [PropertySymbol.multiplySelf](matrix: IDOMMatrixCompatibleObject): void {
		if (!(matrix instanceof DOMMatrixReadOnly)) {
			if (matrix?.m11 === undefined && matrix?.a !== undefined) {
				matrix = Object.assign({}, DEFAULT_MATRIX_JSON, matrix);
				matrix.m11 = matrix.a;
				matrix.m12 = matrix.b;
				matrix.m21 = matrix.c;
				matrix.m22 = matrix.d;
				matrix.m41 = matrix.e;
				matrix.m42 = matrix.f;
			} else {
				matrix = Object.assign({}, DEFAULT_MATRIX_JSON, matrix);
			}
		}

		const m11 =
			this[PropertySymbol.m11] * matrix.m11 +
			this[PropertySymbol.m21] * matrix.m12 +
			this[PropertySymbol.m31] * matrix.m13 +
			this[PropertySymbol.m41] * matrix.m14;
		const m21 =
			this[PropertySymbol.m11] * matrix.m21 +
			this[PropertySymbol.m21] * matrix.m22 +
			this[PropertySymbol.m31] * matrix.m23 +
			this[PropertySymbol.m41] * matrix.m24;
		const m31 =
			this[PropertySymbol.m11] * matrix.m31 +
			this[PropertySymbol.m21] * matrix.m32 +
			this[PropertySymbol.m31] * matrix.m33 +
			this[PropertySymbol.m41] * matrix.m34;
		const m41 =
			this[PropertySymbol.m11] * matrix.m41 +
			this[PropertySymbol.m21] * matrix.m42 +
			this[PropertySymbol.m31] * matrix.m43 +
			this[PropertySymbol.m41] * matrix.m44;

		const m12 =
			this[PropertySymbol.m12] * matrix.m11 +
			this[PropertySymbol.m22] * matrix.m12 +
			this[PropertySymbol.m32] * matrix.m13 +
			this[PropertySymbol.m42] * matrix.m14;
		const m22 =
			this[PropertySymbol.m12] * matrix.m21 +
			this[PropertySymbol.m22] * matrix.m22 +
			this[PropertySymbol.m32] * matrix.m23 +
			this[PropertySymbol.m42] * matrix.m24;
		const m32 =
			this[PropertySymbol.m12] * matrix.m31 +
			this[PropertySymbol.m22] * matrix.m32 +
			this[PropertySymbol.m32] * matrix.m33 +
			this[PropertySymbol.m42] * matrix.m34;
		const m42 =
			this[PropertySymbol.m12] * matrix.m41 +
			this[PropertySymbol.m22] * matrix.m42 +
			this[PropertySymbol.m32] * matrix.m43 +
			this[PropertySymbol.m42] * matrix.m44;

		const m13 =
			this[PropertySymbol.m13] * matrix.m11 +
			this[PropertySymbol.m23] * matrix.m12 +
			this[PropertySymbol.m33] * matrix.m13 +
			this[PropertySymbol.m43] * matrix.m14;
		const m23 =
			this[PropertySymbol.m13] * matrix.m21 +
			this[PropertySymbol.m23] * matrix.m22 +
			this[PropertySymbol.m33] * matrix.m23 +
			this[PropertySymbol.m43] * matrix.m24;
		const m33 =
			this[PropertySymbol.m13] * matrix.m31 +
			this[PropertySymbol.m23] * matrix.m32 +
			this[PropertySymbol.m33] * matrix.m33 +
			this[PropertySymbol.m43] * matrix.m34;
		const m43 =
			this[PropertySymbol.m13] * matrix.m41 +
			this[PropertySymbol.m23] * matrix.m42 +
			this[PropertySymbol.m33] * matrix.m43 +
			this[PropertySymbol.m43] * matrix.m44;

		const m14 =
			this[PropertySymbol.m14] * matrix.m11 +
			this[PropertySymbol.m24] * matrix.m12 +
			this[PropertySymbol.m34] * matrix.m13 +
			this[PropertySymbol.m44] * matrix.m14;
		const m24 =
			this[PropertySymbol.m14] * matrix.m21 +
			this[PropertySymbol.m24] * matrix.m22 +
			this[PropertySymbol.m34] * matrix.m23 +
			this[PropertySymbol.m44] * matrix.m24;
		const m34 =
			this[PropertySymbol.m14] * matrix.m31 +
			this[PropertySymbol.m24] * matrix.m32 +
			this[PropertySymbol.m34] * matrix.m33 +
			this[PropertySymbol.m44] * matrix.m34;
		const m44 =
			this[PropertySymbol.m14] * matrix.m41 +
			this[PropertySymbol.m24] * matrix.m42 +
			this[PropertySymbol.m34] * matrix.m43 +
			this[PropertySymbol.m44] * matrix.m44;

		this[PropertySymbol.m11] = m11;
		this[PropertySymbol.m12] = m12;
		this[PropertySymbol.m13] = m13;
		this[PropertySymbol.m14] = m14;
		this[PropertySymbol.m21] = m21;
		this[PropertySymbol.m22] = m22;
		this[PropertySymbol.m23] = m23;
		this[PropertySymbol.m24] = m24;
		this[PropertySymbol.m31] = m31;
		this[PropertySymbol.m32] = m32;
		this[PropertySymbol.m33] = m33;
		this[PropertySymbol.m34] = m34;
		this[PropertySymbol.m41] = m41;
		this[PropertySymbol.m42] = m42;
		this[PropertySymbol.m43] = m43;
		this[PropertySymbol.m44] = m44;
	}

	/**
	 * Returns an *Array* containing elements which comprise the matrix.
	 *
	 * @param matrix Matrix to convert.
	 * @param [is2D] If the matrix is 2D.
	 * @returns Array representation of the matrix.
	 */
	public [PropertySymbol.toArray](is2D: boolean = false): TDOMMatrix2DArray | TDOMMatrix3DArray {
		if (is2D) {
			return [
				this[PropertySymbol.m11],
				this[PropertySymbol.m12],
				this[PropertySymbol.m21],
				this[PropertySymbol.m22],
				this[PropertySymbol.m41],
				this[PropertySymbol.m42]
			];
		}

		return [
			this[PropertySymbol.m11],
			this[PropertySymbol.m12],
			this[PropertySymbol.m13],
			this[PropertySymbol.m14],
			this[PropertySymbol.m21],
			this[PropertySymbol.m22],
			this[PropertySymbol.m23],
			this[PropertySymbol.m24],
			this[PropertySymbol.m31],
			this[PropertySymbol.m32],
			this[PropertySymbol.m33],
			this[PropertySymbol.m34],
			this[PropertySymbol.m41],
			this[PropertySymbol.m42],
			this[PropertySymbol.m43],
			this[PropertySymbol.m44]
		];
	}

	/**
	 * Returns a new `DOMMatrix` instance given an existing matrix.
	 *
	 * @param matrix Matrix.
	 */
	public static fromMatrix(matrix: IDOMMatrixCompatibleObject): DOMMatrixReadOnly {
		if (!(matrix instanceof DOMMatrixReadOnly)) {
			if (matrix?.m11 === undefined && matrix?.a !== undefined) {
				matrix = Object.assign({}, DEFAULT_MATRIX_JSON, matrix);
				matrix.m11 = matrix.a;
				matrix.m12 = matrix.b;
				matrix.m21 = matrix.c;
				matrix.m22 = matrix.d;
				matrix.m41 = matrix.e;
				matrix.m42 = matrix.f;
			} else {
				matrix = Object.assign({}, DEFAULT_MATRIX_JSON, matrix);
			}
		}

		return this[PropertySymbol.fromArray]([
			matrix.m11,
			matrix.m12,
			matrix.m13,
			matrix.m14,
			matrix.m21,
			matrix.m22,
			matrix.m23,
			matrix.m24,
			matrix.m31,
			matrix.m32,
			matrix.m33,
			matrix.m34,
			matrix.m41,
			matrix.m42,
			matrix.m43,
			matrix.m44
		]);
	}

	/**
	 * Returns a new `DOMMatrix` instance given an array of 16/6 floating point values.
	 *
	 * @param array An `Array` to feed values from.
	 * @returns DOMMatrix instance.
	 */
	public static fromFloat32Array(array: Float32Array): DOMMatrixReadOnly {
		return this[PropertySymbol.fromArray](array);
	}

	/**
	 * Returns a new `DOMMatrix` instance given an array of 16/6 floating point values.
	 *
	 * @param array An `Array` to feed values from.
	 * @returns DOMMatrix instance.
	 */
	public static fromFloat64Array(array: Float64Array): DOMMatrixReadOnly {
		return this[PropertySymbol.fromArray](array);
	}

	/**
	 * Returns a new `DOMMatrix` instance given an array of 16/6 floating point values.
	 *
	 * Conditions:
	 * - If the array has six values, the result is a 2D matrix.
	 * - If the array has 16 values, the result is a 3D matrix.
	 * - Otherwise, a TypeError exception is thrown.
	 *
	 * @param array An `Array` to feed values from.
	 * @returns DOMMatrix instance.
	 */
	public static [PropertySymbol.fromArray](
		array: any[] | Float32Array | Float64Array
	): DOMMatrixReadOnly {
		if (
			!(array instanceof Float64Array || array instanceof Float32Array || Array.isArray(array)) ||
			(array.length !== 6 && array.length !== 16)
		) {
			throw TypeError(
				`Failed to execute 'fromArray' on '${this.name}': '${String(
					array
				)}' is not a compatible array.`
			);
		}

		const matrix = new (<typeof DOMMatrixReadOnly>this)();

		if (array.length === 16) {
			const [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] =
				array;

			matrix[PropertySymbol.m11] = m11;
			matrix[PropertySymbol.m12] = m12;
			matrix[PropertySymbol.m13] = m13;
			matrix[PropertySymbol.m14] = m14;
			matrix[PropertySymbol.m21] = m21;
			matrix[PropertySymbol.m22] = m22;
			matrix[PropertySymbol.m23] = m23;
			matrix[PropertySymbol.m24] = m24;
			matrix[PropertySymbol.m31] = m31;
			matrix[PropertySymbol.m32] = m32;
			matrix[PropertySymbol.m33] = m33;
			matrix[PropertySymbol.m34] = m34;
			matrix[PropertySymbol.m41] = m41;
			matrix[PropertySymbol.m42] = m42;
			matrix[PropertySymbol.m43] = m43;
			matrix[PropertySymbol.m44] = m44;
		} else if (array.length === 6) {
			const [m11, m12, m21, m22, m41, m42] = array;

			matrix[PropertySymbol.m11] = m11;
			matrix[PropertySymbol.m12] = m12;
			matrix[PropertySymbol.m21] = m21;
			matrix[PropertySymbol.m22] = m22;
			matrix[PropertySymbol.m41] = m41;
			matrix[PropertySymbol.m42] = m42;
		}

		return matrix;
	}

	/**
	 * Returns a new `DOMMatrix` instance from a DOM transform string.
	 *
	 * @param source valid CSS transform string syntax.
	 * @returns DOMMatrix instance.
	 */
	public static [PropertySymbol.fromString](source: string): DOMMatrixReadOnly {
		if (typeof source !== 'string') {
			throw TypeError(
				`Failed to execute 'setMatrixValue' on '${this.name}': Expected '${String(
					source
				)}' to be a string.`
			);
		}

		const domMatrix = new (<typeof DOMMatrixReadOnly>this)();
		const regexp = new RegExp(TRANSFORM_REGEXP);
		let match: RegExpMatchArray | null;

		while ((match = regexp.exec(source))) {
			const parameters: number[] = <number[]>(
				(<unknown>match[2].split(TRANSFORM_PARAMETER_SPLIT_REGEXP))
			);

			for (let i = 0, max = parameters.length; i < max; i++) {
				if ((<string>(<unknown>parameters[i])).includes('rad')) {
					parameters[i] = parseFloat(<string>(<unknown>parameters[i])) * (180 / Math.PI);
				} else {
					parameters[i] = parseFloat(<string>(<unknown>parameters[i]));
				}
			}

			const [x, y, z, a] = parameters;

			switch (match[1]) {
				case 'perspective':
					if (!isNaN(x) && y === undefined && z === undefined) {
						domMatrix[PropertySymbol.m34] = -1 / x;
					}
					break;
				case 'matrix':
				case 'matrix3d':
					if (parameters.length === 6 || parameters.length === 16) {
						domMatrix[PropertySymbol.setMatrixValue](this[PropertySymbol.fromArray](parameters));
					}
					break;
				case 'translate':
					if (!isNaN(x) && z === undefined) {
						domMatrix[PropertySymbol.translateSelf](x, y || 0, 0);
					}
					break;
				case 'translate3d':
					if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
						domMatrix[PropertySymbol.translateSelf](x, y, z);
					}
					break;
				case 'translateX':
					if (!isNaN(x) && y === undefined && z === undefined) {
						domMatrix[PropertySymbol.translateSelf](x, 0, 0);
					}
					break;
				case 'translateY':
					if (!isNaN(x) && y === undefined && z === undefined) {
						domMatrix[PropertySymbol.translateSelf](0, x, 0);
					}
					break;
				case 'translateZ':
					if (!isNaN(x) && y === undefined && z === undefined) {
						domMatrix[PropertySymbol.translateSelf](0, 0, x);
					}
					break;
				case 'rotate':
					if (!isNaN(x) && y === undefined && z === undefined) {
						domMatrix[PropertySymbol.rotateSelf](0, 0, x);
					}
					break;
				case 'rotateX':
					if (!isNaN(x) && y === undefined && z === undefined) {
						domMatrix[PropertySymbol.rotateSelf](x, 0, 0);
					}
					break;
				case 'rotateY':
					if (!isNaN(x) && y === undefined && z === undefined) {
						domMatrix[PropertySymbol.rotateSelf](0, x, 0);
					}
				case 'rotate3d':
					if (!isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(a)) {
						domMatrix[PropertySymbol.rotateAxisAngleSelf](x, y, z, a);
					}
					break;
				case 'scale':
					if (!isNaN(x) && x !== 1 && z === undefined) {
						domMatrix[PropertySymbol.scaleSelf](x, isNaN(y) ? x : y);
					}
					break;
				case 'scale3d':
					if (!isNaN(x) && !isNaN(y) && !isNaN(z) && (x !== 1 || y !== 1 || z !== 1)) {
						domMatrix[PropertySymbol.scale3dSelf](x, y, z);
					}
					break;
				case 'skew':
					if (!isNaN(x) && !isNaN(y) && z === undefined) {
						domMatrix[PropertySymbol.skewXSelf](x);
						domMatrix[PropertySymbol.skewYSelf](y);
					}
					break;
				case 'skewX':
					if (!isNaN(x) && y === undefined) {
						domMatrix[PropertySymbol.skewXSelf](x);
					}
					break;
				case 'skewY':
					if (!isNaN(x) && y === undefined) {
						domMatrix[PropertySymbol.skewYSelf](x);
					}
					break;
				default:
					throw TypeError(
						`Failed to execute 'setMatrixValue' on '${this.name}': Unknown transform function '${match[1]}'.`
					);
			}
		}

		return domMatrix;
	}
}
