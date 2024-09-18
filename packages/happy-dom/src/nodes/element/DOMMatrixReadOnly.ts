import DOMPoint from './DOMPoint.js';
import IDOMPointInit from './IDOMPointInit.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IJSONMatrix from './IJSONMatrix.js';
import TDOMMatrixInit from './TDOMMatrixInit.js';
import TMatrix2D from './TMatrix2D.js';
import TMatrix3D from './TMatrix3D.js';

const JSON_MATRIX: IJSONMatrix = {
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

/**
 * DOM Matrix.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly
 *
 * Based on:
 * https://github.com/thednp/dommatrix/tree/master
 * https://github.com/trusktr/geometry-interfaces
 */
export default class DOMMatrixReadOnly {
	public [PropertySymbol.a]: number = 1;
	public [PropertySymbol.b]: number = 0;
	public [PropertySymbol.c]: number = 0;
	public [PropertySymbol.d]: number = 1;
	public [PropertySymbol.e]: number = 0;
	public [PropertySymbol.f]: number = 0;
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
		return this[PropertySymbol.a];
	}

	/**
	 * Returns the `b` value of the matrix.
	 */
	public get b(): number {
		return this[PropertySymbol.b];
	}

	/**
	 * Returns the `c` value of the matrix.
	 */
	public get c(): number {
		return this[PropertySymbol.c];
	}

	/**
	 * Returns the `d` value of the matrix.
	 */
	public get d(): number {
		return this[PropertySymbol.d];
	}

	/**
	 * Returns the `e` value of the matrix.
	 */
	public get e(): number {
		return this[PropertySymbol.e];
	}

	/**
	 * Returns the `f` value of the matrix.
	 */
	public get f(): number {
		return this[PropertySymbol.f];
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
		return Float32Array.from(
			(<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.toArray](this, is2D)
		);
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
		return Float64Array.from(
			(<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.toArray](this, is2D)
		);
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
		const { is2D } = this;
		const values = this.toFloat64Array(is2D).join(', ');
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
	public toJSON(): IJSONMatrix {
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
			a: this[PropertySymbol.a],
			b: this[PropertySymbol.b],
			c: this[PropertySymbol.c],
			d: this[PropertySymbol.d],
			e: this[PropertySymbol.e],
			f: this[PropertySymbol.f],
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
	public multiply(secondMatrix: DOMMatrixReadOnly | IJSONMatrix): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)();
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
	 * @param scale The scale factor.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @returns The resulted matrix
	 */
	public scale(scale, originX = 0, originY = 0): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.scaleSelf](scale, originX, originY);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by a scale 3D matrix containing the passed values.
	 *
	 * @param scale The scale factor.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @param [originZ] Z-Axis scale.
	 * @returns The resulted matrix
	 */
	public scale3d(scale, originX = 0, originY = 0, originZ = 0): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.scale3dSelf](scale, originX, originY, originZ);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by a scale 3D matrix containing the passed values.
	 *
	 * @param scaleX X-Axis scale.
	 * @param [scaleY] Y-Axis scale.
	 * @param [scaleZ] Z-Axis scale.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @param [originZ] Z-Axis scale.
	 * @returns The resulted matrix
	 */
	public scaleNonUniform(
		scaleX: number,
		scaleY: number = 1,
		scaleZ: number = 1,
		originX: number = 0,
		originY: number = 0,
		originZ: number = 0
	): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.scaleNonUniformSelf](scaleX, scaleY, scaleZ, originX, originY, originZ);
		return matrix;
	}

	/**
	 * Returns a new DOMMatrix instance which is this matrix post multiplied by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
	 *
	 * @param rx X component of the rotation, or Z if Y and Z are null.
	 * @param [ry] Y component of the rotation value.
	 * @param [rz] Z component of the rotation value.
	 * @returns The resulted matrix
	 */
	public rotate(rx: number, ry: number = 0, rz: number = 0): DOMMatrixReadOnly {
		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)(this);
		matrix[PropertySymbol.rotateSelf](rx, ry, rz);
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
	 * @param source A `DOMMatrix`, `Float32Array`, `Float64Array`, `Array`, or `IJSONMatrix` to set the matrix values from.
	 */
	public [PropertySymbol.setMatrixValue](source?: TDOMMatrixInit): void {
		let matrix: DOMMatrixReadOnly;

		// String
		if (typeof source === 'string' && source.length && source !== 'none') {
			matrix = (<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromString](source);
		}

		// Array
		if (Array.isArray(source) || source instanceof Float64Array || source instanceof Float32Array) {
			matrix = (<typeof DOMMatrixReadOnly>this.constructor)[PropertySymbol.fromArray](source);
		}

		// DOMMatrixReadOnly or IJSONMatrix
		if (typeof source === 'object') {
			matrix = (<typeof DOMMatrixReadOnly>this.constructor).fromMatrix(<IJSONMatrix>source);
		}

		this[PropertySymbol.a] = matrix[PropertySymbol.a];
		this[PropertySymbol.b] = matrix[PropertySymbol.b];
		this[PropertySymbol.c] = matrix[PropertySymbol.c];
		this[PropertySymbol.d] = matrix[PropertySymbol.d];
		this[PropertySymbol.e] = matrix[PropertySymbol.e];
		this[PropertySymbol.f] = matrix[PropertySymbol.f];
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
	 * Applies translate to the matrix.
	 *
	 * This method is equivalent to the CSS `translate3d()` function.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param [x] X-Axis position.
	 * @param [y] Y-Axis position.
	 * @param [z] Z-Axis position.
	 */
	public [PropertySymbol.translateSelf](x: number = 0, y: number = 0, z: number = 0): void {
		// http://www.w3.org/TR/2012/WD-css3-transforms-20120911/#Translate3dDefined
		// prettier-ignore
		const translationMatrix = new DOMMatrixReadOnly([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ]);

		this[PropertySymbol.multiplySelf](translationMatrix);
	}

	/**
	 * Applies a rotation to the matrix.
	 *
	 * @see http://en.wikipedia.org/wiki/Rotation_matrix
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param rx X-Axis rotation.
	 * @param [ry] Y-Axis rotation.
	 * @param [rz] Z-Axis rotation.
	 */
	public [PropertySymbol.rotateSelf](rx: number, ry: number = 0, rz: number = 0): void {
		// TODO: Is this correct?
		if (typeof rx === 'number' && typeof ry === 'undefined' && typeof rz === 'undefined') {
			rx = 0;
			ry = 0;
			rz = rx;
		}

		const matrix = Object.assign({}, JSON_MATRIX);

		const degToRad = Math.PI / 180;
		const radX = rx * degToRad;
		const radY = ry * degToRad;
		const radZ = rz * degToRad;

		// minus sin() because of right-handed system
		const cosx = Math.cos(radX);
		const sinx = -Math.sin(radX);
		const cosy = Math.cos(radY);
		const siny = -Math.sin(radY);
		const cosz = Math.cos(radZ);
		const sinz = -Math.sin(radZ);

		const m11 = cosy * cosz;
		const m12 = -cosy * sinz;

		matrix.m11 = m11;
		matrix.a = m11;

		matrix.m12 = m12;
		matrix.b = m12;

		matrix.m13 = siny;

		const m21 = sinx * siny * cosz + cosx * sinz;
		matrix.m21 = m21;
		matrix.c = m21;

		const m22 = cosx * cosz - sinx * siny * sinz;
		matrix.m22 = m22;
		matrix.d = m22;

		matrix.m23 = -sinx * cosy;

		matrix.m31 = sinx * sinz - cosx * siny * cosz;
		matrix.m32 = sinx * cosz + cosx * siny * sinz;

		return this[PropertySymbol.multiplySelf](matrix);
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
				`Failed to execute 'rotateAxisAngle' on 'DOMMatrix': The arguments must be numbers.`
			);
		}

		const length = Math.sqrt(x * x + y * y + z * z);

		// Bad vector length
		if (length === 0) {
			return;
		}

		const matrix = Object.assign({}, JSON_MATRIX);
		const X = x / length;
		const Y = y / length;
		const Z = z / length;

		const angleToApply = angle * (Math.PI / 360);
		const sinA = Math.sin(angleToApply);
		const cosA = Math.cos(angleToApply);
		const sinA2 = sinA * sinA;
		const x2 = X * X;
		const y2 = Y * Y;
		const z2 = Z * Z;

		const m11 = 1 - 2 * (y2 + z2) * sinA2;
		matrix.m11 = m11;
		matrix.a = m11;

		const m12 = 2 * (X * Y * sinA2 + Z * sinA * cosA);
		matrix.m12 = m12;
		matrix.b = m12;

		matrix.m13 = 2 * (X * Z * sinA2 - Y * sinA * cosA);

		const m21 = 2 * (Y * X * sinA2 - Z * sinA * cosA);
		matrix.m21 = m21;
		matrix.c = m21;

		const m22 = 1 - 2 * (z2 + x2) * sinA2;
		matrix.m22 = m22;
		matrix.d = m22;

		matrix.m23 = 2 * (Y * Z * sinA2 + X * sinA * cosA);
		matrix.m31 = 2 * (Z * X * sinA2 + Y * sinA * cosA);
		matrix.m32 = 2 * (Z * Y * sinA2 - X * sinA * cosA);
		matrix.m33 = 1 - 2 * (x2 + y2) * sinA2;

		return this[PropertySymbol.multiplySelf](matrix);
	}

	/**
	 * Applies a scale to the matrix.
	 *
	 * This method is equivalent to the CSS `scale()` function.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param scale The scale factor.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 */
	public [PropertySymbol.scaleSelf](scale, originX = 0, originY = 0): void {
		this[PropertySymbol.translateSelf](originX, originY);

		// prettier-ignore
		this[PropertySymbol.multiplySelf](new (<typeof DOMMatrixReadOnly>this.constructor)([
            // 2D:
            /* a*/scale, /* b*/0,
            /* c*/0,     /* d*/scale,
            /* e*/0,     /* f*/0,
        ]))

		this[PropertySymbol.translateSelf](-originX, -originY);
	}

	/**
	 * Applies a scale to the matrix.
	 *
	 * This method is equivalent to the CSS `scale()` function.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d
	 * @see https://www.w3.org/TR/css-transforms-1/#transform-functions
	 * @param scale The scale factor.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @param [originZ] Z-Axis scale.
	 */
	public [PropertySymbol.scale3dSelf](scale, originX = 0, originY = 0, originZ = 0): void {
		this[PropertySymbol.translateSelf](originX, originY, originZ);

		// prettier-ignore
		this[PropertySymbol.multiplySelf](new (<typeof DOMMatrixReadOnly>this.constructor)([
            // 3D
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
	 * @param scaleX X-Axis scale.
	 * @param [scaleY] Y-Axis scale.
	 * @param [scaleZ] Z-Axis scale.
	 * @param [originX] X-Axis scale.
	 * @param [originY] Y-Axis scale.
	 * @param [originZ] Z-Axis scale.
	 */
	public [PropertySymbol.scaleNonUniformSelf](
		scaleX,
		scaleY = 1,
		scaleZ = 1,
		originX = 0,
		originY = 0,
		originZ = 0
	): void {
		this[PropertySymbol.translateSelf](originX, originY, originZ);

		// prettier-ignore
		this[PropertySymbol.multiplySelf](new (<typeof DOMMatrixReadOnly>this.constructor)([
            // 3D
            scaleX, 0,      0,      0,
            0,      scaleY, 0,      0,
            0,      0,      scaleZ, 0,
            0,      0,      0,      1,
        ]))

		this[PropertySymbol.translateSelf](-originX, -originY, -originZ);
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
		const matrix = Object.assign({}, JSON_MATRIX);
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
		const matrix = Object.assign({}, JSON_MATRIX);
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
	public [PropertySymbol.multiplySelf](matrix: DOMMatrixReadOnly | IJSONMatrix): void {
		if (!(matrix instanceof DOMMatrixReadOnly)) {
			throw new TypeError(
				`Failed to execute 'multiply' on '${this.constructor.name}': parameter 1 is not of type '${this.constructor.name}'.`
			);
		}

		this[PropertySymbol.m11] =
			matrix.m11 * this[PropertySymbol.m11] +
			matrix.m12 * this[PropertySymbol.m21] +
			matrix.m13 * this[PropertySymbol.m31] +
			matrix.m14 * this[PropertySymbol.m41];
		this[PropertySymbol.m12] =
			matrix.m11 * this[PropertySymbol.m12] +
			matrix.m12 * this[PropertySymbol.m22] +
			matrix.m13 * this[PropertySymbol.m32] +
			matrix.m14 * this[PropertySymbol.m42];
		this[PropertySymbol.m13] =
			matrix.m11 * this[PropertySymbol.m13] +
			matrix.m12 * this[PropertySymbol.m23] +
			matrix.m13 * this[PropertySymbol.m33] +
			matrix.m14 * this[PropertySymbol.m43];
		this[PropertySymbol.m14] =
			matrix.m11 * this[PropertySymbol.m14] +
			matrix.m12 * this[PropertySymbol.m24] +
			matrix.m13 * this[PropertySymbol.m34] +
			matrix.m14 * this[PropertySymbol.m44];

		this[PropertySymbol.m21] =
			matrix.m21 * this[PropertySymbol.m11] +
			matrix.m22 * this[PropertySymbol.m21] +
			matrix.m23 * this[PropertySymbol.m31] +
			matrix.m24 * this[PropertySymbol.m41];
		this[PropertySymbol.m22] =
			matrix.m21 * this[PropertySymbol.m12] +
			matrix.m22 * this[PropertySymbol.m22] +
			matrix.m23 * this[PropertySymbol.m32] +
			matrix.m24 * this[PropertySymbol.m42];
		this[PropertySymbol.m23] =
			matrix.m21 * this[PropertySymbol.m13] +
			matrix.m22 * this[PropertySymbol.m23] +
			matrix.m23 * this[PropertySymbol.m33] +
			matrix.m24 * this[PropertySymbol.m43];
		this[PropertySymbol.m24] =
			matrix.m21 * this[PropertySymbol.m14] +
			matrix.m22 * this[PropertySymbol.m24] +
			matrix.m23 * this[PropertySymbol.m34] +
			matrix.m24 * this[PropertySymbol.m44];

		this[PropertySymbol.m31] =
			matrix.m31 * this[PropertySymbol.m11] +
			matrix.m32 * this[PropertySymbol.m21] +
			matrix.m33 * this[PropertySymbol.m31] +
			matrix.m34 * this[PropertySymbol.m41];
		this[PropertySymbol.m32] =
			matrix.m31 * this[PropertySymbol.m12] +
			matrix.m32 * this[PropertySymbol.m22] +
			matrix.m33 * this[PropertySymbol.m32] +
			matrix.m34 * this[PropertySymbol.m42];
		this[PropertySymbol.m33] =
			matrix.m31 * this[PropertySymbol.m13] +
			matrix.m32 * this[PropertySymbol.m23] +
			matrix.m33 * this[PropertySymbol.m33] +
			matrix.m34 * this[PropertySymbol.m43];
		this[PropertySymbol.m34] =
			matrix.m31 * this[PropertySymbol.m14] +
			matrix.m32 * this[PropertySymbol.m24] +
			matrix.m33 * this[PropertySymbol.m34] +
			matrix.m34 * this[PropertySymbol.m44];

		this[PropertySymbol.m41] =
			matrix.m41 * this[PropertySymbol.m11] +
			matrix.m42 * this[PropertySymbol.m21] +
			matrix.m43 * this[PropertySymbol.m31] +
			matrix.m44 * this[PropertySymbol.m41];
		this[PropertySymbol.m42] =
			matrix.m41 * this[PropertySymbol.m12] +
			matrix.m42 * this[PropertySymbol.m22] +
			matrix.m43 * this[PropertySymbol.m32] +
			matrix.m44 * this[PropertySymbol.m42];
		this[PropertySymbol.m43] =
			matrix.m41 * this[PropertySymbol.m13] +
			matrix.m42 * this[PropertySymbol.m23] +
			matrix.m43 * this[PropertySymbol.m33] +
			matrix.m44 * this[PropertySymbol.m43];
		this[PropertySymbol.m44] =
			matrix.m41 * this[PropertySymbol.m14] +
			matrix.m42 * this[PropertySymbol.m24] +
			matrix.m43 * this[PropertySymbol.m34] +
			matrix.m44 * this[PropertySymbol.m44];
	}

	/**
	 * Returns a new `DOMMatrix` instance given an existing matrix.
	 *
	 * @param matrix Matrix.
	 */
	public static fromMatrix(matrix: DOMMatrixReadOnly | IJSONMatrix): DOMMatrixReadOnly {
		const isCompatibleObject =
			matrix instanceof DOMMatrixReadOnly ||
			(typeof matrix === 'object' && Object.keys(JSON_MATRIX).every((k) => matrix && k in matrix));

		if (!isCompatibleObject) {
			throw TypeError(
				`DOMMatrix: "${String(matrix)}" is not a DOMMatrix or JSON compatible object.`
			);
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
		array = Array.isArray(array) ? array : Array.from(array);

		const matrix = new (<typeof DOMMatrixReadOnly>this.constructor)();
		const isCompatibleArray =
			(array instanceof Float64Array ||
				array instanceof Float32Array ||
				(Array.isArray(array) && array.every((x) => typeof x === 'number'))) &&
			[6, 16].some((x) => array.length === x);

		if (!isCompatibleArray) {
			throw TypeError(`DOMMatrix: "${String(array)}" must be an array with 6/16 numbers.`);
		}

		if (array.length === 16) {
			const [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] =
				array;

			matrix[PropertySymbol.m11] = m11;
			matrix[PropertySymbol.a] = m11;

			matrix[PropertySymbol.m21] = m21;
			matrix[PropertySymbol.c] = m21;

			matrix[PropertySymbol.m31] = m31;

			matrix[PropertySymbol.m41] = m41;
			matrix[PropertySymbol.e] = m41;

			matrix[PropertySymbol.m12] = m12;
			matrix[PropertySymbol.b] = m12;

			matrix[PropertySymbol.m22] = m22;
			matrix[PropertySymbol.d] = m22;

			matrix[PropertySymbol.m32] = m32;

			matrix[PropertySymbol.m42] = m42;
			matrix[PropertySymbol.f] = m42;

			matrix[PropertySymbol.m13] = m13;
			matrix[PropertySymbol.m23] = m23;
			matrix[PropertySymbol.m33] = m33;
			matrix[PropertySymbol.m43] = m43;
			matrix[PropertySymbol.m14] = m14;
			matrix[PropertySymbol.m24] = m24;
			matrix[PropertySymbol.m34] = m34;
			matrix[PropertySymbol.m44] = m44;
		} else if (array.length === 6) {
			const [M11, M12, M21, M22, M41, M42] = array;

			matrix[PropertySymbol.m11] = M11;
			matrix[PropertySymbol.a] = M11;

			matrix[PropertySymbol.m12] = M12;
			matrix[PropertySymbol.b] = M12;

			matrix[PropertySymbol.m21] = M21;
			matrix[PropertySymbol.c] = M21;

			matrix[PropertySymbol.m22] = M22;
			matrix[PropertySymbol.d] = M22;

			matrix[PropertySymbol.m41] = M41;
			matrix[PropertySymbol.e] = M41;

			matrix[PropertySymbol.m42] = M42;
			matrix[PropertySymbol.f] = M42;
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
			throw TypeError(`DOMMatrix: "${String(source)}" is not a string.`);
		}

		// const px = ['perspective'];
		// const length = ['translate', 'translate3d', 'translateX', 'translateY', 'translateZ'];
		// const deg = ['rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY'];
		// const abs = ['scale', 'scale3d', 'matrix', 'matrix3d'];
		// const transformFunctions = px.concat(length, deg, abs);

		const parts = String(source).replace(/\s/g, '').split(')');
		let domMatrix = new (<typeof DOMMatrixReadOnly>this.constructor)();

		for (const part of parts) {
			if (!part) {
				continue;
			}

			const [property, value] = part.split('(');

			// Throw if empty string
			if (!value) {
				throw TypeError(`DOMMatrix: invalid transform string "${source}"`);
			}

			const components = value
				.split(',')
				.map((n) => (n.includes('rad') ? parseFloat(n) * (180 / Math.PI) : parseFloat(n)));

			const [x, y, z, a] = components;
			const xyz = [x, y, z];
			const xyza = [x, y, z, a];

			// Single number value expected
			if (property === 'perspective' && x && [y, z].every((n) => n === undefined)) {
				domMatrix[PropertySymbol.m34] = -1 / x;
				// 6/16 number values expected
			} else if (
				property.includes('matrix') &&
				[6, 16].includes(components.length) &&
				components.every((n) => !Number.isNaN(+n))
			) {
				const values = components.map((n) => (Math.abs(n) < 1e-6 ? 0 : n));
				domMatrix[PropertySymbol.multiplySelf](
					this[PropertySymbol.fromArray](<TMatrix2D | TMatrix3D>values)
				);
				// 3 values expected
			} else if (property === 'translate3d' && xyz.every((n) => !Number.isNaN(+n))) {
				domMatrix[PropertySymbol.translateSelf](x, y, z);
				// Single/double number value(s) expected
			} else if (property === 'translate' && x && z === undefined) {
				domMatrix[PropertySymbol.translateSelf](x, y || 0, 0);
				// All 4 values expected
			} else if (property === 'rotate3d' && xyza.every((n) => !Number.isNaN(+n)) && a) {
				domMatrix = domMatrix.rotateAxisAngle(x, y, z, a);
				// Single value expected
			} else if (property === 'rotate' && x && [y, z].every((n) => n === undefined)) {
				domMatrix = domMatrix.rotate(0, 0, x);
				// 3 values expected
			} else if (
				property === 'scale3d' &&
				xyz.every((n) => !Number.isNaN(+n)) &&
				xyz.some((n) => n !== 1)
			) {
				domMatrix[PropertySymbol.scale3dSelf](x, y, z);
				// Single value expected
			} else if (property === 'scale' && !Number.isNaN(x) && x !== 1 && z === undefined) {
				const nosy = Number.isNaN(+y);
				const sy = nosy ? x : y;
				domMatrix[PropertySymbol.scaleSelf](x, sy);
				// Single/double value expected
			} else if (property === 'skew' && (x || (!Number.isNaN(x) && y)) && z === undefined) {
				domMatrix[PropertySymbol.skewXSelf](x);
				domMatrix[PropertySymbol.skewYSelf](y || 0);
			} else if (
				['translate', 'rotate', 'scale', 'skew'].some((p) => property.includes(p)) &&
				/[XYZ]/.test(property) &&
				x &&
				[y, z].every((n) => n === undefined) // a single value expected
			) {
				if (property === 'skewX') {
					domMatrix[PropertySymbol.skewXSelf](x);
				} else if (property === 'skewY') {
					domMatrix[PropertySymbol.skewYSelf](x);
				} else {
					const fn = <'scale' | 'scale3d' | 'translate' | 'rotate'>property.replace(/[XYZ]/, '');
					const axis = property.replace(fn, '');
					const idx = ['X', 'Y', 'Z'].indexOf(axis);
					const def = fn === 'scale' ? 1 : 0;
					const axeValues: [number, number, number] = [
						idx === 0 ? x : def,
						idx === 1 ? x : def,
						idx === 2 ? x : def
					];
					switch (fn) {
						case 'scale':
							domMatrix[PropertySymbol.scaleSelf](...axeValues);
							break;
						case 'scale3d':
							domMatrix[PropertySymbol.scale3dSelf](...axeValues);
							break;
						case 'translate':
							domMatrix[PropertySymbol.translateSelf](...axeValues);
							break;
						case 'rotate':
							domMatrix[PropertySymbol.rotateSelf](...axeValues);
							break;
					}
				}
			} else {
				throw TypeError(`DOMMatrix: invalid transform string "${source}"`);
			}
		}

		return domMatrix;
	}

	/**
	 * Returns an *Array* containing elements which comprise the matrix.
	 *
	 * @param matrix Matrix to convert.
	 * @param [is2D] If the matrix is 2D.
	 * @returns Array representation of the matrix.
	 */
	public static [PropertySymbol.toArray](
		matrix: DOMMatrixReadOnly | IJSONMatrix,
		is2D: boolean = false
	): TMatrix2D | TMatrix3D {
		if (is2D) {
			return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
		}
		return [
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
		];
	}
}
