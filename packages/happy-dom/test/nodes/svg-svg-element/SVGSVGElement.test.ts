import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import SVGSVGElement from '../../../src/nodes/svg-svg-element/SVGSVGElement.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';
import SVGRect from '../../../src/svg/SVGRect.js';
import SVGPoint from '../../../src/svg/SVGPoint.js';
import SVGAnimatedRect from '../../../src/svg/SVGAnimatedRect.js';
import SVGNumber from '../../../src/svg/SVGNumber.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGAngle from '../../../src/svg/SVGAngle.js';
import SVGTransform from '../../../src/svg/SVGTransform.js';
import { beforeEach, describe, it, expect } from 'vitest';

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
			it('Returns attribute value.', () => {
				expect(element[property]).toBe('');
				element.setAttribute(property, 'value');
				expect(element[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = 'value';
				expect(element.getAttribute(property)).toBe('value');
			});
		});
	}

	describe('get preserveAspectRatio()', () => {
		it('Returns attribute value.', () => {
			expect(element.preserveAspectRatio).toBe('xMidYMid meet');
			element.setAttribute('preserveAspectRatio', 'xMidYMin');
			expect(element.preserveAspectRatio).toBe('xMidYMin');
		});
	});

	describe('set preserveAspectRatio()', () => {
		it('Sets attribute value.', () => {
			element.preserveAspectRatio = 'xMidYMin';
			expect(element.getAttribute('preserveAspectRatio')).toBe('xMidYMin');
		});
	});

	describe('get currentScale()', () => {
		it('Returns attribute value.', () => {
			expect(element.currentScale).toBe(1);
			element.currentScale = 2;
			expect(element.currentScale).toBe(2);
		});
	});

	describe('set currentScale()', () => {
		it('Sets attribute value.', () => {
			element.setAttribute('currentScale', '2');
			expect(element.currentScale).toBe(2);
			element.currentScale = 3;
			expect(element.currentScale).toBe(3);
			expect(element.getAttribute('currentScale')).toBe('3');
		});
	});

	describe('get currentTranslate()', () => {
		it('Returns an instanceof SVGPoint.', () => {
			expect(element.currentTranslate instanceof SVGPoint).toBe(true);
		});
	});

	describe('get viewBox()', () => {
		it('Returns an instanceof SVGAnimatedRect with values from the attribute "viewBox".', () => {
			element.setAttribute('viewBox', '10 20 100 200');
			expect(element.viewBox instanceof SVGAnimatedRect).toBe(true);
			expect(element.viewBox.baseVal.x).toBe(10);
			expect(element.viewBox.baseVal.y).toBe(20);
			expect(element.viewBox.baseVal.width).toBe(100);
			expect(element.viewBox.baseVal.height).toBe(200);
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
			element.setCurrentTime();
		});
	});

	describe('getIntersectionList()', () => {
		it('Returns an empty Array.', () => {
			expect(element.getIntersectionList()).toEqual([]);
		});
	});

	describe('getEnclosureList()', () => {
		it('Returns an empty Array.', () => {
			expect(element.getEnclosureList()).toEqual([]);
		});
	});

	describe('checkIntersection()', () => {
		it('Returns "false".', () => {
			expect(element.checkIntersection()).toBe(false);
		});
	});

	describe('checkEnclosure()', () => {
		it('Returns "false".', () => {
			expect(element.checkEnclosure()).toBe(false);
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

	describe('get style()', () => {
		it('Returns styles.', () => {
			element.setAttribute('style', 'border-radius: 2px; padding: 2px;');
			expect(element.style.length).toEqual(8);
			expect(element.style[0]).toEqual('border-top-left-radius');
			expect(element.style[1]).toEqual('border-top-right-radius');
			expect(element.style[2]).toEqual('border-bottom-right-radius');
			expect(element.style[3]).toEqual('border-bottom-left-radius');
			expect(element.style[4]).toEqual('padding-top');
			expect(element.style[5]).toEqual('padding-right');
			expect(element.style[6]).toEqual('padding-bottom');
			expect(element.style[7]).toEqual('padding-left');
			expect(element.style.borderRadius).toEqual('2px');
			expect(element.style.padding).toEqual('2px');
			expect(element.style.cssText).toEqual('border-radius: 2px; padding: 2px;');

			element.setAttribute('style', 'border-radius: 4px; padding: 4px;');
			expect(element.style.length).toEqual(8);
			expect(element.style[0]).toEqual('border-top-left-radius');
			expect(element.style[1]).toEqual('border-top-right-radius');
			expect(element.style[2]).toEqual('border-bottom-right-radius');
			expect(element.style[3]).toEqual('border-bottom-left-radius');
			expect(element.style[4]).toEqual('padding-top');
			expect(element.style[5]).toEqual('padding-right');
			expect(element.style[6]).toEqual('padding-bottom');
			expect(element.style[7]).toEqual('padding-left');
			expect(element.style.borderRadius).toEqual('4px');
			expect(element.style.padding).toEqual('4px');
			expect(element.style.cssText).toEqual('border-radius: 4px; padding: 4px;');
		});
	});
	describe('removeAttributeNode()', () => {
		it('Removes property from CSSStyleDeclaration.', () => {
			element.style.background = 'green';
			element.style.color = 'black';
			element.removeAttribute('style');
			expect(element.style.length).toEqual(0);
			expect(element.style.cssText).toEqual('');
		});
	});
});
