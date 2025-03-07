import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import SVGSVGElement from '../../../src/nodes/svg-svg-element/SVGSVGElement.js';
import SVGRect from '../../../src/svg/SVGRect.js';
import SVGPoint from '../../../src/svg/SVGPoint.js';
import SVGAnimatedRect from '../../../src/svg/SVGAnimatedRect.js';
import SVGNumber from '../../../src/svg/SVGNumber.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGAngle from '../../../src/svg/SVGAngle.js';
import SVGTransform from '../../../src/svg/SVGTransform.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import SVGPreserveAspectRatioAlignEnum from '../../../src/svg/SVGPreserveAspectRatioAlignEnum.js';
import SVGPreserveAspectRatioMeetOrSliceEnum from '../../../src/svg/SVGPreserveAspectRatioMeetOrSliceEnum.js';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';
import Element from '../../../src/nodes/element/Element.js';
import NodeList from '../../../src/nodes/node/NodeList.js';
import SVGMatrix from '../../../src/svg/SVGMatrix.js';
import Event from '../../../src/event/Event.js';

describe('SVGSVGElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGSVGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	});

	for (const event of [
		'afterprint',
		'beforeprint',
		'beforeunload',
		'gamepadconnected',
		'gamepaddisconnected',
		'hashchange',
		'languagechange',
		'message',
		'messageerror',
		'offline',
		'online',
		'pagehide',
		'pageshow',
		'popstate',
		'rejectionhandled',
		'storage',
		'unhandledrejection',
		'unload'
	]) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

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

	describe('get currentScale()', () => {
		it('Returns current scale.', () => {
			expect(element.currentScale).toBe(1);
			element.currentScale = 2;
			expect(element.currentScale).toBe(2);
		});
	});

	describe('set currentScale()', () => {
		it('Sets current scale.', () => {
			element.currentScale = 3;
			expect(element.currentScale).toBe(3);
		});

		it('Ignores values less than 1', () => {
			element.currentScale = 0;
			expect(element.currentScale).toBe(1);
			element.currentScale = -1;
			expect(element.currentScale).toBe(1);
		});

		it('Throws an error if the value resolves to NaN', () => {
			expect(() => (element.currentScale = <number>(<unknown>'foo'))).toThrow(
				new TypeError(
					`Failed to set the 'currentScale' property on 'SVGSVGElement': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get currentTranslate()', () => {
		it('Returns an instanceof SVGPoint.', () => {
			expect(element.currentTranslate instanceof SVGPoint).toBe(true);
		});
	});

	describe('get viewBox()', () => {
		it('Returns an instance of SVGAnimatedRect with values from the attribute "viewBox".', () => {
			element.setAttribute('viewBox', '10 20 100 200');

			expect(element.viewBox instanceof SVGAnimatedRect).toBe(true);

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

	describe('pauseAnimations()', () => {
		it('Exists and does nothing.', () => {
			expect(typeof element.pauseAnimations).toBe('function');
			element.pauseAnimations();
		});
	});

	describe('unpauseAnimations()', () => {
		it('Exists and does nothing.', () => {
			expect(typeof element.unpauseAnimations).toBe('function');
			element.unpauseAnimations();
		});
	});

	describe('getCurrentTime()', () => {
		it('Returns "0".', () => {
			expect(element.getCurrentTime()).toBe(0);
		});
	});

	describe('setCurrentTime()', () => {
		it('Exists and does nothing.', () => {
			expect(typeof element.setCurrentTime).toBe('function');
			element.setCurrentTime(1);
		});
	});

	describe('getIntersectionList()', () => {
		it('Returns an empty NodeList.', () => {
			const result = element.getIntersectionList(
				element.createSVGRect(),
				document.createElementNS('http://www.w3.org/2000/svg', 'rect')
			);
			expect(result).instanceOf(NodeList);
			expect(result.length).toBe(0);
		});
	});

	describe('getEnclosureList()', () => {
		it('Returns an empty NodeList.', () => {
			const result = element.getEnclosureList(
				element.createSVGRect(),
				document.createElementNS('http://www.w3.org/2000/svg', 'rect')
			);
			expect(result).instanceOf(NodeList);
			expect(result.length).toBe(0);
		});
	});

	describe('checkIntersection()', () => {
		it('Returns "false".', () => {
			expect(
				element.checkIntersection(
					document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
					element.createSVGRect()
				)
			).toBe(false);
		});
	});

	describe('checkEnclosure()', () => {
		it('Returns "false".', () => {
			expect(
				element.checkEnclosure(
					document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
					element.createSVGRect()
				)
			).toBe(false);
		});
	});

	describe('deselectAll()', () => {
		it('Exists and does nothing.', () => {
			expect(typeof element.deselectAll).toBe('function');
			element.deselectAll();
		});
	});

	describe('createSVGNumber()', () => {
		it('Returns an instance of SVGNumber.', () => {
			expect(element.createSVGNumber() instanceof SVGNumber).toBe(true);
		});
	});

	describe('createSVGLength()', () => {
		it('Returns an instance of SVGLength.', () => {
			expect(element.createSVGLength() instanceof SVGLength).toBe(true);
		});
	});

	describe('createSVGAngle()', () => {
		it('Returns an instance of SVGAngle.', () => {
			expect(element.createSVGAngle() instanceof SVGAngle).toBe(true);
		});
	});

	describe('createSVGPoint()', () => {
		it('Returns an instance of SVGPoint.', () => {
			expect(element.createSVGPoint() instanceof SVGPoint).toBe(true);
		});
	});

	describe('createSVGMatrix()', () => {
		it('Returns an instance of SVGMatrix.', () => {
			expect(element.createSVGMatrix() instanceof SVGMatrix).toBe(true);
		});
	});

	describe('createSVGRect()', () => {
		it('Returns an instance of SVGRect.', () => {
			expect(element.createSVGRect() instanceof SVGRect).toBe(true);
		});
	});

	describe('createSVGTransform()', () => {
		it('Returns an instance of SVGTransform.', () => {
			expect(element.createSVGTransform() instanceof SVGTransform).toBe(true);
		});
	});

	describe('createSVGTransformFromMatrix()', () => {
		it('Returns an instance of SVGTransform.', () => {
			const matrix = element.createSVGMatrix();
			const transform = element.createSVGTransformFromMatrix(matrix);
			expect(transform instanceof SVGTransform).toBe(true);
			expect(transform.matrix === matrix).toBe(true);
		});
	});

	describe('getElementsByClassName()', () => {
		it('Returns an elements by class name.', () => {
			const resultElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			const className = 'className';

			vi.spyOn(ParentNodeUtility, 'getElementsByClassName').mockImplementation(
				(parentNode, requestedClassName) => {
					expect(parentNode === element).toBe(true);
					expect(requestedClassName).toEqual(className);
					return new HTMLCollection(PropertySymbol.illegalConstructor, () => [resultElement]);
				}
			);

			const result = element.getElementsByClassName(className);
			expect(result.length).toBe(1);
			expect(result[0] === resultElement).toBe(true);
		});
	});

	describe('getElementsByTagName()', () => {
		it('Returns an elements by tag name.', () => {
			const resultElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			const tagName = 'tag-name';

			vi.spyOn(ParentNodeUtility, 'getElementsByTagName').mockImplementation(
				(parentNode, requestedTagName) => {
					expect(parentNode === element).toBe(true);
					expect(requestedTagName).toEqual(tagName);
					return new HTMLCollection(PropertySymbol.illegalConstructor, () => [resultElement]);
				}
			);

			const result = element.getElementsByTagName(tagName);
			expect(result.length).toBe(1);
			expect(result[0] === resultElement).toBe(true);
		});
	});

	describe('getElementsByTagNameNS()', () => {
		it('Returns an elements by tag name and namespace.', () => {
			const resultElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			const tagName = 'tag-name';
			const namespaceURI = '/namespace/uri/';

			vi.spyOn(ParentNodeUtility, 'getElementsByTagNameNS').mockImplementation(
				(parentNode, requestedNamespaceURI, requestedTagName) => {
					expect(parentNode === element).toBe(true);
					expect(requestedNamespaceURI).toEqual(namespaceURI);
					expect(requestedTagName).toEqual(tagName);
					return <HTMLCollection<Element>>(<unknown>[resultElement]);
				}
			);

			const result = element.getElementsByTagNameNS(namespaceURI, tagName);

			expect(result.length).toBe(1);
			expect(result[0] === resultElement).toBe(true);
		});
	});

	describe('getElementById()', () => {
		it('Returns an element by ID.', () => {
			const resultElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			const id = 'id';

			vi.spyOn(ParentNodeUtility, 'getElementById').mockImplementation(
				(parentNode, requestedID) => {
					expect(parentNode === element).toBe(true);
					expect(requestedID).toEqual(id);
					return resultElement;
				}
			);

			expect(element.getElementById(id) === resultElement).toBe(true);
		});
	});
});
