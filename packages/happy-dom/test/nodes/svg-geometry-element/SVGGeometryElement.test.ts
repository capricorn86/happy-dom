import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGGeometryElement from '../../../src/nodes/svg-geometry-element/SVGGeometryElement.js';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('SVGGeometryElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGGeometryElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGGeometryElement', () => {
			expect(element instanceof SVGGeometryElement).toBe(true);
		});

		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
		});
	});

	describe('get pathLength()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const pathLength = element.pathLength;
			expect(pathLength).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.pathLength).toBe(pathLength);
		});

		it('Returns 1 by default', () => {
			expect(element.pathLength.baseVal).toBe(0);
			expect(element.pathLength.animVal).toBe(0);
		});

		it('Reflects the "pathLength" attribute', () => {
			element.setAttribute('pathLength', '2.2');

			expect(element.pathLength.baseVal).toBe(2.2);
			expect(element.pathLength.animVal).toBe(2.2);

			element.pathLength.baseVal = 3.3;

			expect(element.getAttribute('pathLength')).toBe('3.3');

			// Should do nothing
			element.pathLength.animVal = 4;

			expect(element.getAttribute('pathLength')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('pathLength', 'test');
			expect(element.pathLength.baseVal).toBe(0);
			expect(element.pathLength.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.pathLength.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('isPointInFill()', () => {
		it('Should return false', () => {
			expect(
				element.isPointInFill(new window.SVGPoint(PropertySymbol.illegalConstructor, window))
			).toBe(false);
		});
	});

	describe('isPointInStroke()', () => {
		it('Should return false', () => {
			expect(
				element.isPointInStroke(new window.SVGPoint(PropertySymbol.illegalConstructor, window))
			).toBe(false);
		});
	});

	describe('getTotalLength()', () => {
		it('Should return 0', () => {
			expect(element.getTotalLength()).toBe(0);
		});
	});

	describe('getPointAtLength()', () => {
		it('Should return a new instance of SVGPoint', () => {
			const point = element.getPointAtLength(10);
			expect(point).toBeInstanceOf(window.SVGPoint);
			expect(point.x).toBe(0);
			expect(point.y).toBe(0);
		});
	});
});
