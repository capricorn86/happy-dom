import * as PropertySymbol from '../PropertySymbol.js';
import NamespaceURI from '../config/NamespaceURI.js';
import Element from '../nodes/element/Element.js';
import Node from '../nodes/node/Node.js';
import * as Entities from 'entities';
import BrowserWindow from '../window/BrowserWindow.js';
import XMLDocument from '../nodes/xml-document/XMLDocument.js';

/**
 * Markup RegExp.
 *
 * Group 1: Beginning of start tag (e.g. "div" in "<div").
 * Group 2: End tag (e.g. "div" in "</div>").
 * Group 3: Comment with ending "--" (e.g. " Comment 1 " in "<!-- Comment 1 -->").
 * Group 4: Comment without ending "--" (e.g. " Comment 1 " in "<!-- Comment 1 >").
 * Group 5: Exclamation mark comment (e.g. "DOCTYPE html" in "<!DOCTYPE html>").
 * Group 6: Processing instruction (e.g. "xml version="1.0"?" in "<?xml version="1.0"?>").
 * Group 7: End of self closing start tag (e.g. "/>" in "<img/>").
 * Group 8: End of start tag (e.g. ">" in "<div>").
 */
const MARKUP_REGEXP =
	/<([^\s/!>?]+)|<\/([^\s/!>?]+)\s*>|<!--([^-]+)-->|<!--([^>]+)>|<!([^>]*)>|<\?([^>]+)>|(\/>)|(>)/gm;

/**
 * Attribute RegExp.
 *
 * Group 1: Attribute name when the attribute has a value using double apostrophe (e.g. "name" in "<div name="value">").
 * Group 2: Attribute value when the attribute has a value using double apostrophe (e.g. "value" in "<div name="value">").
 * Group 3: Attribute end apostrophe when the attribute has a value using double apostrophe (e.g. '"' in "<div name="value">").
 * Group 4: Attribute name when the attribute has a value using single apostrophe (e.g. "name" in "<div name='value'>").
 * Group 5: Attribute value when the attribute has a value using single apostrophe (e.g. "value" in "<div name='value'>").
 * Group 6: Attribute end apostrophe when the attribute has a value using single apostrophe (e.g. "'" in "<div name='value'>").
 * Group 7: Attribute name when the attribute has no value (e.g. "disabled" in "<div disabled>").
 */
const ATTRIBUTE_REGEXP =
	/\s*([a-zA-Z0-9-_]+)\s*=\s*"([^"]*)("{0,1})|\s*([a-zA-Z0-9-_]+)\s*=\s*'([^']*)('{0,1})|\s*([a-zA-Z0-9-_]+)/gm;

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
 * Markup read state (which state the parser is in).
 */
enum MarkupReadStateEnum {
	startOrEndTag = 'startOrEndTag',
	endOfStartTag = 'endOfStartTag',
	error = 'error'
}

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
 * XML parser.
 */
export default class XMLParser {
	private window: BrowserWindow;
	private rootNode: XMLDocument | null = null;
	private nodeStack: Node[] = [];
	private tagNameStack: string[] = [];
	private defaultNamespaceStack: string[] | null = null;
	private namespacePrefixStack: Array<Map<string, string>> | null = null;
	private startTagIndex = 0;
	private markupRegExp: RegExp | null = null;
	private nextElement: Element | null = null;
	private currentNode: Node | null = null;
	private readState: MarkupReadStateEnum = MarkupReadStateEnum.startOrEndTag;
	private errorMessage: string | null = null;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.mode] Mode. Defaults to "htmlFragment".
	 * @param [options.evaluateScripts] Set to "true" to enable script execution
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
		this.rootNode = new this.window.XMLDocument();
		this.nodeStack = [this.rootNode];
		this.tagNameStack = [null];
		this.currentNode = this.rootNode;
		this.readState = <MarkupReadStateEnum>MarkupReadStateEnum.startOrEndTag;
		this.defaultNamespaceStack = [null];
		this.namespacePrefixStack = [null];
		this.startTagIndex = 0;
		this.markupRegExp = new RegExp(MARKUP_REGEXP, 'gm');
		let match: RegExpExecArray;
		let lastIndex = 0;

		xml = String(xml);

		while ((match = this.markupRegExp.exec(xml))) {
			switch (this.readState) {
				case MarkupReadStateEnum.startOrEndTag:
					if (
						match.index !== lastIndex &&
						(match[1] || match[2] || match[3] || match[4] || match[5] !== undefined || match[6])
					) {
						// Plain text between tags.
						this.parsePlainText(xml.substring(lastIndex, match.index));
					}

					if (match[1]) {
						// Start tag.
						this.parseStartTag(match[1]);
					} else if (match[2]) {
						// End tag.
						this.parseEndTag(match[2]);
					} else if (
						match[3] ||
						match[4] ||
						(match[6] &&
							(<Element>this.currentNode)[PropertySymbol.namespaceURI] === NamespaceURI.html)
					) {
						// Comment.
						this.parseComment(
							match[3] ??
								(match[4]?.endsWith('--') ? match[4].slice(0, -2) : match[4] ?? null) ??
								match[6]
						);
					} else if (match[5] !== undefined) {
						// Document type
						this.parseDocumentType(match[5]);
					} else if (match[6]) {
						// Processing instruction.
						this.parseProcessingInstruction(match[6]);
					} else {
						// Plain text between tags, including the matched tag as it is not a valid start or end tag.
						this.parsePlainText(xml.substring(lastIndex, this.markupRegExp.lastIndex));
					}

					break;
				case MarkupReadStateEnum.endOfStartTag:
					// End of start tag

					if (match[7] || match[8]) {
						const attributeString = xml.substring(
							this.startTagIndex,
							match[2] ? this.markupRegExp.lastIndex - 1 : match.index
						);
						const isSelfClosed = !!match[7];

						this.parseEndOfStartTag(attributeString, isSelfClosed);
					} else {
						this.errorMessage = 'error parsing attribute name';
						this.readState = MarkupReadStateEnum.error;
					}
					break;
				case MarkupReadStateEnum.error:
					this.parseError(xml.slice(0, lastIndex), this.errorMessage);
					return this.rootNode;
			}

			lastIndex = this.markupRegExp.lastIndex;
		}

		// Missing end tag.
		if (this.nodeStack.length !== 1) {
			this.parseError(xml, 'Premature end of data in tag article line 1');
			return this.rootNode;
		}

		// Missing start tag (e.g. when parsing just a string like "Test").
		if (this.rootNode[PropertySymbol.elementArray].length === 0) {
			this.parseError(xml, `Start tag expected, '&lt;' not found`);
			return this.rootNode;
		}

		// Plain text after tags.
		if (lastIndex !== xml.length && this.currentNode) {
			this.parsePlainText(xml.substring(lastIndex));
		}

		return this.rootNode;
	}

	/**
	 * Parses plain text.
	 *
	 * @param text Text.
	 */
	private parsePlainText(text: string): void {
		const document = this.window.document;

		if (this.currentNode === this.rootNode) {
			const xmlText = text.replace(SPACE_REGEXP, '');
			if (xmlText) {
				this.errorMessage = 'Extra content at the end of the document';
				this.readState = MarkupReadStateEnum.error;
			}
		} else {
			this.currentNode[PropertySymbol.appendChild](
				document.createTextNode(Entities.decodeHTML(text)),
				true
			);
		}
	}

	/**
	 * Parses processing instruction.
	 *
	 * @param text Text.
	 */
	private parseProcessingInstruction(text: string): void {
		const parts = text.split(' ');

		// When the processing instruction has "xml" as target, we should not add it as a child node.
		// Instead we will store the state on the root node, so that it is added when serializing the document with XMLSerializer.
		if (parts[0] === 'xml') {
			if (
				this.currentNode !== this.rootNode ||
				this.rootNode[PropertySymbol.elementArray].length !== 0
			) {
				this.errorMessage = 'XML declaration allowed only at the start of the document';
				this.readState = MarkupReadStateEnum.error;
			} else {
				this.rootNode[PropertySymbol.hasXMLProcessingInstruction] = true;
			}
		} else if (parts.length > 1) {
			const name = parts[0];
			const content = parts.slice(1).join(' ');
			this.currentNode[PropertySymbol.appendChild](
				this.window.document.createProcessingInstruction(
					name,
					content.endsWith('?') ? content.slice(0, -1) : content
				),
				true
			);
		} else {
			this.errorMessage = 'error parsing processing instruction';
			this.readState = MarkupReadStateEnum.error;
		}
	}

	/**
	 * Parses comment.
	 *
	 * @param comment Comment.
	 */
	private parseComment(comment: string): void {
		const document = this.window.document;

		// Comments are not allowed in the root when parsing XML.
		if (this.currentNode !== this.rootNode) {
			this.currentNode[PropertySymbol.appendChild](
				document.createComment(Entities.decodeHTML(comment)),
				true
			);
		}
	}

	/**
	 * Parses document type.
	 *
	 * @param text Text.
	 */
	private parseDocumentType(text: string): void {
		if (
			this.currentNode === this.rootNode &&
			this.rootNode[PropertySymbol.nodeArray].length === 0
		) {
			const decodedText = Entities.decodeHTML(text);
			const documentType = this.getDocumentType(decodedText);

			if (documentType?.name) {
				this.rootNode[PropertySymbol.appendChild](
					this.window.document.implementation.createDocumentType(
						documentType.name,
						documentType.publicId,
						documentType.systemId
					),
					true
				);
			} else if (documentType) {
				this.errorMessage = 'xmlParseDocTypeDecl : no DOCTYPE name';
				this.readState = MarkupReadStateEnum.error;
			} else {
				this.errorMessage = 'StartTag: invalid element name';
				this.readState = MarkupReadStateEnum.error;
			}
		} else if (
			this.currentNode === this.rootNode &&
			this.rootNode[PropertySymbol.elementArray].length === 1
		) {
			this.errorMessage = 'Extra content at the end of the document';
			this.readState = MarkupReadStateEnum.error;
		} else {
			this.errorMessage = 'StartTag: invalid element name';
			this.readState = MarkupReadStateEnum.error;
		}
	}

	/**
	 * Parses start tag.
	 *
	 * @param tagName Tag name.
	 */
	private parseStartTag(tagName: string): void {
		const parts = tagName.split(':');

		if (parts.length > 1) {
			this.nextElement = this.window.document.createElementNS(
				this.namespacePrefixStack[this.namespacePrefixStack.length - 1]?.get(parts[0]) || null,
				tagName
			);
		} else {
			this.nextElement = this.window.document.createElementNS(
				this.defaultNamespaceStack[this.defaultNamespaceStack.length - 1] || null,
				tagName
			);
		}

		this.namespacePrefixStack.push(
			new Map(this.namespacePrefixStack[this.namespacePrefixStack.length - 1])
		);

		this.startTagIndex = this.markupRegExp.lastIndex;
		this.readState = MarkupReadStateEnum.endOfStartTag;
	}

	/**
	 * Parses end of start tag.
	 *
	 * @param attributeString Attribute string.
	 * @param isSelfClosed Is self closed.
	 */
	private parseEndOfStartTag(attributeString: string, isSelfClosed: boolean): void {
		const document = this.window.document;
		const attributeRegexp = new RegExp(ATTRIBUTE_REGEXP, 'gm');
		const namespacePrefix = this.namespacePrefixStack[this.namespacePrefixStack.length - 1];
		let attributeMatch: RegExpExecArray;
		let lastIndex = 0;

		while ((attributeMatch = attributeRegexp.exec(attributeString))) {
			const textBetweenAttributes = attributeString
				.substring(lastIndex, attributeMatch.index)
				.replace(SPACE_REGEXP, '');

			// If there is text between attributes, the text did not match a valid attribute.
			if (textBetweenAttributes.length) {
				this.errorMessage = 'attributes construct error';
				this.readState = MarkupReadStateEnum.error;
				return;
			}

			if (
				(attributeMatch[1] && attributeMatch[3] === '"') ||
				(attributeMatch[4] && attributeMatch[6] === "'") ||
				attributeMatch[7]
			) {
				// Valid attribute name and value.
				const name = attributeMatch[1] ?? attributeMatch[4] ?? attributeMatch[7];
				const rawValue = attributeMatch[2] ?? attributeMatch[5] ?? null;

				if (rawValue === null) {
					this.errorMessage = `Specification mandates value for attribute ${name}`;
					this.readState = MarkupReadStateEnum.error;
					return;
				}

				const value = rawValue ? Entities.decodeHTMLAttribute(rawValue) : '';
				const attributes = this.nextElement[PropertySymbol.attributes];

				// In XML, attributes prefixed with "xmlns:" or named "xmlns" should be set to the "http://www.w3.org/2000/xmlns/" namespace.
				const namespaceURI = name.startsWith('xmlns:') ? NamespaceURI.xmlns : null;

				if (!attributes.getNamedItemNS(namespaceURI, name)) {
					const attributeItem = document.createAttributeNS(namespaceURI, name);
					attributeItem[PropertySymbol.value] = value;
					attributes[PropertySymbol.setNamedItem](attributeItem);

					// Attributes prefixed with "xmlns:" should be added to the namespace prefix map, so that the prefix can be added as namespaceURI to elements using the prefix.
					if (attributeItem[PropertySymbol.prefix] === 'xmlns') {
						namespacePrefix.set(attributeItem[PropertySymbol.prefix], value);

						// If the prefix matches the current element, we should set the namespace URI of the element to the value of the attribute.
						// We don't need to upgrade the element, as there are no defined element types using a prefix.
						if (this.nextElement[PropertySymbol.prefix] === attributeItem[PropertySymbol.prefix]) {
							this.nextElement[PropertySymbol.namespaceURI] = value;
						}
					}
					// If the attribute is "xmlns", we should upgrade the element to an element created using the namespace URI.
					else if (name === 'xmlns' && !this.nextElement[PropertySymbol.prefix]) {
						// We only need to create a new instance if it is a known namespace URI.
						if (NAMESPACE_URIS.includes(value)) {
							this.nextElement = this.window.document.createElementNS(
								value,
								this.nextElement[PropertySymbol.tagName]
							);
							this.nextElement[PropertySymbol.attributes] = attributes;
						} else {
							this.nextElement[PropertySymbol.namespaceURI] = value;
						}
					}
				} else {
					this.errorMessage = `Attribute ${name} redefined`;
					this.readState = MarkupReadStateEnum.error;
				}

				this.startTagIndex += attributeMatch[0].length;
			} else if (
				(attributeMatch[1] && attributeMatch[3] !== '"') ||
				(attributeMatch[4] && attributeMatch[6] !== "'")
			) {
				// End attribute apostrophe is missing (e.g. "attr='value" or 'attr="value').
				// We should continue to the next end of start tag match.
				return;
			}

			lastIndex = attributeRegexp.lastIndex;
		}

		// We need to check if the attribute string is read completely as the attribute string can potentially contain "/>" or ">".
		const tagName = this.nextElement[PropertySymbol.tagName];

		// Prefixed elements need to have a namespace URI defined by a prefixed "xmlns:" attribute either by a parent or in the current element.
		if (this.nextElement[PropertySymbol.prefix] && !this.nextElement[PropertySymbol.namespaceURI]) {
			this.errorMessage = `Namespace prefix ${
				this.nextElement[PropertySymbol.prefix]
			} on name is not defined`;
			this.readState = MarkupReadStateEnum.error;
			return;
		}

		// Only one document element is allowed in the document.
		if (
			this.currentNode === this.rootNode &&
			this.rootNode[PropertySymbol.elementArray].length !== 0
		) {
			this.errorMessage = 'Extra content at the end of the document';
			this.readState = MarkupReadStateEnum.error;
			return;
		}

		this.currentNode[PropertySymbol.appendChild](this.nextElement, true);

		// Sets the new element as the current node.
		// XML nodes can be self closed using "/>"
		if (!isSelfClosed) {
			this.currentNode = this.nextElement;
			this.nodeStack.push(this.currentNode);
			this.tagNameStack.push(tagName);

			if (
				this.currentNode[PropertySymbol.namespaceURI] &&
				!this.currentNode[PropertySymbol.prefix]
			) {
				this.defaultNamespaceStack.push(this.currentNode[PropertySymbol.namespaceURI]);
			} else {
				this.defaultNamespaceStack.push(
					this.defaultNamespaceStack[this.defaultNamespaceStack.length - 1]
				);
			}
		}

		this.readState = MarkupReadStateEnum.startOrEndTag;
		this.startTagIndex = this.markupRegExp.lastIndex;
	}

	/**
	 * Parses end tag.
	 *
	 * @param tagName Tag name.
	 */
	private parseEndTag(tagName: string): void {
		if (this.tagNameStack[this.tagNameStack.length - 1] === tagName) {
			this.nodeStack.pop();
			this.tagNameStack.pop();
			this.namespacePrefixStack.pop();
			this.defaultNamespaceStack.pop();
			this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
		} else {
			this.errorMessage = 'Opening and ending tag mismatch';
			this.readState = MarkupReadStateEnum.error;
		}
	}

	/**
	 * Parses XML document error.
	 *
	 * @param readXML XML that has been read.
	 * @param errorMessage Error message.
	 */
	private parseError(readXML: string, errorMessage: string): void {
		const document = this.window.document;

		let errorRoot: Element = (<XMLDocument>this.rootNode).documentElement;

		if (!errorRoot) {
			const documentElement = document.createElementNS(NamespaceURI.html, 'html');
			const body = document.createElementNS(NamespaceURI.html, 'body');
			documentElement.appendChild(body);
			errorRoot = body;
			this.rootNode[PropertySymbol.appendChild](documentElement, true);
		}

		const container = document.createElement('div');
		const rows = readXML.split('\n');
		const column = rows[rows.length - 1].length;
		const error = `error on line ${rows.length} at column ${column}: ${errorMessage}`;

		container.innerHTML = `<parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">${error}</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror>`;
		errorRoot.insertBefore(container[PropertySymbol.elementArray][0], errorRoot.firstChild);
	}

	/**
	 * Returns document type.
	 *
	 * @param value Value.
	 * @returns Document type.
	 */
	private getDocumentType(value: string): IDocumentType {
		if (!value.toUpperCase().startsWith('DOCTYPE')) {
			return null;
		}

		const docTypeSplit = value.split(' ');

		if (docTypeSplit.length <= 1) {
			return null;
		}

		const docTypeString = docTypeSplit.slice(1).join(' ');
		const attributes = [];
		const attributeRegExp = new RegExp(DOCUMENT_TYPE_ATTRIBUTE_REGEXP, 'gm');
		const isPublic = docTypeString.toUpperCase().includes('PUBLIC');
		let attributeMatch;

		while ((attributeMatch = attributeRegExp.exec(docTypeString))) {
			attributes.push(attributeMatch[1]);
		}

		const publicId = isPublic ? attributes[0] || '' : '';
		const systemId = isPublic ? attributes[1] || '' : attributes[0] || '';

		return {
			name: docTypeSplit[1].toLowerCase(),
			publicId,
			systemId
		};
	}
}
