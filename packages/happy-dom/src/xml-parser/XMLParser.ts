import { SaxesParser, SaxesTagNS } from 'saxes';
import * as PropertySymbol from '../PropertySymbol.js';
import NamespaceURI from '../config/NamespaceURI.js';
import Element from '../nodes/element/Element.js';
import Node from '../nodes/node/Node.js';
import BrowserWindow from '../window/BrowserWindow.js';
import XMLDocument from '../nodes/xml-document/XMLDocument.js';
import NodeFactory from '../nodes/NodeFactory.js';

/**
 * Document type attribute RegExp.
 *
 * Group 1: Attribute value.
 */
const DOCUMENT_TYPE_ATTRIBUTE_REGEXP = /"([^"]+)"/gm;

/**
 * Space RegExp.
 */
const SPACE_REGEXP = /\s+/;

/**
 * Document type.
 */
interface IDocumentType {
	name: string;
	publicId: string;
	systemId: string;
}

const NAMESPACE_URIS = Object.values(NamespaceURI);

/**
 * XML parser using saxes for robust tokenization.
 */
export default class XMLParser {
	private window: BrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 */
	constructor(window: BrowserWindow) {
		this.window = window;
	}

	/**
	 * Parses XML and returns an XML document containing nodes found.
	 *
	 * @param xml XML string.
	 * @returns XML document.
	 */
	public parse(xml: string): XMLDocument {
		const window = this.window;
		const rootNode = new window.XMLDocument();
		rootNode[PropertySymbol.defaultView] = window;

		const nodeStack: Node[] = [rootNode];
		let currentNode: Node = rootNode;
		let errorOccurred = false;
		let errorMessage: string | null = null;
		let errorLine = 1;
		let errorColumn = 1;
		let hasDocumentElement = false;
		let xmlDeclHandled = false;

		const parser = new SaxesParser({ xmlns: true, position: true });

		parser.on('error', (err: Error) => {
			if (!errorOccurred) {
				errorOccurred = true;
				errorMessage = err.message;
				errorLine = parser.line;
				errorColumn = parser.column;
			}
		});

		parser.on('xmldecl', (decl) => {
			if (xmlDeclHandled || rootNode[PropertySymbol.nodeArray].length > 0) {
				if (!errorOccurred) {
					errorOccurred = true;
					errorMessage = 'XML declaration allowed only at the start of the document\n';
					errorLine = parser.line;
					errorColumn = parser.column;
				}
				return;
			}
			xmlDeclHandled = true;
			// Store XML declaration for serialization
			const parts: string[] = [];
			if (decl.version) {
				parts.push(`version="${decl.version}"`);
			}
			if (decl.encoding) {
				parts.push(`encoding="${decl.encoding}"`);
			}
			if (decl.standalone) {
				parts.push(`standalone="${decl.standalone}"`);
			}
			if (parts.length > 0) {
				rootNode[PropertySymbol.xmlProcessingInstruction] = rootNode.createProcessingInstruction(
					'xml',
					parts.join(' ')
				);
			}
		});

		parser.on('doctype', (doctypeStr: string) => {
			if (currentNode !== rootNode || rootNode[PropertySymbol.nodeArray].length > 0) {
				if (!errorOccurred) {
					errorOccurred = true;
					errorMessage = 'DOCTYPE not allowed here\n';
					errorLine = parser.line;
					errorColumn = parser.column;
				}
				return;
			}
			const doctype = this.getDocumentType(doctypeStr);
			if (doctype?.name) {
				rootNode[PropertySymbol.appendChild](
					window.document.implementation.createDocumentType(
						doctype.name,
						doctype.publicId,
						doctype.systemId
					),
					true
				);
			}
		});

		parser.on('opentag', (tag: SaxesTagNS) => {
			if (errorOccurred) {
				return;
			}

			// Only one document element allowed
			if (currentNode === rootNode && hasDocumentElement) {
				errorOccurred = true;
				errorMessage = 'Extra content at the end of the document\n';
				errorLine = parser.line;
				errorColumn = parser.column;
				return;
			}

			const namespaceURI = tag.uri || null;
			const tagName = tag.name;

			let element: Element;

			// Create element with proper namespace
			if (NAMESPACE_URIS.includes(<string>namespaceURI)) {
				element = rootNode.createElementNS(namespaceURI, tagName);
			} else {
				element = rootNode.createElementNS(namespaceURI, tagName);
			}

			// Set attributes
			const attributes = element[PropertySymbol.attributes];
			for (const [attrName, attr] of Object.entries(tag.attributes)) {
				const attrNode = NodeFactory.createNode(rootNode, window.Attr);

				let attrNamespaceURI: string | null = null;
				const nameParts = attrName.split(':');

				// Determine attribute namespace
				if (nameParts[0] === 'xmlns') {
					attrNamespaceURI = NamespaceURI.xmlns;
				} else if (nameParts[0] === 'xlink') {
					attrNamespaceURI = NamespaceURI.xlink;
				} else if (attr.uri) {
					attrNamespaceURI = attr.uri;
				}

				attrNode[PropertySymbol.namespaceURI] = attrNamespaceURI;
				attrNode[PropertySymbol.name] = attrName;
				attrNode[PropertySymbol.localName] = attr.local || attrName;
				attrNode[PropertySymbol.prefix] = attr.prefix || null;
				attrNode[PropertySymbol.value] = attr.value;

				attributes[PropertySymbol.setNamedItem](attrNode);
			}

			currentNode[PropertySymbol.appendChild](element, true);

			if (currentNode === rootNode) {
				hasDocumentElement = true;
			}

			if (!tag.isSelfClosing) {
				nodeStack.push(element);
				currentNode = element;
			}
		});

		parser.on('closetag', (tag: SaxesTagNS) => {
			if (errorOccurred) {
				return;
			}

			if (tag.isSelfClosing) {
				// Already handled in opentag
				return;
			}

			nodeStack.pop();
			currentNode = nodeStack[nodeStack.length - 1] || rootNode;
		});

		parser.on('text', (text: string) => {
			if (errorOccurred) {
				return;
			}

			if (currentNode === rootNode) {
				// Text at root level - only whitespace is allowed
				if (text.trim()) {
					errorOccurred = true;
					errorMessage = hasDocumentElement
						? 'Extra content at the end of the document\n'
						: "Start tag expected, '<' not found";
					errorLine = parser.line;
					errorColumn = parser.column;
				}
				return;
			}

			currentNode[PropertySymbol.appendChild](rootNode.createTextNode(text), true);
		});

		parser.on('cdata', (cdata: string) => {
			if (errorOccurred) {
				return;
			}

			if (currentNode !== rootNode) {
				currentNode[PropertySymbol.appendChild](rootNode.createCDATASection(cdata), true);
			}
		});

		parser.on('comment', (comment: string) => {
			if (errorOccurred) {
				return;
			}

			// Comments are not allowed at root level in XML parsing (matching original behavior)
			if (currentNode !== rootNode) {
				currentNode[PropertySymbol.appendChild](rootNode.createComment(comment), true);
			}
		});

		parser.on('processinginstruction', (pi: { target: string; body: string }) => {
			if (errorOccurred) {
				return;
			}

			// Skip xml declaration - handled separately
			if (pi.target === 'xml') {
				return;
			}

			currentNode[PropertySymbol.appendChild](
				rootNode.createProcessingInstruction(pi.target, pi.body),
				true
			);
		});

		// Parse the XML
		xml = String(xml);
		try {
			parser.write(xml).close();
		} catch (e) {
			if (!errorOccurred) {
				errorOccurred = true;
				errorMessage = e instanceof Error ? e.message : 'Unknown parsing error';
				errorLine = parser.line;
				errorColumn = parser.column;
			}
		}

		// Check for unclosed tags
		if (!errorOccurred && nodeStack.length > 1) {
			errorOccurred = true;
			errorMessage =
				'Premature end of data in tag ' +
				(<Element>nodeStack[nodeStack.length - 1])[PropertySymbol.tagName] +
				' line 1\n';
			errorLine = parser.line;
			errorColumn = parser.column;
		}

		// Check for missing document element
		if (!errorOccurred && !hasDocumentElement) {
			errorOccurred = true;
			errorMessage = "Start tag expected, '<' not found";
			errorLine = 1;
			errorColumn = 1;
		}

		// Handle errors
		if (errorOccurred) {
			this.appendError(rootNode, errorMessage || 'Unknown error', errorLine, errorColumn);
		}

		return rootNode;
	}

	/**
	 * Appends a parser error element to the document.
	 *
	 * @param rootNode Root document.
	 * @param errorMessage Error message.
	 * @param line Line number.
	 * @param column Column number.
	 */
	private appendError(
		rootNode: XMLDocument,
		errorMessage: string,
		line: number,
		column: number
	): void {
		let errorRoot: Element = rootNode.documentElement;

		if (!errorRoot) {
			const documentElement = rootNode.createElementNS(NamespaceURI.html, 'html');
			const body = rootNode.createElementNS(NamespaceURI.html, 'body');
			documentElement.appendChild(body);
			errorRoot = body;
			rootNode[PropertySymbol.appendChild](documentElement, true);
		}

		const error = `error on line ${line} at column ${column}: ${errorMessage}`;
		const errorElement = rootNode.createElementNS(NamespaceURI.html, 'parsererror');

		errorElement.setAttribute(
			'style',
			'display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black'
		);
		errorElement.innerHTML = `<h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">${error}</div><h3>Below is a rendering of the page up to the first error.</h3>`;

		errorRoot.insertBefore(errorElement, errorRoot.firstChild);
	}

	/**
	 * Returns document type from doctype string.
	 *
	 * @param value Doctype string.
	 * @returns Document type.
	 */
	private getDocumentType(value: string): IDocumentType | null {
		const docTypeSplit = value.trim().split(SPACE_REGEXP);

		if (docTypeSplit.length === 0) {
			return null;
		}

		const docTypeString = docTypeSplit.slice(1).join(' ');
		const attributes: string[] = [];
		const attributeRegExp = new RegExp(DOCUMENT_TYPE_ATTRIBUTE_REGEXP, 'gm');
		const isPublic = docTypeString.toUpperCase().includes('PUBLIC');
		let attributeMatch;

		while ((attributeMatch = attributeRegExp.exec(docTypeString))) {
			attributes.push(attributeMatch[1]);
		}

		const publicId = isPublic ? attributes[0] || '' : '';
		const systemId = isPublic ? attributes[1] || '' : attributes[0] || '';

		return {
			name: docTypeSplit[0].toLowerCase(),
			publicId,
			systemId
		};
	}
}
