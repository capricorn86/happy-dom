import Document from '../nodes/document/Document.js';
import * as PropertySymbol from '../PropertySymbol.js';
import XMLParser from '../xml-parser/XMLParser.js';
import BrowserWindow from '../window/BrowserWindow.js';

/**
 * DOM parser.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMParser.
 */
export default class DOMParser {
	// Injected by WindowContextClassExtender
	protected declare [PropertySymbol.window]: BrowserWindow;

	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param string HTML data.
	 * @param mimeType Mime type.
	 * @returns Root element.
	 */
	public parseFromString(string: string, mimeType: string): Document {
		if (!mimeType) {
			throw new this[PropertySymbol.window].DOMException(
				'Second parameter "mimeType" is mandatory.'
			);
		}

		const newDocument = <Document>this.#createDocument(mimeType);

		return <Document>XMLParser.parse(newDocument, string, {
			evaluateScripts: false,
			rootNode: newDocument
		});
	}

	/**
	 *
	 * @param mimeType Mime type.
	 * @returns Document.
	 */
	#createDocument(mimeType: string): Document {
		const window = this[PropertySymbol.window];

		switch (mimeType) {
			case 'text/html':
				return new window.HTMLDocument();
			case 'image/svg+xml':
			case 'text/xml':
			case 'application/xml':
			case 'application/xhtml+xml':
				return new window.XMLDocument();
			default:
				throw new window.DOMException(`Unknown mime type "${mimeType}".`);
		}
	}
}
