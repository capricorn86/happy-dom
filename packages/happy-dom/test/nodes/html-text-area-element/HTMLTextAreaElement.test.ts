import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLTextAreaElement from '../../../src/nodes/html-text-area-element/HTMLTextAreaElement.js';
import HTMLInputElementSelectionModeEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionModeEnum.js';
import HTMLInputElementSelectionDirectionEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionDirectionEnum.js';
import ValidityState from '../../../src/validity-state/ValidityState.js';
import Event from '../../../src/event/Event.js';
import Text from '../../../src/nodes/text/Text.js';
import { beforeEach, describe, it, expect } from 'vitest';

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

	for (const event of ['input', 'selectionchange']) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

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
			(<Text>element.childNodes[0]).data = 'NEW_TEST_VALUE';
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
		it('Returns null if no parent form element exists.', () => {
			expect(element.form).toBe(null);
		});

		it('Returns parent form element.', () => {
			const form = document.createElement('form');
			const div = document.createElement('div');
			div.appendChild(element);
			form.appendChild(div);
			expect(element.form === form).toBe(true);
		});

		it('Returns form element by id if the form attribute is set when connecting node to DOM.', () => {
			const form = document.createElement('form');
			form.id = 'form';
			document.body.appendChild(form);
			element.setAttribute('form', 'form');
			expect(element.form).toBe(null);
			document.body.appendChild(element);
			expect(element.form === form).toBe(true);
			expect(Array.from(form.elements).includes(element)).toBe(true);
		});

		it('Returns form element by id if the form attribute is set when element is connected to DOM.', () => {
			const form = document.createElement('form');
			form.id = 'form';
			document.body.appendChild(form);
			document.body.appendChild(element);
			element.setAttribute('form', 'form');
			expect(element.form === form).toBe(true);
			expect(Array.from(form.elements).includes(element)).toBe(true);
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

	for (const property of ['name', 'autocomplete', 'cols', 'rows', 'placeholder', 'inputMode']) {
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

	describe('get tabIndex()', () => {
		it('Returns "0" by default.', () => {
			const element = document.createElement('textarea');
			expect(element.tabIndex).toBe(0);
		});

		it('Returns the attribute "tabindex" as a number.', () => {
			const element = document.createElement('textarea');
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});

		it('Returns "0" for NaN numbers.', () => {
			const element = document.createElement('textarea');
			element.setAttribute('tabindex', 'invalid');
			expect(element.tabIndex).toBe(0);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const element = document.createElement('textarea');
			element.tabIndex = 5;
			expect(element.getAttribute('tabindex')).toBe('5');
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe('-1');
			element.tabIndex = <number>(<unknown>'invalid');
			expect(element.getAttribute('tabindex')).toBe('0');
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
				let triggeredEvent: Event | null = null;
				element.addEventListener('invalid', (event: Event) => (triggeredEvent = event));
				element[method]();
				expect((<Event>(<unknown>triggeredEvent)).type).toBe('invalid');
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
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('select');
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
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('select');
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
