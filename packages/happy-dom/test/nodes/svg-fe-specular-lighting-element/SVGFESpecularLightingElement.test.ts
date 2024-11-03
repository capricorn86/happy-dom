import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFESpecularLightingElement from '../../../src/nodes/svg-fe-specular-lighting-element/SVGFESpecularLightingElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';

describe('SVGFESpecularLightingElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFESpecularLightingElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feSpecularLighting');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFESpecularLightingElement', () => {
			expect(element instanceof SVGFESpecularLightingElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
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

	describe('get kernelUnitLengthX()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const kernelUnitLengthX = element.kernelUnitLengthX;
			expect(kernelUnitLengthX).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.kernelUnitLengthX).toBe(kernelUnitLengthX);
		});

		it('Returns 0 by default', () => {
			expect(element.kernelUnitLengthX.baseVal).toBe(0);
			expect(element.kernelUnitLengthX.animVal).toBe(0);
		});

		it('Reflects the "kernelUnitLengthX" attribute', () => {
			element.setAttribute('kernelUnitLengthX', '2.2');

			expect(element.kernelUnitLengthX.baseVal).toBe(2.2);
			expect(element.kernelUnitLengthX.animVal).toBe(2.2);

			element.kernelUnitLengthX.baseVal = 3.3;

			expect(element.getAttribute('kernelUnitLengthX')).toBe('3.3');

			// Should do nothing
			element.kernelUnitLengthX.animVal = 4;

			expect(element.getAttribute('kernelUnitLengthX')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('kernelUnitLengthX', 'test');
			expect(element.kernelUnitLengthX.baseVal).toBe(0);
			expect(element.kernelUnitLengthX.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.kernelUnitLengthX.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get kernelUnitLengthY()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const kernelUnitLengthY = element.kernelUnitLengthY;
			expect(kernelUnitLengthY).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.kernelUnitLengthY).toBe(kernelUnitLengthY);
		});

		it('Returns 0 by default', () => {
			expect(element.kernelUnitLengthY.baseVal).toBe(0);
			expect(element.kernelUnitLengthY.animVal).toBe(0);
		});

		it('Reflects the "kernelUnitLengthY" attribute', () => {
			element.setAttribute('kernelUnitLengthY', '2.2');

			expect(element.kernelUnitLengthY.baseVal).toBe(2.2);
			expect(element.kernelUnitLengthY.animVal).toBe(2.2);

			element.kernelUnitLengthY.baseVal = 3.3;

			expect(element.getAttribute('kernelUnitLengthY')).toBe('3.3');

			// Should do nothing
			element.kernelUnitLengthY.animVal = 4;

			expect(element.getAttribute('kernelUnitLengthY')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('kernelUnitLengthY', 'test');
			expect(element.kernelUnitLengthY.baseVal).toBe(0);
			expect(element.kernelUnitLengthY.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.kernelUnitLengthY.baseVal = <number>(<unknown>'test');
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

	describe('get specularConstant()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const specularConstant = element.specularConstant;
			expect(specularConstant).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.specularConstant).toBe(specularConstant);
		});

		it('Returns 1 by default', () => {
			expect(element.specularConstant.baseVal).toBe(1);
			expect(element.specularConstant.animVal).toBe(1);
		});

		it('Reflects the "specularConstant" attribute', () => {
			element.setAttribute('specularConstant', '2.2');

			expect(element.specularConstant.baseVal).toBe(2.2);
			expect(element.specularConstant.animVal).toBe(2.2);

			element.specularConstant.baseVal = 3.3;

			expect(element.getAttribute('specularConstant')).toBe('3.3');

			// Should do nothing
			element.specularConstant.animVal = 4;

			expect(element.getAttribute('specularConstant')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('specularConstant', 'test');
			expect(element.specularConstant.baseVal).toBe(1);
			expect(element.specularConstant.animVal).toBe(1);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.specularConstant.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get specularExponent()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const specularExponent = element.specularExponent;
			expect(specularExponent).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.specularExponent).toBe(specularExponent);
		});

		it('Returns 1 by default', () => {
			expect(element.specularExponent.baseVal).toBe(1);
			expect(element.specularExponent.animVal).toBe(1);
		});

		it('Reflects the "specularExponent" attribute', () => {
			element.setAttribute('specularExponent', '2.2');

			expect(element.specularExponent.baseVal).toBe(2.2);
			expect(element.specularExponent.animVal).toBe(2.2);

			element.specularExponent.baseVal = 3.3;

			expect(element.getAttribute('specularExponent')).toBe('3.3');

			// Should do nothing
			element.specularExponent.animVal = 4;

			expect(element.getAttribute('specularExponent')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('specularExponent', 'test');
			expect(element.specularExponent.baseVal).toBe(1);
			expect(element.specularExponent.animVal).toBe(1);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.specularExponent.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get surfaceScale()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const surfaceScale = element.surfaceScale;
			expect(surfaceScale).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.surfaceScale).toBe(surfaceScale);
		});

		it('Returns 1 by default', () => {
			expect(element.surfaceScale.baseVal).toBe(1);
			expect(element.surfaceScale.animVal).toBe(1);
		});

		it('Reflects the "surfaceScale" attribute', () => {
			element.setAttribute('surfaceScale', '2.2');

			expect(element.surfaceScale.baseVal).toBe(2.2);
			expect(element.surfaceScale.animVal).toBe(2.2);

			element.surfaceScale.baseVal = 3.3;

			expect(element.getAttribute('surfaceScale')).toBe('3.3');

			// Should do nothing
			element.surfaceScale.animVal = 4;

			expect(element.getAttribute('surfaceScale')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('surfaceScale', 'test');
			expect(element.surfaceScale.baseVal).toBe(1);
			expect(element.surfaceScale.animVal).toBe(1);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.surfaceScale.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
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
