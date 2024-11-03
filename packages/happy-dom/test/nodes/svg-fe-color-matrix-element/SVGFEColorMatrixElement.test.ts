import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFEColorMatrixElement from '../../../src/nodes/svg-fe-color-matrix-element/SVGFEColorMatrixElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('SVGFEColorMatrixElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEColorMatrixElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEColorMatrixElement', () => {
			expect(element instanceof SVGFEColorMatrixElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get static SVG_FEBLEND_TYPE_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGFEColorMatrixElement.SVG_FEBLEND_TYPE_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_FEBLEND_TYPE_MATRIX()', () => {
		it('Should return 1', () => {
			expect(SVGFEColorMatrixElement.SVG_FEBLEND_TYPE_MATRIX).toBe(1);
		});
	});

	describe('get static SVG_FEBLEND_TYPE_SATURATE()', () => {
		it('Should return 2', () => {
			expect(SVGFEColorMatrixElement.SVG_FEBLEND_TYPE_SATURATE).toBe(2);
		});
	});

	describe('get static SVG_FEBLEND_TYPE_HUEROTATE()', () => {
		it('Should return 3', () => {
			expect(SVGFEColorMatrixElement.SVG_FEBLEND_TYPE_HUEROTATE).toBe(3);
		});
	});

	describe('get static SVG_FEBLEND_TYPE_LUMINANCETOALPHA()', () => {
		it('Should return 4', () => {
			expect(SVGFEColorMatrixElement.SVG_FEBLEND_TYPE_LUMINANCETOALPHA).toBe(4);
		});
	});

	describe('get height()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const height = element.height;
			expect(height).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.height).toBe(height);
		});

		it('Reflects the "height" attribute', () => {
			element.setAttribute('height', '10cm');

			expect(element.height.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.height.baseVal.valueAsString).toBe('10cm');
			expect(element.height.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.height.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.height.animVal.valueAsString).toBe('10cm');
			expect(element.height.animVal.valueInSpecifiedUnits).toBe(10);

			element.height.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('height')).toBe('20px');

			expect(() =>
				element.height.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get in1()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const in1 = element.in1;
			expect(in1).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.in1).toBe(in1);
		});

		it('Reflects the "in" attribute', () => {
			element.setAttribute('in', 'SourceGraphic');

			expect(element.in1.baseVal).toBe('SourceGraphic');
			expect(element.in1.animVal).toBe('SourceGraphic');

			element.in1.baseVal = 'BackgroundImage';

			expect(element.getAttribute('in')).toBe('BackgroundImage');

			// Does nothing
			element.in1.animVal = 'Test';

			expect(element.getAttribute('in')).toBe('BackgroundImage');
		});
	});

	describe('get in2()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const in2 = element.in2;
			expect(in2).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.in2).toBe(in2);
		});

		it('Reflects the "in2" attribute', () => {
			element.setAttribute('in2', 'SourceGraphic');

			expect(element.in2.baseVal).toBe('SourceGraphic');
			expect(element.in2.animVal).toBe('SourceGraphic');

			element.in2.baseVal = 'BackgroundImage';

			expect(element.getAttribute('in2')).toBe('BackgroundImage');

			// Does nothing
			element.in2.animVal = 'Test';

			expect(element.getAttribute('in2')).toBe('BackgroundImage');
		});
	});

	describe('get result()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const result = element.result;
			expect(result).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.result).toBe(result);
		});

		it('Reflects the "result" attribute', () => {
			element.setAttribute('result', 'SourceGraphic');

			expect(element.result.baseVal).toBe('SourceGraphic');
			expect(element.result.animVal).toBe('SourceGraphic');

			element.result.baseVal = 'BackgroundImage';

			expect(element.getAttribute('result')).toBe('BackgroundImage');

			// Does nothing
			element.result.animVal = 'Test';

			expect(element.getAttribute('result')).toBe('BackgroundImage');
		});
	});

	describe('get type()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const type = element.type;
			expect(type).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.type).toBe(type);
		});

		it('Should return "matrix" as the default value', () => {
			expect(element.type.baseVal).toBe(SVGFEColorMatrixElement.SVG_FEBLEND_TYPE_MATRIX);
			expect(element.type.animVal).toBe(SVGFEColorMatrixElement.SVG_FEBLEND_TYPE_MATRIX);
		});

		for (const type of ['matrix', 'saturate', 'huerotate', 'luminancetoalpha']) {
			it(`Reflects the "type" attribute for "${type}"`, () => {
				const propertyName = `SVG_FEBLEND_TYPE_${type.toUpperCase().replace(/-/g, '_')}`;

				element.setAttribute('type', type);

				expect(element.type.baseVal).toBe(SVGFEColorMatrixElement[propertyName]);
				expect(element.type.animVal).toBe(SVGFEColorMatrixElement[propertyName]);

				element.removeAttribute('type');

				element.type.baseVal = SVGFEColorMatrixElement[propertyName];

				expect(element.getAttribute('type')).toBe(type);

				element.removeAttribute('type');

				// Does nothing
				element.type.animVal = SVGFEColorMatrixElement.SVG_FEBLEND_TYPE_MATRIX;

				expect(element.getAttribute('type')).toBe(null);
			});
		}
	});

	describe('get values()', () => {
		it('Should return an instance of SVGAnimatedNumberList', () => {
			const values = element.values;
			expect(values).toBeInstanceOf(window.SVGAnimatedNumberList);
			expect(element.values).toBe(values);
		});

		it('Reflects the "values" attribute', () => {
			element.setAttribute('values', '1 2.2 3 4');

			expect(element.values.baseVal.numberOfItems).toBe(4);
			expect(element.values.baseVal.getItem(0).value).toBe(1);
			expect(element.values.baseVal.getItem(1).value).toBe(2.2);
			expect(element.values.baseVal.getItem(2).value).toBe(3);
			expect(element.values.baseVal.getItem(3).value).toBe(4);

			expect(element.values.animVal.numberOfItems).toBe(4);
			expect(element.values.animVal.getItem(0).value).toBe(1);
			expect(element.values.animVal.getItem(1).value).toBe(2.2);
			expect(element.values.animVal.getItem(2).value).toBe(3);
			expect(element.values.animVal.getItem(3).value).toBe(4);

			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			number.value = 5;
			element.values.baseVal.appendItem(number);

			expect(element.getAttribute('values')).toBe('1 2.2 3 4 5');

			element.setAttribute('values', '7 8 9');

			expect(element.values.baseVal.length).toBe(3);
			expect(element.values.baseVal[0].value).toBe(7);
			expect(element.values.baseVal[1].value).toBe(8);
			expect(element.values.baseVal[2].value).toBe(9);

			element.values.baseVal.clear();

			expect(element.getAttribute('values')).toBe('');

			const number2 = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			number2.value = 6;
			expect(() => element.values.animVal.appendItem(number2)).toThrow(
				new TypeError(`Failed to execute 'appendItem' on 'SVGNumberList': The object is read-only.`)
			);
		});
	});

	describe('get width()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const width = element.width;
			expect(width).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.width).toBe(width);
		});

		it('Reflects the "width" attribute', () => {
			element.setAttribute('width', '10cm');

			expect(element.width.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.width.baseVal.valueAsString).toBe('10cm');
			expect(element.width.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.width.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.width.animVal.valueAsString).toBe('10cm');
			expect(element.width.animVal.valueInSpecifiedUnits).toBe(10);

			element.width.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('width')).toBe('20px');

			expect(() =>
				element.width.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get x()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const x = element.x;
			expect(x).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.x).toBe(x);
		});

		it('Reflects the "x" attribute', () => {
			element.setAttribute('x', '10cm');

			expect(element.x.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x.baseVal.valueAsString).toBe('10cm');
			expect(element.x.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.x.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x.animVal.valueAsString).toBe('10cm');
			expect(element.x.animVal.valueInSpecifiedUnits).toBe(10);

			element.x.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('x')).toBe('20px');

			expect(() =>
				element.x.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get y()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const y = element.y;
			expect(y).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.y).toBe(y);
		});

		it('Reflects the "y" attribute', () => {
			element.setAttribute('y', '10cm');

			expect(element.y.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y.baseVal.valueAsString).toBe('10cm');
			expect(element.y.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.y.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y.animVal.valueAsString).toBe('10cm');
			expect(element.y.animVal.valueInSpecifiedUnits).toBe(10);

			element.y.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('y')).toBe('20px');

			expect(() =>
				element.y.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});
});
