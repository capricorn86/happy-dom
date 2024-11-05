import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGComponentTransferFunctionElement from '../../../src/nodes/svg-component-transfer-function-element/SVGComponentTransferFunctionElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('SVGComponentTransferFunctionElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGComponentTransferFunctionElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncA');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGComponentTransferFunctionElement', () => {
			expect(element instanceof SVGComponentTransferFunctionElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get type()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const type = element.type;
			expect(type).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.type).toBe(type);
		});

		it('Should return "identity" by default', () => {
			expect(element.type.animVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_IDENTITY
			);
			expect(element.type.baseVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_IDENTITY
			);
		});

		it('Reflects the "type" attribute', () => {
			element.setAttribute('type', 'table');

			expect(element.type.baseVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_TABLE
			);
			expect(element.type.animVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_TABLE
			);

			element.setAttribute('type', 'discrete');

			expect(element.type.baseVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_DISCRETE
			);
			expect(element.type.animVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_DISCRETE
			);

			element.setAttribute('type', 'linear');

			expect(element.type.baseVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_LINEAR
			);
			expect(element.type.animVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_LINEAR
			);

			element.setAttribute('type', 'gamma');

			expect(element.type.baseVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_GAMMA
			);
			expect(element.type.animVal).toBe(
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_GAMMA
			);

			element.type.baseVal =
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_IDENTITY;

			expect(element.getAttribute('type')).toBe('identity');

			// Should do nothing
			element.type.animVal =
				window.SVGComponentTransferFunctionElement.SVG_FECOMPONENTTRANSFER_TYPE_TABLE;

			expect(element.getAttribute('type')).toBe('identity');
		});
	});

	describe('get tableValues()', () => {
		it('Should return an instance of SVGAnimatedNumberList', () => {
			const tableValues = element.tableValues;
			expect(tableValues).toBeInstanceOf(window.SVGAnimatedNumberList);
			expect(element.tableValues).toBe(tableValues);
		});

		it('Reflects the "tableValues" attribute', () => {
			element.setAttribute('tableValues', '1 2.2 3');

			expect(element.tableValues.baseVal.length).toBe(3);
			expect(element.tableValues.baseVal.numberOfItems).toBe(3);
			expect(element.tableValues.baseVal.getItem(0).value).toBe(1);
			expect(element.tableValues.baseVal.getItem(1).value).toBe(2.2);
			expect(element.tableValues.baseVal.getItem(2).value).toBe(3);

			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			number.value = 4.4;

			element.tableValues.baseVal.appendItem(number);

			expect(element.tableValues.baseVal.length).toBe(4);
			expect(element.tableValues.baseVal[0].value).toBe(1);
			expect(element.tableValues.baseVal[1].value).toBe(2.2);
			expect(element.tableValues.baseVal[2].value).toBe(3);
			expect(element.tableValues.baseVal[3].value).toBe(4.4);

			expect(element.getAttribute('tableValues')).toBe('1 2.2 3 4.4');

			element.tableValues.baseVal.clear();

			expect(element.getAttribute('tableValues')).toBe('');

			element.setAttribute('tableValues', '1 2 3');

			expect(element.tableValues.baseVal.length).toBe(3);
			expect(element.tableValues.baseVal[0].value).toBe(1);
			expect(element.tableValues.baseVal[1].value).toBe(2);
			expect(element.tableValues.baseVal[2].value).toBe(3);
		});
	});

	describe('get slope()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const slope = element.slope;
			expect(slope).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.slope).toBe(slope);
		});

		it('Returns 1 by default', () => {
			expect(element.slope.baseVal).toBe(1);
			expect(element.slope.animVal).toBe(1);
		});

		it('Reflects the "slope" attribute', () => {
			element.setAttribute('slope', '2.2');

			expect(element.slope.baseVal).toBe(2.2);
			expect(element.slope.animVal).toBe(2.2);

			element.slope.baseVal = 3.3;

			expect(element.getAttribute('slope')).toBe('3.3');

			// Should do nothing
			element.slope.animVal = 4;

			expect(element.getAttribute('slope')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('slope', 'test');
			expect(element.slope.baseVal).toBe(1);
			expect(element.slope.animVal).toBe(1);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.slope.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get intercept()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const intercept = element.intercept;
			expect(intercept).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.intercept).toBe(intercept);
		});

		it('Returns 0 by default', () => {
			expect(element.intercept.baseVal).toBe(0);
			expect(element.intercept.animVal).toBe(0);
		});

		it('Reflects the "intercept" attribute', () => {
			element.setAttribute('intercept', '2.2');

			expect(element.intercept.baseVal).toBe(2.2);
			expect(element.intercept.animVal).toBe(2.2);

			element.intercept.baseVal = 3.3;

			expect(element.getAttribute('intercept')).toBe('3.3');

			// Should do nothing
			element.intercept.animVal = 4;

			expect(element.getAttribute('intercept')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('intercept', 'test');
			expect(element.intercept.baseVal).toBe(0);
			expect(element.intercept.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.intercept.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get amplitude()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const amplitude = element.amplitude;
			expect(amplitude).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.amplitude).toBe(amplitude);
		});

		it('Returns 1 by default', () => {
			expect(element.amplitude.baseVal).toBe(1);
			expect(element.amplitude.animVal).toBe(1);
		});

		it('Reflects the "amplitude" attribute', () => {
			element.setAttribute('amplitude', '2.2');

			expect(element.amplitude.baseVal).toBe(2.2);
			expect(element.amplitude.animVal).toBe(2.2);

			element.amplitude.baseVal = 3.3;

			expect(element.getAttribute('amplitude')).toBe('3.3');

			// Should do nothing
			element.amplitude.animVal = 4;

			expect(element.getAttribute('amplitude')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('amplitude', 'test');
			expect(element.amplitude.baseVal).toBe(1);
			expect(element.amplitude.animVal).toBe(1);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.amplitude.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get exponent()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const exponent = element.exponent;
			expect(exponent).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.exponent).toBe(exponent);
		});

		it('Returns 1 by default', () => {
			expect(element.exponent.baseVal).toBe(1);
			expect(element.exponent.animVal).toBe(1);
		});

		it('Reflects the "exponent" attribute', () => {
			element.setAttribute('exponent', '2.2');

			expect(element.exponent.baseVal).toBe(2.2);
			expect(element.exponent.animVal).toBe(2.2);

			element.exponent.baseVal = 3.3;

			expect(element.getAttribute('exponent')).toBe('3.3');

			// Should do nothing
			element.exponent.animVal = 4;

			expect(element.getAttribute('exponent')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('exponent', 'test');
			expect(element.exponent.baseVal).toBe(1);
			expect(element.exponent.animVal).toBe(1);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.exponent.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get offset()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const offset = element.offset;
			expect(offset).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.offset).toBe(offset);
		});

		it('Returns 0 by default', () => {
			expect(element.offset.baseVal).toBe(0);
			expect(element.offset.animVal).toBe(0);
		});

		it('Reflects the "offset" attribute', () => {
			element.setAttribute('offset', '2.2');

			expect(element.offset.baseVal).toBe(2.2);
			expect(element.offset.animVal).toBe(2.2);

			element.offset.baseVal = 3.3;

			expect(element.getAttribute('offset')).toBe('3.3');

			// Should do nothing
			element.offset.animVal = 4;

			expect(element.getAttribute('offset')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('offset', 'test');
			expect(element.offset.baseVal).toBe(0);
			expect(element.offset.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.offset.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});
});
