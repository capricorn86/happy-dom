import { beforeEach, describe, it, expect } from 'vitest';
import SVGAngle from '../../src/svg/SVGAngle.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGAngleTypeEnum from '../../src/svg/SVGAngleTypeEnum.js';

describe('SVGAngle', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window);
			expect(angle).toBeInstanceOf(SVGAngle);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(() => new window.SVGAngle(Symbol(''), window)).toThrow(
				new TypeError('Illegal constructor')
			);
		});
	});

	describe('get static SVG_ANGLETYPE_UNKNOWN()', () => {
		it('Returns SVGAngleTypeEnum.unknown', () => {
			expect(window.SVGAngle.SVG_ANGLETYPE_UNKNOWN).toBe(SVGAngleTypeEnum.unknown);
		});
	});

	describe('get static SVG_ANGLETYPE_UNSPECIFIED()', () => {
		it('Returns SVGAngleTypeEnum.unspecified', () => {
			expect(window.SVGAngle.SVG_ANGLETYPE_UNSPECIFIED).toBe(SVGAngleTypeEnum.unspecified);
		});
	});

	describe('get static SVG_ANGLETYPE_DEG()', () => {
		it('Returns SVGAngleTypeEnum.deg', () => {
			expect(window.SVGAngle.SVG_ANGLETYPE_DEG).toBe(SVGAngleTypeEnum.deg);
		});
	});

	describe('get static SVG_ANGLETYPE_RAD()', () => {
		it('Returns SVGAngleTypeEnum.rad', () => {
			expect(window.SVGAngle.SVG_ANGLETYPE_RAD).toBe(SVGAngleTypeEnum.rad);
		});
	});

	describe('get static SVG_ANGLETYPE_GRAD()', () => {
		it('Returns SVGAngleTypeEnum.grad', () => {
			expect(window.SVGAngle.SVG_ANGLETYPE_GRAD).toBe(SVGAngleTypeEnum.grad);
		});
	});

	describe('get unitType()', () => {
		it('Returns SVGAngleTypeEnum.unknown by default', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window);
			expect(angle.unitType).toBe(SVGAngleTypeEnum.unknown);
		});

		it('Returns type part of "90deg" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg'
			});
			expect(angle.unitType).toBe(SVGAngleTypeEnum.deg);
		});

		it('Returns type part of "90rad" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90rad'
			});
			expect(angle.unitType).toBe(SVGAngleTypeEnum.rad);
		});

		it('Returns type part of "90grad" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90grad'
			});
			expect(angle.unitType).toBe(SVGAngleTypeEnum.grad);
		});

		it('Returns type part of "0.5turn" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90turn'
			});
			expect(angle.unitType).toBe(SVGAngleTypeEnum.unknown);
		});

		it('Returns type part of "90" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90'
			});
			expect(angle.unitType).toBe(SVGAngleTypeEnum.unspecified);
		});
	});

	describe('get value()', () => {
		it('Returns 0 by default', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window);
			expect(angle.value).toBe(0);
		});

		it('Returns value part of "90deg" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg'
			});
			expect(angle.value).toBe(90);
		});

		it('Returns value part of "3.1416rad" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => Math.PI + 'rad'
			});
			expect(angle.value).toBe(180);
		});

		it('Returns value part of "100grad" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100grad'
			});
			expect(angle.value).toBe(90);
		});

		it('Returns value part of "0.5turn" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '0.5turn'
			});
			expect(angle.value).toBe(180);
		});

		it('Returns value part of "90" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90'
			});
			expect(angle.value).toBe(90);
		});
	});

	describe('set value()', () => {
		it('Sets value', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window);
			angle.value = 90;
			expect(angle.value).toBe(90);
		});

		it('Sets value part of "90deg" attribute', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg',
				setAttribute: (value) => (setValue = value)
			});
			angle.value = 180;
			expect(setValue).toBe('180deg');
		});

		it('Sets value part of "3.1416rad" attribute', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => Math.PI + 'rad',
				setAttribute: (value) => (setValue = value)
			});
			angle.value = 90;
			expect(setValue).toBe(`${Math.PI / 2}rad`);
		});

		it('Sets value part of "100grad" attribute', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100grad',
				setAttribute: (value) => (setValue = value)
			});
			angle.value = 45;
			expect(setValue).toBe('50grad');
		});

		it('Sets value part of "0.5turn" attribute', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '0.5turn',
				setAttribute: (value) => (setValue = value)
			});
			angle.value = 90;
			expect(setValue).toBe('0.25turn');
		});

		it('Throws an error if the object is read-only', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			expect(() => (angle.value = 90)).toThrow(
				new TypeError(`Failed to set the 'value' property on 'SVGAngle': The object is read-only.`)
			);
		});
	});

	describe('get valueAsString()', () => {
		it('Returns "0" by default', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window);
			expect(angle.valueAsString).toBe('0');
		});

		it('Returns value for "90deg" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg'
			});
			expect(angle.valueAsString).toBe('90deg');
		});

		it('Returns value for "3.1416rad" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => Math.PI + 'rad'
			});
			expect(angle.valueAsString).toBe(Math.PI + 'rad');
		});

		it('Returns value for "100grad" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100grad'
			});
			expect(angle.valueAsString).toBe('100grad');
		});

		it('Returns value for "0.5turn" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '0.5turn'
			});
			expect(angle.valueAsString).toBe('0.5turn');
		});

		it('Returns value for "90" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90'
			});
			expect(angle.valueAsString).toBe('90');
		});
	});

	describe('get valueInSpecifiedUnits()', () => {
		it('Returns 0 by default', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window);
			expect(angle.valueInSpecifiedUnits).toBe(0);
		});

		it('Returns value for "90deg" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg'
			});
			expect(angle.valueInSpecifiedUnits).toBe(90);
		});

		it('Returns value for "3.1416rad" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => Math.PI + 'rad'
			});
			expect(angle.valueInSpecifiedUnits).toBe(Math.PI);
		});

		it('Returns value for "100grad" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100grad'
			});
			expect(angle.valueInSpecifiedUnits).toBe(100);
		});

		it('Returns value for "0.5turn" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '0.5turn'
			});
			expect(angle.valueInSpecifiedUnits).toBe(0.5);
		});

		it('Returns value for "90" attribute', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90'
			});
			expect(angle.valueInSpecifiedUnits).toBe(90);
		});
	});

	describe('newValueSpecifiedUnits()', () => {
		it('Sets value for deg', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			angle.newValueSpecifiedUnits(SVGAngleTypeEnum.deg, 90);
			expect(setValue).toBe('90deg');
		});

		it('Sets value for rad', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			angle.newValueSpecifiedUnits(SVGAngleTypeEnum.rad, Math.PI);
			expect(setValue).toBe(Math.PI + 'rad');
		});

		it('Sets value for grad', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			angle.newValueSpecifiedUnits(SVGAngleTypeEnum.grad, 100);
			expect(setValue).toBe('100grad');
		});

		it('Sets value for turn (unknown)', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			angle.newValueSpecifiedUnits(SVGAngleTypeEnum.unknown, 0.5);
			expect(setValue).toBe('0.5turn');
		});

		it('Throws an error if the object is read-only', () => {
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			expect(() => angle.newValueSpecifiedUnits(SVGAngleTypeEnum.deg, 90)).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGAngle': The object is read-only.`
				)
			);
		});
	});

	describe('convertToSpecifiedUnits()', () => {
		it('Converts value to deg', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '100grad',
				setAttribute: (value) => (setValue = value)
			});
			angle.convertToSpecifiedUnits(SVGAngleTypeEnum.deg);
			expect(setValue).toBe('90deg');
		});

		it('Converts value to rad', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg',
				setAttribute: (value) => (setValue = value)
			});
			angle.convertToSpecifiedUnits(SVGAngleTypeEnum.rad);
			expect(setValue).toBe(Math.PI / 2 + 'rad');
		});

		it('Converts value to grad', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg',
				setAttribute: (value) => (setValue = value)
			});
			angle.convertToSpecifiedUnits(SVGAngleTypeEnum.grad);
			expect(setValue).toBe('100grad');
		});

		it('Converts value to turn (unknown)', () => {
			let setValue = '';
			const angle = new window.SVGAngle(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '90deg',
				setAttribute: (value) => (setValue = value)
			});
			angle.convertToSpecifiedUnits(SVGAngleTypeEnum.unknown);
			expect(setValue).toBe('0.25turn');
		});
	});
});
