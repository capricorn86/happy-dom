import { beforeEach, describe, it, expect } from 'vitest';
import SVGLength from '../../src/svg/SVGLength.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGLengthTypeEnum from '../../src/svg/SVGLengthTypeEnum.js';

describe('SVGLength', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(length).toBeInstanceOf(SVGLength);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(() => new window.SVGLength(Symbol(''), window)).toThrow(
				new TypeError('Illegal constructor')
			);
		});
	});

	describe('get static SVG_LENGTHTYPE_UNKNOWN()', () => {
		it('Returns SVGLengthTypeEnum.unknown', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_UNKNOWN).toBe(SVGLengthTypeEnum.unknown);
		});
	});

	describe('get static SVG_LENGTHTYPE_NUMBER()', () => {
		it('Returns SVGLengthTypeEnum.number', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_NUMBER).toBe(SVGLengthTypeEnum.number);
		});
	});

	describe('get static SVG_LENGTHTYPE_PERCENTAGE()', () => {
		it('Returns SVGLengthTypeEnum.percentage', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_PERCENTAGE).toBe(SVGLengthTypeEnum.percentage);
		});
	});

	describe('get static SVG_LENGTHTYPE_EMS()', () => {
		it('Returns SVGLengthTypeEnum.ems', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_EMS).toBe(SVGLengthTypeEnum.ems);
		});
	});

	describe('get static SVG_LENGTHTYPE_EXS()', () => {
		it('Returns SVGLengthTypeEnum.exs', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_EXS).toBe(SVGLengthTypeEnum.exs);
		});
	});

	describe('get static SVG_LENGTHTYPE_PX()', () => {
		it('Returns SVGLengthTypeEnum.px', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_PX).toBe(SVGLengthTypeEnum.px);
		});
	});

	describe('get static SVG_LENGTHTYPE_CM()', () => {
		it('Returns SVGLengthTypeEnum.cm', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_CM).toBe(SVGLengthTypeEnum.cm);
		});
	});

	describe('get static SVG_LENGTHTYPE_MM()', () => {
		it('Returns SVGLengthTypeEnum.mm', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_MM).toBe(SVGLengthTypeEnum.mm);
		});
	});

	describe('get static SVG_LENGTHTYPE_IN()', () => {
		it('Returns SVGLengthTypeEnum.in', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_IN).toBe(SVGLengthTypeEnum.in);
		});
	});

	describe('get static SVG_LENGTHTYPE_PT()', () => {
		it('Returns SVGLengthTypeEnum.pt', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_PT).toBe(SVGLengthTypeEnum.pt);
		});
	});

	describe('get static SVG_LENGTHTYPE_PC()', () => {
		it('Returns SVGLengthTypeEnum.pc', () => {
			expect(window.SVGLength.SVG_LENGTHTYPE_PC).toBe(SVGLengthTypeEnum.pc);
		});
	});

	describe('get unitType()', () => {
		it('Returns SVGLengthTypeEnum.unknown by default', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(length.unitType).toBe(SVGLengthTypeEnum.unknown);
		});

		it('Returns defined unit type', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			length.newValueSpecifiedUnits(SVGLengthTypeEnum.cm, 10);
			expect(length.unitType).toBe(SVGLengthTypeEnum.cm);
		});

		it('Returns type part of "10px" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px'
			});
			expect(length.unitType).toBe(SVGLengthTypeEnum.px);
		});

		it('Returns type part of "10cm" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10cm'
			});
			expect(length.unitType).toBe(SVGLengthTypeEnum.cm);
		});

		it('Returns type part of "10mm" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10mm'
			});
			expect(length.unitType).toBe(SVGLengthTypeEnum.mm);
		});

		it('Returns type part of "10in" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in'
			});
			expect(length.unitType).toBe(SVGLengthTypeEnum.in);
		});

		it('Returns type part of "10pt" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pt'
			});
			expect(length.unitType).toBe(SVGLengthTypeEnum.pt);
		});

		it('Returns type part of "10pc" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pc'
			});
			expect(length.unitType).toBe(SVGLengthTypeEnum.pc);
		});

		it('Throws an error for "10em" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10em'
			});
			expect(() => length.unitType).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for "10ex" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10ex'
			});
			expect(() => length.unitType).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for "10%" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10%'
			});
			expect(() => length.unitType).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});
	});

	describe('get value()', () => {
		it('Returns 0 by default', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(length.value).toBe(0);
		});

		it('Returns defined value', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			length.value = 10;
			expect(length.value).toBe(10);
		});

		it('Returns value part of "10px" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px'
			});
			expect(length.value).toBe(10);
		});

		it('Returns value part of "10cm" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10cm'
			});
			expect(length.value).toBe((10 / 2.54) * 96);
		});

		it('Returns value part of "10mm" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10mm'
			});
			expect(length.value).toBe((10 / 25.4) * 96);
		});

		it('Returns value part of "10in" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in'
			});
			expect(length.value).toBe(10 * 96);
		});

		it('Returns value part of "10pt" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pt'
			});
			expect(length.value).toBe(10 * 72);
		});

		it('Returns value part of "10pc" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pc'
			});
			expect(length.value).toBe(10 * 6);
		});

		it('Throws an error for "10em" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10em'
			});
			expect(() => length.value).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for "10ex" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10ex'
			});
			expect(() => length.value).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for "10%" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10%'
			});
			expect(() => length.value).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});
	});

	describe('set value()', () => {
		it('Sets value', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			length.value = 10;
			expect(length.value).toBe(10);
			expect(length[PropertySymbol.attributeValue]).toBe('10');
		});

		it('Sets value part of "10px" attribute', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px',
				setAttribute: (value) => (setValue = value)
			});
			length.value = 20;
			expect(setValue).toBe('20px');
		});

		it('Sets value part of "10cm" attribute', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10cm',
				setAttribute: (value) => (setValue = value)
			});
			length.value = 20;
			expect(setValue).toBe(`${(20 / 96) * 2.54}cm`);
		});

		it('Sets value part of "10mm" attribute', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10mm',
				setAttribute: (value) => (setValue = value)
			});
			length.value = 20;
			expect(setValue).toBe(`${(20 / 96) * 25.4}mm`);
		});

		it('Sets value part of "10in" attribute', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in',
				setAttribute: (value) => (setValue = value)
			});
			length.value = 20;
			expect(setValue).toBe(`${20 / 96}in`);
		});

		it('Sets value part of "10pt" attribute', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pt',
				setAttribute: (value) => (setValue = value)
			});
			length.value = 20;
			expect(setValue).toBe(`${20 / 72}pt`);
		});

		it('Sets value part of "10pc" attribute', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pc',
				setAttribute: (value) => (setValue = value)
			});
			length.value = 20;
			expect(setValue).toBe(`${20 / 6}pc`);
		});

		it('Throws an error for "10em" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10em'
			});
			expect(() => (length.value = 20)).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for "10ex" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10ex'
			});
			expect(() => (length.value = 20)).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for "10%" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10%'
			});
			expect(() => (length.value = 20)).toThrow(
				new TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error if read only', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			expect(() => {
				length.value = 10;
			}).toThrow(
				new TypeError(`Failed to set the 'value' property on 'SVGLength': The object is read-only.`)
			);
		});
	});

	describe('get valueAsString()', () => {
		it('Returns "0" by default', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(length.valueAsString).toBe('0');
		});

		it('Returns value for "10px" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px'
			});
			expect(length.valueAsString).toBe('10px');
		});

		it('Returns value for "10cm" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10cm'
			});
			expect(length.valueAsString).toBe('10cm');
		});

		it('Returns value for "10mm" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10mm'
			});
			expect(length.valueAsString).toBe('10mm');
		});

		it('Returns value for "10in" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in'
			});
			expect(length.valueAsString).toBe('10in');
		});

		it('Returns value for "10pt" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pt'
			});
			expect(length.valueAsString).toBe('10pt');
		});

		it('Returns value for "10pc" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pc'
			});
			expect(length.valueAsString).toBe('10pc');
		});
	});

	describe('get valueInSpecifiedUnits()', () => {
		it('Returns 0 by default', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(length.valueInSpecifiedUnits).toBe(0);
		});

		it('Returns value for "10px" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px'
			});
			expect(length.valueInSpecifiedUnits).toBe(10);
		});

		it('Returns value for "10cm" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10cm'
			});
			expect(length.valueInSpecifiedUnits).toBe(10);
		});

		it('Returns value for "10mm" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10mm'
			});
			expect(length.valueInSpecifiedUnits).toBe(10);
		});

		it('Returns value for "10in" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10in'
			});
			expect(length.valueInSpecifiedUnits).toBe(10);
		});

		it('Returns value for "10pt" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pt'
			});
			expect(length.valueInSpecifiedUnits).toBe(10);
		});

		it('Returns value for "10pc" attribute', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10pc'
			});
			expect(length.valueInSpecifiedUnits).toBe(10);
		});
	});

	describe('newValueSpecifiedUnits()', () => {
		it('Sets value for px', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			length.newValueSpecifiedUnits(SVGLengthTypeEnum.px, 10);
			expect(setValue).toBe('10px');
		});

		it('Sets value for cm', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			length.newValueSpecifiedUnits(SVGLengthTypeEnum.cm, 10);
			expect(setValue).toBe('10cm');
		});

		it('Sets value for mm', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			length.newValueSpecifiedUnits(SVGLengthTypeEnum.mm, 10);
			expect(setValue).toBe('10mm');
		});

		it('Sets value for in', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			length.newValueSpecifiedUnits(SVGLengthTypeEnum.in, 10);
			expect(setValue).toBe('10in');
		});

		it('Sets value for pt', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			length.newValueSpecifiedUnits(SVGLengthTypeEnum.pt, 10);
			expect(setValue).toBe('10pt');
		});

		it('Sets value for pc', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				setAttribute: (value) => (setValue = value)
			});
			length.newValueSpecifiedUnits(SVGLengthTypeEnum.pc, 10);
			expect(setValue).toBe('10pc');
		});

		it('Throws an error for ems', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(() => length.newValueSpecifiedUnits(SVGLengthTypeEnum.ems, 10)).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for exs', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(() => length.newValueSpecifiedUnits(SVGLengthTypeEnum.exs, 10)).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for percentage', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(() => length.newValueSpecifiedUnits(SVGLengthTypeEnum.percentage, 10)).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error if value is not a number', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(() => length.newValueSpecifiedUnits(<number>(<unknown>'test'), 10)).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': parameter 1 ('unitType') is not of type 'number'.`
				)
			);
		});

		it('Throws an error if read only', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			expect(() => length.newValueSpecifiedUnits(SVGLengthTypeEnum.px, 10)).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('convertToSpecifiedUnits()', () => {
		it('Converts value to px', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10cm',
				setAttribute: (value) => (setValue = value)
			});
			length.convertToSpecifiedUnits(SVGLengthTypeEnum.px);
			expect(setValue).toBe(`${(10 / 2.54) * 96}px`);
		});

		it('Converts value to cm', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px',
				setAttribute: (value) => (setValue = value)
			});
			length.convertToSpecifiedUnits(SVGLengthTypeEnum.cm);
			expect(setValue).toBe(`${(10 / 96) * 2.54}cm`);
		});

		it('Converts value to mm', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px',
				setAttribute: (value) => (setValue = value)
			});
			length.convertToSpecifiedUnits(SVGLengthTypeEnum.mm);
			expect(setValue).toBe(`${(10 / 96) * 25.4}mm`);
		});

		it('Converts value to in', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px',
				setAttribute: (value) => (setValue = value)
			});
			length.convertToSpecifiedUnits(SVGLengthTypeEnum.in);
			expect(setValue).toBe(`${10 / 96}in`);
		});

		it('Converts value to pt', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px',
				setAttribute: (value) => (setValue = value)
			});
			length.convertToSpecifiedUnits(SVGLengthTypeEnum.pt);
			expect(setValue).toBe(`${10 / 72}pt`);
		});

		it('Converts value to pc', () => {
			let setValue = '';
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px',
				setAttribute: (value) => (setValue = value)
			});
			length.convertToSpecifiedUnits(SVGLengthTypeEnum.pc);
			expect(setValue).toBe(`${10 / 6}pc`);
		});

		it('Throws an error for ems', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(() => length.convertToSpecifiedUnits(SVGLengthTypeEnum.ems)).toThrow(
				new TypeError(
					`Failed to execute 'convertToSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for exs', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(() => length.convertToSpecifiedUnits(SVGLengthTypeEnum.exs)).toThrow(
				new TypeError(
					`Failed to execute 'convertToSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error for percentage', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			expect(() => length.convertToSpecifiedUnits(SVGLengthTypeEnum.percentage)).toThrow(
				new TypeError(
					`Failed to execute 'convertToSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				)
			);
		});

		it('Throws an error if read only', () => {
			const length = new window.SVGLength(PropertySymbol.illegalConstructor, window, {
				readOnly: true
			});
			expect(() => length.convertToSpecifiedUnits(SVGLengthTypeEnum.px)).toThrow(
				new TypeError(
					`Failed to execute 'convertToSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});
});
