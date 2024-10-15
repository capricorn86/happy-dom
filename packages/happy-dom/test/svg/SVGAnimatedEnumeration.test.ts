import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAnimatedEnumeration from '../../src/svg/SVGAnimatedEnumeration.js';

describe('SVGAnimatedEnumeration', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '',
					setAttribute: () => {},
					values: [],
					defaultValue: ''
				}
			);
			expect(animated).toBeInstanceOf(SVGAnimatedEnumeration);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGAnimatedEnumeration(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {},
						values: [],
						defaultValue: ''
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get animVal()', () => {
		it('Returns number (index + 1) matching the default value when attribute is not set', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '',
					setAttribute: () => {},
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key2'
				}
			);

			expect(animated.animVal).toBe(2);
		});

		it('Returns number (index + 1) matching the attribute value', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'key2',
					setAttribute: () => {},
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key1'
				}
			);

			expect(animated.animVal).toBe(2);
		});

		it('Returns 0 if the attribute value is not in the list of values', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'key4',
					setAttribute: () => {},
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key1'
				}
			);

			expect(animated.animVal).toBe(0);
		});

		it('Returns the "any" value number (index + 1) if the attribute value is set to a value and the list of possible values contains null', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '90deg',
					setAttribute: () => {},
					values: ['key1', 'key2', null],
					defaultValue: 'key1'
				}
			);

			expect(animated.animVal).toBe(3);
		});
	});

	describe('set animVal()', () => {
		it('Do nothing', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value),
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key1'
				}
			);

			animated.animVal = 2;
			expect(animated.animVal).toBe(1);
			expect(attributeValue).toBe('');
		});
	});

	describe('get baseVal()', () => {
		it('Returns number (index + 1) matching the default value when attribute is not set', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '',
					setAttribute: () => {},
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key2'
				}
			);

			expect(animated.baseVal).toBe(2);
		});

		it('Returns number (index + 1) matching the attribute value', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'key2',
					setAttribute: () => {},
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key1'
				}
			);

			expect(animated.baseVal).toBe(2);
		});

		it('Returns 0 if the attribute value is not in the list of values', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'key4',
					setAttribute: () => {},
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key1'
				}
			);

			expect(animated.baseVal).toBe(0);
		});

		it('Returns the "any" value number (index + 1) if the attribute value is set to a value and the list of possible values contains null', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '90deg',
					setAttribute: () => {},
					values: ['key1', 'key2', null],
					defaultValue: 'key1'
				}
			);

			expect(animated.baseVal).toBe(3);
		});
	});

	describe('set baseVal()', () => {
		it('Sets the attribute value to the value matching the index', () => {
			let attributeValue = '';
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value),
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key1'
				}
			);

			animated.baseVal = 2;
			expect(attributeValue).toBe('key2');
		});

		it('Sets the attribute value when one of the possible values is null, indicating that any value can be set', () => {
			let attributeValue = '90deg';
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value),
					values: ['key1', 'key2', null],
					defaultValue: 'key1'
				}
			);

			animated.baseVal = 2;
			expect(attributeValue).toBe('key2');
		});

		it('Sets the attribute value to 0 if the value is changed to any value', () => {
			let attributeValue = 'key2';
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value),
					values: ['key1', 'key2', null],
					defaultValue: 'key1'
				}
			);

			animated.baseVal = 3;
			expect(attributeValue).toBe('0');
		});

		it("Doesn't set value if value is set to any value, but the current value is already set to a defined value", () => {
			let attributeValue = '90deg';
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attributeValue,
					setAttribute: (value) => (attributeValue = value),
					values: ['key1', 'key2', null],
					defaultValue: 'key1'
				}
			);

			animated.baseVal = 3;
			expect(attributeValue).toBe('90deg');
		});

		it('Throws an error if the value is less than 1', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '',
					setAttribute: () => {},
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key1'
				}
			);

			expect(() => (animated.baseVal = 0)).toThrow(
				new TypeError(
					`Failed to set the 'baseVal' property on 'SVGAnimatedEnumeration': The enumeration value provided is 0, which is not settable.`
				)
			);
			expect(() => (animated.baseVal = -1)).toThrow(
				new TypeError(
					`Failed to set the 'baseVal' property on 'SVGAnimatedEnumeration': The enumeration value provided is -1, which is not settable.`
				)
			);
		});

		it('Throws an error if the value is too large', () => {
			const animated = new window.SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => '',
					setAttribute: () => {},
					values: ['key1', 'key2', 'key3'],
					defaultValue: 'key1'
				}
			);

			expect(() => (animated.baseVal = 4)).toThrow(
				new TypeError(
					`Failed to set the 'baseVal' property on 'SVGAnimatedEnumeration': The enumeration value provided (4) is larger than the largest allowed value (3).`
				)
			);
		});
	});
});
