import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGGradientElement from '../../../src/nodes/svg-gradient-element/SVGGradientElement.js';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';
import SVGTransformTypeEnum from '../../../src/svg/SVGTransformTypeEnum.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('SVGGradientElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGGradientElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGGradientElement', () => {
			expect(element instanceof SVGGradientElement).toBe(true);
		});

		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
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

	describe('get gradientUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const gradientUnits = element.gradientUnits;
			expect(gradientUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.gradientUnits).toBe(gradientUnits);
		});

		it('Should return "userSpaceOnUse" by default', () => {
			expect(element.gradientUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
			expect(element.gradientUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
		});

		it('Reflects the "gradientUnits" attribute', () => {
			element.setAttribute('gradientUnits', 'objectBoundingBox');

			expect(element.gradientUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
			expect(element.gradientUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);

			element.setAttribute('gradientUnits', 'userSpaceOnUse');

			expect(element.gradientUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.gradientUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);

			element.gradientUnits.baseVal = window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX;

			expect(element.getAttribute('gradientUnits')).toBe('objectBoundingBox');

			// Should do nothing
			element.gradientUnits.animVal = window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;

			expect(element.getAttribute('gradientUnits')).toBe('objectBoundingBox');
		});
	});

	describe('get gradientTransform()', () => {
		it('Should return an instance of SVGAnimatedTransformList', () => {
			const gradientTransform = element.gradientTransform;
			expect(gradientTransform).toBeInstanceOf(window.SVGAnimatedTransformList);
			expect(element.gradientTransform).toBe(gradientTransform);
		});

		it('Reflects the "gradientTransform" attribute', () => {
			element.setAttribute('gradientTransform', 'matrix(1 2 3 4 5 6) translate(10 20)');

			expect(element.gradientTransform.baseVal.numberOfItems).toBe(2);
			expect(element.gradientTransform.baseVal.getItem(0).type).toBe(SVGTransformTypeEnum.matrix);
			expect(element.gradientTransform.baseVal.getItem(0).matrix.a).toBe(1);
			expect(element.gradientTransform.baseVal.getItem(0).matrix.b).toBe(2);
			expect(element.gradientTransform.baseVal.getItem(0).matrix.c).toBe(3);
			expect(element.gradientTransform.baseVal.getItem(0).matrix.d).toBe(4);
			expect(element.gradientTransform.baseVal.getItem(0).matrix.e).toBe(5);
			expect(element.gradientTransform.baseVal.getItem(0).matrix.f).toBe(6);

			expect(element.gradientTransform.baseVal.getItem(1).type).toBe(
				SVGTransformTypeEnum.translate
			);
			expect(element.gradientTransform.baseVal.getItem(1).matrix.a).toBe(1);
			expect(element.gradientTransform.baseVal.getItem(1).matrix.b).toBe(0);
			expect(element.gradientTransform.baseVal.getItem(1).matrix.c).toBe(0);
			expect(element.gradientTransform.baseVal.getItem(1).matrix.d).toBe(1);
			expect(element.gradientTransform.baseVal.getItem(1).matrix.e).toBe(10);
			expect(element.gradientTransform.baseVal.getItem(1).matrix.f).toBe(20);

			expect(element.gradientTransform.animVal.numberOfItems).toBe(2);
			expect(element.gradientTransform.animVal.getItem(0).type).toBe(SVGTransformTypeEnum.matrix);
			expect(element.gradientTransform.animVal.getItem(0).matrix.a).toBe(1);
			expect(element.gradientTransform.animVal.getItem(0).matrix.b).toBe(2);
			expect(element.gradientTransform.animVal.getItem(0).matrix.c).toBe(3);
			expect(element.gradientTransform.animVal.getItem(0).matrix.d).toBe(4);
			expect(element.gradientTransform.animVal.getItem(0).matrix.e).toBe(5);
			expect(element.gradientTransform.animVal.getItem(0).matrix.f).toBe(6);

			expect(element.gradientTransform.animVal.getItem(1).type).toBe(
				SVGTransformTypeEnum.translate
			);
			expect(element.gradientTransform.animVal.getItem(1).matrix.a).toBe(1);
			expect(element.gradientTransform.animVal.getItem(1).matrix.b).toBe(0);
			expect(element.gradientTransform.animVal.getItem(1).matrix.c).toBe(0);
			expect(element.gradientTransform.animVal.getItem(1).matrix.d).toBe(1);
			expect(element.gradientTransform.animVal.getItem(1).matrix.e).toBe(10);
			expect(element.gradientTransform.animVal.getItem(1).matrix.f).toBe(20);

			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			transform.setScale(10, 20);

			element.gradientTransform.baseVal.initialize(transform);

			expect(element.getAttribute('gradientTransform')).toBe('scale(10 20)');

			// Does nothing
			expect(() =>
				element.gradientTransform.animVal.initialize(
					new window.SVGTransform(PropertySymbol.illegalConstructor, window)
				)
			).toThrow(
				new TypeError(
					`Failed to execute 'initialize' on 'SVGTransformList': The object is read-only.`
				)
			);
		});
	});

	describe('get spreadMethod()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const spreadMethod = element.spreadMethod;
			expect(spreadMethod).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.spreadMethod).toBe(spreadMethod);
		});

		it('Should return "pad" as the default value', () => {
			expect(element.spreadMethod.baseVal).toBe(SVGGradientElement.SVG_SPREADMETHOD_PAD);
			expect(element.spreadMethod.animVal).toBe(SVGGradientElement.SVG_SPREADMETHOD_PAD);
		});

		for (const spreadMethod of ['pad', 'reflect', 'repeat']) {
			it(`Reflects the "spreadMethod" attribute for "${spreadMethod}"`, () => {
				const propertyName = `SVG_SPREADMETHOD_${spreadMethod.toUpperCase()}`;

				element.setAttribute('spreadMethod', spreadMethod);

				expect(element.spreadMethod.baseVal).toBe(SVGGradientElement[propertyName]);
				expect(element.spreadMethod.animVal).toBe(SVGGradientElement[propertyName]);

				element.removeAttribute('spreadMethod');

				element.spreadMethod.baseVal = SVGGradientElement[propertyName];

				expect(element.getAttribute('spreadMethod')).toBe(spreadMethod);

				element.removeAttribute('spreadMethod');

				// Does nothing
				element.spreadMethod.animVal = SVGGradientElement.SVG_SPREADMETHOD_PAD;

				expect(element.getAttribute('spreadMethod')).toBe(null);
			});
		}
	});
});
