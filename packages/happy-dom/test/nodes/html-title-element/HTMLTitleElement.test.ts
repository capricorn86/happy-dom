import HTMLTitleElement from '../../../src/nodes/html-title-element/HTMLTitleElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import Text from '../../../src/nodes/text/Text.js';

describe('HTMLTitleElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTitleElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('title');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTitleElement', () => {
			expect(element instanceof HTMLTitleElement).toBe(true);
		});
	});

	describe('get text()', () => {
		it('Should only return the data of Text nodes', () => {
			const div = document.createElement('div');

			div.textContent = 'Invalid';

			element.appendChild(document.createTextNode('  Hello'));
			element.appendChild(div);
			element.appendChild(document.createTextNode(' World!  '));

			expect(element.text).toBe('  Hello World!  ');
		});
	});

	describe('set text()', () => {
		it('Should set "textContent"', () => {
			element.text = 'Hello';
			expect(element.childNodes.length).toBe(1);
			expect((<Text>element.childNodes[0]).data).toBe('Hello');
		});
	});

	describe('get innerHTML()', () => {
		it('Should HTML', () => {
			const div = document.createElement('div');
			div.textContent = 'Hello';
			element.appendChild(div);
			expect(element.innerHTML).toBe('<div>Hello</div>');
		});
	});

	describe('set innerHTML()', () => {
		it('Should set "textContent"', () => {
			element.innerHTML = '<div>Hello</div>';
			expect(element.childNodes.length).toBe(1);
			expect((<Text>element.childNodes[0]).data).toBe('<div>Hello</div>');
			expect(element.innerHTML).toBe('&lt;div&gt;Hello&lt;/div&gt;');
		});
	});
});
