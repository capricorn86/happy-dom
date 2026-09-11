import HTMLDocument from '../../src/nodes/html-document/HTMLDocument';
import Window from '../../src/window/Window';
import { beforeEach, describe, it, expect } from 'vitest';

describe('DOMImplementation', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('createDocument()', () => {
		it('Returns a new HTMLDocument for "html".', () => {
			const document = window.document.implementation.createDocument(
				'http://www.w3.org/1999/xhtml',
				'html'
			);
			expect(document instanceof window.HTMLDocument).toBe(true);
			expect(document.defaultView).toBe(null);
		});

		it('Returns a new XMLDocument for "svg".', () => {
			const document = window.document.implementation.createDocument(
				'http://www.w3.org/2000/svg',
				'svg'
			);
			expect(document instanceof window.XMLDocument).toBe(true);
			expect(document.defaultView).toBe(null);
		});

		it('Returns a new XMLDocument for "xml".', () => {
			const document = window.document.implementation.createDocument(
				'http://www.w3.org/2000/svg',
				'xml'
			);
			expect(document instanceof window.XMLDocument).toBe(true);
			expect(document.defaultView).toBe(null);
		});

		it('Returns a new HTMLDocument when "qualifiedName" is null.', () => {
			const document = window.document.implementation.createDocument(null, null, null);
			expect(document instanceof window.HTMLDocument).toBe(true);
			expect(document.defaultView).toBe(null);
		});

		it('Throws error if arguments length is less than 2', () => {
			// @ts-expect-error
			expect(() => window.document.implementation.createDocument()).toThrow(
				new TypeError(
					`Failed to execute 'createDocument' on 'DOMImplementation': 2 arguments required, but only 0 present.`
				)
			);
			expect(() =>
				// @ts-expect-error
				window.document.implementation.createDocument('http://www.w3.org/1999/xhtml')
			).toThrow(
				new TypeError(
					`Failed to execute 'createDocument' on 'DOMImplementation': 2 arguments required, but only 1 present.`
				)
			);
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
