import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import ISVGSVGElement from '../../../src/nodes/svg-element/ISVGSVGElement.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';
import ISVGElement from '../../../src/nodes/svg-element/ISVGElement.js';
import HTMLElementUtility from '../../../src/nodes/html-element/HTMLElementUtility.js';

describe('SVGElement', () => {
	let window: Window;
	let document: Document;
	let element: ISVGSVGElement;
	let line: ISVGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <ISVGSVGElement>document.createElementNS(NamespaceURI.svg, 'svg');
		line = <ISVGElement>document.createElementNS(NamespaceURI.svg, 'line');
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
			let blurredElement: ISVGElement | null = null;

			jest
				.spyOn(HTMLElementUtility, 'blur')
				.mockImplementation((element: ISVGElement) => (blurredElement = element));

			element.blur();

			expect(blurredElement === element).toBe(true);
		});
	});

	describe('focus()', () => {
		it('Calls HTMLElementUtility.focus().', () => {
			let focusedElement: ISVGElement | null = null;

			jest
				.spyOn(HTMLElementUtility, 'focus')
				.mockImplementation((element: ISVGElement) => (focusedElement = element));

			element.focus();

			expect(focusedElement === element).toBe(true);
		});
	});
});
