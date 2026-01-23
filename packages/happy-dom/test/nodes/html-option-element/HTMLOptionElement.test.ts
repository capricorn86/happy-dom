import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLOptionElement from '../../../src/nodes/html-option-element/HTMLOptionElement.js';
import HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLOptionElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLOptionElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLOptionElement>document.createElement('option');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLOptionElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLOptionElement]');
		});
	});

	describe('get value()', () => {
		it('Returns the attribute "value".', () => {
			element.setAttribute('value', 'VALUE');
			expect(element.value).toBe('VALUE');
		});

		it('Returns the attribute "value" even if the value is empty string.', () => {
			element.textContent = 'TEXT VALUE';
			element.setAttribute('value', '');
			expect(element.value).toBe('');
		});

		it('Returns the text IDL value if no attribute is present.', () => {
			element.removeAttribute('value');
			element.textContent = 'TEXT VALUE';
			expect(element.value).toBe('TEXT VALUE');
		});
	});

	describe('set value()', () => {
		it('Sets the attribute "value".', () => {
			element.value = 'VALUE';
			expect(element.getAttribute('value')).toBe('VALUE');
		});
	});

	describe('get disabled()', () => {
		it('Returns the attribute "disabled".', () => {
			element.setAttribute('disabled', '');
			expect(element.disabled).toBe(true);
		});
	});

	describe('set disabled()', () => {
		it('Sets the attribute "disabled".', () => {
			element.disabled = true;
			expect(element.getAttribute('disabled')).toBe('');
		});
	});

	describe('get selected()', () => {
		it('Returns the selected state of the option.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');

			expect(option1.selected).toBe(false);
			expect(option2.selected).toBe(false);

			select.appendChild(option1);
			select.appendChild(option2);

			expect(option1.selected).toBe(true);
			expect(option2.selected).toBe(false);
			expect(option1.getAttribute('selected')).toBe(null);
			expect(option2.getAttribute('selected')).toBe(null);

			select.options.selectedIndex = 1;

			expect(option1.selected).toBe(false);
			expect(option2.selected).toBe(true);
			expect(option1.getAttribute('selected')).toBe(null);
			expect(option2.getAttribute('selected')).toBe(null);

			select.options.selectedIndex = -1;

			expect(option1.selected).toBe(false);
			expect(option2.selected).toBe(false);
		});
	});

	describe('set selected()', () => {
		it('Sets the selected state of the option.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');

			expect(option1.selected).toBe(false);
			expect(option2.selected).toBe(false);

			option1.selected = true;

			expect(select.selectedIndex).toBe(-1);

			select.appendChild(option1);
			select.appendChild(option2);

			option1.selected = true;

			expect(select.selectedIndex).toBe(0);

			option2.selected = true;

			expect(select.selectedIndex).toBe(1);

			option2.selected = false;

			expect(select.selectedIndex).toBe(0);
		});
	});
});
