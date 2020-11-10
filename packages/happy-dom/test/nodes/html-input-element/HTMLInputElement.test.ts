import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement';
import File from '../../../src/file/File';
import HTMLInputElementSelectionModeEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionModeEnum';

const PROPERTIES = {
	name: 'name',
	type: 'type',
	disabled: true,
	autofocus: true,
	required: true,
	checked: true,
	indeterminate: true,
	alt: 'alt',
	height: 10,
	src: 'src',
	value: 'value',
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

	describe('get value()', () => {
		for (const type of ['hidden', 'submit', 'image', 'reset', 'button']) {
			test(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.value).toBe('VALUE');
			});
		}

		for (const type of ['checkbox', 'radio']) {
			test(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.value).toBe('VALUE');
			});

			test(`Returns "on" if the attribute "value" has not been set and type is "${type}".`, () => {
				element.type = type;
				expect(element.value).toBe('on');
			});
		}

		for (const type of ['text', 'search', 'url', 'tel', 'password']) {
			test(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.selectionStart).toBe(5);
				expect(element.selectionEnd).toBe(5);
				expect(element.value).toBe('VALUE');
			});
		}

		test('Returns "/fake/path/[filename]" if type is "file".', () => {
			const file = new File(['TEST'], 'filename.jpg');
			element.type = 'file';
			element.files.push(file);
			expect(element.value).toBe('/fake/path/filename.jpg');
		});
	});

	describe('set value()', () => {
		for (const type of ['hidden', 'submit', 'image', 'reset', 'button', 'checkbox', 'radio']) {
			test(`Sets the attribute "value" to the value if type is "${type}".`, () => {
				element.type = type;
				element.value = 'VALUE';
				expect(element.getAttribute('value')).toBe('VALUE');
			});
		}

		test('Throws an exception if a value other than empty string is provided and type is "file".', () => {
			element.type = 'file';
			expect(() => {
				element.value = 'TEST';
			}).toThrow(
				'Input elements of type "file" may only programmatically set the value to empty string.'
			);
		});

		test('Accepts an empty string if type is "file".', () => {
			element.type = 'file';
			element.value = '';
		});

		test('Trims the value if type is "email".', () => {
			element.type = 'email';
			element.value = '  \n\rtest@test.com  ';
			expect(element.value).toBe('test@test.com');
		});

		test('Trims each email address in the value if type is "email" and "multiple" is set to "true".', () => {
			element.type = 'email';
			element.setAttribute('multiple', 'multiple');
			element.value = '  \n\rtest@test.com , test2@test.com  ';

			expect(element.value).toBe('test@test.com,test2@test.com');
		});

		for (const type of ['password', 'search', 'tel', 'text']) {
			test(`Removes new lines if type is "${type}".`, () => {
				element.type = type;
				element.value = '\n\rVALUE\n\r';
				expect(element.value).toBe('VALUE');
			});
		}

		test('Sets the value if the value is a valid hex code and type is "color".', () => {
			element.type = 'color';
			element.value = '#333333';
			expect(element.value).toBe('#333333');
		});

		test('Sets the value to "#000000" if the value is not a valid hex code and type is "color".', () => {
			element.type = 'color';
			element.value = 'test';
			expect(element.value).toBe('#000000');
			element.value = '#111';
			expect(element.value).toBe('#000000');
		});

		test('Sets the value if it is a valid number and type is "number".', () => {
			element.type = 'number';
			element.value = '10';
			expect(element.value).toBe('10');
		});

		test('Sets the value to empty string if the value is not a valid number and type is "number".', () => {
			element.type = 'number';
			element.value = 'test';
			expect(element.value).toBe('');
		});

		test('Sets the value to "50" if no min or max has been set, the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.value = 'test';
			expect(element.value).toBe('50');
		});

		test('Sets the value to "25" if max has been set to "50", the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.max = '50';
			element.value = 'test';
			expect(element.value).toBe('25');
		});

		test('Sets the value to "40" if min is set to "20" and max is set to "60", the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.min = '20';
			element.max = '60';
			element.value = 'test';
			expect(element.value).toBe('40');
		});

		test('Sets the value to "40" if min is set to "40", the value is out of range and the type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '20';
			expect(element.value).toBe('40');
		});

		test('Sets the value to "80" if max is set to "80", the value is out of range and the type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '100';
			expect(element.value).toBe('80');
		});

		test('Sets the value if it is valid, within range and type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '60';
			expect(element.value).toBe('60');
		});

		test('Trims and removes new lines if type is "url".', () => {
			element.type = 'url';
			element.value = '  \n\rhttp://www.test.com\n\r ';
			expect(element.value).toBe('http://www.test.com');
		});
	});

	describe('setSelectionRange()', () => {
		test('Sets selection range.', () => {
			element.value = 'TEST_VALUE';
			element.setSelectionRange(1, 5, 'forward');
			expect(element.selectionStart).toBe(1);
			expect(element.selectionEnd).toBe(5);
			expect(element.selectionDirection).toBe('forward');
		});

		test('Sets selection end to the value length if out of range.', () => {
			element.value = 'TEST_VALUE';
			element.setSelectionRange(1, 100, 'backward');
			expect(element.selectionStart).toBe(1);
			expect(element.selectionEnd).toBe(10);
			expect(element.selectionDirection).toBe('backward');
		});
	});

	describe('setRangeText()', () => {
		test('Sets a range text with selection mode set to "preserve".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5);
			expect(element.selectionStart).toBe(14);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		test('Sets a range text with selection mode set to "select".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.select);
			expect(element.selectionStart).toBe(4);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		test('Sets a range text with selection mode set to "start".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.start);
			expect(element.selectionStart).toBe(4);
			expect(element.selectionEnd).toBe(4);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		test('Sets a range text with selection mode set to "end".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.end);
			expect(element.selectionStart).toBe(14);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});
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
