import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGMatrix from '../../src/svg/SVGMatrix.js';

describe('SVGMatrix', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window);
			expect(matrix).toBeInstanceOf(SVGMatrix);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGMatrix(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get a()', () => {
		it('Returns the `a` value of the matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			expect(matrix.a).toBe(1);
		});
	});

	describe('set a()', () => {
		it('Sets the `a` value of the matrix', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			matrix.a = 10;
			expect(attribute).toBe('matrix(10 2 3 4 5 6)');
		});

		it('Does not set the `a` value of the matrix if read only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value),
				readOnly: true
			});

			matrix.a = 10;
			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('get b()', () => {
		it('Returns the `b` value of the matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			expect(matrix.b).toBe(2);
		});
	});

	describe('set b()', () => {
		it('Sets the `b` value of the matrix', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			matrix.b = 10;
			expect(attribute).toBe('matrix(1 10 3 4 5 6)');
		});

		it('Does not set the `b` value of the matrix if read only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value),
				readOnly: true
			});

			matrix.b = 10;
			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('get c()', () => {
		it('Returns the `c` value of the matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			expect(matrix.c).toBe(3);
		});
	});

	describe('set c()', () => {
		it('Sets the `c` value of the matrix', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			matrix.c = 10;
			expect(attribute).toBe('matrix(1 2 10 4 5 6)');
		});

		it('Does not set the `c` value of the matrix if read only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value),
				readOnly: true
			});

			matrix.c = 10;
			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('get d()', () => {
		it('Returns the `d` value of the matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			expect(matrix.d).toBe(4);
		});
	});

	describe('set d()', () => {
		it('Sets the `d` value of the matrix', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			matrix.d = 10;
			expect(attribute).toBe('matrix(1 2 3 10 5 6)');
		});

		it('Does not set the `d` value of the matrix if read only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value),
				readOnly: true
			});

			matrix.d = 10;
			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('get e()', () => {
		it('Returns the `e` value of the matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			expect(matrix.e).toBe(5);
		});
	});

	describe('set e()', () => {
		it('Sets the `e` value of the matrix', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			matrix.e = 10;
			expect(attribute).toBe('matrix(1 2 3 4 10 6)');
		});

		it('Does not set the `e` value of the matrix if read only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value),
				readOnly: true
			});

			matrix.e = 10;
			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('get f()', () => {
		it('Returns the `f` value of the matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			expect(matrix.f).toBe(6);
		});
	});

	describe('set f()', () => {
		it('Sets the `f` value of the matrix', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			matrix.f = 10;
			expect(attribute).toBe('matrix(1 2 3 4 5 10)');
		});

		it('Does not set the `f` value of the matrix if read only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value),
				readOnly: true
			});

			matrix.f = 10;
			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('multiply()', () => {
		it('Returns a new SVGMatrix instance which is the result of this matrix multiplied by the passed matrix', () => {
			const matrix1 = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});
			const matrix2 = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix1.multiply(matrix2);

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(7);
			expect(result.b).toBe(10);
			expect(result.c).toBe(15);
			expect(result.d).toBe(22);
			expect(result.e).toBe(28);
			expect(result.f).toBe(40);
		});
	});

	describe('translate()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a translation matrix containing the passed values', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.translate(10, 20);

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(1);
			expect(result.b).toBe(2);
			expect(result.c).toBe(3);
			expect(result.d).toBe(4);
			expect(result.e).toBe(75);
			expect(result.f).toBe(106);
		});
	});

	describe('scale()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a scale matrix containing the passed values', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.scale(10);

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(10);
			expect(result.b).toBe(20);
			expect(result.c).toBe(30);
			expect(result.d).toBe(40);
			expect(result.e).toBe(5);
			expect(result.f).toBe(6);
		});
	});

	describe('scaleNonUniform()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a non-uniform scale matrix containing the passed values', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.scaleNonUniform(10, 20);

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(10);
			expect(result.b).toBe(20);
			expect(result.c).toBe(60);
			expect(result.d).toBe(80);
			expect(result.e).toBe(5);
			expect(result.f).toBe(6);
		});
	});

	describe('rotate()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a rotation matrix containing the passed value', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.rotate(90);

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(3);
			expect(result.b).toBe(4);
			expect(result.c).toBe(-1);
			expect(result.d).toBe(-2);
			expect(result.e).toBe(5);
			expect(result.f).toBe(6);
		});
	});

	describe('rotateFromVector()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a rotation matrix containing the passed values', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.rotateFromVector(1, 7);

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(3.111269837220811);
			expect(result.b).toBe(4.242640687119288);
			expect(result.c).toBe(-0.565685424949236);
			expect(result.d).toBe(-1.414213562373092);
			expect(result.e).toBe(5);
			expect(result.f).toBe(6);
		});
	});

	describe('skewX()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a skew matrix containing the passed value', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.skewX(90);

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(1);
			expect(result.b).toBe(2);
			expect(result.c).toBe(16331239353195372);
			expect(result.d).toBe(32662478706390744);
			expect(result.e).toBe(5);
			expect(result.f).toBe(6);
		});
	});

	describe('skewY()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a skew matrix containing the passed value', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.skewY(90);

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(48993718059586110);
			expect(result.b).toBe(65324957412781480);
			expect(result.c).toBe(3);
			expect(result.d).toBe(4);
			expect(result.e).toBe(5);
			expect(result.f).toBe(6);
		});
	});

	describe('flipX()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a flipX matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.flipX();

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(-1);
			expect(result.b).toBe(-2);
			expect(result.c).toBe(3);
			expect(result.d).toBe(4);
			expect(result.e).toBe(5);
			expect(result.f).toBe(6);
		});
	});

	describe('flipY()', () => {
		it('Returns a new SVGMatrix instance which is this matrix post multiplied by a flipY matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.flipY();

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(1);
			expect(result.b).toBe(2);
			expect(result.c).toBe(-3);
			expect(result.d).toBe(-4);
			expect(result.e).toBe(5);
			expect(result.f).toBe(6);
		});
	});

	describe('inverse()', () => {
		it('Returns a new SVGMatrix instance which is the inverse of this matrix', () => {
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6)',
				setAttribute: () => {}
			});

			const result = matrix.inverse();

			expect(result).toBeInstanceOf(SVGMatrix);

			expect(result.a).toBe(-2);
			expect(result.b).toBe(1);
			expect(result.c).toBe(1.5);
			expect(result.d).toBe(-0.5);
			expect(result.e).toBe(1);
			expect(result.f).toBe(-2);
		});
	});
});
