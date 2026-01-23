import HTMLHtmlElement from '../../../src/nodes/html-html-element/HTMLHtmlElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLHtmlElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLHtmlElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('html');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLHtmlElement', () => {
			expect(element instanceof HTMLHtmlElement).toBe(true);
		});
	});
});
