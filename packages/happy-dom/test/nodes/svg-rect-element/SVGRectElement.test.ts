import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGRectElement from '../../../src/nodes/svg-rect-element/SVGRectElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGGeometryElement from '../../../src/nodes/svg-geometry-element/SVGGeometryElement.js';

describe('SVGRectElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGRectElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGRectElement', () => {
			expect(element instanceof SVGRectElement).toBe(true);
		});

		it('Should be an instanceof SVGGeometryElement', () => {
			expect(element instanceof SVGGeometryElement).toBe(true);
		});
	});

	describe('get x()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const x = element.x;
			expect(x).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.x).toBe(x);
		});

		it('Should return 0 by default', () => {
			expect(element.x.baseVal.value).toBe(0);
			expect(element.x.animVal.value).toBe(0);
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

		it('Should return 0 by default', () => {
			expect(element.y.baseVal.value).toBe(0);
			expect(element.y.animVal.value).toBe(0);
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

	describe('get rx()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const rx = element.rx;
			expect(rx).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.rx).toBe(rx);
		});

		it('Reflects the "rx" attribute', () => {
			element.setAttribute('rx', '10cm');

			expect(element.rx.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.rx.baseVal.valueAsString).toBe('10cm');
			expect(element.rx.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.rx.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.rx.animVal.valueAsString).toBe('10cm');
			expect(element.rx.animVal.valueInSpecifiedUnits).toBe(10);

			element.rx.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('rx')).toBe('20px');

			expect(() =>
				element.rx.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get ry()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const ry = element.ry;
			expect(ry).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.ry).toBe(ry);
		});

		it('Reflects the "ry" attribute', () => {
			element.setAttribute('ry', '10cm');

			expect(element.ry.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.ry.baseVal.valueAsString).toBe('10cm');
			expect(element.ry.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.ry.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.ry.animVal.valueAsString).toBe('10cm');
			expect(element.ry.animVal.valueInSpecifiedUnits).toBe(10);

			element.ry.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('ry')).toBe('20px');

			expect(() =>
				element.ry.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});
});
