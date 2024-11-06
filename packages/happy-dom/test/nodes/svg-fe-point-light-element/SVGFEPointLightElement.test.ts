import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFEPointLightElement from '../../../src/nodes/svg-fe-point-light-element/SVGFEPointLightElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGFEPointLightElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEPointLightElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'fePointLight');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEPointLightElement', () => {
			expect(element instanceof SVGFEPointLightElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get x()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const x = element.x;
			expect(x).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.x).toBe(x);
		});

		it('Returns 1 by default', () => {
			expect(element.x.baseVal).toBe(0);
			expect(element.x.animVal).toBe(0);
		});

		it('Reflects the "x" attribute', () => {
			element.setAttribute('x', '2.2');

			expect(element.x.baseVal).toBe(2.2);
			expect(element.x.animVal).toBe(2.2);

			element.x.baseVal = 3.3;

			expect(element.getAttribute('x')).toBe('3.3');

			// Should do nothing
			element.x.animVal = 4;

			expect(element.getAttribute('x')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('x', 'test');
			expect(element.x.baseVal).toBe(0);
			expect(element.x.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.x.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get y()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const y = element.y;
			expect(y).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.y).toBe(y);
		});

		it('Returns 1 by default', () => {
			expect(element.y.baseVal).toBe(0);
			expect(element.y.animVal).toBe(0);
		});

		it('Reflects the "y" attribute', () => {
			element.setAttribute('y', '2.2');

			expect(element.y.baseVal).toBe(2.2);
			expect(element.y.animVal).toBe(2.2);

			element.y.baseVal = 3.3;

			expect(element.getAttribute('y')).toBe('3.3');

			// Should do nothing
			element.y.animVal = 4;

			expect(element.getAttribute('y')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('y', 'test');
			expect(element.y.baseVal).toBe(0);
			expect(element.y.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.y.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get z()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const z = element.z;
			expect(z).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.z).toBe(z);
		});

		it('Returns 1 by default', () => {
			expect(element.z.baseVal).toBe(0);
			expect(element.z.animVal).toBe(0);
		});

		it('Reflects the "z" attribute', () => {
			element.setAttribute('z', '2.2');

			expect(element.z.baseVal).toBe(2.2);
			expect(element.z.animVal).toBe(2.2);

			element.z.baseVal = 3.3;

			expect(element.getAttribute('z')).toBe('3.3');

			// Should do nothing
			element.z.animVal = 4;

			expect(element.getAttribute('z')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('z', 'test');
			expect(element.z.baseVal).toBe(0);
			expect(element.z.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.z.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});
});
