import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLLabelElement from '../../../src/nodes/html-label-element/HTMLLabelElement.js';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import PointerEvent from '../../../src/event/events/PointerEvent.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLLabelElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLLabelElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLLabelElement>document.createElement('label');
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

		it('Returns a descendent input if "for" attribute is not defined.', () => {
			const input = document.createElement('input');
			const span = document.createElement('span');
			span.appendChild(input);
			element.appendChild(span);
			expect(element.control === input).toBe(true);
		});

		it('Does not return hidden inputs.', () => {
			const input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			element.appendChild(input);
			expect(element.control).toBe(null);
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

	describe('dispatchEvent()', () => {
		it('Dispatches a click event on the control element if it exists.', () => {
			const input = <HTMLInputElement>document.createElement('input');
			const span = document.createElement('span');

			input.type = 'checkbox';

			span.appendChild(input);
			element.appendChild(span);

			let labelClickCount = 0;
			let inputClickCount = 0;

			element.addEventListener('click', () => labelClickCount++);
			input.addEventListener('click', () => inputClickCount++);

			expect(input.checked).toBe(false);

			element.dispatchEvent(new PointerEvent('click'));

			expect(input.checked).toBe(true);
			expect(labelClickCount).toBe(2);
			expect(inputClickCount).toBe(1);
		});
	});
});
