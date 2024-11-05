import { beforeEach, describe, it, expect } from 'vitest';
import DOMMatrixReadOnly from '../../../src/dom/dom-matrix/DOMMatrixReadOnly.js';
import DOMMatrix from '../../../src/dom/dom-matrix/DOMMatrix.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import DOMPoint from '../../../src/dom/DOMPoint.js';

describe('DOMMatrixReadOnly', () => {
	describe('constructor()', () => {
		it('Creates a new DOMMatrixReadOnly.', () => {
			const matrix = new DOMMatrixReadOnly();
			expect(matrix).toBeInstanceOf(DOMMatrixReadOnly);
		});

		it('Creates a new DOMMatrixReadOnly from a DOMMatrix instance.', () => {
			const matrix = new DOMMatrixReadOnly(new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)'));

			expect(matrix.a).toBe(10);
			expect(matrix.b).toBe(20);
			expect(matrix.c).toBe(30);
			expect(matrix.d).toBe(40);
			expect(matrix.e).toBe(50);
			expect(matrix.f).toBe(60);
			expect(matrix.m11).toBe(10);
			expect(matrix.m12).toBe(20);
			expect(matrix.m13).toBe(0);
			expect(matrix.m14).toBe(0);
			expect(matrix.m21).toBe(30);
			expect(matrix.m22).toBe(40);
			expect(matrix.m23).toBe(0);
			expect(matrix.m24).toBe(0);
			expect(matrix.m31).toBe(0);
			expect(matrix.m32).toBe(0);
			expect(matrix.m33).toBe(1);
			expect(matrix.m34).toBe(0);
			expect(matrix.m41).toBe(50);
			expect(matrix.m42).toBe(60);
			expect(matrix.m43).toBe(0);
			expect(matrix.m44).toBe(1);
		});

		it('Creates a new DOMMatrixReadOnly from a DOMMatrixReadOnly instance.', () => {
			const matrix = new DOMMatrixReadOnly(
				new DOMMatrixReadOnly('matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)')
			);

			expect(matrix.a).toBe(1);
			expect(matrix.b).toBe(2);
			expect(matrix.c).toBe(5);
			expect(matrix.d).toBe(6);
			expect(matrix.e).toBe(13);
			expect(matrix.f).toBe(14);
			expect(matrix.m11).toBe(1);
			expect(matrix.m12).toBe(2);
			expect(matrix.m13).toBe(3);
			expect(matrix.m14).toBe(4);
			expect(matrix.m21).toBe(5);
			expect(matrix.m22).toBe(6);
			expect(matrix.m23).toBe(7);
			expect(matrix.m24).toBe(8);
			expect(matrix.m31).toBe(9);
			expect(matrix.m32).toBe(10);
			expect(matrix.m33).toBe(11);
			expect(matrix.m34).toBe(12);
			expect(matrix.m41).toBe(13);
			expect(matrix.m42).toBe(14);
			expect(matrix.m43).toBe(15);
			expect(matrix.m44).toBe(16);
		});

		it('Creates a new DOMMatrixReadOnly from a DOM Matrix compatible object.', () => {
			const matrix = new DOMMatrixReadOnly({
				a: 10,
				b: 20,
				c: 30,
				d: 40,
				e: 50,
				f: 60
			});

			expect(matrix.a).toBe(10);
			expect(matrix.b).toBe(20);
			expect(matrix.c).toBe(30);
			expect(matrix.d).toBe(40);
			expect(matrix.e).toBe(50);
			expect(matrix.f).toBe(60);
			expect(matrix.m11).toBe(10);
			expect(matrix.m12).toBe(20);
			expect(matrix.m13).toBe(0);
			expect(matrix.m14).toBe(0);
			expect(matrix.m21).toBe(30);
			expect(matrix.m22).toBe(40);
			expect(matrix.m23).toBe(0);
			expect(matrix.m24).toBe(0);
			expect(matrix.m31).toBe(0);
			expect(matrix.m32).toBe(0);
			expect(matrix.m33).toBe(1);
			expect(matrix.m34).toBe(0);
			expect(matrix.m41).toBe(50);
			expect(matrix.m42).toBe(60);
			expect(matrix.m43).toBe(0);
			expect(matrix.m44).toBe(1);

			const matrix2 = new DOMMatrixReadOnly({
				m11: 1,
				m12: 2,
				m13: 3,
				m14: 4,
				m21: 5,
				m22: 6,
				m23: 7,
				m24: 8,
				m31: 9,
				m32: 10,
				m33: 11,
				m34: 12,
				m41: 13,
				m42: 14,
				m43: 15,
				m44: 16
			});

			expect(matrix2.a).toBe(1);
			expect(matrix2.b).toBe(2);
			expect(matrix2.c).toBe(5);
			expect(matrix2.d).toBe(6);
			expect(matrix2.e).toBe(13);
			expect(matrix2.f).toBe(14);
			expect(matrix2.m11).toBe(1);
			expect(matrix2.m12).toBe(2);
			expect(matrix2.m13).toBe(3);
			expect(matrix2.m14).toBe(4);
			expect(matrix2.m21).toBe(5);
			expect(matrix2.m22).toBe(6);
			expect(matrix2.m23).toBe(7);
			expect(matrix2.m24).toBe(8);
			expect(matrix2.m31).toBe(9);
			expect(matrix2.m32).toBe(10);
			expect(matrix2.m33).toBe(11);
			expect(matrix2.m34).toBe(12);
			expect(matrix2.m41).toBe(13);
			expect(matrix2.m42).toBe(14);
			expect(matrix2.m43).toBe(15);

			const matrix3 = new DOMMatrixReadOnly({
				m11: 1,
				m12: 2,
				m13: 3,
				m14: 4
			});

			expect(matrix3.a).toBe(1);
			expect(matrix3.b).toBe(2);
			expect(matrix3.c).toBe(0);
			expect(matrix3.d).toBe(1);
			expect(matrix3.e).toBe(0);
			expect(matrix3.f).toBe(0);
			expect(matrix3.m11).toBe(1);
			expect(matrix3.m12).toBe(2);
			expect(matrix3.m13).toBe(3);
			expect(matrix3.m14).toBe(4);
			expect(matrix3.m21).toBe(0);
			expect(matrix3.m22).toBe(1);
			expect(matrix3.m23).toBe(0);
			expect(matrix3.m24).toBe(0);
			expect(matrix3.m31).toBe(0);
			expect(matrix3.m32).toBe(0);
			expect(matrix3.m33).toBe(1);
			expect(matrix3.m34).toBe(0);
			expect(matrix3.m41).toBe(0);
			expect(matrix3.m42).toBe(0);
			expect(matrix3.m43).toBe(0);
			expect(matrix3.m44).toBe(1);
		});

		it('Creates a new DOMMatrixReadOnly from an 2D array.', () => {
			const matrix = new DOMMatrixReadOnly([10, 20, 30, 40, 50, 60]);

			expect(matrix.a).toBe(10);
			expect(matrix.b).toBe(20);
			expect(matrix.c).toBe(30);
			expect(matrix.d).toBe(40);
			expect(matrix.e).toBe(50);
			expect(matrix.f).toBe(60);
			expect(matrix.m11).toBe(10);
			expect(matrix.m12).toBe(20);
			expect(matrix.m13).toBe(0);
			expect(matrix.m14).toBe(0);
			expect(matrix.m21).toBe(30);
			expect(matrix.m22).toBe(40);
			expect(matrix.m23).toBe(0);
			expect(matrix.m24).toBe(0);
			expect(matrix.m31).toBe(0);
			expect(matrix.m32).toBe(0);
			expect(matrix.m33).toBe(1);
			expect(matrix.m34).toBe(0);
			expect(matrix.m41).toBe(50);
			expect(matrix.m42).toBe(60);
			expect(matrix.m43).toBe(0);
			expect(matrix.m44).toBe(1);
		});

		it('Creates a new DOMMatrixReadOnly from an 3D array.', () => {
			// prettier-ignore
			const matrix = new DOMMatrixReadOnly([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
            ]);

			expect(matrix.a).toBe(1);
			expect(matrix.b).toBe(2);
			expect(matrix.c).toBe(5);
			expect(matrix.d).toBe(6);
			expect(matrix.e).toBe(13);
			expect(matrix.f).toBe(14);
			expect(matrix.m11).toBe(1);
			expect(matrix.m12).toBe(2);
			expect(matrix.m13).toBe(3);
			expect(matrix.m14).toBe(4);
			expect(matrix.m21).toBe(5);
			expect(matrix.m22).toBe(6);
			expect(matrix.m23).toBe(7);
			expect(matrix.m24).toBe(8);
			expect(matrix.m31).toBe(9);
			expect(matrix.m32).toBe(10);
			expect(matrix.m33).toBe(11);
			expect(matrix.m34).toBe(12);
			expect(matrix.m41).toBe(13);
			expect(matrix.m42).toBe(14);
			expect(matrix.m43).toBe(15);
			expect(matrix.m44).toBe(16);
		});

		it('Creates a new DOMMatrixReadOnly from a "matrix(10, 20, 30, 40, 50, 60)" string.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');

			expect(matrix.a).toBe(10);
			expect(matrix.b).toBe(20);
			expect(matrix.c).toBe(30);
			expect(matrix.d).toBe(40);
			expect(matrix.e).toBe(50);
			expect(matrix.f).toBe(60);
			expect(matrix.m11).toBe(10);
			expect(matrix.m12).toBe(20);
			expect(matrix.m13).toBe(0);
			expect(matrix.m14).toBe(0);
			expect(matrix.m21).toBe(30);
			expect(matrix.m22).toBe(40);
			expect(matrix.m23).toBe(0);
			expect(matrix.m24).toBe(0);
			expect(matrix.m31).toBe(0);
			expect(matrix.m32).toBe(0);
			expect(matrix.m33).toBe(1);
			expect(matrix.m34).toBe(0);
			expect(matrix.m41).toBe(50);
			expect(matrix.m42).toBe(60);
			expect(matrix.m43).toBe(0);
			expect(matrix.m44).toBe(1);
		});

		it('Creates a new DOMMatrixReadOnly from a "matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)" string.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);

			expect(matrix.a).toBe(1);
			expect(matrix.b).toBe(2);
			expect(matrix.c).toBe(5);
			expect(matrix.d).toBe(6);
			expect(matrix.e).toBe(13);
			expect(matrix.f).toBe(14);
			expect(matrix.m11).toBe(1);
			expect(matrix.m12).toBe(2);
			expect(matrix.m13).toBe(3);
			expect(matrix.m14).toBe(4);
			expect(matrix.m21).toBe(5);
			expect(matrix.m22).toBe(6);
			expect(matrix.m23).toBe(7);
			expect(matrix.m24).toBe(8);
			expect(matrix.m31).toBe(9);
			expect(matrix.m32).toBe(10);
			expect(matrix.m33).toBe(11);
			expect(matrix.m34).toBe(12);
			expect(matrix.m41).toBe(13);
			expect(matrix.m42).toBe(14);
			expect(matrix.m43).toBe(15);
			expect(matrix.m44).toBe(16);
		});

		it('Creates a new DOMMatrixReadOnly from a "perspective(none)" string.', () => {
			const matrix = new DOMMatrixReadOnly('perspective(none)');

			expect(matrix.toJSON()).toEqual({
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
			});

			expect(matrix.toJSON()).toEqual(new DOMMatrixReadOnly('perspective(0)').toJSON());
		});

		it('Creates a new DOMMatrixReadOnly from a "perspective(100px)" string.', () => {
			const matrix = new DOMMatrixReadOnly('perspective(100px)');

			expect(matrix.toJSON()).toEqual({
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
				m34: -0.01,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "perspective(10cm)" string.', () => {
			const matrix = new DOMMatrixReadOnly('perspective(10cm)');

			expect(matrix.toJSON()).toEqual({
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
				m34: -0.00264681905286227,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "perspective(100mm)" string.', () => {
			const matrix = new DOMMatrixReadOnly('perspective(100mm)');

			expect(matrix.toJSON()).toEqual({
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
				m34: -0.0026468330642386386,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "perspective(10in)" string.', () => {
			const matrix = new DOMMatrixReadOnly('perspective(10in)');

			expect(matrix.toJSON()).toEqual({
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
				m34: -0.0010416666666666667,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "perspective(10pt)" string.', () => {
			const matrix = new DOMMatrixReadOnly('perspective(10pt)');

			expect(matrix.toJSON()).toEqual({
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
				m34: -0.075295534974776,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "perspective(10pc)" string.', () => {
			const matrix = new DOMMatrixReadOnly('perspective(10pc)');

			expect(matrix.toJSON()).toEqual({
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
				m34: -0.00625,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "perspective(10Q)" string.', () => {
			const matrix = new DOMMatrixReadOnly('perspective(10Q)');

			expect(matrix.toJSON()).toEqual({
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
				m34: -0.10582010582010583,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "translate(10px, 20px)" string.', () => {
			const matrix = new DOMMatrixReadOnly('translate(10px, 20px)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0,
				d: 1,
				e: 10,
				f: 20,
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
				m41: 10,
				m42: 20,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "translate3d(10px, 20px, 30px)" string.', () => {
			const matrix = new DOMMatrixReadOnly('translate3d(10px, 20px, 30px)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0,
				d: 1,
				e: 10,
				f: 20,
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
				m41: 10,
				m42: 20,
				m43: 30,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "translateX(10px)" string.', () => {
			const matrix = new DOMMatrixReadOnly('translateX(10px)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0,
				d: 1,
				e: 10,
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
				m41: 10,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "translateY(10px)" string.', () => {
			const matrix = new DOMMatrixReadOnly('translateY(10px)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0,
				d: 1,
				e: 0,
				f: 10,
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
				m42: 10,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "translateZ(10px)" string.', () => {
			const matrix = new DOMMatrixReadOnly('translateZ(10px)');

			expect(matrix.toJSON()).toEqual({
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
				m43: 10,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "rotate(10rad)" string.', () => {
			const matrix = new DOMMatrixReadOnly('rotate(10rad)');

			expect(matrix.toJSON()).toEqual({
				a: -0.839071529076452,
				b: -0.54402111088937,
				c: 0.54402111088937,
				d: -0.839071529076452,
				e: 0,
				f: 0,
				is2D: true,
				isIdentity: false,
				m11: -0.839071529076452,
				m12: -0.54402111088937,
				m13: 0,
				m14: 0,
				m21: 0.54402111088937,
				m22: -0.839071529076452,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1
			});

			expect(matrix.toJSON()).toEqual(new DOMMatrixReadOnly('rotateZ(10rad)').toJSON());
		});

		it('Creates a new DOMMatrixReadOnly from a "rotateX(10deg)" string.', () => {
			const matrix = new DOMMatrixReadOnly('rotateX(10deg)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0,
				d: 0.984807753012208,
				e: 0,
				f: 0,
				is2D: false,
				isIdentity: false,
				m11: 1,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0,
				m22: 0.984807753012208,
				m23: 0.17364817766693,
				m24: 0,
				m31: 0,
				m32: -0.17364817766693,
				m33: 0.984807753012208,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "rotateY(10deg)" string.', () => {
			const matrix = new DOMMatrixReadOnly('rotateY(10deg)');

			expect(matrix.toJSON()).toEqual({
				a: 0.984807753012208,
				b: 0,
				c: 0,
				d: 1,
				e: 0,
				f: 0,
				is2D: false,
				isIdentity: false,
				m11: 0.984807753012208,
				m12: 0,
				m13: -0.17364817766693,
				m14: 0,
				m21: 0,
				m22: 1,
				m23: 0,
				m24: 0,
				m31: 0.17364817766693,
				m32: 0,
				m33: 0.984807753012208,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "rotateZ(10deg)" string.', () => {
			const matrix = new DOMMatrixReadOnly('rotateZ(10deg)');

			expect(matrix.toJSON()).toEqual({
				a: 0.984807753012208,
				b: 0.17364817766693,
				c: -0.17364817766693,
				d: 0.984807753012208,
				e: 0,
				f: 0,
				is2D: true,
				isIdentity: false,
				m11: 0.984807753012208,
				m12: 0.17364817766693,
				m13: 0,
				m14: 0,
				m21: -0.17364817766693,
				m22: 0.984807753012208,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "rotate3d(1, 1, 1, 45deg)" string.', () => {
			const matrix = new DOMMatrixReadOnly('rotate3d(1, 1, 1, 45deg)');

			expect(matrix.toJSON()).toEqual({
				a: 0.804737854124365,
				b: 0.505879363401681,
				c: -0.310617217526046,
				d: 0.804737854124365,
				e: 0,
				f: 0,
				is2D: false,
				isIdentity: false,
				m11: 0.804737854124365,
				m12: 0.505879363401681,
				m13: -0.310617217526046,
				m14: 0,
				m21: -0.310617217526046,
				m22: 0.804737854124365,
				m23: 0.505879363401681,
				m24: 0,
				m31: 0.505879363401681,
				m32: -0.310617217526046,
				m33: 0.804737854124365,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "scale(10)" string.', () => {
			const matrix = new DOMMatrixReadOnly('scale(10)');

			expect(matrix.toJSON()).toEqual({
				a: 10,
				b: 0,
				c: 0,
				d: 10,
				e: 0,
				f: 0,
				is2D: true,
				isIdentity: false,
				m11: 10,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0,
				m22: 10,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "scale(10, 20)" string.', () => {
			const matrix = new DOMMatrixReadOnly('scale(10, 20)');

			expect(matrix.toJSON()).toEqual({
				a: 10,
				b: 0,
				c: 0,
				d: 20,
				e: 0,
				f: 0,
				is2D: true,
				isIdentity: false,
				m11: 10,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0,
				m22: 20,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "scale3d(10, 20, 30)" string.', () => {
			const matrix = new DOMMatrixReadOnly('scale3d(10, 20, 30)');

			expect(matrix.toJSON()).toEqual({
				a: 10,
				b: 0,
				c: 0,
				d: 20,
				e: 0,
				f: 0,
				m11: 10,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0,
				m22: 20,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 30,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "scaleX(10)" string.', () => {
			const matrix = new DOMMatrixReadOnly('scaleX(10)');

			expect(matrix.toJSON()).toEqual({
				a: 10,
				b: 0,
				c: 0,
				d: 1,
				e: 0,
				f: 0,
				m11: 10,
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
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "scaleY(10)" string.', () => {
			const matrix = new DOMMatrixReadOnly('scaleY(10)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0,
				d: 10,
				e: 0,
				f: 0,
				m11: 1,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0,
				m22: 10,
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
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "scaleZ(10)" string.', () => {
			const matrix = new DOMMatrixReadOnly('scaleZ(10)');

			expect(matrix.toJSON()).toEqual({
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
				m33: 10,
				m34: 0,
				m41: 0,
				m42: 0,
				m43: 0,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "skew(10deg)" string.', () => {
			const matrix = new DOMMatrixReadOnly('skew(10deg)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0.17632698070846498,
				d: 1,
				e: 0,
				f: 0,
				m11: 1,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0.17632698070846498,
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
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "skew(10deg, 20deg)" string.', () => {
			const matrix = new DOMMatrixReadOnly('skew(10deg, 20deg)');

			expect(matrix.toJSON()).toEqual({
				a: 1.064177772475912,
				b: 0.36397023426620234,
				c: 0.17632698070846498,
				d: 1,
				e: 0,
				f: 0,
				m11: 1.064177772475912,
				m12: 0.36397023426620234,
				m13: 0,
				m14: 0,
				m21: 0.17632698070846498,
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
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "skewX(10deg)" string.', () => {
			const matrix = new DOMMatrixReadOnly('skewX(10deg)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0.17632698070846498,
				d: 1,
				e: 0,
				f: 0,
				m11: 1,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0.17632698070846498,
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
				isIdentity: false
			});
		});

		it('Creates a new DOMMatrixReadOnly from a "skewY(10deg)" string.', () => {
			const matrix = new DOMMatrixReadOnly('skewY(10deg)');

			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 0.17632698070846498,
				c: 0,
				d: 1,
				e: 0,
				f: 0,
				m11: 1,
				m12: 0.17632698070846498,
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
				isIdentity: false
			});
		});

		it('Throws an error when trying to use a relative length', () => {
			expect(() => {
				new DOMMatrixReadOnly('perspective(10%)');
			}).toThrow("Failed to construct 'DOMMatrixReadOnly': Lengths must be absolute, not relative");

			expect(() => {
				new DOMMatrixReadOnly('perspective(10vw)');
			}).toThrow("Failed to construct 'DOMMatrixReadOnly': Lengths must be absolute, not relative");

			expect(() => {
				new DOMMatrixReadOnly('perspective(10vh)');
			}).toThrow("Failed to construct 'DOMMatrixReadOnly': Lengths must be absolute, not relative");

			expect(() => {
				new DOMMatrixReadOnly('perspective(10vmin)');
			}).toThrow("Failed to construct 'DOMMatrixReadOnly': Lengths must be absolute, not relative");

			expect(() => {
				new DOMMatrixReadOnly('perspective(10vmax)');
			}).toThrow("Failed to construct 'DOMMatrixReadOnly': Lengths must be absolute, not relative");

			expect(() => {
				new DOMMatrixReadOnly('perspective(10em)');
			}).toThrow("Failed to construct 'DOMMatrixReadOnly': Lengths must be absolute, not relative");

			expect(() => {
				new DOMMatrixReadOnly('perspective(10rem)');
			}).toThrow("Failed to construct 'DOMMatrixReadOnly': Lengths must be absolute, not relative");
		});
	});

	describe('get a()', () => {
		it('Returns "m11" property.', () => {
			const matrix = new DOMMatrixReadOnly();
			matrix[PropertySymbol.m11] = 10;
			expect(matrix.a).toBe(10);
		});
	});

	describe('get b()', () => {
		it('Returns "m12" property.', () => {
			const matrix = new DOMMatrixReadOnly();
			matrix[PropertySymbol.m12] = 10;
			expect(matrix.b).toBe(10);
		});
	});

	describe('get c()', () => {
		it('Returns "m21" property.', () => {
			const matrix = new DOMMatrixReadOnly();
			matrix[PropertySymbol.m21] = 10;
			expect(matrix.c).toBe(10);
		});
	});

	describe('get d()', () => {
		it('Returns "m22" property.', () => {
			const matrix = new DOMMatrixReadOnly();
			matrix[PropertySymbol.m22] = 10;
			expect(matrix.d).toBe(10);
		});
	});

	describe('get e()', () => {
		it('Returns "m41" property.', () => {
			const matrix = new DOMMatrixReadOnly();
			matrix[PropertySymbol.m41] = 10;
			expect(matrix.e).toBe(10);
		});
	});

	describe('get f()', () => {
		it('Returns "m42" property.', () => {
			const matrix = new DOMMatrixReadOnly();
			matrix[PropertySymbol.m42] = 10;
			expect(matrix.f).toBe(10);
		});
	});

	for (const key of [
		'm11',
		'm12',
		'm13',
		'm14',
		'm21',
		'm22',
		'm23',
		'm24',
		'm31',
		'm32',
		'm33',
		'm34',
		'm41',
		'm42',
		'm43',
		'm44'
	]) {
		describe(`get ${key}()`, () => {
			it(`Returns the "${key}" property.`, () => {
				const matrix = new DOMMatrixReadOnly();
				matrix[PropertySymbol[key]] = 10;
				expect(matrix[key]).toBe(10);
			});
		});
	}

	describe('get isIdentity()', () => {
		it('Returns true if the matrix is an identity matrix.', () => {
			const matrix = new DOMMatrixReadOnly();
			expect(matrix.isIdentity).toBe(true);
		});

		it('Returns false if the matrix is not an identity matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.isIdentity).toBe(false);
		});
	});

	describe('get is2D()', () => {
		it('Returns true if the matrix is a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly();
			expect(matrix.is2D).toBe(true);
		});

		it('Returns false if the matrix is a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			expect(matrix.is2D).toBe(false);
		});
	});

	describe('toFloat32Array()', () => {
		it('Returns a Float32Array with the matrix values when "is2D" is not set.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const array = matrix.toFloat32Array();

			expect(array).toBeInstanceOf(Float32Array);
			expect(array).toHaveLength(16);
			expect(array[0]).toBe(10);
			expect(array[1]).toBe(20);
			expect(array[2]).toBe(0);
			expect(array[3]).toBe(0);
			expect(array[4]).toBe(30);
			expect(array[5]).toBe(40);
			expect(array[6]).toBe(0);
			expect(array[7]).toBe(0);
			expect(array[8]).toBe(0);
			expect(array[9]).toBe(0);
			expect(array[10]).toBe(1);
			expect(array[11]).toBe(0);
			expect(array[12]).toBe(50);
			expect(array[13]).toBe(60);
			expect(array[14]).toBe(0);
			expect(array[15]).toBe(1);
		});

		it('Returns a Float32Array with the matrix values when "is2D" is set.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const array = matrix.toFloat32Array(true);

			expect(array).toBeInstanceOf(Float32Array);
			expect(array).toHaveLength(6);
			expect(array[0]).toBe(10);
			expect(array[1]).toBe(20);
			expect(array[2]).toBe(30);
			expect(array[3]).toBe(40);
			expect(array[4]).toBe(50);
			expect(array[5]).toBe(60);
		});
	});

	describe('toFloat64Array()', () => {
		it('Returns a Float64Array with the matrix values when "is2D" is not set.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const array = matrix.toFloat64Array();

			expect(array).toBeInstanceOf(Float64Array);
			expect(array).toHaveLength(16);
			expect(array[0]).toBe(10);
			expect(array[1]).toBe(20);
			expect(array[2]).toBe(0);
			expect(array[3]).toBe(0);
			expect(array[4]).toBe(30);
			expect(array[5]).toBe(40);
			expect(array[6]).toBe(0);
			expect(array[7]).toBe(0);
			expect(array[8]).toBe(0);
			expect(array[9]).toBe(0);
			expect(array[10]).toBe(1);
			expect(array[11]).toBe(0);
			expect(array[12]).toBe(50);
			expect(array[13]).toBe(60);
			expect(array[14]).toBe(0);
			expect(array[15]).toBe(1);
		});

		it('Returns a Float64Array with the matrix values when "is2D" is set.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const array = matrix.toFloat64Array(true);

			expect(array).toBeInstanceOf(Float64Array);
			expect(array).toHaveLength(6);
			expect(array[0]).toBe(10);
			expect(array[1]).toBe(20);
			expect(array[2]).toBe(30);
			expect(array[3]).toBe(40);
			expect(array[4]).toBe(50);
			expect(array[5]).toBe(60);
		});
	});

	describe('toString()', () => {
		it('Returns a string representation of a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.toString()).toBe('matrix(10, 20, 30, 40, 50, 60)');
		});

		it('Returns a string representation of a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			expect(matrix.toString()).toBe(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
		});
	});

	describe('toJSON()', () => {
		it('Returns a JSON representation of a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.toJSON()).toEqual({
				a: 10,
				b: 20,
				c: 30,
				d: 40,
				e: 50,
				f: 60,
				is2D: true,
				isIdentity: false,
				m11: 10,
				m12: 20,
				m13: 0,
				m14: 0,
				m21: 30,
				m22: 40,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 50,
				m42: 60,
				m43: 0,
				m44: 1
			});
		});

		it('Returns a JSON representation of a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			expect(matrix.toJSON()).toEqual({
				a: 1,
				b: 2,
				c: 5,
				d: 6,
				e: 13,
				f: 14,
				is2D: false,
				isIdentity: false,
				m11: 1,
				m12: 2,
				m13: 3,
				m14: 4,
				m21: 5,
				m22: 6,
				m23: 7,
				m24: 8,
				m31: 9,
				m32: 10,
				m33: 11,
				m34: 12,
				m41: 13,
				m42: 14,
				m43: 15,
				m44: 16
			});
		});
	});

	describe('multiply()', () => {
		it('Multiplies two 2d matrices.', () => {
			const matrix1 = new DOMMatrixReadOnly('matrix(2, 3, 4, 5, 6, 7)');
			const matrix2 = new DOMMatrixReadOnly('matrix(2, 3, 4, 5, 6, 7)');
			const result = matrix1.multiply(matrix2);

			expect(result.m11).toBe(16);
			expect(result.m12).toBe(21);
			expect(result.m13).toBe(0);
			expect(result.m14).toBe(0);
			expect(result.m21).toBe(28);
			expect(result.m22).toBe(37);
			expect(result.m23).toBe(0);
			expect(result.m24).toBe(0);
			expect(result.m31).toBe(0);
			expect(result.m32).toBe(0);
			expect(result.m33).toBe(1);
			expect(result.m34).toBe(0);
			expect(result.m41).toBe(46);
			expect(result.m42).toBe(60);
			expect(result.m43).toBe(0);
			expect(result.m44).toBe(1);

			expect(result.a).toBe(16);
			expect(result.b).toBe(21);
			expect(result.c).toBe(28);
			expect(result.d).toBe(37);
			expect(result.e).toBe(46);
			expect(result.f).toBe(60);
		});

		it('Multiplies two 3d matrices.', () => {
			const matrix1 = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			const matrix2 = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			const result = matrix1.multiply(matrix2);

			expect(result.m11).toBe(90);
			expect(result.m12).toBe(100);
			expect(result.m13).toBe(110);
			expect(result.m14).toBe(120);
			expect(result.m21).toBe(202);
			expect(result.m22).toBe(228);
			expect(result.m23).toBe(254);
			expect(result.m24).toBe(280);
			expect(result.m31).toBe(314);
			expect(result.m32).toBe(356);
			expect(result.m33).toBe(398);
			expect(result.m34).toBe(440);
			expect(result.m41).toBe(426);
			expect(result.m42).toBe(484);
			expect(result.m43).toBe(542);
			expect(result.m44).toBe(600);

			expect(result.a).toBe(90);
			expect(result.b).toBe(100);
			expect(result.c).toBe(202);
			expect(result.d).toBe(228);
			expect(result.e).toBe(426);
			expect(result.f).toBe(484);
		});
	});

	describe('translate()', () => {
		it('Translates a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const result = matrix.translate(10, 20);

			expect(result.toJSON()).toEqual({
				a: 10,
				b: 20,
				c: 30,
				d: 40,
				e: 750,
				f: 1060,
				is2D: true,
				isIdentity: false,
				m11: 10,
				m12: 20,
				m13: 0,
				m14: 0,
				m21: 30,
				m22: 40,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 750,
				m42: 1060,
				m43: 0,
				m44: 1
			});
		});

		it('Translates a 3D matrix.', () => {
			const matrix1 = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			const result1 = matrix1.translate(10, 20, 30);

			expect(result1.toJSON()).toEqual({
				a: 1,
				b: 2,
				c: 5,
				d: 6,
				e: 393,
				f: 454,
				m11: 1,
				m12: 2,
				m13: 3,
				m14: 4,
				m21: 5,
				m22: 6,
				m23: 7,
				m24: 8,
				m31: 9,
				m32: 10,
				m33: 11,
				m34: 12,
				m41: 393,
				m42: 454,
				m43: 515,
				m44: 576,
				is2D: false,
				isIdentity: false
			});
			const matrix2 = new DOMMatrixReadOnly(
				'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1)'
			);
			const result2 = matrix2.translate(5, 6, 7);

			expect(result2.toJSON()).toEqual({
				a: 1,
				b: 0,
				c: 0,
				d: 1,
				e: 15,
				f: 26,
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
				m41: 15,
				m42: 26,
				m43: 37,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('scale()', () => {
		it('Scales a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const result = matrix.scale(2, 3);

			expect(result.toJSON()).toEqual({
				a: 20,
				b: 40,
				c: 90,
				d: 120,
				e: 50,
				f: 60,
				m11: 20,
				m12: 40,
				m13: 0,
				m14: 0,
				m21: 90,
				m22: 120,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 50,
				m42: 60,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Scales a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			const result = matrix.scale(2, 3, 4);

			expect(result.toJSON()).toEqual({
				a: 2,
				b: 4,
				c: 15,
				d: 18,
				e: 13,
				f: 14,
				m11: 2,
				m12: 4,
				m13: 6,
				m14: 8,
				m21: 15,
				m22: 18,
				m23: 21,
				m24: 24,
				m31: 36,
				m32: 40,
				m33: 44,
				m34: 48,
				m41: 13,
				m42: 14,
				m43: 15,
				m44: 16,
				is2D: false,
				isIdentity: false
			});
		});

		it('Scales a 3D matrix with a point.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1)'
			);
			const result = matrix.scale(2, 3, 4, 5, 6, 7);

			expect(result.toJSON()).toEqual({
				a: 2,
				b: 0,
				c: 0,
				d: 3,
				e: 5,
				f: 8,
				m11: 2,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0,
				m22: 3,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 4,
				m34: 0,
				m41: 5,
				m42: 8,
				m43: 9,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('scale3d()', () => {
		it('Scales a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			const result = matrix.scale3d(2);

			expect(result.toJSON()).toEqual({
				a: 2,
				b: 4,
				c: 10,
				d: 12,
				e: 13,
				f: 14,
				m11: 2,
				m12: 4,
				m13: 6,
				m14: 8,
				m21: 10,
				m22: 12,
				m23: 14,
				m24: 16,
				m31: 18,
				m32: 20,
				m33: 22,
				m34: 24,
				m41: 13,
				m42: 14,
				m43: 15,
				m44: 16,
				is2D: false,
				isIdentity: false
			});
		});

		it('Scales a 3D matrix with a point.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1)'
			);
			const result = matrix.scale3d(2, 5, 6, 7);

			expect(result.toJSON()).toEqual({
				a: 2,
				b: 0,
				c: 0,
				d: 2,
				e: 5,
				f: 14,
				m11: 2,
				m12: 0,
				m13: 0,
				m14: 0,
				m21: 0,
				m22: 2,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 2,
				m34: 0,
				m41: 5,
				m42: 14,
				m43: 23,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('scaleNonUniform()', () => {
		it('Scales a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const result = matrix.scaleNonUniform(2, 3);

			expect(result.toJSON()).toEqual({
				a: 20,
				b: 40,
				c: 90,
				d: 120,
				e: 50,
				f: 60,
				m11: 20,
				m12: 40,
				m13: 0,
				m14: 0,
				m21: 90,
				m22: 120,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 50,
				m42: 60,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Scales a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			const result = matrix.scaleNonUniform(2, 3);

			expect(result.toJSON()).toEqual({
				a: 2,
				b: 4,
				c: 15,
				d: 18,
				e: 13,
				f: 14,
				m11: 2,
				m12: 4,
				m13: 6,
				m14: 8,
				m21: 15,
				m22: 18,
				m23: 21,
				m24: 24,
				m31: 9,
				m32: 10,
				m33: 11,
				m34: 12,
				m41: 13,
				m42: 14,
				m43: 15,
				m44: 16,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('rotateAxisAngle()', () => {
		it('Rotates a 3D matrix around an axis with parameters 1, 0, 0, 90.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateAxisAngle(1, 0, 0, 90);

			expect(result.toJSON()).toEqual({
				a: 1,
				b: 2,
				c: 9,
				d: 10,
				e: 40,
				f: 50,
				m11: 1,
				m12: 2,
				m13: 3,
				m14: 4,
				m21: 9,
				m22: 10,
				m23: 20,
				m24: 30,
				m31: -5,
				m32: -6,
				m33: -7,
				m34: -8,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Rotates a 3D matrix around an axis with parameters 0, 1, 0, 90.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateAxisAngle(0, 1, 0, 90);

			expect(result.toJSON()).toEqual({
				a: -9,
				b: -10,
				c: 5,
				d: 6,
				e: 40,
				f: 50,
				m11: -9,
				m12: -10,
				m13: -20,
				m14: -30,
				m21: 5,
				m22: 6,
				m23: 7,
				m24: 8,
				m31: 1,
				m32: 2,
				m33: 3,
				m34: 4,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Rotates a 3D matrix around an axis with parameters 0, 0, 1, 90.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateAxisAngle(0, 0, 1, 90);

			expect(result.toJSON()).toEqual({
				a: 5,
				b: 6,
				c: -1,
				d: -2,
				e: 40,
				f: 50,
				m11: 5,
				m12: 6,
				m13: 7,
				m14: 8,
				m21: -1,
				m22: -2,
				m23: -3,
				m24: -4,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Rotates a 3D matrix around an axis with parameters 1, 1, 1, 90.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateAxisAngle(1, 1, 1, 100);

			expect(result.toJSON()).toEqual({
				a: 3.420276625461204,
				b: 4.420276625461204,
				c: 9.548632170413033,
				d: 10.548632170413033,
				e: 40,
				f: 50,
				is2D: false,
				isIdentity: false,
				m11: 3.420276625461204,
				m12: 4.420276625461204,
				m13: 3.8240099667473326,
				m14: 3.227743308033462,
				m21: 9.548632170413033,
				m22: 10.548632170413033,
				m23: 20.186787895128486,
				m24: 29.824943619843935,
				m31: 2.0310912041257643,
				m32: 3.0310912041257643,
				m33: 5.989202138124184,
				m34: 8.947313072122604,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1
			});
		});

		it('Rotates a 3D matrix around an axis with parameters 2, 2, 2, 90.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateAxisAngle(2, 2, 2, 90);

			expect(result.toJSON()).toEqual({
				a: 2.6905989232415,
				b: 3.6905989232414997,
				c: 9.618802153517002,
				d: 10.618802153517004,
				e: 40,
				f: 50,
				is2D: false,
				isIdentity: false,
				m11: 2.6905989232415,
				m12: 3.6905989232414997,
				m13: 2.494446500534872,
				m14: 1.2982940778282437,
				m21: 9.618802153517002,
				m22: 10.618802153517004,
				m23: 19.814954576223634,
				m24: 29.011106998930266,
				m31: 2.690598923241496,
				m32: 3.690598923241496,
				m33: 7.690598923241493,
				m34: 11.69059892324149,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1
			});
		});

		it('Rotates a 3D matrix around an axis with parameters 0, 0, 1, 360 + 90.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateAxisAngle(0, 0, 1, 360 + 90);

			expect(result.toJSON()).toEqual({
				a: 5,
				b: 6,
				c: -1,
				d: -2,
				e: 40,
				f: 50,
				m11: 5,
				m12: 6,
				m13: 7,
				m14: 8,
				m21: -1,
				m22: -2,
				m23: -3,
				m24: -4,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Rotates a 3D matrix around an axis with parameters 0, 0, 1, -90.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateAxisAngle(0, 0, 1, -90);

			expect(result.toJSON()).toEqual({
				a: -5,
				b: -6,
				c: 1,
				d: 2,
				e: 40,
				f: 50,
				m11: -5,
				m12: -6,
				m13: -7,
				m14: -8,
				m21: 1,
				m22: 2,
				m23: 3,
				m24: 4,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('rotate()', () => {
		it('Rotates a 3D matrix with x defined.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotate(90);

			expect(result.toJSON()).toEqual({
				a: 5,
				b: 6,
				c: -1,
				d: -2,
				e: 40,
				f: 50,
				m11: 5,
				m12: 6,
				m13: 7,
				m14: 8,
				m21: -1,
				m22: -2,
				m23: -3,
				m24: -4,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Rotates a 3D matrix with x and y defined.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotate(90, 90);

			expect(result.toJSON()).toEqual({
				a: -9,
				b: -10,
				c: 1,
				d: 2,
				e: 40,
				f: 50,
				m11: -9,
				m12: -10,
				m13: -20,
				m14: -30,
				m21: 1,
				m22: 2,
				m23: 3,
				m24: 4,
				m31: -5,
				m32: -6,
				m33: -7,
				m34: -8,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Rotates a 3D matrix with x, y and z defined.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotate(90, 90, 90);

			expect(result.toJSON()).toEqual({
				a: -9,
				b: -10,
				c: 5,
				d: 6,
				e: 40,
				f: 50,
				m11: -9,
				m12: -10,
				m13: -20,
				m14: -30,
				m21: 5,
				m22: 6,
				m23: 7,
				m24: 8,
				m31: 1,
				m32: 2,
				m33: 3,
				m34: 4,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('rotateFromVector()', () => {
		it('Rotates a 2D matrix with x and y defined.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(1, 2, 3, 4, 5, 6)');
			const result = matrix.rotateFromVector(1, 7);

			expect(result.toJSON()).toEqual({
				a: 3.111269837220811,
				b: 4.242640687119288,
				c: -0.565685424949236,
				d: -1.414213562373092,
				e: 5,
				f: 6,
				m11: 3.111269837220811,
				m12: 4.242640687119288,
				m13: 0,
				m14: 0,
				m21: -0.565685424949236,
				m22: -1.414213562373092,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 5,
				m42: 6,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Rotates a 3D matrix with x defined.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateFromVector(90);

			expect(result.toJSON()).toEqual({
				a: 1,
				b: 2,
				c: 5,
				d: 6,
				e: 40,
				f: 50,
				m11: 1,
				m12: 2,
				m13: 3,
				m14: 4,
				m21: 5,
				m22: 6,
				m23: 7,
				m24: 8,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});

		it('Rotates a 3D matrix with x and y defined.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.rotateFromVector(90, 90);

			expect(result.toJSON()).toEqual({
				a: 4.242640687119288,
				b: 5.656854249492384,
				c: 2.828427124746192,
				d: 2.8284271247461925,
				e: 40,
				f: 50,
				is2D: false,
				isIdentity: false,
				m11: 4.242640687119288,
				m12: 5.656854249492384,
				m13: 7.071067811865481,
				m14: 8.485281374238577,
				m21: 2.828427124746192,
				m22: 2.8284271247461925,
				m23: 2.828427124746192,
				m24: 2.828427124746192,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1
			});
		});
	});

	describe('skewX()', () => {
		it('Skews a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const result = matrix.skewX(10);

			expect(result.toJSON()).toEqual({
				a: 10,
				b: 20,
				c: 31.76326980708465,
				d: 43.5265396141693,
				e: 50,
				f: 60,
				m11: 10,
				m12: 20,
				m13: 0,
				m14: 0,
				m21: 31.76326980708465,
				m22: 43.5265396141693,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 50,
				m42: 60,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Skews a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.skewX(10);

			expect(result.toJSON()).toEqual({
				a: 1,
				b: 2,
				c: 5.176326980708465,
				d: 6.35265396141693,
				e: 40,
				f: 50,
				m11: 1,
				m12: 2,
				m13: 3,
				m14: 4,
				m21: 5.176326980708465,
				m22: 6.35265396141693,
				m23: 7.528980942125395,
				m24: 8.70530792283386,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('skewY()', () => {
		it('Skews a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const result = matrix.skewY(10);

			expect(result.toJSON()).toEqual({
				a: 15.289809421253949,
				b: 27.0530792283386,
				c: 30,
				d: 40,
				e: 50,
				f: 60,
				m11: 15.289809421253949,
				m12: 27.0530792283386,
				m13: 0,
				m14: 0,
				m21: 30,
				m22: 40,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 50,
				m42: 60,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Skews a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.skewY(10);

			expect(result.toJSON()).toEqual({
				a: 1.881634903542325,
				b: 3.0579618842507896,
				c: 5,
				d: 6,
				e: 40,
				f: 50,
				m11: 1.881634903542325,
				m12: 3.0579618842507896,
				m13: 4.234288864959255,
				m14: 5.41061584566772,
				m21: 5,
				m22: 6,
				m23: 7,
				m24: 8,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('flipX()', () => {
		it('Flips a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const result = matrix.flipX();

			expect(result.toJSON()).toEqual({
				a: -10,
				b: -20,
				c: 30,
				d: 40,
				e: 50,
				f: 60,
				m11: -10,
				m12: -20,
				m13: 0,
				m14: 0,
				m21: 30,
				m22: 40,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 50,
				m42: 60,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Flips a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.flipX();

			expect(result.toJSON()).toEqual({
				a: -1,
				b: -2,
				c: 5,
				d: 6,
				e: 40,
				f: 50,
				m11: -1,
				m12: -2,
				m13: -3,
				m14: -4,
				m21: 5,
				m22: 6,
				m23: 7,
				m24: 8,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('flipY()', () => {
		it('Flips a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(10, 20, 30, 40, 50, 60)');
			const result = matrix.flipY();

			expect(result.toJSON()).toEqual({
				a: 10,
				b: 20,
				c: -30,
				d: -40,
				e: 50,
				f: 60,
				m11: 10,
				m12: 20,
				m13: 0,
				m14: 0,
				m21: -30,
				m22: -40,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 50,
				m42: 60,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Flips a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.flipY();

			expect(result.toJSON()).toEqual({
				a: 1,
				b: 2,
				c: -5,
				d: -6,
				e: 40,
				f: 50,
				m11: 1,
				m12: 2,
				m13: 3,
				m14: 4,
				m21: -5,
				m22: -6,
				m23: -7,
				m24: -8,
				m31: 9,
				m32: 10,
				m33: 20,
				m34: 30,
				m41: 40,
				m42: 50,
				m43: 60,
				m44: 1,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('inverse()', () => {
		it('Inverses a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(1, 2, 3, 4, 5, 6)');
			const result = matrix.inverse();

			expect(result.toJSON()).toEqual({
				a: -2,
				b: 1,
				c: 1.5,
				d: -0.5,
				e: 1,
				f: -2,
				m11: -2,
				m12: 1,
				m13: 0,
				m14: 0,
				m21: 1.5,
				m22: -0.5,
				m23: 0,
				m24: 0,
				m31: 0,
				m32: 0,
				m33: 1,
				m34: 0,
				m41: 1,
				m42: -2,
				m43: 0,
				m44: 1,
				is2D: true,
				isIdentity: false
			});
		});

		it('Inverses a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.inverse();

			expect(result.toJSON()).toEqual({
				a: -1.3888888888888888,
				b: 0.2777777777777778,
				c: 1.0640096618357489,
				d: 0.3031400966183575,
				e: 0.036231884057971016,
				f: 0.10869565217391304,
				m11: -1.3888888888888888,
				m12: 0.2777777777777778,
				m13: 0.1111111111111111,
				m14: 0,
				m21: 1.0640096618357489,
				m22: 0.3031400966183575,
				m23: -0.2222222222222222,
				m24: -0.014492753623188406,
				m31: 0.03864734299516908,
				m32: -0.4396135265700483,
				m33: 0.1111111111111111,
				m34: 0.028985507246376812,
				m41: 0.036231884057971016,
				m42: 0.10869565217391304,
				m43: 0,
				m44: -0.014492753623188406,
				is2D: false,
				isIdentity: false
			});
		});
	});

	describe('transformPoint()', () => {
		it('Transforms a point with a 2D matrix.', () => {
			const matrix = new DOMMatrixReadOnly('matrix(1, 2, 3, 4, 5, 6)');
			const result = matrix.transformPoint({ x: 10, y: 20 });

			expect(result).toEqual(new DOMPoint(75, 106, 0, 1));
		});

		it('Transforms a point with a 3D matrix.', () => {
			const matrix = new DOMMatrixReadOnly(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			const result = matrix.transformPoint({ x: 10, y: 20 });

			expect(result).toEqual(new DOMPoint(150, 190, 230, 201));
		});
	});
});
