import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGMarkerElement from '../../../src/nodes/svg-marker-element/SVGMarkerElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGPreserveAspectRatioAlignEnum from '../../../src/svg/SVGPreserveAspectRatioAlignEnum.js';
import SVGPreserveAspectRatioMeetOrSliceEnum from '../../../src/svg/SVGPreserveAspectRatioMeetOrSliceEnum.js';
import SVGAngle from '../../../src/svg/SVGAngle.js';

describe('SVGMarkerElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGMarkerElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGMarkerElement', () => {
			expect(element instanceof SVGMarkerElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get static SVG_MARKER_ORIENT_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGMarkerElement.SVG_MARKER_ORIENT_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_MARKER_ORIENT_AUTO()', () => {
		it('Should return 1', () => {
			expect(SVGMarkerElement.SVG_MARKER_ORIENT_AUTO).toBe(1);
		});
	});

	describe('get static SVG_MARKER_ORIENT_ANGLE()', () => {
		it('Should return 2', () => {
			expect(SVGMarkerElement.SVG_MARKER_ORIENT_ANGLE).toBe(2);
		});
	});

	describe('get static SVG_MARKERUNITS_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGMarkerElement.SVG_MARKERUNITS_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_MARKERUNITS_USERSPACEONUSE()', () => {
		it('Should return 1', () => {
			expect(SVGMarkerElement.SVG_MARKERUNITS_USERSPACEONUSE).toBe(1);
		});
	});

	describe('get static SVG_MARKERUNITS_STROKEWIDTH()', () => {
		it('Should return 2', () => {
			expect(SVGMarkerElement.SVG_MARKERUNITS_STROKEWIDTH).toBe(2);
		});
	});

	describe('get markerUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const markerUnits = element.markerUnits;
			expect(markerUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.markerUnits).toBe(markerUnits);
		});

		it('Should return "strokeWidth" as the default value', () => {
			expect(element.markerUnits.baseVal).toBe(SVGMarkerElement.SVG_MARKERUNITS_STROKEWIDTH);
			expect(element.markerUnits.animVal).toBe(SVGMarkerElement.SVG_MARKERUNITS_STROKEWIDTH);
		});

		for (const markerUnits of ['userSpaceOnUse', 'strokeWidth']) {
			it(`Reflects the "markerUnits" attribute for "${markerUnits}"`, () => {
				const propertyName = `SVG_MARKERUNITS_${markerUnits.toUpperCase().replace(/-/g, '_')}`;

				element.setAttribute('markerUnits', markerUnits);

				expect(element.markerUnits.baseVal).toBe(SVGMarkerElement[propertyName]);
				expect(element.markerUnits.animVal).toBe(SVGMarkerElement[propertyName]);

				element.removeAttribute('markerUnits');

				element.markerUnits.baseVal = SVGMarkerElement[propertyName];

				expect(element.getAttribute('markerUnits')).toBe(markerUnits);

				element.removeAttribute('markerUnits');

				// Does nothing
				element.markerUnits.animVal = SVGMarkerElement.SVG_MARKER_ORIENT_ANGLE;

				expect(element.getAttribute('markerUnits')).toBe(null);
			});
		}
	});

	describe('get markerWidth()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const markerWidth = element.markerWidth;
			expect(markerWidth).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.markerWidth).toBe(markerWidth);
		});

		it('Should return 0 by default', () => {
			expect(element.markerWidth.baseVal.value).toBe(0);
			expect(element.markerWidth.animVal.value).toBe(0);
		});

		it('Reflects the "markerWidth" attribute', () => {
			element.setAttribute('markerWidth', '10cm');

			expect(element.markerWidth.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.markerWidth.baseVal.valueAsString).toBe('10cm');
			expect(element.markerWidth.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.markerWidth.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.markerWidth.animVal.valueAsString).toBe('10cm');
			expect(element.markerWidth.animVal.valueInSpecifiedUnits).toBe(10);

			element.markerWidth.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('markerWidth')).toBe('20px');

			expect(() =>
				element.markerWidth.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get markerHeight()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const markerHeight = element.markerHeight;
			expect(markerHeight).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.markerHeight).toBe(markerHeight);
		});

		it('Should return 0 by default', () => {
			expect(element.markerHeight.baseVal.value).toBe(0);
			expect(element.markerHeight.animVal.value).toBe(0);
		});

		it('Reflects the "markerHeight" attribute', () => {
			element.setAttribute('markerHeight', '10cm');

			expect(element.markerHeight.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.markerHeight.baseVal.valueAsString).toBe('10cm');
			expect(element.markerHeight.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.markerHeight.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.markerHeight.animVal.valueAsString).toBe('10cm');
			expect(element.markerHeight.animVal.valueInSpecifiedUnits).toBe(10);

			element.markerHeight.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('markerHeight')).toBe('20px');

			expect(() =>
				element.markerHeight.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get orientType()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const orientType = element.orientType;
			expect(orientType).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.orientType).toBe(orientType);
		});

		it('Should return "auto" as the default value', () => {
			expect(element.orientType.baseVal).toBe(SVGMarkerElement.SVG_MARKER_ORIENT_AUTO);
			expect(element.orientType.animVal).toBe(SVGMarkerElement.SVG_MARKER_ORIENT_AUTO);
		});

		it('Reflects the "orient" attribute for "auto"', () => {
			element.setAttribute('orient', 'auto');

			expect(element.orientType.baseVal).toBe(SVGMarkerElement.SVG_MARKER_ORIENT_AUTO);
			expect(element.orientType.animVal).toBe(SVGMarkerElement.SVG_MARKER_ORIENT_AUTO);

			element.removeAttribute('orient');

			element.orientType.baseVal = SVGMarkerElement.SVG_MARKER_ORIENT_AUTO;

			expect(element.getAttribute('orient')).toBe('auto');

			element.removeAttribute('orient');

			// Does nothing
			element.orientType.animVal = SVGMarkerElement.SVG_MARKER_ORIENT_AUTO;

			expect(element.getAttribute('orient')).toBe(null);
		});

		it('Reflects the "orient" attribute for any angle', () => {
			element.setAttribute('orient', '90deg');

			expect(element.orientType.baseVal).toBe(SVGMarkerElement.SVG_MARKER_ORIENT_ANGLE);
			expect(element.orientType.animVal).toBe(SVGMarkerElement.SVG_MARKER_ORIENT_ANGLE);

			element.removeAttribute('orient');

			element.orientType.baseVal = SVGMarkerElement.SVG_MARKER_ORIENT_ANGLE;

			expect(element.getAttribute('orient')).toBe('0');

			element.removeAttribute('orient');

			// Does nothing
			element.orientType.animVal = SVGMarkerElement.SVG_MARKER_ORIENT_ANGLE;

			expect(element.getAttribute('orient')).toBe(null);
		});

		for (const orient of ['90deg', '1.5708rad', '100grad', '0.25turn']) {
			it(`Reflects the "orient" attribute for "${orient}"`, () => {
				element.setAttribute('orient', orient);

				expect(element.orientType.baseVal).toBe(SVGMarkerElement.SVG_MARKER_ORIENT_ANGLE);
				expect(element.orientType.animVal).toBe(SVGMarkerElement.SVG_MARKER_ORIENT_ANGLE);
			});
		}
	});

	describe('get orientAngle()', () => {
		it('Should return an instance of SVGAnimatedAngle', () => {
			const orientAngle = element.orientAngle;
			expect(orientAngle).toBeInstanceOf(window.SVGAnimatedAngle);
			expect(element.orientAngle).toBe(orientAngle);
		});

		it('Should return 0 by default', () => {
			expect(element.orientAngle.baseVal.value).toBe(0);
			expect(element.orientAngle.baseVal.unitType).toBe(SVGAngle.SVG_ANGLETYPE_UNKNOWN);
			expect(element.orientAngle.animVal.value).toBe(0);
			expect(element.orientAngle.animVal.unitType).toBe(SVGAngle.SVG_ANGLETYPE_UNKNOWN);
		});

		it('Reflects the "orient" attribute', () => {
			element.setAttribute('orient', '90deg');

			expect(element.orientAngle.baseVal.value).toBe(90);
			expect(element.orientAngle.baseVal.unitType).toBe(SVGAngle.SVG_ANGLETYPE_DEG);
			expect(element.orientAngle.baseVal.valueAsString).toBe('90deg');

			expect(element.orientAngle.animVal.value).toBe(90);
			expect(element.orientAngle.animVal.unitType).toBe(SVGAngle.SVG_ANGLETYPE_DEG);
			expect(element.orientAngle.animVal.valueAsString).toBe('90deg');

			element.orientAngle.baseVal.newValueSpecifiedUnits(SVGAngle.SVG_ANGLETYPE_RAD, 1.5708);

			expect(element.getAttribute('orient')).toBe('1.5708rad');

			expect(() =>
				element.orientAngle.animVal.newValueSpecifiedUnits(SVGAngle.SVG_ANGLETYPE_GRAD, 100)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGAngle': The object is read-only.`
				)
			);
		});
	});

	describe('get refX()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const refX = element.refX;
			expect(refX).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.refX).toBe(refX);
		});

		it('Should return 0 by default', () => {
			expect(element.refX.baseVal.value).toBe(0);
			expect(element.refX.animVal.value).toBe(0);
		});

		it('Reflects the "refX" attribute', () => {
			element.setAttribute('refX', '10cm');

			expect(element.refX.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.refX.baseVal.valueAsString).toBe('10cm');
			expect(element.refX.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.refX.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.refX.animVal.valueAsString).toBe('10cm');
			expect(element.refX.animVal.valueInSpecifiedUnits).toBe(10);

			element.refX.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('refX')).toBe('20px');

			expect(() =>
				element.refX.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get refY()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const refY = element.refY;
			expect(refY).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.refY).toBe(refY);
		});

		it('Should return 0 by default', () => {
			expect(element.refY.baseVal.value).toBe(0);
			expect(element.refY.animVal.value).toBe(0);
		});

		it('Reflects the "refY" attribute', () => {
			element.setAttribute('refY', '10cm');

			expect(element.refY.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.refY.baseVal.valueAsString).toBe('10cm');
			expect(element.refY.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.refY.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.refY.animVal.valueAsString).toBe('10cm');
			expect(element.refY.animVal.valueInSpecifiedUnits).toBe(10);

			element.refY.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('refY')).toBe('20px');

			expect(() =>
				element.refY.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get viewBox()', () => {
		it('Returns an instance of SVGAnimatedRect with values from the attribute "viewBox".', () => {
			element.setAttribute('viewBox', '10 20 100 200');

			expect(element.viewBox instanceof window.SVGAnimatedRect).toBe(true);

			expect(element.viewBox.baseVal.x).toBe(10);
			expect(element.viewBox.baseVal.y).toBe(20);
			expect(element.viewBox.baseVal.width).toBe(100);
			expect(element.viewBox.baseVal.height).toBe(200);

			expect(element.viewBox.animVal.x).toBe(10);
			expect(element.viewBox.animVal.y).toBe(20);
			expect(element.viewBox.animVal.width).toBe(100);
			expect(element.viewBox.animVal.height).toBe(200);

			element.viewBox.baseVal.x = 20;
			element.viewBox.baseVal.y = 30;
			element.viewBox.baseVal.width = 200;
			element.viewBox.baseVal.height = 300;

			expect(element.getAttribute('viewBox')).toBe('20 30 200 300');

			expect(() => (element.viewBox.animVal.x = 40)).toThrow(
				new TypeError(`Failed to set the 'x' property on 'SVGRect': The object is read-only.`)
			);
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

	describe('setOrientToAuto()', () => {
		it('Should set the "orient" attribute to "auto"', () => {
			element.setOrientToAuto();
			expect(element.getAttribute('orient')).toBe('auto');
			element.setAttribute('orient', '90deg');
			element.setOrientToAuto();
			expect(element.getAttribute('orient')).toBe('auto');
		});
	});
});
