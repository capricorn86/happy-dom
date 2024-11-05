import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGNumber from '../../src/svg/SVGNumber.js';

describe('SVGNumber', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			expect(number).toBeInstanceOf(SVGNumber);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(() => new window.SVGNumber(Symbol(''), window)).toThrow(
				new TypeError('Illegal constructor')
			);
		});
	});

	describe('get value()', () => {
		it('Returns value from attribute', () => {
			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10'
			});
			expect(number.value).toBe(10);
		});

		it('Returns defined value', () => {
			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			number.value = 10;
			expect(number.value).toBe(10);
			expect(number[PropertySymbol.attributeValue]).toBe('10');
		});
	});

	describe('set value()', () => {
		it('Sets value', () => {
			let attribute = '';
			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (attribute = value)
			});

			number.value = 10;

			expect(attribute).toBe('10');
		});

		it('Parses value as a float number', () => {
			let attribute = '';
			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (attribute = value)
			});

			number.value = <number>(<unknown>'10.5');

			expect(attribute).toBe('10.5');
		});

		it('Throws an error if value is not a number', () => {
			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			expect(() => {
				number.value = <number>(<unknown>'abc');
			}).toThrow(
				new TypeError(
					`Failed to set the 'value' property on 'SVGNumber': The provided value is not a number.`
				)
			);
		});

		it('Throws an error if read only', () => {
			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			expect(() => {
				number.value = 10;
			}).toThrow(
				new TypeError(`Failed to set the 'value' property on 'SVGNumber': The object is read-only.`)
			);
		});
	});
});
