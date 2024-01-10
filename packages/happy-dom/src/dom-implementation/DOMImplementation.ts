import DocumentType from '../nodes/document-type/DocumentType.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IDocument from '../nodes/document/IDocument.js';
import NodeCreationOwnerDocument from '../nodes/document/NodeCreationOwnerDocument.js';

/**
 * The DOMImplementation interface represents an object providing methods which are not dependent on any particular document. Such an object is returned by the.
 */
export default class DOMImplementation {
	#document: IDocument;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 */
	constructor(window: IDocument) {
		this.#document = window;
	}

	/**
	 * Creates and returns an XML Document.
	 *
	 * TODO: Not fully implemented.
	 */
	public createDocument(): IDocument {
		return new this.#document[PropertySymbol.defaultView].HTMLDocument();
	}

	/**
	 * Creates and returns an HTML Document.
	 */
	public createHTMLDocument(): IDocument {
		return new this.#document[PropertySymbol.defaultView].HTMLDocument();
	}

	/**
	 * Creates and returns an HTML Document.
	 *
	 * @param qualifiedName Qualified name.
	 * @param publicId Public ID.
	 * @param systemId System ID.
	 */
	public createDocumentType(
		qualifiedName: string,
		publicId: string,
		systemId: string
	): DocumentType {
		NodeCreationOwnerDocument.ownerDocument = this.#document;
		const documentType = new this.#document[PropertySymbol.defaultView].DocumentType();
		NodeCreationOwnerDocument.ownerDocument = null;
		documentType.name = qualifiedName;
		documentType.publicId = publicId;
		documentType.systemId = systemId;
		return documentType;
	}
}
