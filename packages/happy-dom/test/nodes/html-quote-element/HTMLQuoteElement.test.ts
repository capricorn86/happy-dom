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
		it('Should be an instanceof HTMLQuoteElement for the "q" tag.', () => {
			expect(document.createElement('q') instanceof HTMLQuoteElement).toBe(true);
		});

		it('Should be an instanceof HTMLQuoteElement for the "blockquote" tag.', () => {
			expect(document.createElement('blockquote') instanceof HTMLQuoteElement).toBe(true);
		});
	});

	describe('get cite()', () => {
		it('Returns the "cite" attribute.', () => {
			element.setAttribute('cite', 'test');
			expect(element.cite).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			element.setAttribute('cite', 'test');
			expect(element.cite).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set cite()', () => {
		it('Sets the attribute "cite".', () => {
			element.cite = 'test';
			expect(element.getAttribute('cite')).toBe('test');
		});
	});
});
