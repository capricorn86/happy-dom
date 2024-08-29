import HTMLLIElement from '../../../src/nodes/html-li-element/HTMLLIElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLLIElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLLIElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('li');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLLIElement', () => {
			expect(element instanceof HTMLLIElement).toBe(true);
		});
	});

	describe('get value()', () => {
		it('Should return "0" by default', () => {
			expect(element.value).toBe(0);
		});

		it('Should return the value', () => {
			element.setAttribute('value', '1');
			expect(element.value).toBe(1);
			element.setAttribute('value', '-1');
			expect(element.value).toBe(-1);
		});

		it('Should return 0 if the value is not a number', () => {
			element.setAttribute('value', 'test');
			expect(element.value).toBe(0);
		});
	});

	describe('set value()', () => {
		it('Should set the value', () => {
			element.value = 1;
			expect(element.getAttribute('value')).toBe('1');
			element.value = -1;
			expect(element.getAttribute('value')).toBe('-1');
		});

		it('Should set the value to 0 if the value is not a number', () => {
			element.value = <number>(<unknown>'test');
			expect(element.getAttribute('value')).toBe('0');
		});
	});
});
