import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import SVGSVGElement from '../../../src/nodes/svg-svg-element/SVGSVGElement.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import HTMLElementUtility from '../../../src/nodes/html-element/HTMLElementUtility.js';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';

describe('SVGElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGSVGElement;
	let line: SVGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <SVGSVGElement>document.createElementNS(NamespaceURI.svg, 'svg');
		line = <SVGElement>document.createElementNS(NamespaceURI.svg, 'line');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get ownerSVGElement()', () => {
		it('Returns svg element when append to some svg.', () => {
			element.append(line);
			const ownerSVG = line.ownerSVGElement;
			expect(ownerSVG).toBe(element);
		});

		it('Returns null when dangling.', () => {
			const ownerSVG = line.ownerSVGElement;
			expect(ownerSVG).toBe(null);
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
