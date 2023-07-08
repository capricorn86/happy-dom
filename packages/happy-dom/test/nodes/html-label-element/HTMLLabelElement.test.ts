import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import IHTMLLabelElement from '../../../src/nodes/html-label-element/IHTMLLabelElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLLabelElement', () => {
	let window: Window;
	let document: Document;
	let element: IHTMLLabelElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLLabelElement>document.createElement('label');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLLabelElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLLabelElement]');
		});
	});

	describe('get htmlFor()', () => {
		it('Returns attribute value.', () => {
			expect(element.htmlFor).toBe('');
			element.setAttribute('for', 'value');
			expect(element.htmlFor).toBe('value');
		});
	});

	describe('set htmlFor()', () => {
		it('Sets attribute value.', () => {
			element.htmlFor = 'value';
			expect(element.getAttribute('for')).toBe('value');
		});
	});

	describe('get control()', () => {
		it('Returns element controlling the label when "for" attribute has been defined.', () => {
			const input = document.createElement('input');
			input.id = 'inputId';
			element.htmlFor = 'inputId';
			document.appendChild(input);
			document.appendChild(element);
			expect(element.control === input).toBe(true);
		});

		it('Returns input appended as a child if "for" attribute is not defined.', () => {
			const input = document.createElement('input');
			element.appendChild(input);
			expect(element.control === input).toBe(true);
		});
	});

	describe('get form()', () => {
		it('Returns parent form element.', () => {
			const form = document.createElement('form');
			const div = document.createElement('div');
			div.appendChild(element);
			form.appendChild(div);
			expect(element.form === form).toBe(true);
		});
	});
});
