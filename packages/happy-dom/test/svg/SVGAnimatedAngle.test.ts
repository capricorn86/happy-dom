import { beforeEach, describe, it, expect } from 'vitest';
import SVGAngle from '../../src/svg/SVGAngle.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAngleTypeEnum from '../../src/svg/SVGAngleTypeEnum.js';
import SVGAnimatedAngle from '../../src/svg/SVGAnimatedAngle.js';

describe('SVGAnimatedAngle', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(animated).toBeInstanceOf(SVGAnimatedAngle);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedAngle(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns a readonly instance of SVGAngle', () => {
			const animated = new window.SVGAnimatedAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg',
				setAttribute: () => {}
			});
			const angle = animated.animVal;

			expect(angle).toBeInstanceOf(SVGAngle);
			expect(animated.animVal).toBe(angle);

			expect(angle.value).toBe(90);
			expect(angle.unitType).toBe(SVGAngleTypeEnum.deg);

			expect(() => {
				angle.value = 45;
			}).toThrow(
				new TypeError(`Failed to set the 'value' property on 'SVGAngle': The object is read-only.`)
			);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '90deg';
			const animated = new window.SVGAnimatedAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value: string) => (attributeValue = value)
			});
			const angle = animated.animVal;

			animated.animVal = new window.SVGAngle(PropertySymbol.illegalConstructor, window);

			expect(animated.animVal).toBe(angle);

			animated.animVal = <SVGAngle>(<unknown>'90deg');

			expect(attributeValue).toBe('90deg');
		});
	});

	describe('get baseVal()', () => {
		it('Returns an instance of SVGAngle', () => {
			let attributeValue = '90deg';
			const animated = new window.SVGAnimatedAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value: string) => (attributeValue = value)
			});
			const angle = animated.baseVal;

			expect(angle).toBeInstanceOf(SVGAngle);
			expect(animated.baseVal).toBe(angle);

			expect(angle.value).toBe(90);
			expect(angle.unitType).toBe(SVGAngleTypeEnum.deg);

			angle.value = 45;

			expect(angle.value).toBe(45);
			expect(attributeValue).toBe('45deg');
		});
	});

	describe('set baseVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '90deg';
			const animated = new window.SVGAnimatedAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attributeValue,
				setAttribute: (value: string) => (attributeValue = value)
			});
			const angle = animated.baseVal;

			animated.baseVal = new window.SVGAngle(PropertySymbol.illegalConstructor, window);

			expect(animated.baseVal).toBe(angle);

			animated.baseVal = <SVGAngle>(<unknown>'90deg');

			expect(attributeValue).toBe('90deg');
		});
	});
});
