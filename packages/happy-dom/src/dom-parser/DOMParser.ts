import Document from '../nodes/document/Document';
import XMLParser from '../xml-parser/XMLParser';
import Node from '../nodes/node/Node';
import DOMException from '../exception/DOMException';

/**
 * DOM parser.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */
export default class DOMParser {
	public static _ownerDocument: Document = null;

	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param string HTML data.
	 * @param mimeType Mime type.
	 * @return Root element.
	 */
	public parseFromString(string: string, mimeType: string): Document {
		if (!mimeType) {
			throw new DOMException('Second parameter "mimeType" is mandatory.');
		}

		if (mimeType !== 'text/html') {
			throw new DOMException('The DOMParser in Happy DOM only supports the mime type "text/html".');
		}

		const ownerDocument = (<typeof DOMParser>(<unknown>this.constructor))._ownerDocument;
		const newDocument = new Document();

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
}
