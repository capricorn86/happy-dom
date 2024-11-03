import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAnimatedInteger from '../../src/svg/SVGAnimatedInteger.js';

describe('SVGAnimatedInteger', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(animated).toBeInstanceOf(SVGAnimatedInteger);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedInteger(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns attribute value as integer number', () => {
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100',
				setAttribute: () => {}
			});

			expect(animated.animVal).toBe(100);
		});

		it('Returns float number as integer', () => {
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100.5',
				setAttribute: () => {}
			});

			expect(animated.animVal).toBe(100);
		});

		it('Returns 0 if attribute value is not a number', () => {
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'abc',
				setAttribute: () => {}
			});

			expect(animated.animVal).toBe(0);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			animated.animVal = 100;
			expect(attributeValue).toBe('');
		});
	});

	describe('get baseVal()', () => {
		it('Returns attribute value as integer number', () => {
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100',
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBe(100);
		});

		it('Returns float number as integer', () => {
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100.5',
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBe(100);
		});

		it('Returns 0 if attribute value is not a number', () => {
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'abc',
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBe(0);
		});
	});

	describe('set baseVal()', () => {
		it('Sets attribute', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			animated.baseVal = 100;

			expect(attributeValue).toBe('100');

			animated.baseVal = 105.5;

			expect(attributeValue).toBe('105');
		});

		it('Throws an error if value is not a number', () => {
			const animated = new window.SVGAnimatedInteger(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100',
				setAttribute: () => {}
			});

			expect(() => {
				animated.baseVal = <number>(<unknown>'abc');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedInteger': The provided float value is non-finite.`
				)
			);
		});
	});
});
