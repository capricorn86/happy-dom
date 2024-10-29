import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFEDisplacementMapElement from '../../../src/nodes/svg-fe-displacement-map-element/SVGFEDisplacementMapElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGFEDisplacementMapElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEDisplacementMapElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEDisplacementMapElement', () => {
			expect(element instanceof SVGFEDisplacementMapElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get static SVG_CHANNEL_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGFEDisplacementMapElement.SVG_CHANNEL_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_CHANNEL_R()', () => {
		it('Should return 1', () => {
			expect(SVGFEDisplacementMapElement.SVG_CHANNEL_R).toBe(1);
		});
	});

	describe('get static SVG_CHANNEL_G()', () => {
		it('Should return 2', () => {
			expect(SVGFEDisplacementMapElement.SVG_CHANNEL_G).toBe(2);
		});
	});

	describe('get static SVG_CHANNEL_B()', () => {
		it('Should return 3', () => {
			expect(SVGFEDisplacementMapElement.SVG_CHANNEL_B).toBe(3);
		});
	});

	describe('get static SVG_CHANNEL_A()', () => {
		it('Should return 4', () => {
			expect(SVGFEDisplacementMapElement.SVG_CHANNEL_A).toBe(4);
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

	describe('get result()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const result = element.result;
			expect(result).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.result).toBe(result);
		});

		it('Reflects the "result" attribute', () => {
			element.setAttribute('result', 'SourceGraphic');

			expect(element.result.baseVal).toBe('SourceGraphic');
			expect(element.result.animVal).toBe('SourceGraphic');

			element.result.baseVal = 'BackgroundImage';

			expect(element.getAttribute('result')).toBe('BackgroundImage');

			// Does nothing
			element.result.animVal = 'Test';

			expect(element.getAttribute('result')).toBe('BackgroundImage');
		});
	});

	describe('get scale()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const scale = element.scale;
			expect(scale).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.scale).toBe(scale);
		});

		it('Reflects the "scale" attribute', () => {
			element.setAttribute('scale', '10');

			expect(element.scale.baseVal).toBe(10);
			expect(element.scale.animVal).toBe(10);

			element.scale.baseVal = 20;

			expect(element.getAttribute('scale')).toBe('20');

			// Does nothing
			element.scale.animVal = 30;

			expect(element.getAttribute('scale')).toBe('20');
		});
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

	describe('get xChannelSelector()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const xChannelSelector = element.xChannelSelector;
			expect(xChannelSelector).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.xChannelSelector).toBe(xChannelSelector);
		});

		it('Returns "r" by default', () => {
			expect(element.xChannelSelector.baseVal).toBe(SVGFEDisplacementMapElement.SVG_CHANNEL_R);
			expect(element.xChannelSelector.animVal).toBe(SVGFEDisplacementMapElement.SVG_CHANNEL_R);
		});

		for (const xChannelSelector of ['r', 'g', 'b', 'a']) {
			it(`Reflects the "xChannelSelector" attribute for "${xChannelSelector}"`, () => {
				const propertyName = `SVG_CHANNEL_${xChannelSelector.toUpperCase()}`;

				element.setAttribute('xChannelSelector', xChannelSelector);

				expect(element.xChannelSelector.baseVal).toBe(SVGFEDisplacementMapElement[propertyName]);
				expect(element.xChannelSelector.animVal).toBe(SVGFEDisplacementMapElement[propertyName]);

				element.removeAttribute('xChannelSelector');

				element.xChannelSelector.baseVal = SVGFEDisplacementMapElement[propertyName];

				expect(element.getAttribute('xChannelSelector')).toBe(xChannelSelector);

				element.removeAttribute('xChannelSelector');

				// Does nothing
				element.xChannelSelector.animVal = SVGFEDisplacementMapElement.SVG_CHANNEL_G;

				expect(element.getAttribute('xChannelSelector')).toBe(null);
			});
		}
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

	describe('get yChannelSelector()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const yChannelSelector = element.yChannelSelector;
			expect(yChannelSelector).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.yChannelSelector).toBe(yChannelSelector);
		});

		it('Returns "r" by default', () => {
			expect(element.yChannelSelector.baseVal).toBe(SVGFEDisplacementMapElement.SVG_CHANNEL_R);
			expect(element.yChannelSelector.animVal).toBe(SVGFEDisplacementMapElement.SVG_CHANNEL_R);
		});

		for (const yChannelSelector of ['r', 'g', 'b', 'a']) {
			it(`Reflects the "yChannelSelector" attribute for "${yChannelSelector}"`, () => {
				const propertyName = `SVG_CHANNEL_${yChannelSelector.toUpperCase()}`;

				element.setAttribute('yChannelSelector', yChannelSelector);

				expect(element.yChannelSelector.baseVal).toBe(SVGFEDisplacementMapElement[propertyName]);
				expect(element.yChannelSelector.animVal).toBe(SVGFEDisplacementMapElement[propertyName]);

				element.removeAttribute('yChannelSelector');

				element.yChannelSelector.baseVal = SVGFEDisplacementMapElement[propertyName];

				expect(element.getAttribute('yChannelSelector')).toBe(yChannelSelector);

				element.removeAttribute('yChannelSelector');

				// Does nothing
				element.yChannelSelector.animVal = SVGFEDisplacementMapElement.SVG_CHANNEL_G;

				expect(element.getAttribute('yChannelSelector')).toBe(null);
			});
		}
	});
});
