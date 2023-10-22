import IDocument from '../nodes/document/IDocument.js';
import XMLParser from '../xml-parser/XMLParser.js';
import Node from '../nodes/node/Node.js';
import DOMException from '../exception/DOMException.js';
import IWindow from '../window/IWindow.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';

/**
 * DOM parser.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMParser.
 */
export default class DOMParser {
	// Will be populated by a sub-class in Window.
	public readonly _ownerDocument: IDocument;

	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param string HTML data.
	 * @param mimeType Mime type.
	 * @returns Root element.
	 */
	public parseFromString(string: string, mimeType: string): IDocument {
		if (!mimeType) {
			throw new DOMException('Second parameter "mimeType" is mandatory.');
		}

		const ownerDocument = this._ownerDocument;
		const newDocument = <IDocument>this._createDocument(mimeType);

		(<IWindow>newDocument.defaultView) = ownerDocument.defaultView;

		const root = <DocumentFragment>XMLParser.parse(newDocument, string, { evaluateScripts: true });
		let documentElement = null;
		let documentTypeNode = null;

		for (const node of root._childNodes) {
			if (node['tagName'] === 'HTML') {
				documentElement = node;
			} else if (node.nodeType === Node.DOCUMENT_TYPE_NODE) {
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
				for (const child of root._childNodes.slice()) {
					body.appendChild(child);
				}
			}
		} else {
			switch (mimeType) {
				case 'image/svg+xml':
					{
						for (const node of root._childNodes.slice()) {
							newDocument.appendChild(node);
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

						for (const node of root._childNodes.slice()) {
							bodyElement.appendChild(node);
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
	 * @returns IDocument.
	 */
	private _createDocument(mimeType: string): IDocument {
		switch (mimeType) {
			case 'text/html':
				return new this._ownerDocument.defaultView.HTMLDocument();
			case 'image/svg+xml':
				return new this._ownerDocument.defaultView.SVGDocument();
			case 'text/xml':
			case 'application/xml':
			case 'application/xhtml+xml':
				return new this._ownerDocument.defaultView.XMLDocument();
			default:
				throw new DOMException(`Unknown mime type "${mimeType}".`);
		}
	}
}
