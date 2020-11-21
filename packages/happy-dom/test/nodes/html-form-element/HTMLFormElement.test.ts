import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement';

describe('HTMLFormElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLFormElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLFormElement>document.createElement('form');
	});

	for (const property of [
		'name',
		'target',
		'action',
		'encoding',
		'enctype',
		'acceptCharset',
		'autocomplete',
		'noValidate'
	]) {
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

	describe('get method()', () => {
		test('Returns attribute value.', () => {
			expect(element.method).toBe('get');
			element.setAttribute('method', 'post');
			expect(element.method).toBe('post');
		});
	});

	describe('set method()', () => {
		test('Sets attribute value.', () => {
			element.method = 'post';
			expect(element.getAttribute('method')).toBe('post');
		});
	});
});
