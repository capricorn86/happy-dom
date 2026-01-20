import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('QuerySelector - Attribute Case Sensitivity', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('Issue #1912: CSS attribute selector with capital letters', () => {
		it('Should match attribute selectors case-insensitively for HTML elements.', () => {
			const container = document.createElement('div');
			container.innerHTML = '<input Name="test" />';

			// All case variations should match the same element in HTML
			expect(container.querySelectorAll('[Name]').length).toBe(1);
			expect(container.querySelectorAll('[name]').length).toBe(1);
			expect(container.querySelectorAll('[NAME]').length).toBe(1);
			expect(container.querySelectorAll('[Name="test"]').length).toBe(1);
			expect(container.querySelectorAll('[name="test"]').length).toBe(1);
			expect(container.querySelector('[Name]')).not.toBeNull();
			expect(container.querySelector('[name]')).not.toBeNull();
		});

		it('Should match attribute selectors case-sensitively for XML documents.', () => {
			// This is the actual issue from #1912 - XML documents should preserve case
			const xml = '<root><child Name="John">Content</child></root>';
			const parser = new window.DOMParser();
			const xmlDoc = parser.parseFromString(xml, 'application/xml');

			// In XML, attribute names are case-sensitive, so [Name] should match Name
			expect(xmlDoc.querySelectorAll('[Name]').length).toBe(1);
			expect(xmlDoc.querySelectorAll('[Name="John"]').length).toBe(1);

			// [name] should NOT match Name in XML (case-sensitive)
			expect(xmlDoc.querySelectorAll('[name]').length).toBe(0);
		});

		it('Should match both Name and name attributes separately in XML documents.', () => {
			const xml = '<root><child Name="John" name="jane">Content</child></root>';
			const parser = new window.DOMParser();
			const xmlDoc = parser.parseFromString(xml, 'application/xml');

			// Both [Name] and [name] should match their respective attributes
			expect(xmlDoc.querySelectorAll('[Name]').length).toBe(1);
			expect(xmlDoc.querySelectorAll('[name]').length).toBe(1);
			expect(xmlDoc.querySelectorAll('[Name="John"]').length).toBe(1);
			expect(xmlDoc.querySelectorAll('[name="jane"]').length).toBe(1);
		});
	});
});
