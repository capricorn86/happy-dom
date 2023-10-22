import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import { beforeEach, describe, it, expect } from 'vitest';

describe('DOMImplementation', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('createHTMLDocument()', () => {
		it('Returns a new Document.', () => {
			const document = window.document.implementation.createHTMLDocument();
			expect(document instanceof Document).toBe(true);
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
