import { describe, it, expect } from 'vitest';
import DOMMatrix from '../../../src/dom/dom-matrix/DOMMatrix.js';
import DOMMatrixReadOnly from '../../../src/dom/dom-matrix/DOMMatrixReadOnly.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('DOMMatrix', () => {
	describe('constructor()', () => {
		it('Creates a new DOMMatrix.', () => {
			const matrix = new DOMMatrix();
			expect(matrix).toBeInstanceOf(DOMMatrix);
			expect(matrix).toBeInstanceOf(DOMMatrixReadOnly);
		});

		it('Creates a new DOMMatrix from a DOMMatrix instance.', () => {
			const matrix = new DOMMatrix(new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)'));

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

		it('Creates a new DOMMatrix from a DOMMatrixReadOnly instance.', () => {
			const matrix = new DOMMatrix(
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

		it('Creates a new DOMMatrix from a DOM Matrix compatible object.', () => {
			const matrix = new DOMMatrix({
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
		});

		it('Creates a new DOMMatrix from an array.', () => {
			// prettier-ignore
			const matrix = new DOMMatrix([
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

		it('Creates a new DOMMatrix from a "matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)" string.', () => {
			const matrix = new DOMMatrix(
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
	});

	describe('get a()', () => {
		it('Returns "m11" property.', () => {
			const matrix = new DOMMatrix();
			matrix[PropertySymbol.m11] = 10;
			expect(matrix.a).toBe(10);
		});
	});

	describe('set a()', () => {
		it('Sets "m11" property.', () => {
			const matrix = new DOMMatrix();
			matrix.a = 10;
			expect(matrix[PropertySymbol.m11]).toBe(10);
		});
	});

	describe('get b()', () => {
		it('Returns "m12" property.', () => {
			const matrix = new DOMMatrix();
			matrix[PropertySymbol.m12] = 10;
			expect(matrix.b).toBe(10);
		});
	});

	describe('set b()', () => {
		it('Sets "m12" property.', () => {
			const matrix = new DOMMatrix();
			matrix.b = 10;
			expect(matrix[PropertySymbol.m12]).toBe(10);
		});
	});

	describe('get c()', () => {
		it('Returns "m21" property.', () => {
			const matrix = new DOMMatrix();
			matrix[PropertySymbol.m21] = 10;
			expect(matrix.c).toBe(10);
		});
	});

	describe('set c()', () => {
		it('Sets "m21" property.', () => {
			const matrix = new DOMMatrix();
			matrix.c = 10;
			expect(matrix[PropertySymbol.m21]).toBe(10);
		});
	});

	describe('get d()', () => {
		it('Returns "m22" property.', () => {
			const matrix = new DOMMatrix();
			matrix[PropertySymbol.m22] = 10;
			expect(matrix.d).toBe(10);
		});
	});

	describe('set d()', () => {
		it('Sets "m22" property.', () => {
			const matrix = new DOMMatrix();
			matrix.d = 10;
			expect(matrix[PropertySymbol.m22]).toBe(10);
		});
	});

	describe('get e()', () => {
		it('Returns "m41" property.', () => {
			const matrix = new DOMMatrix();
			matrix[PropertySymbol.m41] = 10;
			expect(matrix.e).toBe(10);
		});
	});

	describe('set e()', () => {
		it('Sets "m41" property.', () => {
			const matrix = new DOMMatrix();
			matrix.e = 10;
			expect(matrix[PropertySymbol.m41]).toBe(10);
		});
	});

	describe('get f()', () => {
		it('Returns "m42" property.', () => {
			const matrix = new DOMMatrix();
			matrix[PropertySymbol.m42] = 10;
			expect(matrix.f).toBe(10);
		});
	});

	describe('set f()', () => {
		it('Sets "m42" property.', () => {
			const matrix = new DOMMatrix();
			matrix.f = 10;
			expect(matrix[PropertySymbol.m42]).toBe(10);
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
				const matrix = new DOMMatrix();
				matrix[PropertySymbol[key]] = 10;
				expect(matrix[key]).toBe(10);
			});
		});

		describe(`set ${key}()`, () => {
			it(`Sets "${key}" property.`, () => {
				const matrix = new DOMMatrix();
				matrix[key] = 10;
				expect(matrix[PropertySymbol[key]]).toBe(10);
			});
		});
	}

	describe('multiplySelf()', () => {
		it('Multiplies two 2d matrices.', () => {
			const matrix1 = new DOMMatrix('matrix(2, 3, 4, 5, 6, 7)');
			const matrix2 = new DOMMatrix('matrix(2, 3, 4, 5, 6, 7)');
			expect(matrix1.multiplySelf(matrix2)).toBe(matrix1);

			expect(matrix1.m11).toBe(16);
			expect(matrix1.m12).toBe(21);
			expect(matrix1.m13).toBe(0);
			expect(matrix1.m14).toBe(0);
			expect(matrix1.m21).toBe(28);
			expect(matrix1.m22).toBe(37);
			expect(matrix1.m23).toBe(0);
			expect(matrix1.m24).toBe(0);
			expect(matrix1.m31).toBe(0);
			expect(matrix1.m32).toBe(0);
			expect(matrix1.m33).toBe(1);
			expect(matrix1.m34).toBe(0);
			expect(matrix1.m41).toBe(46);
			expect(matrix1.m42).toBe(60);
			expect(matrix1.m43).toBe(0);
			expect(matrix1.m44).toBe(1);

			expect(matrix1.a).toBe(16);
			expect(matrix1.b).toBe(21);
			expect(matrix1.c).toBe(28);
			expect(matrix1.d).toBe(37);
			expect(matrix1.e).toBe(46);
			expect(matrix1.f).toBe(60);
		});

		it('Multiplies two 3d matrices.', () => {
			const matrix1 = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			const matrix2 = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			matrix1.multiplySelf(matrix2);

			expect(matrix1.m11).toBe(90);
			expect(matrix1.m12).toBe(100);
			expect(matrix1.m13).toBe(110);
			expect(matrix1.m14).toBe(120);
			expect(matrix1.m21).toBe(202);
			expect(matrix1.m22).toBe(228);
			expect(matrix1.m23).toBe(254);
			expect(matrix1.m24).toBe(280);
			expect(matrix1.m31).toBe(314);
			expect(matrix1.m32).toBe(356);
			expect(matrix1.m33).toBe(398);
			expect(matrix1.m34).toBe(440);
			expect(matrix1.m41).toBe(426);
			expect(matrix1.m42).toBe(484);
			expect(matrix1.m43).toBe(542);
			expect(matrix1.m44).toBe(600);

			expect(matrix1.a).toBe(90);
			expect(matrix1.b).toBe(100);
			expect(matrix1.c).toBe(202);
			expect(matrix1.d).toBe(228);
			expect(matrix1.e).toBe(426);
			expect(matrix1.f).toBe(484);
		});
	});

	describe('translateSelf()', () => {
		it('Translates a 2D matrix.', () => {
			const matrix = new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.translateSelf(10, 20)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix1 = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			matrix1.translateSelf(10, 20, 30);

			expect(matrix1.toJSON()).toEqual({
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
			const matrix2 = new DOMMatrix('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1)');
			matrix2.translateSelf(5, 6, 7);

			expect(matrix2.toJSON()).toEqual({
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

	describe('scaleSelf()', () => {
		it('Scales a 2D matrix.', () => {
			const matrix = new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.scaleSelf(2, 3)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			matrix.scaleSelf(2, 3, 4);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1)');
			matrix.scaleSelf(2, 3, 4, 5, 6, 7);

			expect(matrix.toJSON()).toEqual({
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

	describe('scale3dSelf()', () => {
		it('Scales a 3D matrix.', () => {
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			expect(matrix.scale3dSelf(2)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1)');
			matrix.scale3dSelf(2, 5, 6, 7);

			expect(matrix.toJSON()).toEqual({
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

	describe('scaleNonUniformSelf()', () => {
		it('Scales a 2D matrix.', () => {
			const matrix = new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)');

			expect(matrix.scaleNonUniformSelf(2, 3)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)'
			);
			matrix.scaleNonUniformSelf(2, 3);

			expect(matrix.toJSON()).toEqual({
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

	describe('rotateAxisAngleSelf()', () => {
		it('Rotates a 3D matrix around an axis with parameters 1, 0, 0, 90.', () => {
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			expect(matrix.rotateAxisAngleSelf(1, 0, 0, 90)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateAxisAngleSelf(0, 1, 0, 90);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateAxisAngleSelf(0, 0, 1, 90);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateAxisAngleSelf(1, 1, 1, 100);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateAxisAngleSelf(2, 2, 2, 90);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateAxisAngleSelf(0, 0, 1, 360 + 90);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateAxisAngleSelf(0, 0, 1, -90);

			expect(matrix.toJSON()).toEqual({
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

	describe('rotateSelf()', () => {
		it('Rotates a 3D matrix with x defined.', () => {
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			expect(matrix.rotateSelf(90)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateSelf(90, 90);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateSelf(90, 90, 90);

			expect(matrix.toJSON()).toEqual({
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

	describe('rotateFromVectorSelf()', () => {
		it('Rotates a 3D matrix with x defined.', () => {
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			expect(matrix.rotateFromVectorSelf(90)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.rotateFromVectorSelf(90, 90);

			expect(matrix.toJSON()).toEqual({
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

	describe('skewXSelf()', () => {
		it('Skews a 2D matrix.', () => {
			const matrix = new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.skewXSelf(10)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.skewXSelf(10);

			expect(matrix.toJSON()).toEqual({
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

	describe('skewYSelf()', () => {
		it('Skews a 2D matrix.', () => {
			const matrix = new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.skewYSelf(10)).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.skewYSelf(10);

			expect(matrix.toJSON()).toEqual({
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

	describe('flipXSelf()', () => {
		it('Flips a 2D matrix.', () => {
			const matrix = new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.flipXSelf()).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.flipXSelf();

			expect(matrix.toJSON()).toEqual({
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

	describe('flipYSelf()', () => {
		it('Flips a 2D matrix.', () => {
			const matrix = new DOMMatrix('matrix(10, 20, 30, 40, 50, 60)');
			expect(matrix.flipYSelf()).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.flipYSelf();

			expect(matrix.toJSON()).toEqual({
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

	describe('invertSelf()', () => {
		it('Inverses a 2D matrix.', () => {
			const matrix = new DOMMatrix('matrix(1, 2, 3, 4, 5, 6)');
			expect(matrix.invertSelf()).toBe(matrix);

			expect(matrix.toJSON()).toEqual({
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
			const matrix = new DOMMatrix(
				'matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 1)'
			);
			matrix.invertSelf();

			expect(matrix.toJSON()).toEqual({
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
});
