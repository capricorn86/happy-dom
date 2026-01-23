import HTMLObjectElement from '../../../src/nodes/html-object-element/HTMLObjectElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import ValidityState from '../../../src/validity-state/ValidityState.js';

describe('HTMLObjectElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLObjectElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('object');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLObjectElement', () => {
			expect(element instanceof HTMLObjectElement).toBe(true);
		});
	});

	describe('contentDocument', () => {
		it('Should return null', () => {
			expect(element.contentDocument).toBe(null);
		});
	});

	describe('contentWindow', () => {
		it('Should return null', () => {
			expect(element.contentWindow).toBe(null);
		});
	});

	describe('get data()', () => {
		it('Returns the "data" attribute.', () => {
			element.setAttribute('data', 'test');
			expect(element.data).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			element.setAttribute('data', 'test');
			expect(element.data).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set data()', () => {
		it('Sets the attribute "data".', () => {
			element.data = 'test';
			expect(element.getAttribute('data')).toBe('test');
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

	for (const property of ['name', 'height', 'width', 'type']) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				element.setAttribute(property, 'value');
				expect(element[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				element[property] = 'value';
				expect(element.getAttribute(property)).toBe('value');
			});
		});
	}

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

	describe('get tabIndex()', () => {
		it('Returns "0" by default.', () => {
			const element = document.createElement('object');
			expect(element.tabIndex).toBe(0);
		});

		it('Returns the attribute "tabindex" as a number.', () => {
			const element = document.createElement('object');
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});

		it('Returns "0" for NaN numbers.', () => {
			const element = document.createElement('object');
			element.setAttribute('tabindex', 'invalid');
			expect(element.tabIndex).toBe(0);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const element = document.createElement('object');
			element.tabIndex = 5;
			expect(element.getAttribute('tabindex')).toBe('5');
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe('-1');
			element.tabIndex = <number>(<unknown>'invalid');
			expect(element.getAttribute('tabindex')).toBe('0');
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
