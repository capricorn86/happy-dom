import Document from '../nodes/document/Document.js';
import * as PropertySymbol from '../PropertySymbol.js';
import XMLParser from '../xml-parser/XMLParser.js';
import BrowserWindow from '../window/BrowserWindow.js';
import XMLParserModeEnum from '../xml-parser/XMLParserModeEnum.js';

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

		const window = this[PropertySymbol.window];

		switch (mimeType) {
			case 'text/html':
				return <Document>new XMLParser(this[PropertySymbol.window], {
					mode: XMLParserModeEnum.htmlDocument
				}).parse(string);
			case 'image/svg+xml':
			case 'text/xml':
			case 'application/xml':
			case 'application/xhtml+xml':
				return <Document>new XMLParser(this[PropertySymbol.window], {
					mode: XMLParserModeEnum.xmlDocument
				}).parse(string);
			default:
				throw new window.DOMException(`Unknown mime type "${mimeType}".`);
		}
	}
}
