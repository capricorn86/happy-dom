import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLButtonElement from '../../../src/nodes/html-button-element/HTMLButtonElement';

describe('HTMLButtonElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLButtonElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLButtonElement>document.createElement('button');
	});

	describe('get value()', () => {
		it(`Returns the attribute "value".`, () => {
			element.setAttribute('value', 'VALUE');
			expect(element.value).toBe('VALUE');
		});
	});

	describe('set value()', () => {
		it(`Sets the attribute "value".`, () => {
			element.value = 'VALUE';
			expect(element.getAttribute('value')).toBe('VALUE');
		});
	});

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

	describe('get type()', () => {
		it(`Defaults to "submit".`, () => {
			expect(element.type).toBe('submit');
		});

		it(`Returns the attribute "type".`, () => {
			element.setAttribute('type', 'menu');
			expect(element.type).toBe('menu');
		});

		it(`Sanitizes the value before returning.`, () => {
			element.setAttribute('type', 'reset');
			expect(element.type).toBe('reset');

			element.setAttribute('type', 'button');
			expect(element.type).toBe('button');

			element.setAttribute('type', 'submit');
			expect(element.type).toBe('submit');

			element.setAttribute('type', 'MeNu');
			expect(element.type).toBe('menu');

			element.setAttribute('type', 'foobar');
			expect(element.type).toBe('submit');
		});
	});

	describe('set type()', () => {
		it(`Sets the attribute "type" after sanitizing.`, () => {
			element.type = 'SuBmIt';
			expect(element.getAttribute('type')).toBe('submit');

			element.type = 'reset';
			expect(element.getAttribute('type')).toBe('reset');

			element.type = 'button';
			expect(element.getAttribute('type')).toBe('button');

			element.type = 'menu';
			expect(element.getAttribute('type')).toBe('menu');

			element.type = null;
			expect(element.getAttribute('type')).toBe('submit');
		});
	});
});
