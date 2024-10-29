import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGCircleElement from '../../../src/nodes/svg-circle-element/SVGCircleElement.js';
import SVGGeometryElement from '../../../src/nodes/svg-geometry-element/SVGGeometryElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';

describe('SVGCircleElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGCircleElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGCircleElement', () => {
			expect(element instanceof SVGCircleElement).toBe(true);
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

	describe('get r()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const r = element.r;
			expect(r).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.r).toBe(r);
		});

		it('Reflects the "r" attribute', () => {
			element.setAttribute('r', '10cm');

			expect(element.r.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.r.baseVal.valueAsString).toBe('10cm');
			expect(element.r.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.r.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.r.animVal.valueAsString).toBe('10cm');
			expect(element.r.animVal.valueInSpecifiedUnits).toBe(10);

			element.r.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('r')).toBe('20px');

			expect(() =>
				element.r.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});
});
