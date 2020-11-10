import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement';

const PROPERTIES = {
	name: '',
	method: 'get',
	target: '',
	action: '',
	encoding: '',
	enctype: '',
	acceptCharset: '',
	autocomplete: '',
	noValidate: ''
};

describe('HTMLFormElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLFormElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLFormElement>document.createElement('form');
	});

	describe('removeAttributeNode()', () => {
		test('Sets properties to its default value.', () => {
			const newForm = <HTMLFormElement>document.createElement('form');

			for (const key of Object.keys(PROPERTIES)) {
				element.setAttribute(key, PROPERTIES[key]);
				element.removeAttribute(key);
				expect(element[key]).toBe(newForm[key]);
			}
		});
	});

	describe('setAttributeNode()', () => {
		test('Sets attributes as properties.', () => {
			for (const key of Object.keys(PROPERTIES)) {
				element.setAttribute(key, PROPERTIES[key]);
				expect(element[key]).toBe(PROPERTIES[key]);
			}
		});
	});
});
