import Document from '../../src/nodes/document/Document.js';
import DOMImplementation from '../../src/dom-implementation/DOMImplementation.js';

describe('DOMImplementation', () => {
	let ownerDocument: Document;
	let domImplementation: DOMImplementation;

	beforeEach(() => {
		ownerDocument = new Document();
		domImplementation = new DOMImplementation(ownerDocument);
	});

	describe('createHTMLDocument()', () => {
		it('Returns a new Document.', () => {
			const document = domImplementation.createHTMLDocument();
			expect(document instanceof Document).toBe(true);
			expect(document.defaultView).toBe(null);
		});
	});

	describe('createDocumentType()', () => {
		it('Returns a new Document Type.', () => {
			const documentType = domImplementation.createDocumentType(
				'qualifiedName',
				'publicId',
				'systemId'
			);
			expect(documentType.name).toBe('qualifiedName');
			expect(documentType.publicId).toBe('publicId');
			expect(documentType.systemId).toBe('systemId');
			expect(documentType.ownerDocument).toBe(ownerDocument);
		});
	});
});
