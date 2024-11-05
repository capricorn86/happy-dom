import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAnimatedLengthList from '../../src/svg/SVGAnimatedLengthList.js';
import SVGLengthList from '../../src/svg/SVGLengthList.js';

describe('SVGAnimatedLengthList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(animated).toBeInstanceOf(SVGAnimatedLengthList);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedLengthList(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns an instance of SVGLengthList', () => {
			const animated = new window.SVGAnimatedLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 20cm 30in 40mm',
				setAttribute: () => {}
			});

			expect(animated.animVal).toBeInstanceOf(SVGLengthList);

			expect(animated.animVal[0].valueAsString).toBe('10px');
			expect(animated.animVal[0].valueInSpecifiedUnits).toBe(10);

			expect(animated.animVal[1].valueAsString).toBe('20cm');
			expect(animated.animVal[1].valueInSpecifiedUnits).toBe(20);

			expect(animated.animVal[2].valueAsString).toBe('30in');
			expect(animated.animVal[2].valueInSpecifiedUnits).toBe(30);

			expect(animated.animVal[3].valueAsString).toBe('40mm');
			expect(animated.animVal[3].valueInSpecifiedUnits).toBe(40);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			expect(attributeValue).toBe('');
			const list = animated.animVal;
			animated.animVal = new SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 20cm 30in 40mm',
				setAttribute: () => {}
			});
			expect(animated.animVal).toBe(list);
			animated.animVal = <SVGLengthList>(<unknown>'10px 20cm 30in 40mm');
			expect(attributeValue).toBe('');
		});
	});

	describe('get baseVal()', () => {
		it('Returns an instance of SVGLengthList', () => {
			const animated = new window.SVGAnimatedLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 20cm 30in 40mm',
				setAttribute: () => {}
			});

			expect(animated.baseVal).toBeInstanceOf(SVGLengthList);

			expect(animated.baseVal[0].valueAsString).toBe('10px');
			expect(animated.baseVal[0].valueInSpecifiedUnits).toBe(10);

			expect(animated.baseVal[1].valueAsString).toBe('20cm');
			expect(animated.baseVal[1].valueInSpecifiedUnits).toBe(20);

			expect(animated.baseVal[2].valueAsString).toBe('30in');
			expect(animated.baseVal[2].valueInSpecifiedUnits).toBe(30);

			expect(animated.baseVal[3].valueAsString).toBe('40mm');
			expect(animated.baseVal[3].valueInSpecifiedUnits).toBe(40);
		});
	});

	describe('set baseVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value) => (attributeValue = value)
			});

			expect(attributeValue).toBe('');
			const list = animated.baseVal;
			animated.baseVal = new SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 20cm 30in 40mm',
				setAttribute: () => {}
			});
			expect(animated.baseVal).toBe(list);
			animated.baseVal = <SVGLengthList>(<unknown>'10px 20cm 30in 40mm');
			expect(attributeValue).toBe('');
		});
	});
});
