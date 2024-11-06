import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGMaskElement from '../../../src/nodes/svg-mask-element/SVGMaskElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGPreserveAspectRatioAlignEnum from '../../../src/svg/SVGPreserveAspectRatioAlignEnum.js';
import SVGPreserveAspectRatioMeetOrSliceEnum from '../../../src/svg/SVGPreserveAspectRatioMeetOrSliceEnum.js';
import SVGAngle from '../../../src/svg/SVGAngle.js';

describe('SVGMaskElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGMaskElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGMaskElement', () => {
			expect(element instanceof SVGMaskElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get maskUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const maskUnits = element.maskUnits;
			expect(maskUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.maskUnits).toBe(maskUnits);
		});

		it('Should return userSpaceOnUse by default', () => {
			expect(element.maskUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.maskUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
		});

		it('Reflects the "maskUnits" attribute', () => {
			element.setAttribute('maskUnits', 'userSpaceOnUse');

			expect(element.maskUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.maskUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);

			element.setAttribute('maskUnits', 'objectBoundingBox');

			expect(element.maskUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX);
			expect(element.maskUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX);

			element.maskUnits.baseVal = window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;

			expect(element.getAttribute('maskUnits')).toBe('userSpaceOnUse');

			// Should do nothing
			element.maskUnits.animVal = window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX;

			expect(element.getAttribute('maskUnits')).toBe('userSpaceOnUse');
		});
	});

	describe('get maskContentUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const maskContentUnits = element.maskContentUnits;
			expect(maskContentUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.maskContentUnits).toBe(maskContentUnits);
		});

		it('Should return userSpaceOnUse by default', () => {
			expect(element.maskContentUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE
			);
			expect(element.maskContentUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE
			);
		});

		it('Reflects the "maskContentUnits" attribute', () => {
			element.setAttribute('maskContentUnits', 'userSpaceOnUse');

			expect(element.maskContentUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE
			);
			expect(element.maskContentUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE
			);

			element.setAttribute('maskContentUnits', 'objectBoundingBox');

			expect(element.maskContentUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
			expect(element.maskContentUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);

			element.maskContentUnits.baseVal = window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;

			expect(element.getAttribute('maskContentUnits')).toBe('userSpaceOnUse');

			// Should do nothing
			element.maskContentUnits.animVal = window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX;

			expect(element.getAttribute('maskContentUnits')).toBe('userSpaceOnUse');
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
