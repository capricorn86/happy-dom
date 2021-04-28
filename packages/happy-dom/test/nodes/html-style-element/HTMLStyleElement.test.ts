import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLStyleElement from '../../../src/nodes/html-style-element/HTMLStyleElement';

describe('HTMLStyleElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLStyleElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLStyleElement>document.createElement('style');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	for (const property of ['media', 'type']) {
		describe(`get ${property}()`, () => {
			test(`Returns the "${property}" attribute.`, () => {
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			test(`Sets the attribute "${property}".`, () => {
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	describe(`get disabled()`, () => {
		test('Returns attribute value.', () => {
			expect(element.disabled).toBe(false);
			element.setAttribute('disabled', '');
			expect(element.disabled).toBe(true);
		});
	});

	describe(`set disabled()`, () => {
		test('Sets attribute value.', () => {
			element.disabled = true;
			expect(element.getAttribute('disabled')).toBe('');
		});
	});

	describe(`get sheet()`, () => {
		test('Returns "null" if not connected to DOM.', () => {
			expect(element.sheet).toBe(null);
		});

		test('Returns an CSSStyleSheet instance with its text content as style rules.', () => {
			const textNode = document.createTextNode(
				'body { background-color: red }\ndiv { background-color: green }'
			);
			element.appendChild(textNode);
			document.head.appendChild(element);
			expect(element.sheet.cssRules.length).toBe(2);
			expect(element.sheet.cssRules[0].cssText).toBe('body { background-color: red; }');
			expect(element.sheet.cssRules[1].cssText).toBe('div { background-color: green; }');
		});
	});
});
