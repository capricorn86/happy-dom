import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGTextPositioningElement from '../../../src/nodes/svg-text-positioning-element/SVGTextPositioningElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';

describe('SVGTextPositioningElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGTextPositioningElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	});

	describe('get x()', () => {
		it('Returns an instance of SVGAnimatedLengthList', () => {
			const list = element.x;
			expect(list).toBeInstanceOf(window.SVGAnimatedLengthList);
			expect(element.x).toBe(list);
		});

		it('Reflects the "x" attribute', () => {
			element.setAttribute('x', '10px 20cm 30in 40mm');
			const list = element.x;

			expect(list.baseVal[0].valueInSpecifiedUnits).toBe(10);
			expect(list.baseVal[1].valueInSpecifiedUnits).toBe(20);
			expect(list.baseVal[2].valueInSpecifiedUnits).toBe(30);
			expect(list.baseVal[3].valueInSpecifiedUnits).toBe(40);

			expect(list.animVal[0].valueInSpecifiedUnits).toBe(10);
			expect(list.animVal[1].valueInSpecifiedUnits).toBe(20);
			expect(list.animVal[2].valueInSpecifiedUnits).toBe(30);
			expect(list.animVal[3].valueInSpecifiedUnits).toBe(40);

			element.x.baseVal[0].newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_CM, 100);

			expect(element.getAttribute('x')).toBe('100cm 20cm 30in 40mm');

			expect(() =>
				element.x.animVal[0].newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get y()', () => {
		it('Returns an instance of SVGAnimatedLengthList', () => {
			const list = element.y;
			expect(list).toBeInstanceOf(window.SVGAnimatedLengthList);
			expect(element.y).toBe(list);
		});

		it('Reflects the "y" attribute', () => {
			element.setAttribute('y', '10px 20cm 30in 40mm');
			const list = element.y;

			expect(list.baseVal[0].valueInSpecifiedUnits).toBe(10);
			expect(list.baseVal[1].valueInSpecifiedUnits).toBe(20);
			expect(list.baseVal[2].valueInSpecifiedUnits).toBe(30);
			expect(list.baseVal[3].valueInSpecifiedUnits).toBe(40);

			expect(list.animVal[0].valueInSpecifiedUnits).toBe(10);
			expect(list.animVal[1].valueInSpecifiedUnits).toBe(20);
			expect(list.animVal[2].valueInSpecifiedUnits).toBe(30);
			expect(list.animVal[3].valueInSpecifiedUnits).toBe(40);

			element.y.baseVal[0].newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_CM, 100);

			expect(element.getAttribute('y')).toBe('100cm 20cm 30in 40mm');

			expect(() =>
				element.y.animVal[0].newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get dx()', () => {
		it('Returns an instance of SVGAnimatedLengthList', () => {
			const list = element.dx;
			expect(list).toBeInstanceOf(window.SVGAnimatedLengthList);
			expect(element.dx).toBe(list);
		});

		it('Reflects the "dx" attribute', () => {
			element.setAttribute('dx', '10px 20cm 30in 40mm');
			const list = element.dx;

			expect(list.baseVal[0].valueInSpecifiedUnits).toBe(10);
			expect(list.baseVal[1].valueInSpecifiedUnits).toBe(20);
			expect(list.baseVal[2].valueInSpecifiedUnits).toBe(30);
			expect(list.baseVal[3].valueInSpecifiedUnits).toBe(40);

			expect(list.animVal[0].valueInSpecifiedUnits).toBe(10);
			expect(list.animVal[1].valueInSpecifiedUnits).toBe(20);
			expect(list.animVal[2].valueInSpecifiedUnits).toBe(30);
			expect(list.animVal[3].valueInSpecifiedUnits).toBe(40);

			element.dx.baseVal[0].newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_CM, 100);

			expect(element.getAttribute('dx')).toBe('100cm 20cm 30in 40mm');

			expect(() =>
				element.dx.animVal[0].newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get dy()', () => {
		it('Returns an instance of SVGAnimatedLengthList', () => {
			const list = element.dy;
			expect(list).toBeInstanceOf(window.SVGAnimatedLengthList);
			expect(element.dy).toBe(list);
		});

		it('Reflects the "dy" attribute', () => {
			element.setAttribute('dy', '10px 20cm 30in 40mm');
			const list = element.dy;

			expect(list.baseVal[0].valueInSpecifiedUnits).toBe(10);
			expect(list.baseVal[1].valueInSpecifiedUnits).toBe(20);
			expect(list.baseVal[2].valueInSpecifiedUnits).toBe(30);
			expect(list.baseVal[3].valueInSpecifiedUnits).toBe(40);

			expect(list.animVal[0].valueInSpecifiedUnits).toBe(10);
			expect(list.animVal[1].valueInSpecifiedUnits).toBe(20);
			expect(list.animVal[2].valueInSpecifiedUnits).toBe(30);
			expect(list.animVal[3].valueInSpecifiedUnits).toBe(40);

			element.dy.baseVal[0].newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_CM, 100);

			expect(element.getAttribute('dy')).toBe('100cm 20cm 30in 40mm');

			expect(() =>
				element.dy.animVal[0].newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get rotate()', () => {
		it('Returns an instance of SVGAnimatedNumberList', () => {
			const list = element.rotate;
			expect(list).toBeInstanceOf(window.SVGAnimatedNumberList);
			expect(element.rotate).toBe(list);
		});

		it('Reflects the "rotate" attribute', () => {
			element.setAttribute('rotate', '10 20.2 30');
			const list = element.rotate;

			expect(list.baseVal[0].value).toBe(10);
			expect(list.baseVal[1].value).toBe(20.2);
			expect(list.baseVal[2].value).toBe(30);

			expect(list.animVal[0].value).toBe(10);
			expect(list.animVal[1].value).toBe(20.2);
			expect(list.animVal[2].value).toBe(30);

			element.rotate.baseVal[0].value = 100;

			expect(element.getAttribute('rotate')).toBe('100 20.2 30');

			expect(() => {
				element.rotate.animVal[0].value = 200;
			}).toThrow(
				new TypeError(`Failed to set the 'value' property on 'SVGNumber': The object is read-only.`)
			);
		});
	});
});
