import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGLinearGradientElement from '../../../src/nodes/svg-linear-gradient-element/SVGLinearGradientElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGGradientElement from '../../../src/nodes/svg-gradient-element/SVGGradientElement.js';

describe('SVGLinearGradientElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGLinearGradientElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGLinearGradientElement', () => {
			expect(element instanceof SVGLinearGradientElement).toBe(true);
		});

		it('Should be an instanceof SVGGradientElement', () => {
			expect(element instanceof SVGGradientElement).toBe(true);
		});
	});

	describe('get x1()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const x1 = element.x1;
			expect(x1).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.x1).toBe(x1);
		});

		it('Reflects the "x1" attribute', () => {
			element.setAttribute('x1', '10cm');

			expect(element.x1.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x1.baseVal.valueAsString).toBe('10cm');
			expect(element.x1.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.x1.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x1.animVal.valueAsString).toBe('10cm');
			expect(element.x1.animVal.valueInSpecifiedUnits).toBe(10);

			element.x1.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('x1')).toBe('20px');

			expect(() =>
				element.x1.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get y1()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const y1 = element.y1;
			expect(y1).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.y1).toBe(y1);
		});

		it('Reflects the "y1" attribute', () => {
			element.setAttribute('y1', '10cm');

			expect(element.y1.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y1.baseVal.valueAsString).toBe('10cm');
			expect(element.y1.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.y1.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y1.animVal.valueAsString).toBe('10cm');
			expect(element.y1.animVal.valueInSpecifiedUnits).toBe(10);

			element.y1.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('y1')).toBe('20px');

			expect(() =>
				element.y1.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get x2()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const x2 = element.x2;
			expect(x2).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.x2).toBe(x2);
		});

		it('Reflects the "x2" attribute', () => {
			element.setAttribute('x2', '10cm');

			expect(element.x2.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x2.baseVal.valueAsString).toBe('10cm');
			expect(element.x2.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.x2.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x2.animVal.valueAsString).toBe('10cm');
			expect(element.x2.animVal.valueInSpecifiedUnits).toBe(10);

			element.x2.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('x2')).toBe('20px');

			expect(() =>
				element.x2.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get y2()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const y2 = element.y2;
			expect(y2).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.y2).toBe(y2);
		});

		it('Reflects the "y2" attribute', () => {
			element.setAttribute('y2', '10cm');

			expect(element.y2.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y2.baseVal.valueAsString).toBe('10cm');
			expect(element.y2.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.y2.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y2.animVal.valueAsString).toBe('10cm');
			expect(element.y2.animVal.valueInSpecifiedUnits).toBe(10);

			element.y2.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('y2')).toBe('20px');

			expect(() =>
				element.y2.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});
});
