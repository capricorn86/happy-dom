import IDocument from '../nodes/document/IDocument';
import XMLParser from '../xml-parser/XMLParser';
import Node from '../nodes/node/Node';
import DOMException from '../exception/DOMException';
import HTMLDocument from '../nodes/html-document/HTMLDocument';
import XMLDocument from '../nodes/xml-document/XMLDocument';
import SVGDocument from '../nodes/svg-document/SVGDocument';
import IWindow from '../window/IWindow';

/**
 * DOM parser.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMParser.
 */
export default class DOMParser {
	// Owner document is set by a sub-class in the Window constructor
	public static _ownerDocument: IDocument = null;
	public readonly _ownerDocument: IDocument = null;

	/**
	 * Constructor.
	 */
	constructor() {
		this._ownerDocument = (<typeof DOMParser>this.constructor)._ownerDocument;
	}

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
		const newDocument = this._createDocument(mimeType);

		(<IWindow>newDocument.defaultView) = ownerDocument.defaultView;
		newDocument.childNodes.length = 0;
		newDocument.children.length = 0;

		const root = XMLParser.parse(newDocument, string, { evaluateScripts: true });
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
			const body = newDocument.body;
			if (body) {
				for (const child of root.childNodes.slice()) {
					body.appendChild(child);
				}
			}
		} else {
			const documentElement = newDocument.createElement('html');
			const bodyElement = newDocument.createElement('body');
			const headElement = newDocument.createElement('head');

			documentElement.appendChild(headElement);
			documentElement.appendChild(bodyElement);
			newDocument.appendChild(documentElement);

			for (const node of root.childNodes.slice()) {
				bodyElement.appendChild(node);
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
				HTMLDocument._defaultView = this._ownerDocument.defaultView;
				return new HTMLDocument();
			case 'image/svg+xml':
				SVGDocument._defaultView = this._ownerDocument.defaultView;
				return new SVGDocument();
			case 'text/xml':
			case 'application/xml':
			case 'application/xhtml+xml':
				XMLDocument._defaultView = this._ownerDocument.defaultView;
				return new XMLDocument();
			default:
				throw new DOMException(`Unknown mime type "${mimeType}".`);
		}
	}
}
