import Document from '../nodes/basic/document/Document';
import HTMLParser from '../html-parser/HTMLParser';

/**
 * HTML parser.
 */
export default class DOMParser {
	public static ownerDocument: Document = null;

	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param string HTML data.
	 * @param mimeType Mime type.
	 * @return Root element.
	 */
	public parseFromString(string: string, mimeType: string): Document {
		if (!mimeType) {
			throw new Error('Second parameter "mimeType" is mandatory.');
		}

		if (mimeType !== 'text/html') {
			throw new Error('The DOMParser in Happy DOM only supports the mime type "text/html".');
		}

		const ownerDocument = (<typeof DOMParser>(<unknown>this.constructor)).ownerDocument;
		const newDocument = new Document(ownerDocument.defaultView);

		const root = HTMLParser.parse(newDocument, string);
		const documentElement = root.querySelector('html');

		newDocument.documentElement.parentNode.removeChild(newDocument.documentElement);

		if (documentElement) {
			newDocument.appendChild(documentElement);
			const body = newDocument.querySelector('body');
			if (body) {
				for (const child of root.childNodes.slice()) {
					body.appendChild(child);
				}
			}
		} else {
			const documentElement = newDocument.createElement('html');
			const bodyElement = newDocument.createElement('body');
			const headElement = newDocument.createElement('head');

			for (const child of root.childNodes.slice()) {
				bodyElement.appendChild(child);
			}

			documentElement.appendChild(headElement);
			documentElement.appendChild(bodyElement);

			newDocument.appendChild(documentElement);
		}

		return newDocument;
	}
}
