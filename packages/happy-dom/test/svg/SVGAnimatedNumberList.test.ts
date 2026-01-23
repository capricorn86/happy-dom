import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAnimatedNumberList from '../../src/svg/SVGAnimatedNumberList.js';
import SVGNumberList from '../../src/svg/SVGNumberList.js';

describe('SVGAnimatedNumberList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(animated).toBeInstanceOf(SVGAnimatedNumberList);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedNumberList(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns an instance of SVGNumberList', () => {
			const animated = new window.SVGAnimatedNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100.5 200.5',
				setAttribute: () => {}
			});

			expect(animated.animVal).toBeInstanceOf(SVGNumberList);
			expect(animated.animVal[0].value).toBe(100.5);
			expect(animated.animVal[1].value).toBe(200.5);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			expect(attributeValue).toBe('');
			const list = animated.animVal;
			animated.animVal = new SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100.5 200.5',
				setAttribute: () => {}
			});
			expect(animated.animVal).toBe(list);
			animated.animVal = <SVGNumberList>(<unknown>'100.5 200.5');
			expect(attributeValue).toBe('');
		});
	});

	describe('get baseVal()', () => {
		it('Returns an instance of SVGNumberList', () => {
			const animated = new window.SVGAnimatedNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100.5 200.5',
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBeInstanceOf(SVGNumberList);
			expect(animated.baseVal[0].value).toBe(100.5);
			expect(animated.baseVal[1].value).toBe(200.5);
		});
	});

	describe('set baseVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			expect(attributeValue).toBe('');
			const list = animated.baseVal;
			animated.baseVal = new SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100.5 200.5',
				setAttribute: () => {}
			});
			expect(animated.baseVal).toBe(list);
			animated.baseVal = <SVGNumberList>(<unknown>'100.5 200.5');
			expect(attributeValue).toBe('');
		});
	});
});
