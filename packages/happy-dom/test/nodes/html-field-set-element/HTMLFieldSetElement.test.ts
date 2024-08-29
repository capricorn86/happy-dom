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

	describe('get elements()', () => {
		it('Returns elements.', () => {
			const form = document.createElement('form');

			element.innerHTML = `
                <input type="text" name="text1" value="Default value">
                <select>
                    <option value="value1"></option>
                    <option value="value2" selected></option>
                    <option value="value3"></option>
                </select>
                <textarea name="textarea1">Default value</textarea>
                <input type="checkbox" name="checkbox1" value="value1">
                <input type="checkbox" name="checkbox1" value="value2" checked>
                <input type="checkbox" name="checkbox1" value="value3">
                <input type="radio" name="radio1" value="value1">
                <input type="radio" name="radio1" value="value2" checked>
                <input type="radio" name="radio1" value="value3">
                <button name="button1">Button</button>
            `;

			form.appendChild(element);

			document.body.appendChild(form);

			expect(element.elements.length).toBe(10);
			expect(element.elements[0]).toBe(element.children[0]);
			expect(element.elements[1]).toBe(element.children[1]);
			expect(element.elements[2]).toBe(element.children[2]);
			expect(element.elements[3]).toBe(element.children[3]);
			expect(element.elements[4]).toBe(element.children[4]);
			expect(element.elements[5]).toBe(element.children[5]);
			expect(element.elements[6]).toBe(element.children[6]);
			expect(element.elements[7]).toBe(element.children[7]);
			expect(element.elements[8]).toBe(element.children[8]);
			expect(element.elements[9]).toBe(element.children[9]);

			expect(element.elements['text1']).toBe(element.children[0]);
			expect(element.elements['textarea1']).toBe(element.children[2]);
			expect(element.elements['checkbox1']).toBe(element.children[3]);
			expect(element.elements['radio1']).toBe(element.children[6]);
			expect(element.elements['button1']).toBe(element.children[9]);

			element.removeChild(element.children[0]);
			element.removeChild(element.children[3]);

			expect(element.elements.length).toBe(8);
			expect(element.elements[0]).toBe(element.children[0]);
			expect(element.elements[1]).toBe(element.children[1]);
			expect(element.elements[2]).toBe(element.children[2]);
			expect(element.elements[3]).toBe(element.children[3]);
			expect(element.elements[4]).toBe(element.children[4]);
			expect(element.elements[5]).toBe(element.children[5]);
			expect(element.elements[6]).toBe(element.children[6]);
			expect(element.elements[7]).toBe(element.children[7]);
			expect(element.elements['text1']).toBe(undefined);
			expect(element.elements['textarea1']).toBe(element.children[1]);
			expect(element.elements['checkbox1']).toBe(element.children[2]);
			expect(element.elements['radio1']).toBe(element.children[4]);
			expect(element.elements['button1']).toBe(element.children[7]);
		});
	});
});
