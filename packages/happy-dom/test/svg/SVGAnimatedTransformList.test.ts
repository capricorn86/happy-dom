import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAnimatedTransformList from '../../src/svg/SVGAnimatedTransformList.js';
import SVGTransformList from '../../src/svg/SVGTransformList.js';

describe('SVGAnimatedTransformList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedTransformList(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '',
					setAttribute: () => {}
				}
			);
			expect(animated).toBeInstanceOf(SVGAnimatedTransformList);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedTransformList(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns an instance of SVGTransformList', () => {
			const animated = new window.SVGAnimatedTransformList(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'rotate(-10 50 100) translate(-36 45.5) skewX(40) scale(1 0.5)',
					setAttribute: () => {}
				}
			);

			expect(animated.animVal).toBeInstanceOf(SVGTransformList);

			expect(animated.animVal[0].matrix.a).toBe(0.984807753012208);
			expect(animated.animVal[0].matrix.b).toBe(-0.17364817766693033);
			expect(animated.animVal[0].matrix.c).toBe(0.17364817766693033);
			expect(animated.animVal[0].matrix.d).toBe(0.984807753012208);
			expect(animated.animVal[0].matrix.e).toBe(-16.605205417303438);
			expect(animated.animVal[0].matrix.f).toBe(10.201633582125709);

			expect(animated.animVal[1].matrix.a).toBe(1);
			expect(animated.animVal[1].matrix.b).toBe(0);
			expect(animated.animVal[1].matrix.c).toBe(0);
			expect(animated.animVal[1].matrix.d).toBe(1);
			expect(animated.animVal[1].matrix.e).toBe(-36);
			expect(animated.animVal[1].matrix.f).toBe(45.5);

			expect(animated.animVal[2].matrix.a).toBe(1);
			expect(animated.animVal[2].matrix.b).toBe(0);
			expect(animated.animVal[2].matrix.c).toBe(0.8390996311772799);
			expect(animated.animVal[2].matrix.d).toBe(1);
			expect(animated.animVal[2].matrix.e).toBe(0);
			expect(animated.animVal[2].matrix.f).toBe(0);

			expect(animated.animVal[3].matrix.a).toBe(1);
			expect(animated.animVal[3].matrix.b).toBe(0);
			expect(animated.animVal[3].matrix.c).toBe(0);
			expect(animated.animVal[3].matrix.d).toBe(1);
			expect(animated.animVal[3].matrix.e).toBe(0);
			expect(animated.animVal[3].matrix.f).toBe(0);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedTransformList(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value)
				}
			);

			expect(attributeValue).toBe('');
			const list = animated.animVal;
			animated.animVal = new SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'rotate(-10 50 100) translate(-36 45.5) skewX(40) scale(1 0.5)',
				setAttribute: () => {}
			});
			expect(animated.animVal).toBe(list);
			animated.animVal = <SVGTransformList>(
				(<unknown>'rotate(-10 50 100) translate(-36 45.5) skewX(40) scale(1 0.5)')
			);
			expect(attributeValue).toBe('');
		});
	});

	describe('get baseVal()', () => {
		it('Returns an instance of SVGTransformList', () => {
			const animated = new window.SVGAnimatedTransformList(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'rotate(-10 50 100) translate(-36 45.5) skewX(40) scale(1 0.5)',
					setAttribute: () => {}
				}
			);

			expect(animated.baseVal).toBeInstanceOf(SVGTransformList);

			expect(animated.baseVal[0].matrix.a).toBe(0.984807753012208);
			expect(animated.baseVal[0].matrix.b).toBe(-0.17364817766693033);
			expect(animated.baseVal[0].matrix.c).toBe(0.17364817766693033);
			expect(animated.baseVal[0].matrix.d).toBe(0.984807753012208);
			expect(animated.baseVal[0].matrix.e).toBe(-16.605205417303438);
			expect(animated.baseVal[0].matrix.f).toBe(10.201633582125709);

			expect(animated.baseVal[1].matrix.a).toBe(1);
			expect(animated.baseVal[1].matrix.b).toBe(0);
			expect(animated.baseVal[1].matrix.c).toBe(0);
			expect(animated.baseVal[1].matrix.d).toBe(1);
			expect(animated.baseVal[1].matrix.e).toBe(-36);
			expect(animated.baseVal[1].matrix.f).toBe(45.5);

			expect(animated.baseVal[2].matrix.a).toBe(1);
			expect(animated.baseVal[2].matrix.b).toBe(0);
			expect(animated.baseVal[2].matrix.c).toBe(0.8390996311772799);
			expect(animated.baseVal[2].matrix.d).toBe(1);
			expect(animated.baseVal[2].matrix.e).toBe(0);
			expect(animated.baseVal[2].matrix.f).toBe(0);

			expect(animated.baseVal[3].matrix.a).toBe(1);
			expect(animated.baseVal[3].matrix.b).toBe(0);
			expect(animated.baseVal[3].matrix.c).toBe(0);
			expect(animated.baseVal[3].matrix.d).toBe(1);
			expect(animated.baseVal[3].matrix.e).toBe(0);
			expect(animated.baseVal[3].matrix.f).toBe(0);
		});
	});

	describe('set baseVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedTransformList(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value)
				}
			);

			expect(attributeValue).toBe('');
			const list = animated.baseVal;
			animated.baseVal = new SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'rotate(-10 50 100) translate(-36 45.5) skewX(40) scale(1 0.5)',
				setAttribute: () => {}
			});
			expect(animated.baseVal).toBe(list);
			animated.baseVal = <SVGTransformList>(
				(<unknown>'rotate(-10 50 100) translate(-36 45.5) skewX(40) scale(1 0.5)')
			);
			expect(attributeValue).toBe('');
		});
	});
});
