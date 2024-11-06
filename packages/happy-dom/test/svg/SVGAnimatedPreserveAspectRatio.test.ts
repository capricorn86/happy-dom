import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAnimatedPreserveAspectRatio from '../../src/svg/SVGAnimatedPreserveAspectRatio.js';
import SVGPreserveAspectRatio from '../../src/svg/SVGPreserveAspectRatio.js';
import SVGPreserveAspectRatioAlignEnum from '../../src/svg/SVGPreserveAspectRatioAlignEnum.js';
import SVGPreserveAspectRatioMeetOrSliceEnum from '../../src/svg/SVGPreserveAspectRatioMeetOrSliceEnum.js';

describe('SVGAnimatedPreserveAspectRatio', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '',
					setAttribute: () => {}
				}
			);
			expect(animated).toBeInstanceOf(SVGAnimatedPreserveAspectRatio);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedPreserveAspectRatio(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns an instance of SVGPreserveAspectRatio', () => {
			const animated = new window.SVGAnimatedPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'xMinYMin slice',
					setAttribute: () => {}
				}
			);

			expect(animated.animVal).toBeInstanceOf(SVGPreserveAspectRatio);
			expect(animated.animVal.align).toBe(SVGPreserveAspectRatioAlignEnum.xMinYMin);
			expect(animated.animVal.meetOrSlice).toBe(SVGPreserveAspectRatioMeetOrSliceEnum.slice);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value)
				}
			);

			expect(attributeValue).toBe('');
			const aspectRatio = animated.animVal;
			animated.animVal = new SVGPreserveAspectRatio(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'xMinYMin slice',
				setAttribute: () => {}
			});
			expect(animated.animVal).toBe(aspectRatio);
			animated.animVal = <SVGPreserveAspectRatio>(<unknown>'xMinYMin slice');
			expect(attributeValue).toBe('');
		});
	});

	describe('get baseVal()', () => {
		it('Returns an instance of SVGPreserveAspectRatio', () => {
			const animated = new window.SVGAnimatedPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'xMinYMin slice',
					setAttribute: () => {}
				}
			);

			expect(animated.baseVal).toBeInstanceOf(SVGPreserveAspectRatio);
			expect(animated.baseVal.align).toBe(SVGPreserveAspectRatioAlignEnum.xMinYMin);
			expect(animated.baseVal.meetOrSlice).toBe(SVGPreserveAspectRatioMeetOrSliceEnum.slice);
		});
	});

	describe('set baseVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value)
				}
			);

			expect(attributeValue).toBe('');
			const aspectRatio = animated.baseVal;
			animated.baseVal = new SVGPreserveAspectRatio(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'xMinYMin slice',
				setAttribute: () => {}
			});
			expect(animated.baseVal).toBe(aspectRatio);
			animated.baseVal = <SVGPreserveAspectRatio>(<unknown>'xMinYMin slice');
			expect(attributeValue).toBe('');
		});
	});
});
