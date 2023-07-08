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
		const documentClass = this._ownerDocument.constructor;
		// @ts-ignore
		documentClass._defaultView = this._ownerDocument.defaultView;
		// @ts-ignore
		return new documentClass();
	}

	/**
	 * Creates and returns an HTML Document.
	 */
	public createHTMLDocument(): IDocument {
		return this.createDocument();
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
		DocumentType._ownerDocument = this._ownerDocument;
		const documentType = new DocumentType();
		documentType.name = qualifiedName;
		documentType.publicId = publicId;
		documentType.systemId = systemId;
		return documentType;
	}
}
