import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGPatternElement from '../../../src/nodes/svg-pattern-element/SVGPatternElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGTransformTypeEnum from '../../../src/svg/SVGTransformTypeEnum.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('SVGPatternElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGPatternElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGPatternElement', () => {
			expect(element instanceof SVGPatternElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get href()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const href = element.href;
			expect(href).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.href).toBe(href);
		});

		it('Returns empty string by default', () => {
			expect(element.href.baseVal).toBe('');
			expect(element.href.animVal).toBe('');
		});

		it('Reflects the "href" attribute', () => {
			element.setAttribute('href', 'https://example.com/image.jpg');

			expect(element.href.baseVal).toBe('https://example.com/image.jpg');
			expect(element.href.animVal).toBe('https://example.com/image.jpg');

			element.href.baseVal = 'https://example.com/image2.jpg';

			expect(element.getAttribute('href')).toBe('https://example.com/image2.jpg');

			// Does nothing
			element.href.animVal = 'https://example.com/image3.jpg';

			expect(element.getAttribute('href')).toBe('https://example.com/image2.jpg');
		});
	});

	describe('get patternUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const patternUnits = element.patternUnits;
			expect(patternUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.patternUnits).toBe(patternUnits);
		});

		it('Should return "objectBoundingBox" by default', () => {
			expect(element.patternUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
			expect(element.patternUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
		});

		it('Reflects the "patternUnits" attribute', () => {
			element.setAttribute('patternUnits', 'objectBoundingBox');

			expect(element.patternUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
			expect(element.patternUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);

			element.setAttribute('patternUnits', 'userSpaceOnUse');

			expect(element.patternUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.patternUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);

			element.patternUnits.baseVal = window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX;

			expect(element.getAttribute('patternUnits')).toBe('objectBoundingBox');

			// Should do nothing
			element.patternUnits.animVal = window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;

			expect(element.getAttribute('patternUnits')).toBe('objectBoundingBox');
		});
	});

	describe('get patternContentUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const patternContentUnits = element.patternContentUnits;
			expect(patternContentUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.patternContentUnits).toBe(patternContentUnits);
		});

		it('Should return "userSpaceOnUse" by default', () => {
			expect(element.patternContentUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE
			);
			expect(element.patternContentUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE
			);
		});

		it('Reflects the "patternContentUnits" attribute', () => {
			element.setAttribute('patternContentUnits', 'userSpaceOnUse');

			expect(element.patternContentUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE
			);
			expect(element.patternContentUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE
			);

			element.setAttribute('patternContentUnits', 'objectBoundingBox');

			expect(element.patternContentUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
			expect(element.patternContentUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);

			element.patternContentUnits.baseVal = window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;

			expect(element.getAttribute('patternContentUnits')).toBe('userSpaceOnUse');

			// Should do nothing
			element.patternContentUnits.animVal = window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX;

			expect(element.getAttribute('patternContentUnits')).toBe('userSpaceOnUse');
		});
	});

	describe('get patternTransform()', () => {
		it('Should return an instance of SVGAnimatedTransformList', () => {
			const patternTransform = element.patternTransform;
			expect(patternTransform).toBeInstanceOf(window.SVGAnimatedTransformList);
			expect(element.patternTransform).toBe(patternTransform);
		});

		it('Reflects the "patternTransform" attribute', () => {
			element.setAttribute('patternTransform', 'matrix(1 2 3 4 5 6) translate(10 20)');

			expect(element.patternTransform.baseVal.numberOfItems).toBe(2);
			expect(element.patternTransform.baseVal.getItem(0).type).toBe(SVGTransformTypeEnum.matrix);
			expect(element.patternTransform.baseVal.getItem(0).matrix.a).toBe(1);
			expect(element.patternTransform.baseVal.getItem(0).matrix.b).toBe(2);
			expect(element.patternTransform.baseVal.getItem(0).matrix.c).toBe(3);
			expect(element.patternTransform.baseVal.getItem(0).matrix.d).toBe(4);
			expect(element.patternTransform.baseVal.getItem(0).matrix.e).toBe(5);
			expect(element.patternTransform.baseVal.getItem(0).matrix.f).toBe(6);

			expect(element.patternTransform.baseVal.getItem(1).type).toBe(SVGTransformTypeEnum.translate);
			expect(element.patternTransform.baseVal.getItem(1).matrix.a).toBe(1);
			expect(element.patternTransform.baseVal.getItem(1).matrix.b).toBe(0);
			expect(element.patternTransform.baseVal.getItem(1).matrix.c).toBe(0);
			expect(element.patternTransform.baseVal.getItem(1).matrix.d).toBe(1);
			expect(element.patternTransform.baseVal.getItem(1).matrix.e).toBe(10);
			expect(element.patternTransform.baseVal.getItem(1).matrix.f).toBe(20);

			expect(element.patternTransform.animVal.numberOfItems).toBe(2);
			expect(element.patternTransform.animVal.getItem(0).type).toBe(SVGTransformTypeEnum.matrix);
			expect(element.patternTransform.animVal.getItem(0).matrix.a).toBe(1);
			expect(element.patternTransform.animVal.getItem(0).matrix.b).toBe(2);
			expect(element.patternTransform.animVal.getItem(0).matrix.c).toBe(3);
			expect(element.patternTransform.animVal.getItem(0).matrix.d).toBe(4);
			expect(element.patternTransform.animVal.getItem(0).matrix.e).toBe(5);
			expect(element.patternTransform.animVal.getItem(0).matrix.f).toBe(6);

			expect(element.patternTransform.animVal.getItem(1).type).toBe(SVGTransformTypeEnum.translate);
			expect(element.patternTransform.animVal.getItem(1).matrix.a).toBe(1);
			expect(element.patternTransform.animVal.getItem(1).matrix.b).toBe(0);
			expect(element.patternTransform.animVal.getItem(1).matrix.c).toBe(0);
			expect(element.patternTransform.animVal.getItem(1).matrix.d).toBe(1);
			expect(element.patternTransform.animVal.getItem(1).matrix.e).toBe(10);
			expect(element.patternTransform.animVal.getItem(1).matrix.f).toBe(20);

			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			transform.setScale(10, 20);

			element.patternTransform.baseVal.initialize(transform);

			expect(element.getAttribute('patternTransform')).toBe('scale(10 20)');

			// Does nothing
			expect(() =>
				element.patternTransform.animVal.initialize(
					new window.SVGTransform(PropertySymbol.illegalConstructor, window)
				)
			).toThrow(
				new TypeError(
					`Failed to execute 'initialize' on 'SVGTransformList': The object is read-only.`
				)
			);
		});
	});

	describe('get width()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const width = element.width;
			expect(width).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.width).toBe(width);
		});

		it('Should return 0 by default', () => {
			expect(element.width.baseVal.value).toBe(0);
			expect(element.width.animVal.value).toBe(0);
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

	describe('get height()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const height = element.height;
			expect(height).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.height).toBe(height);
		});

		it('Should return 0 by default', () => {
			expect(element.height.baseVal.value).toBe(0);
			expect(element.height.animVal.value).toBe(0);
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

	describe('get x()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const x = element.x;
			expect(x).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.x).toBe(x);
		});

		it('Should return 0 by default', () => {
			expect(element.x.baseVal.value).toBe(0);
			expect(element.x.animVal.value).toBe(0);
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

		it('Should return 0 by default', () => {
			expect(element.y.baseVal.value).toBe(0);
			expect(element.y.animVal.value).toBe(0);
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
