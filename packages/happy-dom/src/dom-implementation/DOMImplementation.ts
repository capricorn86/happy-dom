import DocumentType from '../nodes/document-type/DocumentType.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IDocument from '../nodes/document/IDocument.js';
import NodeFactory from '../nodes/NodeFactory.js';

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
		return new this.#document[PropertySymbol.ownerWindow].HTMLDocument();
	}

	/**
	 * Creates and returns an HTML Document.
	 */
	public createHTMLDocument(): IDocument {
		return new this.#document[PropertySymbol.ownerWindow].HTMLDocument();
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
		const documentType = NodeFactory.createNode<DocumentType>(
			this.#document,
			this.#document[PropertySymbol.ownerWindow].DocumentType
		);
		documentType[PropertySymbol.name] = qualifiedName;
		documentType[PropertySymbol.publicId] = publicId;
		documentType[PropertySymbol.systemId] = systemId;
		return documentType;
	}
}
