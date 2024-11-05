import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAnimatedLength from '../../src/svg/SVGAnimatedLength.js';
import SVGLength from '../../src/svg/SVGLength.js';

describe('SVGAnimatedLength', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(animated).toBeInstanceOf(SVGAnimatedLength);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedLength(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns an instance of SVGLength', () => {
			const animated = new window.SVGAnimatedLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in',
				setAttribute: () => {}
			});

			expect(animated.animVal).toBeInstanceOf(SVGLength);
			expect(animated.animVal.value).toBe(960);
			expect(animated.animVal.valueInSpecifiedUnits).toBe(10);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			expect(attributeValue).toBe('');
			const length = animated.animVal;
			animated.animVal = new SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in',
				setAttribute: () => {}
			});
			expect(animated.animVal).toBe(length);
			animated.animVal = <SVGLength>(<unknown>'10in');
			expect(attributeValue).toBe('');
		});
	});

	describe('get baseVal()', () => {
		it('Returns an instance of SVGLength', () => {
			const animated = new window.SVGAnimatedLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in',
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBeInstanceOf(SVGLength);
			expect(animated.baseVal.value).toBe(960);
			expect(animated.baseVal.valueInSpecifiedUnits).toBe(10);
		});
	});

	describe('set baseVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			expect(attributeValue).toBe('');
			const length = animated.baseVal;
			animated.baseVal = new SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in',
				setAttribute: () => {}
			});
			expect(animated.baseVal).toBe(length);
			animated.baseVal = <SVGLength>(<unknown>'10in');
			expect(attributeValue).toBe('');
		});
	});
});
