import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLLabelElement from '../../../src/nodes/html-label-element/HTMLLabelElement.js';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import { beforeEach, describe, it, expect } from 'vitest';
import MouseEvent from '../../../src/event/events/MouseEvent.js';

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
			document.body.appendChild(input);
			document.body.appendChild(element);
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
		it('Returns null if no parent form element exists.', () => {
			expect(element.form).toBe(null);
		});

		it('Returns parent form element.', () => {
			const form = document.createElement('form');
			const div = document.createElement('div');
			const input = document.createElement('input');
			element.appendChild(input);
			div.appendChild(element);
			form.appendChild(div);
			expect(element.form).toBe(form);
		});

		it('Returns associated control form element.', () => {
			const form = document.createElement('form');
			const input = document.createElement('input');
			form.id = 'form';
			document.body.appendChild(form);
			input.id = 'input';
			input.setAttribute('form', 'form');
			element.htmlFor = 'input';
			document.body.appendChild(element);
			document.body.appendChild(input);
			expect(element.form).toBe(form);
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

			element.click();

			expect(input.checked).toBe(true);
			expect(labelClickCount).toBe(2);
			expect(inputClickCount).toBe(1);
		});

		it('Supports MouseEvent.', () => {
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

			element.dispatchEvent(new MouseEvent('click'));

			expect(input.checked).toBe(true);
			expect(labelClickCount).toBe(2);
			expect(inputClickCount).toBe(1);
		});

		it("Doesn't trigger when preventDefault() has been called.", () => {
			const input = <HTMLInputElement>document.createElement('input');
			const span = document.createElement('span');

			input.type = 'checkbox';

			span.appendChild(input);
			element.appendChild(span);

			let inputClickCount = 0;

			element.addEventListener('click', (event) => {
				event.preventDefault();
			});
			input.addEventListener('click', () => inputClickCount++);

			expect(input.checked).toBe(false);

			element.click();

			expect(input.checked).toBe(false);
			expect(inputClickCount).toBe(0);
		});

		it('It triggers "change" event on the control element when clicking on a span inside the label.', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <label>
                  <input type="checkbox">
                  <span>Description</span>
                </label>
            `;
			let isChangeFired = false;

			document.body.appendChild(div);

			div.querySelector('input')?.addEventListener('change', () => (isChangeFired = true));

			div.querySelector('span')?.click();

			expect(isChangeFired).toBe(true);
		});

		it('Doesn\'t trigger "change" event a second time when clicking on control element inside of a label.', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <label>
                  <input type="checkbox">
                  <span>Description</span>
                </label>
            `;
			let changeFiredCount = 0;

			document.body.appendChild(div);

			div.querySelector('input')?.addEventListener('change', () => changeFiredCount++);

			div.querySelector('input')?.click();

			expect(changeFiredCount).toBe(1);
			expect(div.querySelector('input')?.checked).toBe(true);
		});
	});
});
