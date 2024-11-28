import Document from '../nodes/document/Document.js';
import * as PropertySymbol from '../PropertySymbol.js';
import NamespaceURI from '../config/NamespaceURI.js';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement.js';
import Element from '../nodes/element/Element.js';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement.js';
import Node from '../nodes/node/Node.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import HTMLElementConfig from '../config/HTMLElementConfig.js';
import * as Entities from 'entities';
import HTMLElementConfigContentModelEnum from '../config/HTMLElementConfigContentModelEnum.js';
import SVGElementConfig from '../config/SVGElementConfig.js';
import StringUtility from '../StringUtility.js';
import XMLParserModeEnum from './XMLParserModeEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';
import HTMLDocument from '../nodes/html-document/HTMLDocument.js';
import XMLDocument from '../nodes/xml-document/XMLDocument.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
import HTMLHeadElement from '../nodes/html-head-element/HTMLHeadElement.js';
import HTMLBodyElement from '../nodes/html-body-element/HTMLBodyElement.js';
import HTMLHtmlElement from '../nodes/html-html-element/HTMLHtmlElement.js';

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
 * Group 3: Attribute name when the attribute has a value using double apostrophe (e.g. "name" in "<div name="value">").
 * Group 4: Attribute value when the attribute has a value using double apostrophe (e.g. "value" in "<div name="value">").
 * Group 5: Attribute end apostrophe when the attribute has a value using double apostrophe (e.g. '"' in "<div name="value">").
 * Group 6: Attribute name when the attribute has a value using single apostrophe (e.g. "name" in "<div name='value'>").
 * Group 7: Attribute value when the attribute has a value using single apostrophe (e.g. "value" in "<div name='value'>").
 * Group 8: Attribute end apostrophe when the attribute has a value using single apostrophe (e.g. "'" in "<div name='value'>").
 * Group 9: Attribute name when the attribute has no value (e.g. "disabled" in "<div disabled>").
 */
const ATTRIBUTE_REGEXP =
	/\s*([a-zA-Z0-9-_:.$@?\\<]+)\s*=\s*([a-zA-Z0-9-_:.$@?{}/<]+)|\s*([a-zA-Z0-9-_:.$@?\\<]+)\s*=\s*"([^"]*)("{0,1})|\s*([a-zA-Z0-9-_:.$@?\\<]+)\s*=\s*'([^']*)('{0,1})|\s*([a-zA-Z0-9-_:.$@?\\<]+)/gm;

/**
 * Document type attribute RegExp.
 *
 * Group 1: Attribute value.
 */
const DOCUMENT_TYPE_ATTRIBUTE_REGEXP = /"([^"]+)"/gm;

/**
 * Space in the beginning of string RegExp.
 */
const SPACE_IN_BEGINNING_REGEXP = /^\s+/;

/**
 * Markup read state (which state the parser is in).
 */
enum MarkupReadStateEnum {
	startOrEndTag = 'startOrEndTag',
	endOfStartTag = 'endOfStartTag',
	plainTextContent = 'plainTextContent',
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

/**
 * How much of the HTML document that has been parsed (where the parser level is).
 */
enum HTMLDocumentStructureLevelEnum {
	root = 0,
	doctype = 1,
	documentElement = 2,
	head = 3,
	additionalHeadWithoutBody = 4,
	body = 5
}

interface IHTMLDocumentStructure {
	nodes: {
		doctype: DocumentType;
		documentElement: HTMLHtmlElement;
		head: HTMLHeadElement;
		body: HTMLBodyElement;
	};
	level: HTMLDocumentStructureLevelEnum;
}

/**
 * XML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/indices.html
 */
export default class XMLParser {
	private window: BrowserWindow;
	private mode: XMLParserModeEnum = XMLParserModeEnum.htmlFragment;
	private evaluateScripts: boolean = false;
	private rootNode: Element | DocumentFragment | Document | null = null;
	private nodeStack: Node[] = [];
	private localNameStack: string[] = [];
	private htmlDocumentStructure: IHTMLDocumentStructure | null = null;
	private currentNode: Node | null = null;
	private readState: MarkupReadStateEnum = MarkupReadStateEnum.startOrEndTag;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.mode] Mode. Defaults to "htmlFragment".
	 * @param [options.evaluateScripts] Set to "true" to enable script execution
	 */
	constructor(
		window: BrowserWindow,
		options?: {
			mode?: XMLParserModeEnum;
			evaluateScripts?: boolean;
		}
	) {
		this.window = window;

		if (options) {
			if (options.mode) {
				this.mode = options.mode;
			}
			if (options.evaluateScripts) {
				this.evaluateScripts = true;
			}
		}
	}
	/**
	 * Parses XML/HTML and returns a root element.
	 *
	 * @param xml XML/HTML string.
	 * @param [rootNode] Root node.
	 * @returns Root node.
	 */
	public parse(
		xml: string,
		rootNode?: Element | DocumentFragment | Document
	): Element | DocumentFragment | Document {
		this.rootNode = rootNode || this.createRootNode();
		this.nodeStack = [this.rootNode];
		this.localNameStack = [null];
		this.currentNode = this.rootNode;
		this.readState = <MarkupReadStateEnum>MarkupReadStateEnum.startOrEndTag;

		if (this.mode === XMLParserModeEnum.xmlDocument && !(this.rootNode instanceof XMLDocument)) {
			throw new Error(
				'Failed to parse XML: The root node must be of type XMLDocument when the mode is "xmlDocument".'
			);
		}

		if (this.mode === XMLParserModeEnum.htmlDocument) {
			if (!(this.rootNode instanceof HTMLDocument)) {
				throw new Error(
					'Failed to parse XML: The root node must be of type HTMLDocument when the mode is "htmlDocument".'
				);
			}

			const { doctype, documentElement, head, body } = <HTMLDocument>this.rootNode;

			if (!doctype || !documentElement || !head || !body) {
				throw new Error(
					'Failed to parse XML: The root node must have "doctype", "documentElement", "head" and "body" when the mode is "htmlDocument".'
				);
			}

			this.htmlDocumentStructure = {
				nodes: {
					doctype,
					documentElement,
					head,
					body
				},
				level: HTMLDocumentStructureLevelEnum.root
			};
		}

		const markupRegexp = new RegExp(MARKUP_REGEXP, 'gm');
		let match: RegExpExecArray;
		let lastIndex = 0;
		let startTagIndex = 0;
		let newElement: Element | null = null;

		if (xml === null || xml === undefined) {
			return this.rootNode;
		}

		xml = String(xml);

		while ((match = markupRegexp.exec(xml))) {
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
						newElement = this.createElement(match[1]);
						startTagIndex = markupRegexp.lastIndex;
						this.readState = MarkupReadStateEnum.endOfStartTag;
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
						if (match[3]) {
							this.parseComment(match[3]);
						} else if (match[4]) {
							this.parseComment(match[4].endsWith('--') ? match[4].slice(0, -2) : match[4]);
						} else {
							this.parseComment('?' + match[6]);
						}
					} else if (match[5] !== undefined) {
						// Document type comment.
						this.parseDocumentType(match[5]);
					} else if (match[6]) {
						// Processing instruction.
						switch (this.mode) {
							case XMLParserModeEnum.htmlDocument:
							case XMLParserModeEnum.htmlFragment:
								// Should become a comment in HTML as it is not supported.
								this.parseComment('?' + match[6]);
								break;
						}
						// TODO: It seems like it is ignored when parsing XML, but perhaps something should be done here.
					} else {
						// Plain text between tags, including the matched tag as it is not a valid start or end tag.
						this.parsePlainText(xml.substring(lastIndex, markupRegexp.lastIndex));
					}

					break;
				case MarkupReadStateEnum.endOfStartTag:
					// End of start tag

					// match[2] is matching an end tag in case the start tag wasn't closed (e.g. "<div\n</ul>" instead of "<div>\n</ul>").
					if (newElement && (match[7] || match[8] || match[2])) {
						const attributeString = xml.substring(
							startTagIndex,
							match[2] ? markupRegexp.lastIndex - 1 : match.index
						);
						const parsedCharacters = this.parseStartTagAttributes(newElement, attributeString);

						// We need to check if the attribute string is read completely as the attribute string can potentially contain "/>" or ">".
						if (parsedCharacters === attributeString.length) {
							const isSelfClosed = !!match[7];
							this.parseStartTag(newElement, isSelfClosed);
							startTagIndex = markupRegexp.lastIndex;
						} else {
							startTagIndex += parsedCharacters;
						}
					} else if (!newElement && (match[7] || match[8] || match[2])) {
						// The node is null when the tag is not allowed (<html>, <head> and <body> are not allowed in an HTML fragment or to be nested)
						this.currentNode = this.rootNode;
						this.readState = MarkupReadStateEnum.startOrEndTag;
						startTagIndex = markupRegexp.lastIndex;
					}
					break;
				case MarkupReadStateEnum.plainTextContent:
					// Raw text content.
					this.parseRawTextElementContent(match[2], xml.substring(startTagIndex, match.index));
					break;
				case MarkupReadStateEnum.error:
					return this.rootNode;
			}

			lastIndex = markupRegexp.lastIndex;
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

		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
				const level = this.htmlDocumentStructure.level;
				const { documentElement, head, body } = this.htmlDocumentStructure.nodes;

				// We should remove space in beginning inside the document and the <html> tag.
				const htmlText =
					(this.currentNode === this.rootNode || this.currentNode === documentElement) &&
					level < HTMLDocumentStructureLevelEnum.head &&
					body[PropertySymbol.elementArray].length === 0
						? text.replace(SPACE_IN_BEGINNING_REGEXP, '')
						: text;

				if (htmlText) {
					const textNode = document.createTextNode(Entities.decodeHTML(htmlText));
					if (
						this.currentNode === head &&
						level === HTMLDocumentStructureLevelEnum.additionalHeadWithoutBody
					) {
						documentElement[PropertySymbol.insertBefore](textNode, body, true);
					} else if (
						this.currentNode === this.rootNode ||
						this.currentNode === documentElement ||
						(this.currentNode === head && level >= HTMLDocumentStructureLevelEnum.body)
					) {
						if (level === HTMLDocumentStructureLevelEnum.head) {
							// Space between <head> and <body> is allowed
							documentElement[PropertySymbol.insertBefore](textNode, body, true);
						} else {
							// Nodes outside <html>, <head> and <body> should be appended to the body
							body[PropertySymbol.appendChild](textNode, true);
						}
					} else {
						this.currentNode[PropertySymbol.appendChild](textNode, true);
					}
				}
				break;
			case XMLParserModeEnum.xmlDocument:
				const xmlText =
					this.currentNode === this.rootNode ? text.replace(SPACE_IN_BEGINNING_REGEXP, '') : text;
				if (xmlText) {
					if (this.currentNode === this.rootNode) {
						this.parseXMLDocumentError(
							'error on line 1 at column 1: Extra content at the end of the document'
						);
						return;
					}
					const textNode = document.createTextNode(Entities.decodeHTML(xmlText));
					this.currentNode[PropertySymbol.appendChild](textNode, true);
				}
				break;
			case XMLParserModeEnum.xmlFragment:
			case XMLParserModeEnum.htmlFragment:
				const textNode = document.createTextNode(Entities.decodeHTML(text));
				this.currentNode[PropertySymbol.appendChild](textNode, true);
				break;
		}
	}

	/**
	 * Parses start tag attributes.
	 *
	 * @param newElement New element.
	 * @param attributeString Attribute string.
	 * @returns Amount of characters parsed.
	 */
	private parseStartTagAttributes(newElement: Element, attributeString: string): number {
		if (
			!attributeString ||
			(this.mode === XMLParserModeEnum.htmlDocument &&
				newElement === this.htmlDocumentStructure.nodes.head &&
				this.htmlDocumentStructure.level === HTMLDocumentStructureLevelEnum.body)
		) {
			return attributeString.length;
		}

		const document = this.window.document;
		const attributeRegexp = new RegExp(ATTRIBUTE_REGEXP, 'gm');
		let attributeMatch: RegExpExecArray;
		let parsedCharacters = 0;

		while ((attributeMatch = attributeRegexp.exec(attributeString))) {
			if (
				(attributeMatch[1] && attributeMatch[2]) ||
				(attributeMatch[3] && attributeMatch[5] === '"') ||
				(attributeMatch[6] && attributeMatch[8] === "'") ||
				attributeMatch[9]
			) {
				// Valid attribute name and value.
				const name =
					attributeMatch[1] || attributeMatch[3] || attributeMatch[6] || attributeMatch[9] || '';
				const rawValue = attributeMatch[2] || attributeMatch[4] || attributeMatch[7] || '';
				const value = rawValue ? Entities.decodeHTMLAttribute(rawValue) : '';
				const attributes = newElement[PropertySymbol.attributes];

				if (newElement[PropertySymbol.namespaceURI] === NamespaceURI.svg) {
					// In XML and SVG namespaces, the attribute "xmlns" should be set to the "http://www.w3.org/2000/xmlns/" namespace.
					const namespaceURI = name === 'xmlns' ? NamespaceURI.xmlns : null;
					if (!attributes.getNamedItemNS(namespaceURI, name)) {
						const attributeItem = document.createAttributeNS(namespaceURI, name);
						attributeItem[PropertySymbol.value] = value;
						attributes[PropertySymbol.setNamedItem](attributeItem);
					}
				} else if (!attributes.getNamedItem(name)) {
					const attributeItem = document.createAttribute(name);
					attributeItem[PropertySymbol.value] = value;
					attributes[PropertySymbol.setNamedItem](attributeItem);
				}

				parsedCharacters += attributeMatch[0].length;
			} else if (
				!attributeMatch[1] &&
				((attributeMatch[3] && !attributeMatch[5]) || (attributeMatch[6] && !attributeMatch[8]))
			) {
				// End attribute apostrophe is missing (e.g. "attr='value" or 'attr="value').
				return parsedCharacters;
			}
		}

		return attributeString.length;
	}

	/**
	 * Parses start tag.
	 *
	 * @param newElement New element.
	 * @param isSelfClosed Is void.
	 */
	private parseStartTag(newElement: Element, isSelfClosed: boolean): void {
		const localName = newElement[PropertySymbol.localName];

		// Handles pre-processing, before the new element is appended to its parent.
		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
			case XMLParserModeEnum.htmlFragment:
				const config = HTMLElementConfig[localName];

				// Some elements are not allowed to be nested (e.g. "<a><a></a></a>" is not allowed.).
				// Therefore we need to auto-close tags with the same name matching the config, so that it become valid (e.g. "<a></a><a></a>").
				if (
					config?.contentModel === HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants &&
					this.localNameStack[this.localNameStack.length - 1] === localName
				) {
					this.nodeStack.pop();
					this.localNameStack.pop();
					this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
				} else if (
					config?.contentModel === HTMLElementConfigContentModelEnum.noSelfDescendants &&
					this.localNameStack.includes(localName)
				) {
					while (this.currentNode !== this.rootNode) {
						if ((<Element>this.currentNode)[PropertySymbol.localName] === localName) {
							this.nodeStack.pop();
							this.localNameStack.pop();
							this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
							break;
						}
						this.nodeStack.pop();
						this.localNameStack.pop();
						this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
					}
				}
				break;
		}

		// Appends the new element to its parent
		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
				const config = HTMLElementConfig[localName];
				const { documentElement, head, body } = this.htmlDocumentStructure.nodes;
				const level = this.htmlDocumentStructure.level;
				// Appends the new node to its parent and sets is as current node.

				// Raw text elements (e.g. <script>) should be appended after the raw text has been added as content to the element.
				// <html>, <head> and <body> are special elements with context constraints. They are already available in the document.
				if (
					(!config || config.contentModel !== HTMLElementConfigContentModelEnum.rawText) &&
					newElement !== documentElement &&
					newElement !== head &&
					newElement !== body
				) {
					// When parser mode is "htmlDocument", any element added directly to the document or document element should be added to the body.
					if (
						documentElement &&
						(this.currentNode === this.rootNode ||
							this.currentNode === documentElement ||
							(this.currentNode === head && level >= HTMLDocumentStructureLevelEnum.body))
					) {
						body[PropertySymbol.appendChild](newElement, true);
					} else {
						this.currentNode[PropertySymbol.appendChild](newElement, true);
					}
				}

				break;
			case XMLParserModeEnum.htmlFragment:
			case XMLParserModeEnum.xmlFragment:
				this.currentNode[PropertySymbol.appendChild](newElement, true);
				break;
			case XMLParserModeEnum.xmlDocument:
				if (
					this.currentNode === this.rootNode &&
					this.rootNode[PropertySymbol.elementArray].length !== 0
				) {
					this.parseXMLDocumentError(
						'error on line 1 at column 1: Extra content at the end of the document'
					);
					return;
				}
				this.currentNode[PropertySymbol.appendChild](newElement, true);
				break;
		}

		// Sets the new element as the current node.
		this.currentNode = newElement;
		this.nodeStack.push(this.currentNode);
		this.localNameStack.push(localName);

		// Handles post-processing of the element after it has been appended to the parent.
		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
			case XMLParserModeEnum.htmlFragment:
				const config = HTMLElementConfig[localName];

				// Check if the tag is a void element and should be closed immediately.
				// Elements in the SVG namespace can be self-closed (e.g. "/>").
				// "/>" will be ignored in the HTML namespace.
				if (
					config?.contentModel === HTMLElementConfigContentModelEnum.noDescendants ||
					(isSelfClosed &&
						(<Element>this.currentNode)[PropertySymbol.namespaceURI] === NamespaceURI.svg)
				) {
					this.nodeStack.pop();
					this.localNameStack.pop();
					this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
					this.readState = MarkupReadStateEnum.startOrEndTag;
				} else {
					// We will set the read state to "rawText" for raw text elements such as <script> and <style> elements.
					this.readState =
						config?.contentModel === HTMLElementConfigContentModelEnum.rawText
							? MarkupReadStateEnum.plainTextContent
							: MarkupReadStateEnum.startOrEndTag;
				}
				break;
			case XMLParserModeEnum.xmlDocument:
			case XMLParserModeEnum.xmlFragment:
				// XML nodes can be self closed using "/>"
				if (isSelfClosed) {
					this.nodeStack.pop();
					this.localNameStack.pop();
					this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
				}
				this.readState = MarkupReadStateEnum.startOrEndTag;
				break;
		}
	}

	/**
	 * Parses end tag.
	 *
	 * @param tagName Tag name.
	 */
	private parseEndTag(tagName: string): void {
		const { localName } = this.getElementLocalNameAndNamespaceURI(tagName);

		// We close all tags up until the first tag that matches the end tag.
		const index = this.localNameStack.lastIndexOf(localName);

		if (index !== -1) {
			this.nodeStack.splice(index, this.nodeStack.length - index);
			this.localNameStack.splice(index, this.localNameStack.length - index);
			this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
		}
	}

	/**
	 * Parses comment.
	 *
	 * @param comment Comment.
	 */
	private parseComment(comment: string): void {
		const document = this.window.document;
		const commentNode = document.createComment(Entities.decodeHTML(comment));

		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
				const level = this.htmlDocumentStructure.level;
				const { documentElement, head, body } = this.htmlDocumentStructure.nodes;

				// We need to add the comment node to the correct position in the document.
				let beforeNode: Node | null = null;
				if (this.currentNode === this.rootNode && level === HTMLDocumentStructureLevelEnum.root) {
					beforeNode = documentElement;
				} else if (
					this.currentNode === documentElement &&
					level === HTMLDocumentStructureLevelEnum.documentElement
				) {
					beforeNode = head;
				} else if (
					this.currentNode === documentElement &&
					level === HTMLDocumentStructureLevelEnum.head
				) {
					beforeNode = body;
				}

				this.currentNode[PropertySymbol.insertBefore](commentNode, beforeNode, true);
				break;
			case XMLParserModeEnum.xmlDocument:
				// Comments are not allowed in the root when parsing XML.
				if (this.currentNode !== this.rootNode) {
					this.currentNode[PropertySymbol.appendChild](commentNode, true);
				}
				break;
			case XMLParserModeEnum.xmlFragment:
			case XMLParserModeEnum.htmlFragment:
				this.currentNode[PropertySymbol.appendChild](commentNode, true);
				break;
		}
	}

	/**
	 * Parses document type.
	 *
	 * @param text Text.
	 */
	private parseDocumentType(text: string): void {
		const decodedText = Entities.decodeHTML(text);

		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
				const { doctype } = this.htmlDocumentStructure.nodes;
				const documentType = this.getDocumentType(decodedText);
				// Document type nodes are only allowed at the beginning of the document.
				if (documentType) {
					if (
						this.currentNode === this.rootNode &&
						this.htmlDocumentStructure.level === HTMLDocumentStructureLevelEnum.root
					) {
						doctype[PropertySymbol.name] = documentType.name;
						doctype[PropertySymbol.publicId] = documentType.publicId;
						doctype[PropertySymbol.systemId] = documentType.systemId;

						this.htmlDocumentStructure.level = HTMLDocumentStructureLevelEnum.doctype;
					}
				} else {
					this.parseComment(decodedText);
				}
				break;
			case XMLParserModeEnum.htmlFragment:
				// Document type nodes are only allowed at the beginning of the document.
				if (!this.getDocumentType(decodedText)) {
					this.parseComment(decodedText);
				}
				break;
			case XMLParserModeEnum.xmlFragment:
			case XMLParserModeEnum.xmlDocument:
				this.parseXMLDocumentError('error on line 1 at column 1: StartTag: invalid element name');
				break;
		}
	}

	/**
	 * Parses raw text content for elements such as <script> and <style>.
	 *
	 * @param endTagName End tag name.
	 * @param text Text.
	 */
	private parseRawTextElementContent(endTagName: string, text: string): void {
		const document = this.window.document;

		const localName = this.currentNode[PropertySymbol.localName];

		if (!endTagName || StringUtility.asciiLowerCase(endTagName) !== localName) {
			return;
		}

		// Scripts are not allowed to be executed when they are parsed using innerHTML, outerHTML, replaceWith() etc.
		// However, they are allowed to be executed when document.write() is used.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
		if (localName === 'script') {
			(<HTMLScriptElement>this.currentNode)[PropertySymbol.evaluateScript] = this.evaluateScripts;
		} else if (localName === 'link') {
			// An assumption that the same rule should be applied for the HTMLLinkElement is made here.
			(<HTMLLinkElement>this.currentNode)[PropertySymbol.evaluateCSS] = this.evaluateScripts;
		}

		// Plain text elements such as <script> and <style> should only contain text.
		this.currentNode[PropertySymbol.appendChild](
			document.createTextNode(Entities.decodeHTML(text)),
			true
		);

		const rawTextElement = this.currentNode;

		this.nodeStack.pop();
		this.localNameStack.pop();
		this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
		this.readState = MarkupReadStateEnum.startOrEndTag;

		// Appends the raw text element to its parent.

		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
				const { documentElement, body } = this.htmlDocumentStructure.nodes;

				// When parser mode is "htmlDocument", any element added directly to the document or document element should be added to the body.
				if (
					documentElement &&
					(this.currentNode === this.rootNode || this.currentNode === documentElement)
				) {
					body[PropertySymbol.appendChild](rawTextElement, true);
				} else {
					this.currentNode[PropertySymbol.appendChild](rawTextElement, true);
				}
				break;
			case XMLParserModeEnum.htmlFragment:
			case XMLParserModeEnum.xmlFragment:
				this.currentNode[PropertySymbol.appendChild](rawTextElement, true);
				break;
			case XMLParserModeEnum.xmlDocument:
				if (
					this.currentNode === this.rootNode &&
					this.rootNode[PropertySymbol.elementArray].length !== 0
				) {
					this.parseXMLDocumentError(
						'error on line 1 at column 1: Extra content at the end of the document'
					);
					return;
				}
				this.currentNode[PropertySymbol.appendChild](rawTextElement, true);
				break;
		}
	}

	/**
	 * Parses XML document error.
	 *
	 * @param error Error.
	 */
	private parseXMLDocumentError(error: string): void {
		const document = this.window.document;

		let errorRoot = (<XMLDocument>this.rootNode).documentElement;

		if (!errorRoot) {
			const documentElement = document.createElement('html');
			const body = document.createElement('body');
			documentElement.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
			documentElement.appendChild(body);
			errorRoot = body;
		}

		const container = document.createElement('div');
		container.innerHTML = `<parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">${error}</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror>`;
		errorRoot.insertBefore(container[PropertySymbol.elementArray][0], errorRoot.firstChild);

		this.readState = MarkupReadStateEnum.error;
	}

	/**
	 * Creates an element or returns a reference to it.
	 *
	 * @param tagName Tag name.
	 */
	private createElement(tagName: string): Element {
		const document = this.window.document;

		if (
			this.mode === XMLParserModeEnum.htmlDocument ||
			this.mode === XMLParserModeEnum.htmlFragment
		) {
			const { localName, namespaceURI } = this.getElementLocalNameAndNamespaceURI(tagName);

			// New element.
			switch (localName) {
				case 'html':
					if (this.mode === XMLParserModeEnum.htmlFragment) {
						return null;
					}
					if (this.htmlDocumentStructure.level < HTMLDocumentStructureLevelEnum.documentElement) {
						this.htmlDocumentStructure.level = HTMLDocumentStructureLevelEnum.documentElement;
					}
					return this.htmlDocumentStructure.nodes.documentElement ?? null;
				case 'head':
					if (this.mode === XMLParserModeEnum.htmlFragment) {
						return null;
					}
					if (this.htmlDocumentStructure.level < HTMLDocumentStructureLevelEnum.head) {
						this.htmlDocumentStructure.level = HTMLDocumentStructureLevelEnum.head;
					} else if (this.htmlDocumentStructure.level === HTMLDocumentStructureLevelEnum.head) {
						this.htmlDocumentStructure.level =
							HTMLDocumentStructureLevelEnum.additionalHeadWithoutBody;
					}
					return this.htmlDocumentStructure.nodes.head ?? null;
				case 'body':
					if (this.mode === XMLParserModeEnum.htmlFragment) {
						return null;
					}
					if (this.htmlDocumentStructure.level < HTMLDocumentStructureLevelEnum.body) {
						this.htmlDocumentStructure.level = HTMLDocumentStructureLevelEnum.body;
					}
					return this.htmlDocumentStructure.nodes.body ?? null;
				default:
					return document.createElementNS(namespaceURI, localName);
			}
		}

		const { localName, namespaceURI } = this.getElementLocalNameAndNamespaceURI(tagName);
		return document.createElementNS(namespaceURI, localName);
	}

	/**
	 * Returns the local name and namespace URI of an element.
	 *
	 * @param tagName
	 */
	private getElementLocalNameAndNamespaceURI(tagName: string): {
		localName: string;
		namespaceURI: string;
	} {
		const lowerName = StringUtility.asciiLowerCase(tagName);

		// NamespaceURI is inherited from the parent element.
		const namespaceURI = this.currentNode[PropertySymbol.namespaceURI];

		// NamespaceURI should be SVG when the tag name is "svg" (even in XML mode).
		if (lowerName === 'svg') {
			return { localName: 'svg', namespaceURI: NamespaceURI.svg };
		}

		if (namespaceURI === NamespaceURI.svg) {
			return {
				localName: SVGElementConfig[lowerName]?.localName || tagName,
				namespaceURI: NamespaceURI.svg
			};
		}

		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
			case XMLParserModeEnum.htmlFragment:
				return {
					localName: lowerName,
					namespaceURI: namespaceURI || NamespaceURI.html
				};
			case XMLParserModeEnum.xmlDocument:
			case XMLParserModeEnum.xmlFragment:
				return {
					localName: tagName,
					namespaceURI: namespaceURI || NamespaceURI.xmlns
				};
		}
	}

	/**
	 * Returns root node.
	 *
	 * @returns Root node.
	 */
	private createRootNode(): DocumentFragment | Document {
		switch (this.mode) {
			case XMLParserModeEnum.htmlDocument:
				return new this.window.HTMLDocument();
			case XMLParserModeEnum.xmlDocument:
				return new this.window.XMLDocument();
			case XMLParserModeEnum.xmlFragment:
			case XMLParserModeEnum.htmlFragment:
				return this.window.document.createDocumentFragment();
		}
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
