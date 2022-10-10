import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLTextAreaElement from '../../../src/nodes/html-text-area-element/HTMLTextAreaElement';
import HTMLInputElementSelectionModeEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionModeEnum';
import HTMLInputElementSelectionDirectionEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionDirectionEnum';

describe('HTMLTextAreaElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTextAreaElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLTextAreaElement>document.createElement('textarea');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLTextAreaElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLTextAreaElement]');
		});
	});

	describe('get value()', () => {
		it('Returns the attribute "value" if it has not been set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			expect(element.value).toBe('TEST_VALUE');
		});

		it('Returns value set using the property.', () => {
			element.value = 'TEST_VALUE';
			expect(element.value).toBe('TEST_VALUE');
		});
	});

	describe('set value()', () => {
		it('Sets a value and selection range.', () => {
			element.selectionDirection = HTMLInputElementSelectionDirectionEnum.forward;
			element.value = 'TEST_VALUE';
			expect(element.value).toBe('TEST_VALUE');
			expect(element.selectionStart).toBe(10);
			expect(element.selectionEnd).toBe(10);
			expect(element.selectionDirection).toBe(HTMLInputElementSelectionDirectionEnum.none);
		});
	});

	describe('get selectionStart()', () => {
		it('Returns the length of the attribute "value" if value has not been set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			expect(element.selectionStart).toBe(10);
		});

		it('Returns the length of the value set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			element.selectionStart = 5;
			expect(element.selectionStart).toBe(5);
		});
	});

	describe('set selectionStart()', () => {
		it('Sets the value to the length of the property "value" if it is out of range.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			element.selectionStart = 20;
			expect(element.selectionStart).toBe(10);
		});

		it('Sets the property.', () => {
			element.value = 'TEST_VALUE';
			element.selectionStart = 5;
			expect(element.selectionStart).toBe(5);
		});
	});

	describe('get selectionEnd()', () => {
		it('Returns the length of the attribute "value" if value has not been set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			expect(element.selectionEnd).toBe(10);
		});

		it('Returns the length of the value set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			element.selectionEnd = 5;
			expect(element.selectionEnd).toBe(5);
		});
	});

	describe('set selectionEnd()', () => {
		it('Sets the value to the length of the property "value" if it is out of range.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			element.selectionEnd = 20;
			expect(element.selectionEnd).toBe(10);
		});

		it('Sets the property.', () => {
			element.value = 'TEST_VALUE';
			element.selectionEnd = 5;
			expect(element.selectionEnd).toBe(5);
		});
	});

	describe('get form()', () => {
		it('Returns parent form element.', () => {
			const form = document.createElement('form');
			const div = document.createElement('div');
			div.appendChild(element);
			form.appendChild(div);
			expect(element.form).toBe(form);
		});
	});

	for (const property of ['disabled', 'autofocus', 'required', 'readOnly']) {
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

	for (const property of ['name', 'autocomplete', 'cols', 'rows', 'placeholder']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe('');
				element.setAttribute(property, 'value');
				expect(element[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = 'value';
				expect(element.getAttribute(property)).toBe('value');
			});
		});
	}

	for (const property of ['minLength', 'maxLength']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe(-1);
				element.setAttribute(property, '50');
				expect(element[property]).toBe(50);
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = 50;
				expect(element[property]).toBe(50);
				expect(element.getAttribute(property)).toBe('50');
			});
		});
	}

	describe('setSelectionRange()', () => {
		it('Sets selection range.', () => {
			element.value = 'TEST_VALUE';
			element.setSelectionRange(1, 5, 'forward');
			expect(element.selectionStart).toBe(1);
			expect(element.selectionEnd).toBe(5);
			expect(element.selectionDirection).toBe('forward');
		});

		it('Sets selection end to the value length if out of range.', () => {
			element.value = 'TEST_VALUE';
			element.setSelectionRange(1, 100, 'backward');
			expect(element.selectionStart).toBe(1);
			expect(element.selectionEnd).toBe(10);
			expect(element.selectionDirection).toBe('backward');
		});
	});

	describe('setRangeText()', () => {
		it('Sets a range text with selection mode set to "preserve".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5);
			expect(element.selectionStart).toBe(14);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		it('Sets a range text with selection mode set to "select".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.select);
			expect(element.selectionStart).toBe(4);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		it('Sets a range text with selection mode set to "start".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.start);
			expect(element.selectionStart).toBe(4);
			expect(element.selectionEnd).toBe(4);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		it('Sets a range text with selection mode set to "end".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.end);
			expect(element.selectionStart).toBe(14);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});
	});

	describe('cloneNode()', () => {
		it('Clones node.', () => {
			element.value = 'TEST_VALUE';
			element.selectionStart = 4;
			element.selectionEnd = 4;

			const clone = element.cloneNode(true);

			expect(clone.value).toBe(element.value);
			expect(clone.defaultValue).toBe(element.defaultValue);
			expect(clone.selectionStart).toBe(element.selectionStart);
			expect(clone.selectionEnd).toBe(element.selectionEnd);
			expect(clone.selectionDirection).toBe(element.selectionDirection);
		});
	});
});
