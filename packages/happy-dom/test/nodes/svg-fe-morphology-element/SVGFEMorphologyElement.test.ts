import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFEMorphologyElement from '../../../src/nodes/svg-fe-morphology-element/SVGFEMorphologyElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';

describe('SVGFEMorphologyElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEMorphologyElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feMorphology');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEMorphologyElement', () => {
			expect(element instanceof SVGFEMorphologyElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get static SVG_MORPHOLOGY_OPERATOR_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGFEMorphologyElement.SVG_MORPHOLOGY_OPERATOR_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_MORPHOLOGY_OPERATOR_ERODE()', () => {
		it('Should return 1', () => {
			expect(SVGFEMorphologyElement.SVG_MORPHOLOGY_OPERATOR_ERODE).toBe(1);
		});
	});

	describe('get static SVG_MORPHOLOGY_OPERATOR_DILATE()', () => {
		it('Should return 2', () => {
			expect(SVGFEMorphologyElement.SVG_MORPHOLOGY_OPERATOR_DILATE).toBe(2);
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

	describe('get operator()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const operator = element.operator;
			expect(operator).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.operator).toBe(operator);
		});

		it('Should return "erode" as the default value', () => {
			expect(element.operator.baseVal).toBe(SVGFEMorphologyElement.SVG_MORPHOLOGY_OPERATOR_ERODE);
			expect(element.operator.animVal).toBe(SVGFEMorphologyElement.SVG_MORPHOLOGY_OPERATOR_ERODE);
		});

		for (const operator of ['erode', 'dilate']) {
			it(`Reflects the "operator" attribute for "${operator}"`, () => {
				const propertyName = `SVG_MORPHOLOGY_OPERATOR_${operator.toUpperCase().replace(/-/g, '_')}`;

				element.setAttribute('operator', operator);

				expect(element.operator.baseVal).toBe(SVGFEMorphologyElement[propertyName]);
				expect(element.operator.animVal).toBe(SVGFEMorphologyElement[propertyName]);

				element.removeAttribute('operator');

				element.operator.baseVal = SVGFEMorphologyElement[propertyName];

				expect(element.getAttribute('operator')).toBe(operator);

				element.removeAttribute('operator');

				// Does nothing
				element.operator.animVal = SVGFEMorphologyElement.SVG_MORPHOLOGY_OPERATOR_DILATE;

				expect(element.getAttribute('operator')).toBe(null);
			});
		}
	});

	describe('get radiusX()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const radiusX = element.radiusX;
			expect(radiusX).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.radiusX).toBe(radiusX);
		});

		it('Returns 1 by default', () => {
			expect(element.radiusX.baseVal).toBe(0);
			expect(element.radiusX.animVal).toBe(0);
		});

		it('Reflects the "radiusX" attribute', () => {
			element.setAttribute('radiusX', '2.2');

			expect(element.radiusX.baseVal).toBe(2.2);
			expect(element.radiusX.animVal).toBe(2.2);

			element.radiusX.baseVal = 3.3;

			expect(element.getAttribute('radiusX')).toBe('3.3');

			// Should do nothing
			element.radiusX.animVal = 4;

			expect(element.getAttribute('radiusX')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('radiusX', 'test');
			expect(element.radiusX.baseVal).toBe(0);
			expect(element.radiusX.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.radiusX.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get radiusY()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const radiusY = element.radiusY;
			expect(radiusY).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.radiusY).toBe(radiusY);
		});

		it('Returns 1 by default', () => {
			expect(element.radiusY.baseVal).toBe(0);
			expect(element.radiusY.animVal).toBe(0);
		});

		it('Reflects the "radiusY" attribute', () => {
			element.setAttribute('radiusY', '2.2');

			expect(element.radiusY.baseVal).toBe(2.2);
			expect(element.radiusY.animVal).toBe(2.2);

			element.radiusY.baseVal = 3.3;

			expect(element.getAttribute('radiusY')).toBe('3.3');

			// Should do nothing
			element.radiusY.animVal = 4;

			expect(element.getAttribute('radiusY')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('radiusY', 'test');
			expect(element.radiusY.baseVal).toBe(0);
			expect(element.radiusY.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.radiusY.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
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
