import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLOptionElement from '../../../src/nodes/html-option-element/HTMLOptionElement';

describe('HTMLOptionElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLOptionElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLOptionElement>document.createElement('option');
	});

	describe('get value()', () => {
		it('Returns the attribute "value".', () => {
			element.setAttribute('value', 'VALUE');
			expect(element.value).toBe('VALUE');
		});
	});

	describe('set value()', () => {
		it('Sets the attribute "value".', () => {
			element.value = 'VALUE';
			expect(element.getAttribute('value')).toBe('VALUE');
		});

		it('Trims and removes new lines.', () => {
			element.value = '  \n\rtest  ';
			expect(element.value).toBe('test');
		});
	});

	for (const property of ['disabled', 'selected']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe(false);
				element.setAttribute(property, '');
				expect(element[property]).toBe(true);
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = true;
				expect(element.getAttribute(property)).toBe('');
			});
		});
	}
});
