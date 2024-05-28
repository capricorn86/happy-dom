import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLStyleElement from '../../../src/nodes/html-style-element/HTMLStyleElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLStyleElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLStyleElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLStyleElement>document.createElement('style');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLStyleElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLStyleElement]');
		});
	});

	for (const property of ['media', 'type']) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	describe(`get disabled()`, () => {
		it('Returns attribute value.', () => {
			expect(element.disabled).toBe(false);
			element.setAttribute('disabled', '');
			expect(element.disabled).toBe(true);
		});
	});

	describe(`set disabled()`, () => {
		it('Sets attribute value.', () => {
			element.disabled = true;
			expect(element.getAttribute('disabled')).toBe('');
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
