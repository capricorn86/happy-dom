import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGUnitTypes from '../../src/svg/SVGUnitTypes.js';

describe('SVGUnitTypes', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const unitTypes = new window.SVGUnitTypes(PropertySymbol.illegalConstructor);
			expect(unitTypes).toBeInstanceOf(SVGUnitTypes);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(() => new window.SVGUnitTypes(Symbol(''))).toThrow(
				new TypeError('Illegal constructor')
			);
		});
	});

	describe('get static SVG_UNIT_TYPE_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGUnitTypes.SVG_UNIT_TYPE_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_UNIT_TYPE_USERSPACEONUSE()', () => {
		it('Should return 1', () => {
			expect(SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE).toBe(1);
		});
	});

	describe('get static SVG_UNIT_TYPE_OBJECTBOUNDINGBOX()', () => {
		it('Should return 2', () => {
			expect(SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX).toBe(2);
		});
	});

	describe('get SVG_UNIT_TYPE_UNKNOWN()', () => {
		it('Should return 0', () => {
			const unitTypes = new window.SVGUnitTypes(PropertySymbol.illegalConstructor);
			expect(unitTypes.SVG_UNIT_TYPE_UNKNOWN).toBe(0);
		});
	});

	describe('get SVG_UNIT_TYPE_USERSPACEONUSE()', () => {
		it('Should return 1', () => {
			const unitTypes = new window.SVGUnitTypes(PropertySymbol.illegalConstructor);
			expect(unitTypes.SVG_UNIT_TYPE_USERSPACEONUSE).toBe(1);
		});
	});

	describe('get SVG_UNIT_TYPE_OBJECTBOUNDINGBOX()', () => {
		it('Should return 2', () => {
			const unitTypes = new window.SVGUnitTypes(PropertySymbol.illegalConstructor);
			expect(unitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX).toBe(2);
		});
	});
});
