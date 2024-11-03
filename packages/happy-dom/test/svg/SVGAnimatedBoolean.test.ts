import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAnimatedBoolean from '../../src/svg/SVGAnimatedBoolean.js';

describe('SVGAnimatedBoolean', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(animated).toBeInstanceOf(SVGAnimatedBoolean);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedBoolean(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns true if attribute is set to "true', () => {
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'true',
				setAttribute: () => {}
			});

			expect(animated.animVal).toBe(true);
		});

		it('Returns false if attribute is set to "false"', () => {
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'false',
				setAttribute: () => {}
			});

			expect(animated.animVal).toBe(false);
		});

		it('Returns false if attribute is set to null', () => {
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => null,
				setAttribute: () => {}
			});

			expect(animated.animVal).toBe(false);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			animated.animVal = false;
			expect(attributeValue).toBe('');
		});
	});

	describe('get baseVal()', () => {
		it('Returns true if attribute is set to "true', () => {
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'true',
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBe(true);
		});

		it('Returns false if attribute is set to "false"', () => {
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'false',
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBe(false);
		});

		it('Returns false if attribute is set to null', () => {
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => null,
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBe(false);
		});
	});

	describe('set baseVal()', () => {
		it('Sets attribute to empty string if true', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			animated.baseVal = true;
			expect(attributeValue).toBe('true');
		});

		it('Sets attribute to null if false', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedBoolean(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			animated.baseVal = false;
			expect(attributeValue).toBe('false');
		});
	});
});
