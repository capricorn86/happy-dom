import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFESpotLightElement from '../../../src/nodes/svg-fe-spot-light-element/SVGFESpotLightElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGFESpotLightElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFESpotLightElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feSpotLight');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFESpotLightElement', () => {
			expect(element instanceof SVGFESpotLightElement).toBe(true);
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

		it('Returns 0 by default', () => {
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

		it('Returns 0 by default', () => {
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

		it('Returns 0 by default', () => {
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

	describe('get pointsAtX()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const pointsAtX = element.pointsAtX;
			expect(pointsAtX).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.pointsAtX).toBe(pointsAtX);
		});

		it('Returns 0 by default', () => {
			expect(element.pointsAtX.baseVal).toBe(0);
			expect(element.pointsAtX.animVal).toBe(0);
		});

		it('Reflects the "pointsAtX" attribute', () => {
			element.setAttribute('pointsAtX', '2.2');

			expect(element.pointsAtX.baseVal).toBe(2.2);
			expect(element.pointsAtX.animVal).toBe(2.2);

			element.pointsAtX.baseVal = 3.3;

			expect(element.getAttribute('pointsAtX')).toBe('3.3');

			// Should do nothing
			element.pointsAtX.animVal = 4;

			expect(element.getAttribute('pointsAtX')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('pointsAtX', 'test');
			expect(element.pointsAtX.baseVal).toBe(0);
			expect(element.pointsAtX.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.pointsAtX.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get pointsAtY()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const pointsAtY = element.pointsAtY;
			expect(pointsAtY).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.pointsAtY).toBe(pointsAtY);
		});

		it('Returns 0 by default', () => {
			expect(element.pointsAtY.baseVal).toBe(0);
			expect(element.pointsAtY.animVal).toBe(0);
		});

		it('Reflects the "pointsAtY" attribute', () => {
			element.setAttribute('pointsAtY', '2.2');

			expect(element.pointsAtY.baseVal).toBe(2.2);
			expect(element.pointsAtY.animVal).toBe(2.2);

			element.pointsAtY.baseVal = 3.3;

			expect(element.getAttribute('pointsAtY')).toBe('3.3');

			// Should do nothing
			element.pointsAtY.animVal = 4;

			expect(element.getAttribute('pointsAtY')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('pointsAtY', 'test');
			expect(element.pointsAtY.baseVal).toBe(0);
			expect(element.pointsAtY.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.pointsAtY.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get pointsAtZ()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const pointsAtZ = element.pointsAtZ;
			expect(pointsAtZ).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.pointsAtZ).toBe(pointsAtZ);
		});

		it('Returns 0 by default', () => {
			expect(element.pointsAtZ.baseVal).toBe(0);
			expect(element.pointsAtZ.animVal).toBe(0);
		});

		it('Reflects the "pointsAtZ" attribute', () => {
			element.setAttribute('pointsAtZ', '2.2');

			expect(element.pointsAtZ.baseVal).toBe(2.2);
			expect(element.pointsAtZ.animVal).toBe(2.2);

			element.pointsAtZ.baseVal = 3.3;

			expect(element.getAttribute('pointsAtZ')).toBe('3.3');

			// Should do nothing
			element.pointsAtZ.animVal = 4;

			expect(element.getAttribute('pointsAtZ')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('pointsAtZ', 'test');
			expect(element.pointsAtZ.baseVal).toBe(0);
			expect(element.pointsAtZ.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.pointsAtZ.baseVal = <number>(<unknown>'test');
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

	describe('get limitingConeAngle()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const limitingConeAngle = element.limitingConeAngle;
			expect(limitingConeAngle).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.limitingConeAngle).toBe(limitingConeAngle);
		});

		it('Returns 0 by default', () => {
			expect(element.limitingConeAngle.baseVal).toBe(0);
			expect(element.limitingConeAngle.animVal).toBe(0);
		});

		it('Reflects the "limitingConeAngle" attribute', () => {
			element.setAttribute('limitingConeAngle', '2.2');

			expect(element.limitingConeAngle.baseVal).toBe(2.2);
			expect(element.limitingConeAngle.animVal).toBe(2.2);

			element.limitingConeAngle.baseVal = 3.3;

			expect(element.getAttribute('limitingConeAngle')).toBe('3.3');

			// Should do nothing
			element.limitingConeAngle.animVal = 4;

			expect(element.getAttribute('limitingConeAngle')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('limitingConeAngle', 'test');
			expect(element.limitingConeAngle.baseVal).toBe(0);
			expect(element.limitingConeAngle.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.limitingConeAngle.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});
});
