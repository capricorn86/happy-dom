import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement.js';
import HTMLOptionElement from '../../../src/nodes/html-option-element/HTMLOptionElement.js';
import DOMException from '../../../src/exception/DOMException.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('HTMLOptionsCollection', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('get selectedIndex()', () => {
		it('Returns -1 if there are no options.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			expect(select.options.selectedIndex).toBe(-1);
		});

		it('Returns 0 by default.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');

			option1.value = 'option1';
			option2.value = 'option2';

			select.appendChild(option1);
			select.appendChild(option2);

			expect(select.options.selectedIndex).toBe(0);
		});
	});

	describe('set selectedIndex()', () => {
		it('Updates option.selected', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');

			expect(option1.selected).toBe(false);
			expect(option2.selected).toBe(false);

			select.appendChild(option1);
			select.appendChild(option2);

			expect(option1.selected).toBe(true);
			expect(option2.selected).toBe(false);

			select.options.selectedIndex = 1;

			expect(option1.selected).toBe(false);
			expect(option2.selected).toBe(true);

			select.options.selectedIndex = -1;

			expect(option1.selected).toBe(false);
			expect(option2.selected).toBe(false);
		});
	});

	describe('item()', () => {
		it('Returns node at index.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			expect(select.options.item(0) === option).toBe(true);
		});
	});

	describe('add()', () => {
		it('Adds item to the collection.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			expect(select.options.item(0) === option).toBe(true);

			const option2 = <HTMLOptionElement>document.createElement('option');
			select.options.add(option2);
			expect(select.options.item(1) === option2).toBe(true);
		});

		it('Throws error when before element doesnt exist.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			expect(select.options.item(0) === option).toBe(true);

			const option2 = <HTMLOptionElement>document.createElement('option');
			const optionThatDoesntExist = <HTMLOptionElement>document.createElement('option');
			expect(() => select.options.add(option2, optionThatDoesntExist)).toThrowError(DOMException);
		});

		it('Adds item to defined index.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			expect(select.options.item(0) === option).toBe(true);

			const option2 = <HTMLOptionElement>document.createElement('option');
			select.options.add(option2, 0);
			expect(select.options.item(0) === option2).toBe(true);
		});
	});

	describe('remove()', () => {
		it('Removes item from collection.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			select.options.remove(0);
			expect(select.options.length).toBe(0);
		});

		it('Changes selectedIndex when element removed from collection.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			const option2 = document.createElement('option');

			expect(select.options.selectedIndex).toBe(-1);

			select.appendChild(option);
			select.appendChild(option2);

			expect(select.options.selectedIndex).toBe(0);

			select.options.selectedIndex = 1;
			expect(select.options.selectedIndex).toBe(1);

			select.options.remove(1);
			expect(select.options.selectedIndex).toBe(0);

			select.options.remove(0);
			expect(select.options.selectedIndex).toBe(-1);
		});
	});
});
