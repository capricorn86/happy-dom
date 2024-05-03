import HTMLFieldSetElement from '../../../src/nodes/html-field-set-element/HTMLFieldSetElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';

describe('HTMLFieldSetElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLFieldSetElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('fieldset');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLFieldSetElement', () => {
			expect(element instanceof HTMLFieldSetElement).toBe(true);
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
		});

		it('Returns form element by id if the form attribute is set when connecting node to DOM.', () => {
			const form = document.createElement('form');
			form.id = 'form';
			document.body.appendChild(form);
			element.setAttribute('form', 'form');
			expect(element.form).toBe(null);
			document.body.appendChild(element);
			expect(element.form).toBe(form);
			expect(form.elements.includes(element)).toBe(true);
		});

		it('Returns form element by id if the form attribute is set when element is connected to DOM.', () => {
			const form = document.createElement('form');
			form.id = 'form';
			document.body.appendChild(form);
			document.body.appendChild(element);
			element.setAttribute('form', 'form');
			expect(element.form).toBe(form);
			expect(form.elements.includes(element)).toBe(true);
		});
	});

	describe('get name()', () => {
		it(`Returns the attribute "name".`, () => {
			element.setAttribute('name', 'VALUE');
			expect(element.name).toBe('VALUE');
		});
	});

	describe('set name()', () => {
		it(`Sets the attribute "name".`, () => {
			element.name = 'VALUE';
			expect(element.getAttribute('name')).toBe('VALUE');
		});

		it(`Sets name as property in parent form elements.`, () => {
			const form = <HTMLFormElement>document.createElement('form');
			form.appendChild(element);
			element.name = 'button1';
			expect(form.elements['button1']).toBe(element);
		});

		it(`Sets name as property in parent element children.`, () => {
			const div = <HTMLElement>document.createElement('div');
			div.appendChild(element);
			element.name = 'button1';
			expect(div.children['button1']).toBe(element);
		});
	});
});
