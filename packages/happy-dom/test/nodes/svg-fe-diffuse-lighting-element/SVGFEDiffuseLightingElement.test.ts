import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFEDiffuseLightingElement from '../../../src/nodes/svg-fe-diffuse-lighting-element/SVGFEDiffuseLightingElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGFEDiffuseLightingElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEDiffuseLightingElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feDiffuseLighting');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEDiffuseLightingElement', () => {
			expect(element instanceof SVGFEDiffuseLightingElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get diffuseConstant()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const diffuseConstant = element.diffuseConstant;
			expect(diffuseConstant).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.diffuseConstant).toBe(diffuseConstant);
		});

		it('Reflects the "diffuseConstant" attribute', () => {
			element.setAttribute('diffuseConstant', '10');

			expect(element.diffuseConstant.baseVal).toBe(10);
			expect(element.diffuseConstant.animVal).toBe(10);

			element.diffuseConstant.baseVal = 20;

			expect(element.getAttribute('diffuseConstant')).toBe('20');

			// Does nothing
			element.diffuseConstant.animVal = 30;

			expect(element.getAttribute('diffuseConstant')).toBe('20');
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

		it('Reflects the "kernelUnitLengthX" attribute', () => {
			element.setAttribute('kernelUnitLengthX', '10');

			expect(element.kernelUnitLengthX.baseVal).toBe(10);
			expect(element.kernelUnitLengthX.animVal).toBe(10);

			element.kernelUnitLengthX.baseVal = 20;

			expect(element.getAttribute('kernelUnitLengthX')).toBe('20');

			// Does nothing
			element.kernelUnitLengthX.animVal = 30;

			expect(element.getAttribute('kernelUnitLengthX')).toBe('20');
		});
	});

	describe('get kernelUnitLengthY()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const kernelUnitLengthY = element.kernelUnitLengthY;
			expect(kernelUnitLengthY).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.kernelUnitLengthY).toBe(kernelUnitLengthY);
		});

		it('Reflects the "kernelUnitLengthY" attribute', () => {
			element.setAttribute('kernelUnitLengthY', '10');

			expect(element.kernelUnitLengthY.baseVal).toBe(10);
			expect(element.kernelUnitLengthY.animVal).toBe(10);

			element.kernelUnitLengthY.baseVal = 20;

			expect(element.getAttribute('kernelUnitLengthY')).toBe('20');

			// Does nothing
			element.kernelUnitLengthY.animVal = 30;

			expect(element.getAttribute('kernelUnitLengthY')).toBe('20');
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

	describe('get surfaceScale()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const surfaceScale = element.surfaceScale;
			expect(surfaceScale).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.surfaceScale).toBe(surfaceScale);
		});

		it('Reflects the "surfaceScale" attribute', () => {
			element.setAttribute('surfaceScale', '10');

			expect(element.surfaceScale.baseVal).toBe(10);
			expect(element.surfaceScale.animVal).toBe(10);

			element.surfaceScale.baseVal = 20;

			expect(element.getAttribute('surfaceScale')).toBe('20');

			// Does nothing
			element.surfaceScale.animVal = 30;

			expect(element.getAttribute('surfaceScale')).toBe('20');
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
