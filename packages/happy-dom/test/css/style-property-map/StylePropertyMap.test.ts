import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import StylePropertyMap from '../../../src/css/style-property-map/StylePropertyMap.js';
import CSSStyleDeclaration from '../../../src/css/declaration/CSSStyleDeclaration.js';

describe('StylePropertyMap', () => {
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
				new StylePropertyMap();
			}).toThrow('Illegal constructor');
		});
	});

	describe('append()', () => {
		it('Sets value', () => {
			const stylePropertyMap = new StylePropertyMap(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			stylePropertyMap.append('color', 'red');
			stylePropertyMap.append('z-index', '2');
			stylePropertyMap.append('width', '100px');
			stylePropertyMap.append('width', '100px');

			expect(stylePropertyMap.get('color').toString()).toBe('red');
			expect(stylePropertyMap.get('z-index').toString()).toBe('2');
			expect(stylePropertyMap.get('width') + '').toBe('100px');
		});
	});

	describe('delete()', () => {
		it('Deletes value', () => {
			const stylePropertyMap = new StylePropertyMap(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			stylePropertyMap.append('color', 'red');
			stylePropertyMap.append('z-index', '2');
			stylePropertyMap.append('width', '100px');
			stylePropertyMap.append('width', '100px');

			stylePropertyMap.delete('color');
			stylePropertyMap.delete('z-index');
			stylePropertyMap.delete('width');

			expect(stylePropertyMap.size).toBe(0);
		});
	});

	describe('set()', () => {
		it('Sets value', () => {
			const stylePropertyMap = new StylePropertyMap(
				PropertySymbol.illegalConstructor,
				styleDeclaration
			);

			stylePropertyMap.set('color', 'red');
			stylePropertyMap.set('z-index', '2');
			stylePropertyMap.set('width', '100px');
			stylePropertyMap.set('width', '100px');

			expect(stylePropertyMap.get('color').toString()).toBe('red');
			expect(stylePropertyMap.get('z-index').toString()).toBe('2');
			expect(stylePropertyMap.get('width') + '').toBe('100px');
		});
	});
});
