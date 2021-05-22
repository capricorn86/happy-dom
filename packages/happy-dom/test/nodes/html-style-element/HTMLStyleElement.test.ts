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
			it(`Returns the "${property}" attribute.`, () => {
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	describe(`get disabled()`, () => {
		it('Returns attribute value.', () => {
			expect(element.disabled).toBe(false);
			element.setAttribute('disabled', '');
			expect(element.disabled).toBe(true);
		});
	});

	describe(`set disabled()`, () => {
		it('Sets attribute value.', () => {
			element.disabled = true;
			expect(element.getAttribute('disabled')).toBe('');
		});
	});

	describe(`get sheet()`, () => {
		it('Returns "null" if not connected to DOM.', () => {
			expect(element.sheet).toBe(null);
		});

		it('Returns an CSSStyleSheet instance with its text content as style rules.', () => {
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
