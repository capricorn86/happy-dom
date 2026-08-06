import Window from '../../../src/window/Window.js';
import DOMParser from '../../../src/dom-parser/DOMParser.js';
import { describe, it, expect } from 'vitest';

describe('XMLDocument', () => {
	describe('createElement()', () => {
		it('Preserves case of element names in XML documents.', () => {
			const window = new Window();
			const domParser = new window.DOMParser();
			const xmlDocument = domParser.parseFromString('<root/>', 'text/xml');
			const element = xmlDocument.createElement('myNode');

			expect(element.nodeName).toBe('myNode');
			expect(element.tagName).toBe('myNode');
		});

		it('Preserves mixed case element names in XML documents.', () => {
			const window = new Window();
			const domParser = new window.DOMParser();
			const xmlDocument = domParser.parseFromString('<root/>', 'text/xml');
			const element = xmlDocument.createElement('MyNode');

			expect(element.nodeName).toBe('MyNode');
			expect(element.tagName).toBe('MyNode');
		});

		it('HTML documents still uppercase element names.', () => {
			const window = new Window();
			const element = window.document.createElement('myNode');

			expect(element.nodeName).toBe('MYNODE');
			expect(element.tagName).toBe('MYNODE');
		});
	});
});
