import Document from '../nodes/document/Document.js';
import * as PropertySymbol from '../PropertySymbol.js';
import XMLParser from '../xml-parser/XMLParser.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import BrowserWindow from '../window/BrowserWindow.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';

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
		const documentChildNodes = newDocument[PropertySymbol.nodeArray];

		while (documentChildNodes.length) {
			newDocument.removeChild(documentChildNodes[0]);
		}

		const root = <DocumentFragment>XMLParser.parse(newDocument, string, { evaluateScripts: true });
		let documentElement = null;
		let documentTypeNode = null;

		for (const node of root[PropertySymbol.nodeArray]) {
			if (node['tagName'] === 'HTML') {
				documentElement = node;
			} else if (node[PropertySymbol.nodeType] === NodeTypeEnum.documentTypeNode) {
				documentTypeNode = node;
			}

			if (documentElement && documentTypeNode) {
				break;
			}
		}

		if (documentElement) {
			if (documentTypeNode) {
				newDocument.appendChild(documentTypeNode);
			}
			newDocument.appendChild(documentElement);
			const body = newDocument.body;
			if (body) {
				while (root[PropertySymbol.nodeArray].length) {
					body.appendChild(root[PropertySymbol.nodeArray][0]);
				}
			}
		} else {
			switch (mimeType) {
				case 'image/svg+xml':
					{
						while (root[PropertySymbol.nodeArray].length) {
							newDocument.appendChild(root[PropertySymbol.nodeArray][0]);
						}
					}
					break;
				case 'text/html':
				default:
					{
						const documentElement = newDocument.createElement('html');
						const bodyElement = newDocument.createElement('body');
						const headElement = newDocument.createElement('head');

						documentElement.appendChild(headElement);
						documentElement.appendChild(bodyElement);
						newDocument.appendChild(documentElement);

						while (root[PropertySymbol.nodeArray].length) {
							bodyElement.appendChild(root[PropertySymbol.nodeArray][0]);
						}
					}
					break;
			}
		}

		return newDocument;
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
