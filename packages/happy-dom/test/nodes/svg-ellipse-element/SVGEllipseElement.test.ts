import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGEllipseElement from '../../../src/nodes/svg-ellipse-element/SVGEllipseElement.js';
import SVGGeometryElement from '../../../src/nodes/svg-geometry-element/SVGGeometryElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';

describe('SVGEllipseElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGEllipseElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGEllipseElement', () => {
			expect(element instanceof SVGEllipseElement).toBe(true);
		});

		it('Should be an instanceof SVGGeometryElement', () => {
			expect(element instanceof SVGGeometryElement).toBe(true);
		});
	});

	describe('get cx()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const cx = element.cx;
			expect(cx).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.cx).toBe(cx);
		});

		it('Reflects the "cx" attribute', () => {
			element.setAttribute('cx', '10cm');

			expect(element.cx.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.cx.baseVal.valueAsString).toBe('10cm');
			expect(element.cx.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.cx.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.cx.animVal.valueAsString).toBe('10cm');
			expect(element.cx.animVal.valueInSpecifiedUnits).toBe(10);

			element.cx.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('cx')).toBe('20px');

			expect(() =>
				element.cx.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get cy()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const cy = element.cy;
			expect(cy).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.cy).toBe(cy);
		});

		it('Reflects the "cy" attribute', () => {
			element.setAttribute('cy', '10cm');

			expect(element.cy.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.cy.baseVal.valueAsString).toBe('10cm');
			expect(element.cy.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.cy.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.cy.animVal.valueAsString).toBe('10cm');
			expect(element.cy.animVal.valueInSpecifiedUnits).toBe(10);

			element.cy.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('cy')).toBe('20px');

			expect(() =>
				element.cy.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
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
