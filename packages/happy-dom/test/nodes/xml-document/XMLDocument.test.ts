import Window from '../../../src/window/Window.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('XMLDocument', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('createElement()', () => {
		it('Preserves case of element names for text/xml documents.', () => {
			const document = new window.DOMParser().parseFromString('<root/>', 'text/xml');
			const element = document.createElement('myNode');

			expect(document).toBeInstanceOf(window.XMLDocument);
			expect(element.nodeName).toBe('myNode');
			expect(element.tagName).toBe('myNode');
			expect(element.localName).toBe('myNode');
			expect(element.namespaceURI).toBe(null);
		});

		it('Preserves mixed case element names for application/xml documents.', () => {
			const document = new window.DOMParser().parseFromString('<root/>', 'application/xml');
			const element = document.createElement('MyNode');

			expect(element.nodeName).toBe('MyNode');
			expect(element.tagName).toBe('MyNode');
			expect(element.localName).toBe('MyNode');
			expect(element.namespaceURI).toBe(null);
		});

		it('Preserves case on XMLDocument instances.', () => {
			const document = new window.XMLDocument();
			const element = document.createElement('myNode');

			expect(element.nodeName).toBe('myNode');
			expect(element.tagName).toBe('myNode');
			expect(element.localName).toBe('myNode');
			expect(element.namespaceURI).toBe(null);
		});

		it('Does not change HTML Document.createElement() uppercasing.', () => {
			const element = window.document.createElement('myNode');

			expect(window.document.contentType).toBe('text/html');
			expect(element.nodeName).toBe('MYNODE');
			expect(element.tagName).toBe('MYNODE');
			expect(element.localName).toBe('mynode');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
		});
	});
});
