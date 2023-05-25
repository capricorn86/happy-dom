import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import IHTMLTextAreaElement from '../../../src/nodes/html-text-area-element/IHTMLTextAreaElement.js';
import HTMLInputElementSelectionModeEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionModeEnum.js';
import HTMLInputElementSelectionDirectionEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionDirectionEnum.js';
import ValidityState from '../../../src/validity-state/ValidityState.js';
import Event from '../../../src/event/Event.js';
import IText from '../../../src/nodes/text/IText.js';

describe('HTMLTextAreaElement', () => {
	let window: Window;
	let document: Document;
	let element: IHTMLTextAreaElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLTextAreaElement>document.createElement('textarea');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLTextAreaElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLTextAreaElement]');
		});
	});

	describe('get value()', () => {
		it('Returns text content of the element.', () => {
			element.textContent = 'TEST_VALUE';
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
			element.textContent = 'TEST_VALUE';

			expect(element.value).toBe('TEST_VALUE');
			expect(element.selectionStart).toBe(10);
			expect(element.selectionEnd).toBe(10);
			expect(element.selectionDirection).toBe(HTMLInputElementSelectionDirectionEnum.none);

			element.selectionDirection = HTMLInputElementSelectionDirectionEnum.forward;
			(<IText>element.childNodes[0]).data = 'NEW_TEST_VALUE';
			expect(element.selectionStart).toBe(14);
			expect(element.selectionEnd).toBe(14);
			expect(element.selectionDirection).toBe(HTMLInputElementSelectionDirectionEnum.none);
		});
	});

	describe('get selectionStart()', () => {
		it('Returns the length of the attribute "value" if value has not been set using the property.', () => {
			element.textContent = 'TEST_VALUE';
			expect(element.selectionStart).toBe(10);
		});

		it('Returns the length of the value set using the property.', () => {
			element.textContent = 'TEST_VALUE';
			element.selectionStart = 5;
			expect(element.selectionStart).toBe(5);
		});
	});

	describe('set selectionStart()', () => {
		it('Sets the value to the length of the property "value" if it is out of range.', () => {
			element.textContent = 'TEST_VALUE';
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
			element.textContent = 'TEST_VALUE';
			expect(element.selectionEnd).toBe(10);
		});

		it('Returns the length of the value set using the property.', () => {
			element.textContent = 'TEST_VALUE';
			element.selectionEnd = 5;
			expect(element.selectionEnd).toBe(5);
		});
	});

	describe('set selectionEnd()', () => {
		it('Sets the value to the length of the property "value" if it is out of range.', () => {
			element.textContent = 'TEST_VALUE';
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

	describe('get validity()', () => {
		it('Returns an instance of ValidityState.', () => {
			expect(element.validity).toBeInstanceOf(ValidityState);
		});
	});

	describe(`get labels()`, () => {
		it('Returns associated labels', () => {
			const label1 = document.createElement('label');
			const label2 = document.createElement('label');
			const parentLabel = document.createElement('label');

			label1.setAttribute('for', 'select1');
			label2.setAttribute('for', 'select1');

			element.id = 'select1';

			parentLabel.appendChild(element);
			document.body.appendChild(label1);
			document.body.appendChild(label2);
			document.body.appendChild(parentLabel);

			const labels = element.labels;

			expect(labels.length).toBe(3);
			expect(labels[0] === label1).toBe(true);
			expect(labels[1] === label2).toBe(true);
			expect(labels[2] === parentLabel).toBe(true);
		});
	});

	for (const method of ['checkValidity', 'reportValidity']) {
		describe(`${method}()`, () => {
			it('Returns "true" if the field is "disabled".', () => {
				element.required = true;
				element.disabled = true;
				expect(element[method]()).toBe(true);
			});

			it('Returns "true" if the field is "readOnly".', () => {
				element.required = true;
				element.readOnly = true;
				expect(element[method]()).toBe(true);
			});

			it('Returns "false" if invalid.', () => {
				element.required = true;
				expect(element[method]()).toBe(false);
			});

			it('Triggers an "invalid" event when invalid.', () => {
				element.required = true;
				let dispatchedEvent: Event | null = null;
				element.addEventListener('invalid', (event: Event) => (dispatchedEvent = event));
				element[method]();
				expect(dispatchedEvent.type).toBe('invalid');
			});
		});
	}

	describe('select()', () => {
		it('Selects all text.', () => {
			let triggeredEvent: Event | null = null;
			element.addEventListener('select', (event) => (triggeredEvent = event));
			element.value = 'TEST_VALUE';
			element.select();
			expect(element.selectionStart).toBe(0);
			expect(element.selectionEnd).toBe(10);
			expect(element.selectionDirection).toBe('none');
			expect(triggeredEvent.type).toBe('select');
		});
	});

	describe('setSelectionRange()', () => {
		it('Sets selection range.', () => {
			let triggeredEvent: Event | null = null;
			element.addEventListener('select', (event) => (triggeredEvent = event));
			element.value = 'TEST_VALUE';
			element.setSelectionRange(1, 5, 'forward');
			expect(element.selectionStart).toBe(1);
			expect(element.selectionEnd).toBe(5);
			expect(element.selectionDirection).toBe('forward');
			expect(triggeredEvent.type).toBe('select');
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
