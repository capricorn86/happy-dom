import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGImageElement from '../../../src/nodes/svg-image-element/SVGImageElement.js';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';
import SVGPreserveAspectRatioAlignEnum from '../../../src/svg/SVGPreserveAspectRatioAlignEnum.js';
import SVGPreserveAspectRatioMeetOrSliceEnum from '../../../src/svg/SVGPreserveAspectRatioMeetOrSliceEnum.js';
import SVGLength from '../../../src/svg/SVGLength.js';

describe('SVGImageElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGImageElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGImageElement', () => {
			expect(element instanceof SVGImageElement).toBe(true);
		});

		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
		});
	});

	describe('get crossOrigin()', () => {
		it('Returns the "crossorigin attribute', () => {
			expect(element.crossOrigin).toBe(null);
			element.setAttribute('crossorigin', 'use-credentials');
			expect(element.crossOrigin).toBe('use-credentials');
		});
	});

	describe('set crossOrigin()', () => {
		it('Sets the "crossorigin attribute', () => {
			element.crossOrigin = 'anonymous';
			expect(element.crossOrigin).toBe('anonymous');
			expect(element.getAttribute('crossorigin')).toBe('anonymous');
			element.crossOrigin = 'use-credentials';
			expect(element.crossOrigin).toBe('use-credentials');
			expect(element.getAttribute('crossorigin')).toBe('use-credentials');
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

	describe('get decoding()', () => {
		it('Returns the "decoding" attribute', () => {
			element.setAttribute('decoding', 'sync');
			expect(element.decoding).toBe('sync');

			element.setAttribute('decoding', 'async');
			expect(element.decoding).toBe('async');

			element.setAttribute('decoding', 'auto');
			expect(element.decoding).toBe('auto');

			element.setAttribute('decoding', 'invalid');
			expect(element.decoding).toBe('auto');
		});
	});

	describe('set decoding()', () => {
		it('Sets the "decoding" attribute', () => {
			element.decoding = 'anyValue';
			expect(element.getAttribute('decoding')).toBe('anyValue');
		});
	});

	describe('get preserveAspectRatio()', () => {
		it('Should return an instance of SVGAnimatedPreserveAspectRatio', () => {
			const preserveAspectRatio = element.preserveAspectRatio;
			expect(preserveAspectRatio).toBeInstanceOf(window.SVGAnimatedPreserveAspectRatio);
			expect(element.preserveAspectRatio).toBe(preserveAspectRatio);
		});

		it('Reflects the "preserveAspectRatio" attribute', () => {
			expect(element.preserveAspectRatio.baseVal.align).toBe(
				SVGPreserveAspectRatioAlignEnum.xMidYMid
			);
			expect(element.preserveAspectRatio.baseVal.meetOrSlice).toBe(
				SVGPreserveAspectRatioMeetOrSliceEnum.meet
			);

			element.setAttribute('preserveAspectRatio', 'xMaxYMin slice');

			expect(element.preserveAspectRatio.baseVal.align).toBe(
				SVGPreserveAspectRatioAlignEnum.xMaxYMin
			);
			expect(element.preserveAspectRatio.animVal.align).toBe(
				SVGPreserveAspectRatioAlignEnum.xMaxYMin
			);
			expect(element.preserveAspectRatio.baseVal.meetOrSlice).toBe(
				SVGPreserveAspectRatioMeetOrSliceEnum.slice
			);
			expect(element.preserveAspectRatio.animVal.meetOrSlice).toBe(
				SVGPreserveAspectRatioMeetOrSliceEnum.slice
			);

			element.preserveAspectRatio.baseVal.align = SVGPreserveAspectRatioAlignEnum.xMaxYMin;
			element.preserveAspectRatio.baseVal.meetOrSlice = SVGPreserveAspectRatioMeetOrSliceEnum.meet;

			expect(element.getAttribute('preserveAspectRatio')).toBe('xMaxYMin meet');

			expect(
				() => (element.preserveAspectRatio.animVal.align = SVGPreserveAspectRatioAlignEnum.xMinYMin)
			).toThrow(
				new TypeError(
					`Failed to set the 'align' property on 'SVGPreserveAspectRatio': The object is read-only.`
				)
			);

			expect(
				() =>
					(element.preserveAspectRatio.animVal.meetOrSlice =
						SVGPreserveAspectRatioMeetOrSliceEnum.slice)
			).toThrow(
				new TypeError(
					`Failed to set the 'meetOrSlice' property on 'SVGPreserveAspectRatio': The object is read-only.`
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

	describe('decode()', () => {
		it('Should return a promise', () => {
			expect(element.decode()).resolves.toBe(undefined);
		});
	});
});
