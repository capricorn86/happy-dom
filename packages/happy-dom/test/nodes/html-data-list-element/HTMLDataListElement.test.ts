import HTMLDataListElement from '../../../src/nodes/html-data-list-element/HTMLDataListElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';

describe('HTMLDataListElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLDataListElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('datalist');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLDataListElement', () => {
			expect(element instanceof HTMLDataListElement).toBe(true);
		});
	});

	describe('get options()', () => {
		it('Should return options', () => {
			expect(element.options).toBeInstanceOf(HTMLCollection);
			expect(element.options.length).toBe(0);

			const option1 = document.createElement('option');
			const option2 = document.createElement('option');
			const option3 = document.createElement('option');

			option3.setAttribute('id', 'option3_id');
			option3.setAttribute('name', 'option3_name');

			element.appendChild(option1);
			element.appendChild(option2);
			element.appendChild(option3);

			expect(element.options.length).toBe(3);

			expect(element.options[0]).toBe(option1);
			expect(element.options[1]).toBe(option2);
			expect(element.options[2]).toBe(option3);

			expect(element.options['option3_id']).toBe(option3);
			expect(element.options['option3_name']).toBe(option3);

			element.removeChild(option2);

			expect(element.options.length).toBe(2);

			expect(element.options[0]).toBe(option1);
			expect(element.options[1]).toBe(option3);

			expect(element.options['option3_id']).toBe(option3);
			expect(element.options['option3_name']).toBe(option3);

			element.removeChild(option3);

			expect(element.options.length).toBe(1);

			expect(element.options[0]).toBe(option1);

			expect(element.options['option3_id']).toBe(undefined);
			expect(element.options['option3_name']).toBe(undefined);

			element.appendChild(option3);

			expect(element.options.length).toBe(2);

			expect(element.options[0]).toBe(option1);
			expect(element.options[1]).toBe(option3);

			expect(element.options['option3_id']).toBe(option3);
			expect(element.options['option3_name']).toBe(option3);
		});
	});
});
