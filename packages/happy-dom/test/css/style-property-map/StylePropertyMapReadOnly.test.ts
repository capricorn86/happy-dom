import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import type BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import StylePropertyMapReadOnly from '../../../src/css/style-property-map/StylePropertyMapReadOnly.js';
import CSSStyleDeclaration from '../../../src/css/declaration/CSSStyleDeclaration.js';
import CSSKeywordValue from '../../../src/css/style-property-map/CSSKeywordValue.js';

describe('StylePropertyMapReadOnly', () => {
	let window: BrowserWindow;
	let styleDeclaration: CSSStyleDeclaration;

	beforeEach(() => {
		window = new Window();
		styleDeclaration = new CSSStyleDeclaration(PropertySymbol.illegalConstructor, window);
	});

	describe('constructor()', () => {
		it('Throws error for illegal constructor', () => {
			expect(() => {
				// @ts-expect-error
				new StylePropertyMapReadOnly();
			}).toThrow('Illegal constructor');
		});
	});

	describe('get size()', () => {
		it('Returns size', () => {
			const stylePropertyMap = new StylePropertyMapReadOnly(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			expect(stylePropertyMap.size).toBe(0);

			styleDeclaration.setProperty('color', 'red');

			expect(stylePropertyMap.size).toBe(1);
		});
	});

	describe('Symbol.iterator()', () => {
		it('Returns iterator', () => {
			const stylePropertyMap = new StylePropertyMapReadOnly(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			styleDeclaration.setProperty('color', 'red');
			styleDeclaration.setProperty('z-index', '2');
			styleDeclaration.setProperty('width', '100px');

			const entries: Array<[string, CSSKeywordValue[]]> = [];

			for (const entry of stylePropertyMap) {
				entries.push(entry);
			}

			expect(entries).toEqual([
				['color', [new CSSKeywordValue('red')]],
				['z-index', [new CSSKeywordValue('2')]],
				['width', [new CSSKeywordValue('100px')]]
			]);
		});
	});

	describe('entries()', () => {
		it('Returns entries', () => {
			const stylePropertyMap = new StylePropertyMapReadOnly(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			styleDeclaration.setProperty('color', 'red');
			styleDeclaration.setProperty('z-index', '2');
			styleDeclaration.setProperty('width', '100px');

			const entries: Array<[string, CSSKeywordValue[]]> = [];

			for (const entry of stylePropertyMap.entries()) {
				entries.push(entry);
			}

			expect(entries).toEqual([
				['color', [new CSSKeywordValue('red')]],
				['z-index', [new CSSKeywordValue('2')]],
				['width', [new CSSKeywordValue('100px')]]
			]);
		});
	});

	describe('values()', () => {
		it('Returns values', () => {
			const stylePropertyMap = new StylePropertyMapReadOnly(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			styleDeclaration.setProperty('color', 'red');
			styleDeclaration.setProperty('z-index', '2');
			styleDeclaration.setProperty('width', '100px');

			const values: Array<CSSKeywordValue[]> = [];

			for (const value of stylePropertyMap.values()) {
				values.push(value);
			}

			expect(values).toEqual([
				[new CSSKeywordValue('red')],
				[new CSSKeywordValue('2')],
				[new CSSKeywordValue('100px')]
			]);
		});
	});

	describe('keys()', () => {
		it('Returns keys', () => {
			const stylePropertyMap = new StylePropertyMapReadOnly(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			styleDeclaration.setProperty('color', 'red');
			styleDeclaration.setProperty('z-index', '2');
			styleDeclaration.setProperty('width', '100px');

			const keys: Array<string> = [];

			for (const key of stylePropertyMap.keys()) {
				keys.push(key);
			}

			expect(keys).toEqual(['color', 'z-index', 'width']);
		});
	});

	describe('get()', () => {
		it('Returns value', () => {
			const stylePropertyMap = new StylePropertyMapReadOnly(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			styleDeclaration.setProperty('color', 'red');
			styleDeclaration.setProperty('z-index', '2');
			styleDeclaration.setProperty('width', '100px');

			expect(stylePropertyMap.get('color').toString()).toBe('red');
			expect(stylePropertyMap.get('z-index').toString()).toBe('2');
			expect(stylePropertyMap.get('width') + '').toBe('100px');
		});
	});

	describe('getAll()', () => {
		it('Returns values', () => {
			const stylePropertyMap = new StylePropertyMapReadOnly(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			styleDeclaration.setProperty('color', 'red');
			styleDeclaration.setProperty('z-index', '2');
			styleDeclaration.setProperty('width', '100px');

			expect(stylePropertyMap.getAll('color').map((value) => value.toString())).toEqual(['red']);
			expect(stylePropertyMap.getAll('z-index').map((value) => value.toString())).toEqual(['2']);
			expect(stylePropertyMap.getAll('width').map((value) => value.toString())).toEqual(['100px']);
		});
	});

	describe('has()', () => {
		it('Returns true if property exists', () => {
			const stylePropertyMap = new StylePropertyMapReadOnly(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			styleDeclaration.setProperty('z-index', '2');

			expect(stylePropertyMap.has('z-index')).toBe(true);
			expect(stylePropertyMap.has('color')).toBe(false);
		});
	});
});
