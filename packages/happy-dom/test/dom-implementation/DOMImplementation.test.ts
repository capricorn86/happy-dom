import HTMLDocument from '../../src/nodes/html-document/HTMLDocument';
import XMLDocument from '../../src/nodes/xml-document/XMLDocument';
import Window from '../../src/window/Window';
import Window from '../../src/window/Window';
import { beforeEach, describe, it, expect } from 'vitest';

describe('DOMImplementation', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('createDocument()', () => {
		it('Returns a new XMLDocument.', () => {
			const document = window.document.implementation.createDocument();
			expect(document instanceof HTMLDocument).toBe(true);
			expect(document.defaultView).toBe(null);
		});
	});

	describe('createHTMLDocument()', () => {
		it('Returns a new Document.', () => {
			const document = window.document.implementation.createHTMLDocument();
			expect(document instanceof HTMLDocument).toBe(true);
			expect(document.defaultView).toBe(null);
		});
	});

	describe('createDocumentType()', () => {
		it('Returns a new Document Type.', () => {
			const documentType = window.document.implementation.createDocumentType(
				'qualifiedName',
				'publicId',
				'systemId'
			);
			expect(documentType.name).toBe('qualifiedName');
			expect(documentType.publicId).toBe('publicId');
			expect(documentType.systemId).toBe('systemId');
			expect(documentType.ownerDocument).toBe(window.document);
		});
	});
});
