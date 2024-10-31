import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGTextContentElement from '../../../src/nodes/svg-text-content-element/SVGTextContentElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';
import SVGPoint from '../../../src/svg/SVGPoint.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import SVGRect from '../../../src/svg/SVGRect.js';

describe('SVGTextContentElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGTextContentElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGTextContentElement', () => {
			expect(element instanceof SVGTextContentElement).toBe(true);
		});

		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
		});
	});

	describe('static get LENGTHADJUST_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGTextContentElement.LENGTHADJUST_UNKNOWN).toBe(0);
		});
	});

	describe('static get LENGTHADJUST_SPACING()', () => {
		it('Should return 1', () => {
			expect(SVGTextContentElement.LENGTHADJUST_SPACING).toBe(1);
		});
	});

	describe('static get LENGTHADJUST_SPACINGANDGLYPHS()', () => {
		it('Should return 2', () => {
			expect(SVGTextContentElement.LENGTHADJUST_SPACINGANDGLYPHS).toBe(2);
		});
	});

	describe('get textLength()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const textLength = element.textLength;
			expect(textLength).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.textLength).toBe(textLength);
		});

		it('Should return 0 by default', () => {
			expect(element.textLength.baseVal.value).toBe(0);
			expect(element.textLength.animVal.value).toBe(0);
		});

		it('Reflects the "textLength" attribute', () => {
			element.setAttribute('textLength', '10cm');

			expect(element.textLength.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.textLength.baseVal.valueAsString).toBe('10cm');
			expect(element.textLength.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.textLength.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.textLength.animVal.valueAsString).toBe('10cm');
			expect(element.textLength.animVal.valueInSpecifiedUnits).toBe(10);

			element.textLength.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('textLength')).toBe('20px');

			expect(() =>
				element.textLength.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get lengthAdjust()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const lengthAdjust = element.lengthAdjust;
			expect(lengthAdjust).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.lengthAdjust).toBe(lengthAdjust);
		});

		it('Should return "spacing" by default', () => {
			expect(element.lengthAdjust.baseVal).toBe(SVGTextContentElement.LENGTHADJUST_SPACING);
			expect(element.lengthAdjust.animVal).toBe(SVGTextContentElement.LENGTHADJUST_SPACING);
		});

		it('Reflects the "lengthAdjust" attribute', () => {
			element.setAttribute('lengthAdjust', 'spacingAndGlyphs');

			expect(element.lengthAdjust.baseVal).toBe(
				SVGTextContentElement.LENGTHADJUST_SPACINGANDGLYPHS
			);
			expect(element.lengthAdjust.animVal).toBe(
				SVGTextContentElement.LENGTHADJUST_SPACINGANDGLYPHS
			);

			element.lengthAdjust.baseVal = SVGTextContentElement.LENGTHADJUST_SPACING;

			expect(element.getAttribute('lengthAdjust')).toBe('spacing');

			// Nothing should happen

			element.lengthAdjust.animVal = SVGTextContentElement.LENGTHADJUST_SPACINGANDGLYPHS;

			expect(element.getAttribute('lengthAdjust')).toBe('spacing');
		});
	});

	describe('getNumberOfChars()', () => {
		it('Returns 0', () => {
			expect(element.getNumberOfChars()).toBe(0);
		});
	});

	describe('getComputedTextLength()', () => {
		it('Returns 0', () => {
			expect(element.getComputedTextLength()).toBe(0);
		});
	});

	describe('getSubStringLength()', () => {
		it('Returns 0', () => {
			expect(element.getSubStringLength(0, 0)).toBe(0);
		});
	});

	describe('getStartPositionOfChar()', () => {
		it('Returns 0', () => {
			expect(element.getStartPositionOfChar(0)).toBeInstanceOf(SVGPoint);
		});
	});

	describe('getEndPositionOfChar()', () => {
		it('Returns 0', () => {
			expect(element.getEndPositionOfChar(0)).toBeInstanceOf(SVGPoint);
		});
	});

	describe('getExtentOfChar()', () => {
		it('Returns 0', () => {
			expect(element.getExtentOfChar(0)).toBeInstanceOf(SVGRect);
		});
	});

	describe('getRotationOfChar()', () => {
		it('Returns 0', () => {
			expect(element.getRotationOfChar(0)).toBe(0);
		});
	});

	describe('getCharNumAtPosition()', () => {
		it('Returns 0', () => {
			expect(
				element.getCharNumAtPosition(new SVGPoint(PropertySymbol.illegalConstructor, window))
			).toBe(0);
		});
	});
});
