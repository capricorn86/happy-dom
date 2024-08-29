import HTMLOutputElement from '../../../src/nodes/html-output-element/HTMLOutputElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import ValidityState from '../../../src/validity-state/ValidityState.js';

describe('HTMLOutputElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLOutputElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('output');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLOutputElement', () => {
			expect(element instanceof HTMLOutputElement).toBe(true);
		});
	});

	describe('get defaultValue()', () => {
		it('Returns default value.', () => {
			expect(element.defaultValue).toBe('');
			element.defaultValue = 'Test';
			expect(element.defaultValue).toBe('Test');
		});
	});

	describe('set defaultValue()', () => {
		it('Returns default value.', () => {
			element.defaultValue = 'Test';
			expect(element.defaultValue).toBe('Test');
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
			expect(element.form).toBe(form);
			expect(Array.from(form.elements).includes(element)).toBe(true);
		});

		it('Returns form element by id if the form attribute is set when connecting node to DOM.', () => {
			const form = document.createElement('form');
			form.id = 'form';
			document.body.appendChild(form);
			element.setAttribute('form', 'form');
			expect(element.form).toBe(null);
			document.body.appendChild(element);
			expect(element.form).toBe(form);
			expect(Array.from(form.elements).includes(element)).toBe(true);
		});

		it('Returns form element by id if the form attribute is set when element is connected to DOM.', () => {
			const form = document.createElement('form');
			form.id = 'form';
			document.body.appendChild(form);
			document.body.appendChild(element);
			element.setAttribute('form', 'form');
			expect(element.form).toBe(form);
			expect(Array.from(form.elements).includes(element)).toBe(true);
		});
	});

	describe('get htmlFor()', () => {
		it('Returns empty string by default.', () => {
			expect(element.htmlFor).toBe('');
		});

		it('Returns the value of the "for" attribute.', () => {
			element.setAttribute('for', 'test1 test2');
			expect(element.htmlFor).toBe('test1 test2');
		});
	});

	describe('set htmlFor()', () => {
		it('Sets the value of the "for" attribute.', () => {
			element.htmlFor = 'test';
			expect(element.getAttribute('for')).toBe('test');
		});
	});

	describe(`get labels()`, () => {
		it('Returns associated labels', () => {
			const label1 = document.createElement('label');
			const label2 = document.createElement('label');
			const parentLabel = document.createElement('label');

			label1.setAttribute('for', 'output1');
			label2.setAttribute('for', 'output1');

			element.id = 'output1';

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

	describe('get name()', () => {
		it('Returns empty string by default.', () => {
			expect(element.name).toBe('');
		});

		it('Returns the value of the "name" attribute.', () => {
			element.setAttribute('name', 'test');
			expect(element.name).toBe('test');
		});
	});

	describe('set name()', () => {
		it('Sets the value of the "name" attribute.', () => {
			element.name = 'test';
			expect(element.getAttribute('name')).toBe('test');
		});
	});

	describe('get type()', () => {
		it('Returns "output".', () => {
			expect(element.type).toBe('output');
		});
	});

	describe('get value()', () => {
		it('Returns empty string by default.', () => {
			expect(element.value).toBe('');
		});

		it('Returns the text content.', () => {
			element.textContent = 'test';
			expect(element.value).toBe('test');
		});
	});

	describe('set value()', () => {
		it('Sets the text content.', () => {
			element.value = 'test';
			expect(element.textContent).toBe('test');
		});
	});

	describe('get validationMessage()', () => {
		it('Returns empty string by default.', () => {
			expect(element.validationMessage).toBe('');
		});

		it('Returns defined message.', () => {
			element.setCustomValidity('Test message');
			expect(element.validationMessage).toBe('Test message');
		});
	});

	describe('get validity()', () => {
		it('Returns validity state.', () => {
			expect(element.validity).toBeInstanceOf(ValidityState);
			expect(element.validity.valid).toBe(true);
		});
	});

	describe('get willValidate()', () => {
		it('Always returns false.', () => {
			expect(element.willValidate).toBe(false);
		});
	});

	describe('checkValidity()', () => {
		it('Always returns true.', () => {
			expect(element.checkValidity()).toBe(true);
		});
	});

	describe('reportValidity()', () => {
		it('Always returns true.', () => {
			expect(element.reportValidity()).toBe(true);
		});
	});

	describe('setCustomValidity()', () => {
		it('Should set validation message.', () => {
			element.setCustomValidity('Test message');
			expect(element.validationMessage).toBe('Test message');
		});
	});
});
