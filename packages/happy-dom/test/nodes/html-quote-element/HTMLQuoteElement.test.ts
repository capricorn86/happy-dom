import HTMLQuoteElement from '../../../src/nodes/html-quote-element/HTMLQuoteElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLQuoteElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLQuoteElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('q');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLQuoteElement', () => {
			expect(element instanceof HTMLQuoteElement).toBe(true);
		});
	});
});
