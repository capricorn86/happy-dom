import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFEBlendElement from '../../../src/nodes/svg-fe-blend-element/SVGFEBlendElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGFEBlendElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEBlendElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEBlendElement', () => {
			expect(element instanceof SVGFEBlendElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get static SVG_FEBLEND_MODE_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_FEBLEND_MODE_NORMAL()', () => {
		it('Should return 1', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_NORMAL).toBe(1);
		});
	});

	describe('get static SVG_FEBLEND_MODE_MULTIPLY()', () => {
		it('Should return 2', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_MULTIPLY).toBe(2);
		});
	});

	describe('get static SVG_FEBLEND_MODE_SCREEN()', () => {
		it('Should return 3', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_SCREEN).toBe(3);
		});
	});

	describe('get static SVG_FEBLEND_MODE_DARKEN()', () => {
		it('Should return 4', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_DARKEN).toBe(4);
		});
	});

	describe('get static SVG_FEBLEND_MODE_LIGHTEN()', () => {
		it('Should return 5', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_LIGHTEN).toBe(5);
		});
	});

	describe('get static SVG_FEBLEND_MODE_OVERLAY()', () => {
		it('Should return 6', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_OVERLAY).toBe(6);
		});
	});

	describe('get static SVG_FEBLEND_MODE_COLOR_DODGE()', () => {
		it('Should return 7', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_COLOR_DODGE).toBe(7);
		});
	});

	describe('get static SVG_FEBLEND_MODE_COLOR_BURN()', () => {
		it('Should return 8', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_COLOR_BURN).toBe(8);
		});
	});

	describe('get static SVG_FEBLEND_MODE_HARD_LIGHT()', () => {
		it('Should return 9', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_HARD_LIGHT).toBe(9);
		});
	});

	describe('get static SVG_FEBLEND_MODE_SOFT_LIGHT()', () => {
		it('Should return 10', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_SOFT_LIGHT).toBe(10);
		});
	});

	describe('get static SVG_FEBLEND_MODE_DIFFERENCE()', () => {
		it('Should return 11', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_DIFFERENCE).toBe(11);
		});
	});

	describe('get static SVG_FEBLEND_MODE_EXCLUSION()', () => {
		it('Should return 12', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_EXCLUSION).toBe(12);
		});
	});

	describe('get static SVG_FEBLEND_MODE_HUE()', () => {
		it('Should return 13', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_HUE).toBe(13);
		});
	});

	describe('get static SVG_FEBLEND_MODE_SATURATION()', () => {
		it('Should return 14', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_SATURATION).toBe(14);
		});
	});

	describe('get static SVG_FEBLEND_MODE_COLOR()', () => {
		it('Should return 15', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_COLOR).toBe(15);
		});
	});

	describe('get static SVG_FEBLEND_MODE_LUMINOSITY()', () => {
		it('Should return 16', () => {
			expect(SVGFEBlendElement.SVG_FEBLEND_MODE_LUMINOSITY).toBe(16);
		});
	});

	describe('get height()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const height = element.height;
			expect(height).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.height).toBe(height);
		});

		it('Reflects the "height" attribute', () => {
			element.setAttribute('height', '10cm');

			expect(element.height.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.height.baseVal.valueAsString).toBe('10cm');
			expect(element.height.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.height.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.height.animVal.valueAsString).toBe('10cm');
			expect(element.height.animVal.valueInSpecifiedUnits).toBe(10);

			element.height.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('height')).toBe('20px');

			expect(() =>
				element.height.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get in1()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const in1 = element.in1;
			expect(in1).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.in1).toBe(in1);
		});

		it('Reflects the "in" attribute', () => {
			element.setAttribute('in', 'SourceGraphic');

			expect(element.in1.baseVal).toBe('SourceGraphic');
			expect(element.in1.animVal).toBe('SourceGraphic');

			element.in1.baseVal = 'BackgroundImage';

			expect(element.getAttribute('in')).toBe('BackgroundImage');

			// Does nothing
			element.in1.animVal = 'Test';

			expect(element.getAttribute('in')).toBe('BackgroundImage');
		});
	});

	describe('get in2()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const in2 = element.in2;
			expect(in2).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.in2).toBe(in2);
		});

		it('Reflects the "in2" attribute', () => {
			element.setAttribute('in2', 'SourceGraphic');

			expect(element.in2.baseVal).toBe('SourceGraphic');
			expect(element.in2.animVal).toBe('SourceGraphic');

			element.in2.baseVal = 'BackgroundImage';

			expect(element.getAttribute('in2')).toBe('BackgroundImage');

			// Does nothing
			element.in2.animVal = 'Test';

			expect(element.getAttribute('in2')).toBe('BackgroundImage');
		});
	});

	describe('get mode()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const mode = element.mode;
			expect(mode).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.mode).toBe(mode);
		});

		it('Should return "normal" as the default value', () => {
			expect(element.mode.baseVal).toBe(SVGFEBlendElement.SVG_FEBLEND_MODE_NORMAL);
			expect(element.mode.animVal).toBe(SVGFEBlendElement.SVG_FEBLEND_MODE_NORMAL);
		});

		for (const mode of [
			'normal',
			'multiply',
			'screen',
			'darken',
			'lighten',
			'overlay',
			'color-dodge',
			'color-burn',
			'hard-light',
			'soft-light',
			'difference',
			'exclusion',
			'hue',
			'saturation',
			'color',
			'luminosity'
		]) {
			it(`Reflects the "mode" attribute for "${mode}"`, () => {
				const propertyName = `SVG_FEBLEND_MODE_${mode.toUpperCase().replace(/-/g, '_')}`;

				element.setAttribute('mode', mode);

				expect(element.mode.baseVal).toBe(SVGFEBlendElement[propertyName]);
				expect(element.mode.animVal).toBe(SVGFEBlendElement[propertyName]);

				element.removeAttribute('mode');

				element.mode.baseVal = SVGFEBlendElement[propertyName];

				expect(element.getAttribute('mode')).toBe(mode);

				element.removeAttribute('mode');

				// Does nothing
				element.mode.animVal = SVGFEBlendElement.SVG_FEBLEND_MODE_DARKEN;

				expect(element.getAttribute('mode')).toBe(null);
			});
		}
	});

	describe('get width()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const width = element.width;
			expect(width).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.width).toBe(width);
		});

		it('Reflects the "width" attribute', () => {
			element.setAttribute('width', '10cm');

			expect(element.width.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.width.baseVal.valueAsString).toBe('10cm');
			expect(element.width.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.width.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.width.animVal.valueAsString).toBe('10cm');
			expect(element.width.animVal.valueInSpecifiedUnits).toBe(10);

			element.width.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('width')).toBe('20px');

			expect(() =>
				element.width.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get x()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const x = element.x;
			expect(x).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.x).toBe(x);
		});

		it('Reflects the "x" attribute', () => {
			element.setAttribute('x', '10cm');

			expect(element.x.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x.baseVal.valueAsString).toBe('10cm');
			expect(element.x.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.x.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x.animVal.valueAsString).toBe('10cm');
			expect(element.x.animVal.valueInSpecifiedUnits).toBe(10);

			element.x.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('x')).toBe('20px');

			expect(() =>
				element.x.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get y()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const y = element.y;
			expect(y).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.y).toBe(y);
		});

		it('Reflects the "y" attribute', () => {
			element.setAttribute('y', '10cm');

			expect(element.y.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y.baseVal.valueAsString).toBe('10cm');
			expect(element.y.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.y.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y.animVal.valueAsString).toBe('10cm');
			expect(element.y.animVal.valueInSpecifiedUnits).toBe(10);

			element.y.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('y')).toBe('20px');

			expect(() =>
				element.y.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});
});
