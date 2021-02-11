import DocumentType from '../nodes/document-type/DocumentType';
import Document from '../nodes/document/Document';

/**
 * The DOMImplementation interface represents an object providing methods which are not dependent on any particular document. Such an object is returned by the
 */
export default class DOMImplementation {
	public _ownerDocument: Document = null;

	/**
	 * Creates and returns an XML Document.
	 *
	 * @TODO Not fully implemented.
	 */
	public createDocument(): Document {
		return new Document();
	}

	/**
	 * Creates and returns an HTML Document.
	 */
	public createHTMLDocument(): Document {
		return new Document();
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
		DocumentType.ownerDocument = this._ownerDocument;
		const documentType = new DocumentType();
		documentType.name = qualifiedName;
		documentType.publicId = publicId;
		documentType.systemId = systemId;
		return documentType;
	}
}
