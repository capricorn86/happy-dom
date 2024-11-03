import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLStyleElement from '../../../src/nodes/html-style-element/HTMLStyleElement.js';
import { beforeEach, describe, it, expect } from 'vitest';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';

describe('HTMLStyleElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLStyleElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('style');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLStyleElement', () => {
			expect(element instanceof HTMLStyleElement).toBe(true);
		});

		it('Should be an instanceof HTMLElement', () => {
			expect(element instanceof HTMLElement).toBe(true);
		});
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLStyleElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLStyleElement]');
		});
	});

	describe('get media()', () => {
		it('Returns the "media" attribute.', () => {
			element.setAttribute('media', 'test');
			expect(element.media).toBe('test');
		});
	});

	describe('set media()', () => {
		it('Sets the "media" attribute.', () => {
			element.media = 'test';
			expect(element.getAttribute('media')).toBe('test');
		});
	});

	describe('get type()', () => {
		it('Returns the "type" attribute.', () => {
			element.setAttribute('type', 'test');
			expect(element.type).toBe('test');
		});
	});

	describe('set type()', () => {
		it('Sets the "type" attribute.', () => {
			element.type = 'test';
			expect(element.getAttribute('type')).toBe('test');
		});
	});

	describe(`get disabled()`, () => {
		it('Returns disabled state.', () => {
			expect(element.disabled).toBe(false);
			element.disabled = true;
			expect(element.disabled).toBe(true);
		});
	});

	describe(`set disabled()`, () => {
		it('Sets disabled state.', () => {
			element.disabled = true;
			// Should not set an attribute
			expect(element.getAttribute('disabled')).toBe(null);
		});
	});

	describe(`get sheet()`, () => {
		it('Returns "null" if not connected to DOM.', () => {
			expect(element.sheet).toBe(null);
		});

		it('Returns an CSSStyleSheet instance with its text content as style rules.', () => {
			const textNode = document.createTextNode(
				'body { background-color: red }\ndiv { background-color: green }'
			);

			element.appendChild(textNode);
			document.head.appendChild(element);

			expect(element.sheet.cssRules.length).toBe(2);
			expect(element.sheet.cssRules[0].cssText).toBe('body { background-color: red; }');
			expect(element.sheet.cssRules[1].cssText).toBe('div { background-color: green; }');

			element.sheet.insertRule('html { background-color: blue }', 0);

			expect(element.sheet.cssRules.length).toBe(3);
			expect(element.sheet.cssRules[0].cssText).toBe('html { background-color: blue; }');
			expect(element.sheet.cssRules[1].cssText).toBe('body { background-color: red; }');
			expect(element.sheet.cssRules[2].cssText).toBe('div { background-color: green; }');
		});

		it('Updates rules when appending a text node.', () => {
			document.head.appendChild(element);

			expect(element.sheet.cssRules.length).toBe(0);

			const textNode = document.createTextNode(
				'body { background-color: red }\ndiv { background-color: green }'
			);

			element.appendChild(textNode);

			expect(element.sheet.cssRules[0].cssText).toBe('body { background-color: red; }');
			expect(element.sheet.cssRules[1].cssText).toBe('div { background-color: green; }');
		});

		it('Updates rules when removing a text node.', () => {
			document.head.appendChild(element);

			const textNode = document.createTextNode(
				'body { background-color: red }\ndiv { background-color: green }'
			);

			element.appendChild(textNode);

			expect(element.sheet.cssRules.length).toBe(2);

			expect(element.sheet.cssRules[0].cssText).toBe('body { background-color: red; }');
			expect(element.sheet.cssRules[1].cssText).toBe('div { background-color: green; }');

			element.removeChild(textNode);

			expect(element.sheet.cssRules.length).toBe(0);
		});

		it('Updates rules when inserting a text node.', () => {
			document.head.appendChild(element);

			const textNode = document.createTextNode(
				'body { background-color: red }\ndiv { background-color: green }'
			);

			element.appendChild(textNode);

			expect(element.sheet.cssRules.length).toBe(2);

			expect(element.sheet.cssRules[0].cssText).toBe('body { background-color: red; }');
			expect(element.sheet.cssRules[1].cssText).toBe('div { background-color: green; }');

			const textNode2 = document.createTextNode('html { background-color: blue }');

			element.insertBefore(textNode2, textNode);

			expect(element.sheet.cssRules.length).toBe(3);

			expect(element.sheet.cssRules[0].cssText).toBe('html { background-color: blue; }');
			expect(element.sheet.cssRules[1].cssText).toBe('body { background-color: red; }');
			expect(element.sheet.cssRules[2].cssText).toBe('div { background-color: green; }');
		});

		it('Updates rules editing data of a child Text node.', () => {
			document.head.appendChild(element);

			expect(element.sheet.cssRules.length).toBe(0);

			const textNode = document.createTextNode(
				'body { background-color: red }\ndiv { background-color: green }'
			);

			const documentElementComputedStyle = window.getComputedStyle(document.documentElement);

			element.appendChild(textNode);

			expect(element.sheet.cssRules.length).toBe(2);
			expect(element.sheet.cssRules[0].cssText).toBe('body { background-color: red; }');
			expect(element.sheet.cssRules[1].cssText).toBe('div { background-color: green; }');

			expect(documentElementComputedStyle.backgroundColor).toBe('');

			textNode.data = 'html { background-color: blue }';

			expect(element.sheet.cssRules.length).toBe(1);
			expect(element.sheet.cssRules[0].cssText).toBe('html { background-color: blue; }');

			expect(documentElementComputedStyle.backgroundColor).toBe('blue');
		});
	});
});
