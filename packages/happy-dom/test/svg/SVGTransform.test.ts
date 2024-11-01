import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGTransform from '../../src/svg/SVGTransform.js';
import SVGTransformTypeEnum from '../../src/svg/SVGTransformTypeEnum.js';
import SVGMatrix from '../../src/svg/SVGMatrix.js';

describe('SVGTransform', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			expect(transform).toBeInstanceOf(SVGTransform);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(() => new window.SVGTransform(Symbol(''), window)).toThrow(
				new TypeError('Illegal constructor')
			);
		});
	});

	describe('get type()', () => {
		it('Returns unknown by default', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			expect(transform.type).toBe(SVGTransformTypeEnum.unknown);
		});

		it('Returns SVGTransformTypeEnum.matrix if attribute has matrix()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1, 2, 3, 4, 5, 6)'
			});
			expect(transform.type).toBe(SVGTransformTypeEnum.matrix);
		});

		it('Returns SVGTransformTypeEnum.translate if attribute has translate()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'translate(10, 20)'
			});
			expect(transform.type).toBe(SVGTransformTypeEnum.translate);
		});

		it('Returns SVGTransformTypeEnum.rotate if attribute has rotate()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'rotate(90)'
			});
			expect(transform.type).toBe(SVGTransformTypeEnum.rotate);
		});

		it('Returns SVGTransformTypeEnum.scale if attribute has scale()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'scale(10)'
			});
			expect(transform.type).toBe(SVGTransformTypeEnum.scale);
		});

		it('Returns SVGTransformTypeEnum.skewX if attribute has skewX()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'skewX(10)'
			});
			expect(transform.type).toBe(SVGTransformTypeEnum.skewX);
		});

		it('Returns SVGTransformTypeEnum.skewY if attribute has skewY()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'skewY(10)'
			});
			expect(transform.type).toBe(SVGTransformTypeEnum.skewY);
		});
	});

	describe('get angle()', () => {
		it('Returns 0 by default', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			expect(transform.angle).toBe(0);
		});

		it('Returns angle for attribute value with rotate()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'rotate(90)'
			});
			expect(transform.angle).toBe(90);

			const transform2 = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'rotate(90 10 20)'
			});
			expect(transform2.angle).toBe(90);
		});

		it('Returns angle for attribute value with skewX()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'skewX(90)'
			});
			expect(transform.angle).toBe(90);
		});

		it('Returns angle for attribute value with skewY()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'skewY(90)'
			});
			expect(transform.angle).toBe(90);
		});
	});

	describe('get matrix()', () => {
		it('Returns an SVGMatrix instance', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			const matrix = transform.matrix;
			expect(matrix).toBeInstanceOf(window.SVGMatrix);
			expect(transform.matrix).toBe(matrix);
		});

		it('Returns SVGMatrix for attribute value with matrix()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1, 2, 3, 4, 5, 6)'
			});
			const matrix = transform.matrix;
			expect(matrix.a).toBe(1);
			expect(matrix.b).toBe(2);
			expect(matrix.c).toBe(3);
			expect(matrix.d).toBe(4);
			expect(matrix.e).toBe(5);
			expect(matrix.f).toBe(6);
		});

		it('Returns SVGMatrix for attribute value with translate()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'translate(10)'
			});
			const matrix = transform.matrix;
			expect(matrix.a).toBe(1);
			expect(matrix.b).toBe(0);
			expect(matrix.c).toBe(0);
			expect(matrix.d).toBe(1);
			expect(matrix.e).toBe(10);
			expect(matrix.f).toBe(0);

			const transform2 = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'translate(10, 20)'
			});
			const matrix2 = transform2.matrix;
			expect(matrix2.a).toBe(1);
			expect(matrix2.b).toBe(0);
			expect(matrix2.c).toBe(0);
			expect(matrix2.d).toBe(1);
			expect(matrix2.e).toBe(10);
			expect(matrix2.f).toBe(20);
		});

		it('Returns SVGMatrix for attribute value with rotate()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'rotate(90)'
			});
			const matrix = transform.matrix;
			expect(matrix.a).toBe(6.123233995736766e-17);
			expect(matrix.b).toBe(1);
			expect(matrix.c).toBe(-1);
			expect(matrix.d).toBe(6.123233995736766e-17);
			expect(matrix.e).toBe(0);
			expect(matrix.f).toBe(0);

			const transform2 = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'rotate(90 10 20)'
			});
			const matrix2 = transform2.matrix;
			expect(matrix2.a).toBe(6.123233995736766e-17);
			expect(matrix2.b).toBe(1);
			expect(matrix2.c).toBe(-1);
			expect(matrix2.d).toBe(6.123233995736766e-17);
			expect(matrix2.e).toBe(30);
			expect(matrix2.f).toBe(9.999999999999998);
		});

		it('Returns SVGMatrix for attribute value with scale()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'scale(10)'
			});
			const matrix = transform.matrix;
			expect(matrix.a).toBe(10);
			expect(matrix.b).toBe(0);
			expect(matrix.c).toBe(0);
			expect(matrix.d).toBe(10);
			expect(matrix.e).toBe(0);
			expect(matrix.f).toBe(0);

			const transform2 = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'scale(10 20)'
			});
			const matrix2 = transform2.matrix;
			expect(matrix2.a).toBe(10);
			expect(matrix2.b).toBe(0);
			expect(matrix2.c).toBe(0);
			expect(matrix2.d).toBe(20);
			expect(matrix2.e).toBe(0);
			expect(matrix2.f).toBe(0);
		});

		it('Returns SVGMatrix for attribute value with skewX()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'skewX(10)'
			});
			const matrix = transform.matrix;
			expect(matrix.a).toBe(1);
			expect(matrix.b).toBe(0);
			expect(matrix.c).toBe(0.17632698070846498);
			expect(matrix.d).toBe(1);
			expect(matrix.e).toBe(0);
			expect(matrix.f).toBe(0);
		});

		it('Returns SVGMatrix for attribute value with skewY()', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'skewY(10)'
			});
			const matrix = transform.matrix;
			expect(matrix.a).toBe(1);
			expect(matrix.b).toBe(0.17632698070846498);
			expect(matrix.c).toBe(0);
			expect(matrix.d).toBe(1);
			expect(matrix.e).toBe(0);
			expect(matrix.f).toBe(0);
		});

		it('Throws an error for attribute value with invalid transform function', () => {
			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'invalid(10)'
					}).matrix.a
			).toThrow(
				new TypeError(`Failed to parse transform attribute: Unknown transformation "invalid(10)".`)
			);

			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'rotateX(10)'
					}).matrix.a
			).toThrow(
				new TypeError(`Failed to parse transform attribute: Unknown transformation "rotateX(10)".`)
			);

			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'rotateY(10)'
					}).matrix.a
			).toThrow(
				new TypeError(`Failed to parse transform attribute: Unknown transformation "rotateY(10)".`)
			);

			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'scaleX(10)'
					}).matrix.a
			).toThrow(
				new TypeError(`Failed to parse transform attribute: Unknown transformation "scaleX(10)".`)
			);

			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'scaleY(10)'
					}).matrix.a
			).toThrow(
				new TypeError(`Failed to parse transform attribute: Unknown transformation "scaleY(10)".`)
			);

			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'rotate(90 10)'
					}).matrix.a
			).toThrow(
				new TypeError(
					`Failed to parse transform attribute: Expected 1 or 3 parameters in "rotate(90 10)".`
				)
			);

			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'matrix(1 2 3 4 5)'
					}).matrix.a
			).toThrow(
				new TypeError(
					`Failed to parse transform attribute: Expected 6 parameters in "matrix(1 2 3 4 5)".`
				)
			);

			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'skewX(10 20)'
					}).matrix.a
			).toThrow(
				new TypeError(
					`Failed to parse transform attribute: Expected 1 parameter in "skewX(10 20)".`
				)
			);

			expect(
				() =>
					new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
						getAttribute: () => 'skewY(10 20)'
					}).matrix.a
			).toThrow(
				new TypeError(
					`Failed to parse transform attribute: Expected 1 parameter in "skewY(10 20)".`
				)
			);
		});
	});

	describe('setMatrix()', () => {
		it('Throws an error if value is not an SVGMatrix instance', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			expect(() => transform.setMatrix(<SVGMatrix>{})).toThrow(
				new TypeError(
					'Failed to set the "matrix" property on "SVGTransform": The provided value is not of type "SVGMatrix".'
				)
			);
		});

		it('Does not set matrix if read-only', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window);
			matrix.a = 10;
			transform.setMatrix(matrix);
			expect(transform.matrix.a).toBe(1);
		});

		it('Sets matrix', () => {
			let attribute = 'matrix(1, 2, 3, 4, 5, 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window);
			const rotatedMatrix = matrix.rotate(90);

			transform.setMatrix(rotatedMatrix);

			expect(transform.matrix).toBe(rotatedMatrix);

			expect(transform.matrix.a).toBe(0);
			expect(transform.matrix.b).toBe(1);
			expect(transform.matrix.c).toBe(-1);
			expect(transform.matrix.d).toBe(0);
			expect(transform.matrix.e).toBe(0);
			expect(transform.matrix.f).toBe(0);

			expect(attribute).toBe('matrix(0 1 -1 0 0 0)');

			attribute = 'matrix(1, 2, 3, 4, 5, 6)';

			expect(transform.matrix.a).toBe(1);
			expect(transform.matrix.b).toBe(2);
			expect(transform.matrix.c).toBe(3);
			expect(transform.matrix.d).toBe(4);
			expect(transform.matrix.e).toBe(5);
			expect(transform.matrix.f).toBe(6);
		});

		it('Does not set matrix if read-only', () => {
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				readOnly: true,
				getAttribute: () => 'matrix(1, 2, 3, 4, 5, 6)'
			});
			const matrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window);
			matrix.a = 10;
			transform.setMatrix(matrix);
			expect(transform.matrix.a).toBe(1);
		});
	});

	describe('setTranslate()', () => {
		it('Sets translate', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setTranslate(30, 40);

			expect(attribute).toBe('translate(30 40)');
		});

		it('Does not set translate if read-only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				readOnly: true,
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setTranslate(30, 40);

			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('setScale()', () => {
		it('Sets scale', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setScale(10, 20);

			expect(attribute).toBe('scale(10 20)');
		});

		it('Does not set scale if read-only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				readOnly: true,
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setScale(10, 20);

			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('setRotate()', () => {
		it('Sets rotate', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setRotate(90, 10, 20);

			expect(attribute).toBe('rotate(90 10 20)');
		});

		it('Does not set rotate if read-only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				readOnly: true,
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setRotate(90, 10, 20);

			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('setSkewX()', () => {
		it('Sets skewX', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setSkewX(10);

			expect(attribute).toBe('skewX(10)');
		});

		it('Does not set skewX if read-only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				readOnly: true,
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setSkewX(10);

			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});

	describe('setSkewY()', () => {
		it('Sets skewY', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setSkewY(10);

			expect(attribute).toBe('skewY(10)');
		});

		it('Does not set skewY if read-only', () => {
			let attribute = 'matrix(1 2 3 4 5 6)';
			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window, {
				readOnly: true,
				getAttribute: () => attribute,
				setAttribute: (value: string) => (attribute = value)
			});

			transform.setSkewY(10);

			expect(attribute).toBe('matrix(1 2 3 4 5 6)');
		});
	});
});
