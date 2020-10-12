import DocumentType from '../nodes/basic/document-type/DocumentType';
import Document from '../nodes/basic/document/Document';
import Window from '../window/Window';

/**
 * The DOMImplementation interface represents an object providing methods which are not dependent on any particular document. Such an object is returned by the
 */
export default class DOMImplementation {
	private _window: Window;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 */
	constructor(window: Window) {
		this._window = window;
	}

	/**
	 * Creates and returns an HTML Document.
	 */
	public createHTMLDocument(): Document {
		return new Document(this._window);
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
		DocumentType.ownerDocument = this._window.document;
		const documentType = new DocumentType();
		documentType.name = qualifiedName;
		documentType.publicId = publicId;
		documentType.systemId = systemId;
		return documentType;
	}
}
