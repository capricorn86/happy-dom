import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLTextAreaElement from '../../../src/nodes/html-text-area-element/HTMLTextAreaElement';

const PROPERTIES = {
	name: 'name',
	disabled: true,
	autofocus: true,
	required: true,
	value: 'value',
	autocomplete: 'autocomplete',
	cols: 'cols',
	rows: 'rows',
	minLength: 10,
	maxLength: 10,
	placeholder: 'placeholder',
	readOnly: true
};

describe('HTMLTextAreaElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTextAreaElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLTextAreaElement>document.createElement('textarea');
	});

	describe('removeAttributeNode()', () => {
		test('Sets properties to its default value.', () => {
			const newTextarea = <HTMLTextAreaElement>document.createElement('textarea');

			for (const key of Object.keys(PROPERTIES)) {
				element.setAttribute(key, PROPERTIES[key]);
				element.removeAttribute(key);
				expect(element[key]).toBe(newTextarea[key]);
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
