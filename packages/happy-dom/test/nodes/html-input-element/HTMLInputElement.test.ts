import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import IHTMLInputElement from '../../../src/nodes/html-input-element/IHTMLInputElement';
import DOMException from '../../../src/exception/DOMException';
import File from '../../../src/file/File';
import Event from '../../../src/event/Event';
import HTMLInputElementSelectionModeEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionModeEnum';
import HTMLInputElementSelectionDirectionEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionDirectionEnum';

describe('HTMLInputElement', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IHTMLInputElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLInputElement>document.createElement('input');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLInputElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLInputElement]');
		});
	});

	describe('get value()', () => {
		for (const type of ['hidden', 'submit', 'image', 'reset', 'button']) {
			it(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.value).toBe('VALUE');
			});
		}

		for (const type of ['checkbox', 'radio']) {
			it(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.value).toBe('VALUE');
			});

			it(`Returns "on" if the attribute "value" has not been set and type is "${type}".`, () => {
				element.type = type;
				expect(element.value).toBe('on');
			});
		}

		for (const type of ['text', 'search', 'url', 'tel', 'password']) {
			it(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.selectionStart).toBe(5);
				expect(element.selectionEnd).toBe(5);
				expect(element.value).toBe('VALUE');
			});
		}

		it('Returns "/fake/path/[filename]" if type is "file".', () => {
			const file = new File(['TEST'], 'filename.jpg');
			element.type = 'file';
			element.files.push(file);
			expect(element.value).toBe('/fake/path/filename.jpg');
		});
	});

	describe('set value()', () => {
		for (const type of ['hidden', 'submit', 'image', 'reset', 'button', 'checkbox', 'radio']) {
			it(`Sets the attribute "value" to the value if type is "${type}".`, () => {
				element.type = type;
				element.value = 'VALUE';
				expect(element.getAttribute('value')).toBe('VALUE');
			});
		}

		it('Throws an exception if a value other than empty string is provided and type is "file".', () => {
			element.type = 'file';
			expect(() => {
				element.value = 'TEST';
			}).toThrow(
				'Input elements of type "file" may only programmatically set the value to empty string.'
			);
		});

		it('Accepts an empty string if type is "file".', () => {
			element.type = 'file';
			element.value = '';
		});

		it('Trims the value if type is "email".', () => {
			element.type = 'email';
			element.value = '  \n\rtest@test.com  ';
			expect(element.value).toBe('test@test.com');
		});

		it('Trims each email address in the value if type is "email" and "multiple" is set to "true".', () => {
			element.type = 'email';
			element.setAttribute('multiple', 'multiple');
			element.value = '  \n\rtest@test.com , test2@test.com  ';

			expect(element.value).toBe('test@test.com,test2@test.com');
		});

		for (const type of ['password', 'search', 'tel', 'text']) {
			it(`Removes new lines if type is "${type}".`, () => {
				element.type = type;
				element.value = '\n\rVALUE\n\r';
				expect(element.value).toBe('VALUE');
				expect(element.selectionStart).toBe(5);
				expect(element.selectionEnd).toBe(5);
			});

			it(`Sets selection range.`, () => {
				element.type = type;
				element.selectionDirection = HTMLInputElementSelectionDirectionEnum.forward;
				element.value = 'VALUE';
				expect(element.selectionStart).toBe(5);
				expect(element.selectionEnd).toBe(5);
				expect(element.selectionDirection).toBe(HTMLInputElementSelectionDirectionEnum.none);
			});
		}

		it('Sets the value if the value is a valid hex code and type is "color".', () => {
			element.type = 'color';
			element.value = '#333333';
			expect(element.value).toBe('#333333');
		});

		it('Sets the value to "#000000" if the value is not a valid hex code and type is "color".', () => {
			element.type = 'color';
			element.value = 'test';
			expect(element.value).toBe('#000000');
			element.value = '#111';
			expect(element.value).toBe('#000000');
		});

		it('Sets the value if it is a valid number and type is "number".', () => {
			element.type = 'number';
			element.value = '10';
			expect(element.value).toBe('10');
		});

		it('Sets the value to empty string if the value is not a valid number and type is "number".', () => {
			element.type = 'number';
			element.value = 'test';
			expect(element.value).toBe('');
		});

		it('Sets the value to "50" if no min or max has been set, the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.value = 'test';
			expect(element.value).toBe('50');
		});

		it('Sets the value to "25" if max has been set to "50", the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.max = '50';
			element.value = 'test';
			expect(element.value).toBe('25');
		});

		it('Sets the value to "40" if min is set to "20" and max is set to "60", the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.min = '20';
			element.max = '60';
			element.value = 'test';
			expect(element.value).toBe('40');
		});

		it('Sets the value to "40" if min is set to "40", the value is out of range and the type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '20';
			expect(element.value).toBe('40');
		});

		it('Sets the value to "80" if max is set to "80", the value is out of range and the type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '100';
			expect(element.value).toBe('80');
		});

		it('Sets the value if it is valid, within range and type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '60';
			expect(element.value).toBe('60');
		});

		it('Trims and removes new lines if type is "url".', () => {
			element.type = 'url';
			element.value = '  \n\rhttp://www.test.com\n\r ';
			expect(element.value).toBe('http://www.test.com');
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

	describe('get form()', () => {
		it('Returns parent form element.', () => {
			const form = document.createElement('form');
			const div = document.createElement('div');
			div.appendChild(element);
			form.appendChild(div);
			expect(element.form).toBe(form);
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

	for (const property of [
		'disabled',
		'autofocus',
		'required',
		'indeterminate',
		'multiple',
		'readOnly'
	]) {
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

	for (const property of [
		'name',
		'alt',
		'src',
		'accept',
		'allowdirs',
		'autocomplete',
		'min',
		'max',
		'pattern',
		'placeholder',
		'step',
		'inputmode'
	]) {
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

	for (const property of ['height', 'width']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe(0);
				element[property] = 20;
				expect(element[property]).toBe(20);
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element.setAttribute(property, '50');
				expect(element[property]).toBe(0);
				element[property] = 50;
				expect(element[property]).toBe(50);
				expect(element.getAttribute(property)).toBe('50');
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

	describe('get checked()', () => {
		it('Returns attribute value if not set.', () => {
			element.setAttribute('checked', '');
			expect(element.checked).toBe(true);
		});

		it('Returns checked state overriding the attribute when set', () => {
			element.setAttribute('checked', '');
			element.checked = false;
			expect(element.checked).toBe(false);
		});
	});

	describe('set checked()', () => {
		it('Sets the checked state.', () => {
			element.setAttribute('checked', '');
			element.checked = true;
			element.removeAttribute('checked');

			expect(element.checked).toBe(true);
		});

		it('Unchecks other radio buttons with the same name in a form.', () => {
			const form = document.createElement('form');
			const radio1 = <IHTMLInputElement>document.createElement('input');
			const radio2 = <IHTMLInputElement>document.createElement('input');
			const radio3 = <IHTMLInputElement>document.createElement('input');

			radio1.type = 'radio';
			radio2.type = 'radio';
			radio3.type = 'radio';

			radio1.name = 'radio';
			radio2.name = 'radio';
			radio3.name = 'radio';

			form.appendChild(radio1);
			form.appendChild(radio2);
			form.appendChild(radio3);

			radio1.checked = true;

			expect(radio1.checked).toBe(true);
			expect(radio2.checked).toBe(false);
			expect(radio3.checked).toBe(false);

			radio2.checked = true;

			expect(radio1.checked).toBe(false);
			expect(radio2.checked).toBe(true);
			expect(radio3.checked).toBe(false);
		});

		it('Unchecks other radio buttons with the same name outside of a form', () => {
			const radio1 = <IHTMLInputElement>document.createElement('input');
			const radio2 = <IHTMLInputElement>document.createElement('input');
			const radio3 = <IHTMLInputElement>document.createElement('input');

			radio1.type = 'radio';
			radio2.type = 'radio';
			radio3.type = 'radio';

			radio1.name = 'radio';
			radio2.name = 'radio';
			radio3.name = 'radio';

			document.body.appendChild(radio1);
			document.body.appendChild(radio2);
			document.body.appendChild(radio3);

			radio1.checked = true;

			expect(radio1.checked).toBe(true);
			expect(radio2.checked).toBe(false);
			expect(radio3.checked).toBe(false);

			radio2.checked = true;

			expect(radio1.checked).toBe(false);
			expect(radio2.checked).toBe(true);
			expect(radio3.checked).toBe(false);
		});
	});

	describe('get type()', () => {
		it('Returns attribute value.', () => {
			expect(element.type).toBe('text');
			element.setAttribute('type', 'date');
			expect(element.type).toBe('date');
		});
	});

	describe('set type()', () => {
		it('Sets attribute value.', () => {
			element.type = 'date';
			expect(element.getAttribute('type')).toBe('date');
		});
	});

	describe('get size()', () => {
		it('Returns attribute value.', () => {
			expect(element.size).toBe(20);
			element.size = 50;
			expect(element.size).toBe(50);
		});
	});

	describe('set size()', () => {
		it('Sets attribute value.', () => {
			element.setAttribute('size', '50');
			expect(element.size).toBe(50);
			element.size = 60;
			expect(element.size).toBe(60);
			expect(element.getAttribute('size')).toBe('60');
		});
	});

	describe('get validationMessage()', () => {
		it('Returns validation message.', () => {
			element.setCustomValidity('Error message');
			expect(element.validationMessage).toBe('Error message');
		});
	});

	describe('setCustomValidity()', () => {
		it('Returns validation message.', () => {
			element.setCustomValidity('Error message');
			expect(element.validationMessage).toBe('Error message');
			element.setCustomValidity(null);
			expect(element.validationMessage).toBe('null');
			element.setCustomValidity('');
			expect(element.validationMessage).toBe('');
		});
	});

	describe('reportValidity()', () => {
		it('Dispatches an "invalid" event.', () => {
			let dispatchedEvent: Event = null;
			element.addEventListener('invalid', (event: Event) => (dispatchedEvent = event));
			element.setCustomValidity('Error message');
			element.reportValidity();
			expect(dispatchedEvent.cancelable).toBe(true);
			expect(dispatchedEvent.bubbles).toBe(true);
		});

		it('Does not dispatch an "invalid" event if the validation message is an empty string.', () => {
			let dispatchedEvent: Event = null;
			element.setCustomValidity('');
			element.reportValidity();
			element.addEventListener('invalid', (event: Event) => (dispatchedEvent = event));
			expect(dispatchedEvent).toBe(null);
		});
	});

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

	describe('checkValidity()', () => {
		it('Returns "true".', () => {
			expect(element.checkValidity()).toBe(true);
		});
	});

	describe('stepUp()', () => {
		it('Steps up with default value.', () => {
			element.type = 'number';
			element.stepUp();
			expect(element.value).toBe('1');
		});

		it('Steps up with defined increment value.', () => {
			element.type = 'number';
			element.value = '1';
			element.stepUp(3);
			expect(element.value).toBe('4');
		});

		it('Throws exception when invalid type.', () => {
			expect(() => element.stepUp()).toThrowError(
				new DOMException('This form element is not steppable.')
			);
		});
	});

	describe('stepDown()', () => {
		it('Steps up with default value.', () => {
			element.type = 'number';
			element.stepDown();
			expect(element.value).toBe('-1');
		});

		it('Steps up with defined increment value.', () => {
			element.type = 'number';
			element.value = '1';
			element.stepDown(3);
			expect(element.value).toBe('-2');
		});

		it('Throws exception when invalid type.', () => {
			expect(() => element.stepDown()).toThrowError(
				new DOMException('This form element is not steppable.')
			);
		});
	});

	describe('cloneNode()', () => {
		it('Clones when type is "checkbox".', () => {
			element.type = 'checkbox';

			const clone = element.cloneNode(true);

			expect(clone.formAction).toBe(element.formAction);
			expect(clone.formMethod).toBe(element.formMethod);
			expect(clone.formNoValidate).toBe(element.formNoValidate);
			expect(clone.value).toBe(element.value);
			expect(clone.height).toBe(element.height);
			expect(clone.width).toBe(element.width);
			expect(clone.defaultChecked).toBe(element.defaultChecked);
			expect(clone.files).toEqual(element.files);
			expect(clone.selectionStart).toBe(element.selectionStart);
			expect(clone.selectionEnd).toBe(element.selectionEnd);
			expect(clone.selectionDirection).toBe(element.selectionDirection);
		});

		it('Clones when type is "search".', () => {
			element.type = 'search';
			element.value = 'TEST_VALUE';
			element.selectionStart = 4;
			element.selectionEnd = 4;

			const clone = element.cloneNode(true);

			expect(clone.formAction).toBe(element.formAction);
			expect(clone.formMethod).toBe(element.formMethod);
			expect(clone.formNoValidate).toBe(element.formNoValidate);
			expect(clone.value).toBe(element.value);
			expect(clone.height).toBe(element.height);
			expect(clone.width).toBe(element.width);
			expect(clone.defaultChecked).toBe(element.defaultChecked);
			expect(clone.files).toEqual(element.files);
			expect(clone.selectionStart).toBe(element.selectionStart);
			expect(clone.selectionEnd).toBe(element.selectionEnd);
			expect(clone.selectionDirection).toBe(element.selectionDirection);
		});

		it('Clones when type is "file".', () => {
			element.type = 'file';
			element.files.push(new File(['test'], 'file.jpg'));

			const clone = element.cloneNode(true);

			expect(clone.formAction).toBe(element.formAction);
			expect(clone.formMethod).toBe(element.formMethod);
			expect(clone.formNoValidate).toBe(element.formNoValidate);
			expect(clone.value).toBe(element.value);
			expect(clone.height).toBe(element.height);
			expect(clone.width).toBe(element.width);
			expect(clone.defaultChecked).toBe(element.defaultChecked);
			expect(clone.files).toEqual(element.files);
			expect(clone.selectionStart).toEqual(element.selectionStart);
			expect(clone.selectionEnd).toEqual(element.selectionEnd);
			expect(clone.selectionDirection).toEqual(element.selectionDirection);
		});
	});

	describe('dispatchEvent()', () => {
		it('Sets "checked" to "true" if type is "checkbox" and it is mutable for a "click" event.', () => {
			let isInputTriggered = false;
			let isChangeTriggered = false;

			element.type = 'checkbox';

			element.addEventListener('input', () => (isInputTriggered = true));
			element.addEventListener('change', () => (isChangeTriggered = true));

			document.body.appendChild(element);

			element.dispatchEvent(new Event('click'));

			expect(isInputTriggered).toBe(true);
			expect(isChangeTriggered).toBe(true);
			expect(element.checked).toBe(true);

			element.dispatchEvent(new Event('click'));

			expect(element.checked).toBe(false);
		});

		it('Sets "checked" to "true" if type is "radio" and it is mutable for a "click" event.', () => {
			let isInputTriggered = false;
			let isChangeTriggered = false;

			element.type = 'radio';

			element.addEventListener('input', () => (isInputTriggered = true));
			element.addEventListener('change', () => (isChangeTriggered = true));

			document.body.appendChild(element);

			element.dispatchEvent(new Event('click'));

			expect(isInputTriggered).toBe(true);
			expect(isChangeTriggered).toBe(true);
			expect(element.checked).toBe(true);

			element.dispatchEvent(new Event('click'));

			expect(element.checked).toBe(true);
		});

		it('Submits form if type is "submit" and it is mutable for a "click" event.', () => {
			// TODO: implement
		});
	});
});
