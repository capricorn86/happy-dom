import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGPoint from '../../src/svg/SVGPoint.js';

describe('SVGPoint', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			expect(point).toBeInstanceOf(SVGPoint);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(() => new window.SVGPoint(Symbol(''), window)).toThrow(
				new TypeError('Illegal constructor')
			);
		});
	});

	describe('get x()', () => {
		it('Returns 0 by default', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			expect(point.x).toBe(0);
		});

		it('Returns value from attribute', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2'
			});
			expect(point.x).toBe(1);
		});

		it('Returns defined value', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			point.x = 10;
			expect(point.x).toBe(10);
			expect(point[PropertySymbol.attributeValue]).toBe('10 0');
		});
	});

	describe('set x()', () => {
		it('Sets value to attribute', () => {
			let attribute = '';
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (attribute = value)
			});
			point.x = 10;
			expect(attribute).toBe('10 0');
		});

		it('Throws an error if the object is read-only', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			expect(() => (point.x = 10)).toThrow(
				new TypeError(`Failed to set the 'x' property on 'SVGPoint': The object is read-only.`)
			);
		});
	});

	describe('get y()', () => {
		it('Returns 0 by default', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			expect(point.y).toBe(0);
		});

		it('Returns value from attribute', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2'
			});
			expect(point.y).toBe(2.2);
		});

		it('Returns defined value', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			point.y = 10;
			expect(point.y).toBe(10);
			expect(point[PropertySymbol.attributeValue]).toBe('0 10');
		});
	});

	describe('set y()', () => {
		it('Sets value to attribute', () => {
			let attribute = '';
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (attribute = value)
			});
			point.y = 10;
			expect(attribute).toBe('0 10');
		});

		it('Throws an error if the object is read-only', () => {
			const point = new window.SVGPoint(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			expect(() => (point.y = 10)).toThrow(
				new TypeError(`Failed to set the 'y' property on 'SVGPoint': The object is read-only.`)
			);
		});
	});
});
