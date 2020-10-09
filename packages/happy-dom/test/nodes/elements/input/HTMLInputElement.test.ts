import Window from '../../../../src/window/Window';
import Document from '../../../../src/nodes/basic/document/Document';
import HTMLInputElement from '../../../../src/nodes/elements/input/HTMLInputElement';

const PROPERTIES = {
	name: 'name',
	type: 'type',
	disabled: true,
	autofocus: true,
	required: true,
	value: 'value',
	checked: true,
	indeterminate: true,
	alt: 'alt',
	height: 10,
	src: 'src',
	width: 10,
	accept: 'accept',
	allowdirs: 'allowdirs',
	autocomplete: 'autocomplete',
	min: 'min',
	max: 'max',
	minLength: 10,
	maxLength: 10,
	pattern: 'pattern',
	placeholder: 'placeholder',
	readOnly: true,
	size: 10,
	selectionStart: 10,
	selectionEnd: 10,
	selectionDirection: 'forward',
	defaultValue: 'defaultValue',
	multiple: true,
	step: 'step',
	inputmode: 'inputmode'
};

describe('HTMLInputElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLInputElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLInputElement>document.createElement('input');
	});

	describe('removeAttributeNode()', () => {
		test('Sets properties to its default value.', () => {
			const newInput = <HTMLInputElement>document.createElement('input');

			for (const key of Object.keys(PROPERTIES)) {
				element.setAttribute(key, PROPERTIES[key]);
				element.removeAttribute(key);
				expect(element[key]).toBe(newInput[key]);
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
