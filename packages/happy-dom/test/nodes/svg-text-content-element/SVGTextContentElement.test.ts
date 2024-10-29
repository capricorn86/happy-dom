import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGTextContentElement from '../../../src/nodes/svg-text-content-element/SVGTextContentElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGGeometryElement from '../../../src/nodes/svg-geometry-element/SVGGeometryElement.js';

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

		it('Should be an instanceof SVGGeometryElement', () => {
			expect(element instanceof SVGGeometryElement).toBe(true);
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
});
