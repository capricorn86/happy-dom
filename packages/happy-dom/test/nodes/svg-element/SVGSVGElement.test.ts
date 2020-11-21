import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import SVGSVGElement from '../../../src/nodes/svg-element/SVGSVGElement';
import NamespaceURI from '../../../src/config/NamespaceURI';
import SVGRect from '../../../src/nodes/svg-element/SVGRect';
import SVGPoint from '../../../src/nodes/svg-element/SVGPoint';
import SVGAnimatedRect from '../../../src/nodes/svg-element/SVGAnimatedRect';
import SVGNumber from '../../../src/nodes/svg-element/SVGNumber';
import SVGLength from '../../../src/nodes/svg-element/SVGLength';
import SVGAngle from '../../../src/nodes/svg-element/SVGAngle';
import SVGTransform from '../../../src/nodes/svg-element/SVGTransform';

describe('SVGSVGElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGSVGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <SVGSVGElement>document.createElementNS(NamespaceURI.svg, 'svg');
	});

	for (const property of ['width', 'height', 'x', 'y', 'contentScriptType']) {
		describe(`get ${property}()`, () => {
			test('Returns attribute value.', () => {
				expect(element[property]).toBe('');
				element.setAttribute(property, 'value');
				expect(element[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			test('Sets attribute value.', () => {
				element[property] = 'value';
				expect(element.getAttribute(property)).toBe('value');
			});
		});
	}

	describe('get preserveAspectRatio()', () => {
		test('Returns attribute value.', () => {
			expect(element.preserveAspectRatio).toBe('xMidYMid meet');
			element.setAttribute('preserveAspectRatio', 'xMidYMin');
			expect(element.preserveAspectRatio).toBe('xMidYMin');
		});
	});

	describe('set preserveAspectRatio()', () => {
		test('Sets attribute value.', () => {
			element.preserveAspectRatio = 'xMidYMin';
			expect(element.getAttribute('preserveAspectRatio')).toBe('xMidYMin');
		});
	});

	describe('get currentScale()', () => {
		test('Returns attribute value.', () => {
			expect(element.currentScale).toBe(1);
			element.currentScale = 2;
			expect(element.currentScale).toBe(2);
		});
	});

	describe('set currentScale()', () => {
		test('Sets attribute value.', () => {
			element.setAttribute('currentScale', '2');
			expect(element.currentScale).toBe(2);
			element.currentScale = 3;
			expect(element.currentScale).toBe(3);
			expect(element.getAttribute('currentScale')).toBe('3');
		});
	});

	describe('get viewport()', () => {
		test('Returns an instanceof SVGRect.', () => {
			expect(element.viewport instanceof SVGRect).toBe(true);
		});
	});

	describe('get currentTranslate()', () => {
		test('Returns an instanceof SVGPoint.', () => {
			expect(element.currentTranslate instanceof SVGPoint).toBe(true);
		});
	});

	describe('get viewBox()', () => {
		test('Returns an instanceof SVGAnimatedRect with values from the attribute "viewBox".', () => {
			element.setAttribute('viewBox', '0 0 100 100');
			expect(element.viewBox instanceof SVGAnimatedRect).toBe(true);
			expect(element.viewBox.baseVal).toEqual({
				x: 0,
				y: 0,
				width: 100,
				height: 100
			});
		});
	});

	describe('pauseAnimations()', () => {
		test('Exists and does nothing.', () => {
			expect(typeof element.pauseAnimations).toBe('function');
			element.pauseAnimations();
		});
	});

	describe('unpauseAnimations()', () => {
		test('Exists and does nothing.', () => {
			expect(typeof element.unpauseAnimations).toBe('function');
			element.unpauseAnimations();
		});
	});

	describe('getCurrentTime()', () => {
		test('Returns "0".', () => {
			expect(element.getCurrentTime()).toBe(0);
		});
	});

	describe('setCurrentTime()', () => {
		test('Exists and does nothing.', () => {
			expect(typeof element.setCurrentTime).toBe('function');
			element.setCurrentTime();
		});
	});

	describe('getIntersectionList()', () => {
		test('Returns an empty Array.', () => {
			expect(element.getIntersectionList()).toEqual([]);
		});
	});

	describe('getEnclosureList()', () => {
		test('Returns an empty Array.', () => {
			expect(element.getEnclosureList()).toEqual([]);
		});
	});

	describe('checkIntersection()', () => {
		test('Returns "false".', () => {
			expect(element.checkIntersection()).toBe(false);
		});
	});

	describe('checkEnclosure()', () => {
		test('Returns "false".', () => {
			expect(element.checkEnclosure()).toBe(false);
		});
	});

	describe('deselectAll()', () => {
		test('Exists and does nothing.', () => {
			expect(typeof element.deselectAll).toBe('function');
			element.deselectAll();
		});
	});

	describe('createSVGNumber()', () => {
		test('Returns an instance of SVGNumber.', () => {
			expect(element.createSVGNumber() instanceof SVGNumber).toBe(true);
		});
	});

	describe('createSVGLength()', () => {
		test('Returns an instance of SVGLength.', () => {
			expect(element.createSVGLength() instanceof SVGLength).toBe(true);
		});
	});

	describe('createSVGAngle()', () => {
		test('Returns an instance of SVGAngle.', () => {
			expect(element.createSVGAngle() instanceof SVGAngle).toBe(true);
		});
	});

	describe('createSVGPoint()', () => {
		test('Returns an instance of SVGPoint.', () => {
			expect(element.createSVGPoint() instanceof SVGPoint).toBe(true);
		});
	});

	describe('createSVGRect()', () => {
		test('Returns an instance of SVGRect.', () => {
			expect(element.createSVGRect() instanceof SVGRect).toBe(true);
		});
	});

	describe('createSVGTransform()', () => {
		test('Returns an instance of SVGTransform.', () => {
			expect(element.createSVGTransform() instanceof SVGTransform).toBe(true);
		});
	});
});
