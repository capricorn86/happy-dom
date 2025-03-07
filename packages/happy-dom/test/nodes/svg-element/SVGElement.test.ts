import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import SVGSVGElement from '../../../src/nodes/svg-svg-element/SVGSVGElement.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import HTMLElementUtility from '../../../src/nodes/html-element/HTMLElementUtility.js';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import Element from '../../../src/nodes/element/Element.js';
import Event from '../../../src/event/Event.js';

describe('SVGElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'unknown');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});

		it('Should be an instanceof Element', () => {
			expect(element instanceof Element).toBe(true);
		});
	});

	for (const event of [
		'abort',
		'animationend',
		'animationiteration',
		'animationstart',
		'blur',
		'canplay',
		'canplaythrough',
		'change',
		'click',
		'close',
		'contextmenu',
		'copy',
		'cuechange',
		'cut',
		'dblclick',
		'drag',
		'dragend',
		'dragenter',
		'dragleave',
		'dragover',
		'dragstart',
		'drop',
		'durationchange',
		'emptied',
		'ended',
		'error',
		'focus',
		'formdata',
		'gotpointercapture',
		'input',
		'invalid',
		'keydown',
		'keypress',
		'keyup',
		'load',
		'loadeddata',
		'loadedmetadata',
		'loadstart',
		'lostpointercapture',
		'mousedown',
		'mouseenter',
		'mouseleave',
		'mousemove',
		'mouseout',
		'mouseover',
		'mouseup',
		'mousewheel',
		'paste',
		'pause',
		'play',
		'playing',
		'pointercancel',
		'pointerdown',
		'pointerenter',
		'pointerleave',
		'pointermove',
		'pointerout',
		'pointerover',
		'pointerrawupdate',
		'pointerup',
		'progress',
		'ratechange',
		'reset',
		'resize',
		'scroll',
		'scrollend',
		'scrollsnapchange',
		'scrollsnapchanging',
		'securitypolicyviolation',
		'seeked',
		'seeking',
		'select',
		'selectionchange',
		'selectstart',
		'slotchange',
		'stalled',
		'submit',
		'suspend',
		'timeupdate',
		'toggle',
		'transitioncancel',
		'transitionend',
		'transitionrun',
		'transitionstart',
		'volumechange',
		'waiting',
		'wheel'
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

	describe('get ownerSVGElement()', () => {
		it('Returns the owner SVG element.', () => {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			svg.appendChild(rect);
			rect.appendChild(element);
			expect(element.ownerSVGElement).toBe(svg);
		});
	});

	describe('get viewportElement()', () => {
		it('Returns the viewport element.', () => {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			svg.appendChild(rect);
			rect.appendChild(element);
			expect(element.viewportElement).toBe(svg);
		});
	});

	describe('get dataset()', () => {
		it('Returns a Proxy behaving like an object that can add, remove, set and get element attributes prefixed with "data-".', () => {
			element.setAttribute('test-alpha', 'value1');
			element.setAttribute('data-test-alpha', 'value2');
			element.setAttribute('test-beta', 'value3');
			element.setAttribute('data-test-beta', 'value4');

			const dataset = element.dataset;

			expect(dataset).toBe(element.dataset);
			expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta']);
			expect(Object.values(dataset)).toEqual(['value2', 'value4']);

			dataset.testGamma = 'value5';

			expect(element.getAttribute('data-test-gamma')).toBe('value5');
			expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma']);
			expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5']);

			element.setAttribute('data-test-delta', 'value6');

			expect(dataset.testDelta).toBe('value6');
			expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma', 'testDelta']);
			expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5', 'value6']);

			delete dataset.testDelta;

			expect(element.getAttribute('data-test-delta')).toBe(null);
			expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma']);
			expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5']);
		});
	});

	describe('get style()', () => {
		it('Returns an instance of CSSStyleDeclaration.', () => {
			const style = element.style;

			expect(style).toBeInstanceOf(window.CSSStyleDeclaration);
			expect(element.style).toBe(style);

			style.border = '1px solid red';

			expect(element.getAttribute('style')).toBe('border: 1px solid red;');

			element.setAttribute('style', 'color: blue;');

			expect(style.color).toBe('blue');
		});

		it('Returns correct style properties.', () => {
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

	describe('get tabIndex()', () => {
		it('Returns the attribute "tabindex" as a number.', () => {
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			element.tabIndex = 5;
			expect(element.getAttribute('tabindex')).toBe('5');
		});

		it('Removes the attribute "tabindex" when set to "-1".', () => {
			element.tabIndex = 5;
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe(null);
		});
	});

	describe('blur()', () => {
		it('Calls HTMLElementUtility.blur().', () => {
			let blurredElement: SVGElement | null = null;

			vi.spyOn(HTMLElementUtility, 'blur').mockImplementation(
				(element: SVGElement | HTMLElement) => {
					blurredElement = <SVGElement>element;
				}
			);

			element.blur();

			expect(blurredElement === element).toBe(true);
		});
	});

	describe('focus()', () => {
		it('Calls HTMLElementUtility.focus().', () => {
			let focusedElement: SVGElement | null = null;

			vi.spyOn(HTMLElementUtility, 'focus').mockImplementation(
				(element: SVGElement | HTMLElement) => {
					focusedElement = <SVGElement>element;
				}
			);

			element.focus();

			expect(focusedElement === element).toBe(true);
		});
	});
});
