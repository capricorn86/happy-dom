import Document from '../nodes/document/Document';
import XMLParser from '../xml-parser/XMLParser';
import Node from '../nodes/node/Node';
import DOMException from '../exception/DOMException';
import HTMLDocument from '../nodes/html-document/HTMLDocument';
import XMLDocument from '../nodes/xml-document/XMLDocument';
import SVGDocument from '../nodes/svg-document/SVGDocument';

/**
 * DOM parser.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMParser.
 */
export default class DOMParser {
	public static _ownerDocument: Document = null;

	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param string HTML data.
	 * @param mimeType Mime type.
	 * @returns Root element.
	 */
	public parseFromString(string: string, mimeType: string): Document {
		if (!mimeType) {
			throw new DOMException('Second parameter "mimeType" is mandatory.');
		}

		const ownerDocument = (<typeof DOMParser>(<unknown>this.constructor))._ownerDocument;
		const newDocument = this._createDocument(mimeType);

		newDocument.defaultView = ownerDocument.defaultView;
		newDocument.childNodes.length = 0;
		newDocument.children.length = 0;

		const root = XMLParser.parse(newDocument, string, true);
		let documentElement = null;
		let documentTypeNode = null;

		for (const node of root.childNodes) {
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

			for (const node of root.childNodes.slice()) {
				bodyElement.appendChild(node);
			}

			documentElement.appendChild(headElement);
			documentElement.appendChild(bodyElement);

			newDocument.appendChild(documentElement);
		}

		return newDocument;
	}

	/**
	 *
	 * @param mimeType Mime type.
	 * @returns Document.
	 */
	private _createDocument(mimeType: string): Document {
		switch (mimeType) {
			case 'text/html':
				return new HTMLDocument();
			case 'image/svg+xml':
				return new SVGDocument();
			case 'text/xml':
			case 'application/xml':
			case 'application/xhtml+xml':
				return new XMLDocument();
			default:
				throw new DOMException(`Unknown mime type "${mimeType}".`);
		}
	}
}
