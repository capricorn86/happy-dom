import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFilterElement from '../../../src/nodes/svg-filter-element/SVGFilterElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';

describe('SVGFilterElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFilterElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFilterElement', () => {
			expect(element instanceof SVGFilterElement).toBe(true);
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

	describe('get filterUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const filterUnits = element.filterUnits;
			expect(filterUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.filterUnits).toBe(filterUnits);
		});

		it('Should return userSpaceOnUse by default', () => {
			expect(element.filterUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.filterUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
		});

		it('Reflects the "filterUnits" attribute', () => {
			element.setAttribute('filterUnits', 'userSpaceOnUse');

			expect(element.filterUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.filterUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);

			element.setAttribute('filterUnits', 'objectBoundingBox');

			expect(element.filterUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX);
			expect(element.filterUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX);

			element.filterUnits.baseVal = window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;

			expect(element.getAttribute('filterUnits')).toBe('userSpaceOnUse');

			// Should do nothing
			element.filterUnits.animVal = window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX;

			expect(element.getAttribute('filterUnits')).toBe('userSpaceOnUse');
		});
	});

	describe('get primitiveUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const primitiveUnits = element.primitiveUnits;
			expect(primitiveUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.primitiveUnits).toBe(primitiveUnits);
		});

		it('Should return userSpaceOnUse by default', () => {
			expect(element.primitiveUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.primitiveUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
		});

		it('Reflects the "primitiveUnits" attribute', () => {
			element.setAttribute('primitiveUnits', 'userSpaceOnUse');

			expect(element.primitiveUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.primitiveUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);

			element.setAttribute('primitiveUnits', 'objectBoundingBox');

			expect(element.primitiveUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
			expect(element.primitiveUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);

			element.primitiveUnits.baseVal = window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;

			expect(element.getAttribute('primitiveUnits')).toBe('userSpaceOnUse');

			// Should do nothing
			element.primitiveUnits.animVal = window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX;

			expect(element.getAttribute('primitiveUnits')).toBe('userSpaceOnUse');
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
