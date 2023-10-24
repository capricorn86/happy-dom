import DocumentType from '../nodes/document-type/DocumentType.js';
import IDocument from '../nodes/document/IDocument.js';

/**
 * The DOMImplementation interface represents an object providing methods which are not dependent on any particular document. Such an object is returned by the.
 */
export default class DOMImplementation {
	protected _ownerDocument: IDocument = null;

	/**
	 * Constructor.
	 *
	 * @param ownerDocument
	 */
	constructor(ownerDocument: IDocument) {
		this._ownerDocument = ownerDocument;
	}

	/**
	 * Creates and returns an XML Document.
	 *
	 * TODO: Not fully implemented.
	 */
	public createDocument(): IDocument {
		return new this._ownerDocument._defaultView.XMLDocument();
	}

	/**
	 * Creates and returns an HTML Document.
	 */
	public createHTMLDocument(): IDocument {
		return new this._ownerDocument._defaultView.HTMLDocument();
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
		const documentType = new this._ownerDocument._defaultView.DocumentType();
		documentType.name = qualifiedName;
		documentType.publicId = publicId;
		documentType.systemId = systemId;
		return documentType;
	}
}
