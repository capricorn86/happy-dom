import Document from '../nodes/document/Document.js';
import * as PropertySymbol from '../PropertySymbol.js';
import NamespaceURI from '../config/NamespaceURI.js';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement.js';
import Element from '../nodes/element/Element.js';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement.js';
import Node from '../nodes/node/Node.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import HTMLElementConfig from '../config/HTMLElementConfig.js';
import HTMLElementConfigContentModelEnum from '../config/HTMLElementConfigContentModelEnum.js';
import SVGElementConfig from '../config/SVGElementConfig.js';
import StringUtility from '../utilities/StringUtility.js';
import BrowserWindow from '../window/BrowserWindow.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
import HTMLHeadElement from '../nodes/html-head-element/HTMLHeadElement.js';
import HTMLBodyElement from '../nodes/html-body-element/HTMLBodyElement.js';
import HTMLHtmlElement from '../nodes/html-html-element/HTMLHtmlElement.js';
import XMLEncodeUtility from '../utilities/XMLEncodeUtility.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import MathMLElementConfig from '../config/MathMLElementConfig.js';
import Attr from '../nodes/attr/Attr.js';
import ForeignAttributeConfig from '../config/ForeignAttributeConfig.js';
import SVGAttributeConfig from '../config/SVGAttributeConfig.js';
import MathMLAttributeConfig from '../config/MathMLAttributeConfig.js';
import HTMLParserErrorCodeEnum from './HTMLParserErrorCodeEnum.js';
import HTMLFormElement from '../nodes/html-form-element/HTMLFormElement.js';

/**
 * Markup RegExp.
 *
 * Group 1: Beginning of start tag (e.g. "div" in "<div").
 * Group 2: End tag (e.g. "div" in "</div>").
 * Group 3: Comment start tag "<!--"
 * Group 4: Comment end tag "-->"
 * Group 5: Document type start tag "<!"
 * Group 6: Processing instruction start tag "<?"
 * Group 7: End of self closing start tag (e.g. "/>" in "<img/>").
 * Group 8: End of start tag or comment tag (e.g. ">" in "<div>").
 */
const MARKUP_REGEXP = /<([^\s/!>?]+)|<\/([^\s/!>?]+)\s*>|(<!--)|(-->|--!>)|(<!)|(<\?)|(\/>)|(>)/gm;

/**
 * Attribute RegExp.
 *
 * Group 1: Attribute name when the attribute has a value with no apostrophes (e.g. "name" in "<div name=value>").
 * Group 2: Attribute value when the attribute has a value with no apostrophes (e.g. "value" in "<div name="value">").
 * Group 3: Attribute name when the attribute has a value using double apostrophe (e.g. "name" in "<div name="value">").
 * Group 4: Attribute value when the attribute has a value using double apostrophe (e.g. "value" in "<div name="value">").
 * Group 5: Attribute end apostrophe when the attribute has a value using double apostrophe (e.g. '"' in "<div name="value">").
 * Group 6: Attribute name when the attribute has a value using single apostrophe (e.g. "name" in "<div name='value'>").
 * Group 7: Attribute value when the attribute has a value using single apostrophe (e.g. "value" in "<div name='value'>").
 * Group 8: Attribute end apostrophe when the attribute has a value using single apostrophe (e.g. "'" in "<div name='value'>").
 * Group 9: Attribute name when the attribute has no value (e.g. "disabled" in "<div disabled>").
 */
const ATTRIBUTE_REGEXP =
	/\s*([^="'\/\s]+)\s*=\s*([^"'\s]+)|([^="'\/\s]+)\s*=\s*"([^"]+)("){0,1}|\s*([^="'\/\s]+)\s*=\s*'([^']+)('){0,1}|\s*([^="'\/\s]+)/gm;

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
 * Space in the beginning of string RegExp.
 */
const SPACE_IN_BEGINNING_REGEXP = /^\s+/;

/**
 * Markup read state (which state the parser is in).
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#tokenization
 */
enum MarkupReadStateEnum {
	data = 'data',
	tagName = 'tagName',
	comment = 'comment',
	documentType = 'documentType',
	processingInstruction = 'processingInstruction',
	rawText = 'rawText'
}

/**
 * Insertion mode.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#insertion-mode
 */
enum InsertionModeEnum {
	initial = 'initial',
	beforeHTML = 'beforeHTML',
	beforeHead = 'beforeHead',
	inHead = 'inHead',
	inHeadNoscript = 'inHeadNoscript',
	afterHead = 'afterHead',
	inBody = 'inBody',
	inTable = 'inTable',
	inCaption = 'inCaption',
	inColumnGroup = 'inColumnGroup',
	inTableBody = 'inTableBody',
	inRow = 'inRow',
	inCell = 'inCell',
	inSelect = 'inSelect',
	inSelectInTable = 'inSelectInTable',
	inTemplate = 'inTemplate',
	afterBody = 'afterBody',
	inFrameset = 'inFrameset',
	afterFrameset = 'afterFrameset',
	afterAfterBody = 'afterAfterBody',
	afterAfterFrameset = 'afterAfterFrameset'
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
 * HTML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html
 */
export default class HTMLParser {
	private window: BrowserWindow;
	private enableScripts: boolean = false;
	private framesetOk: boolean = true;
	private elementPointer: {
		html: HTMLHtmlElement | null;
		head: HTMLHeadElement | null;
		body: HTMLBodyElement | null;
		form: HTMLFormElement | null;
	} = {
		html: null,
		head: null,
		body: null,
		form: null
	};
	private rootNode: Element | DocumentFragment | Document | null = null;
	private rootDocument: Document | null = null;
	private nodeStack: Node[] = [];
	private tagNameStack: string[] = [];
    private impliedEndTags: string[] = [];
	private startTagIndex = 0;
	private markupRegExp: RegExp | null = null;
	private readState: MarkupReadStateEnum = MarkupReadStateEnum.data;
	private insertionMode: InsertionModeEnum = InsertionModeEnum.initial;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.enableScripts] Set to "true" to enable script execution
	 */
	constructor(
		window: BrowserWindow,
		options?: {
			enableScripts?: boolean;
		}
	) {
		this.window = window;

		if (options?.enableScripts) {
			this.enableScripts = true;
		}
	}
	/**
	 * Parses HTML a root element containing nodes found.
	 *
	 * @param html HTML string.
	 * @param [rootNode] Root node.
	 * @returns Root node.
	 */
	public parse(
		html: string,
		rootNode?: Element | DocumentFragment | Document
	): Element | DocumentFragment | Document {
		this.rootNode = rootNode || this.window.document.createDocumentFragment();
		this.rootDocument = this.rootNode instanceof Document ? this.rootNode : this.window.document;
		this.nodeStack = [this.rootNode];
		this.readState = <MarkupReadStateEnum>MarkupReadStateEnum.data;
		this.startTagIndex = 0;
		this.markupRegExp = new RegExp(MARKUP_REGEXP, 'gm');
		this.insertionMode = this.getInitialInsertionMode(this.rootNode);

		if (rootNode instanceof Element || rootNode instanceof DocumentFragment) {
			this.elementPointer.html = this.rootNode[PropertySymbol.ownerDocument].documentElement;
			this.elementPointer.head = this.rootNode[PropertySymbol.ownerDocument].head;
			this.elementPointer.body = this.rootNode[PropertySymbol.ownerDocument].body;
		} else {
			this.elementPointer.html = null;
			this.elementPointer.head = null;
			this.elementPointer.body = null;
		}

		let match: RegExpExecArray;
		let lastIndex = 0;
		let tagName: string | null = null;

		html = String(html);

		while ((match = this.markupRegExp.exec(html))) {
			switch (this.readState) {
				case MarkupReadStateEnum.data:
					// Plain text between tags.
					if (
						match.index !== lastIndex &&
						(match[1] || match[2] || match[3] || match[4] || match[5] !== undefined || match[6])
					) {
						this.parsePlainText(html.substring(lastIndex, match.index));
					}

					if (match[1]) {
						// Start tag.
						tagName = StringUtility.asciiUpperCase(match[1]);
						this.startTagIndex = this.markupRegExp.lastIndex;
						this.readState = MarkupReadStateEnum.tagName;
					} else if (match[2]) {
						// End tag.
						this.parseEndTag(match[2]);
					} else if (match[3]) {
						// Comment.
						this.startTagIndex = this.markupRegExp.lastIndex;
						this.readState = MarkupReadStateEnum.comment;
					} else if (match[5] !== undefined) {
						// Document type.
						this.startTagIndex = this.markupRegExp.lastIndex;
						this.readState = MarkupReadStateEnum.documentType;
					} else if (match[6]) {
						// Processing instruction.
						this.startTagIndex = this.markupRegExp.lastIndex;
						this.readState = MarkupReadStateEnum.processingInstruction;
					} else {
						// Plain text between tags, including the matched tag as it is not a valid start or end tag.
						this.parsePlainText(html.substring(lastIndex, this.markupRegExp.lastIndex));
					}

					break;
				case MarkupReadStateEnum.tagName:
					// End of start tag

					// match[2] is matching an end tag in case the start tag wasn't closed (e.g. "<div\n</ul>" instead of "<div>\n</ul>").
					// match[7] is matching "/>" (e.g. "<img/>").
					// match[8] is matching ">" (e.g. "<div>").
					if (match[7] || match[8] || match[2]) {
						const attributes = this.parseAttributes(
							html.substring(
								this.startTagIndex,
								match[2] ? this.markupRegExp.lastIndex - 1 : match.index
							)
						);

						// If attributes are null, the attribute string wasn't complete.
						// We should continue parsing until the next end of start tag.
						if (attributes !== null) {
							this.parseStartTag(tagName, attributes, !!match[7]);
						}
					}
					break;
				case MarkupReadStateEnum.comment:
					// Comment end tag.

					if (match[4]) {
						this.parseComment(html.substring(this.startTagIndex, match.index));
					}
					break;
				case MarkupReadStateEnum.documentType:
					// Document type end tag.

					if (match[7] || match[8]) {
						this.parseDocumentType(html.substring(this.startTagIndex, match.index));
					}
					break;
				case MarkupReadStateEnum.processingInstruction:
					// Processing instruction end tag.

					if (match[7] || match[8]) {
						// Processing instructions are not supported in HTML and are rendered as comments.
						this.parseComment('?' + html.substring(this.startTagIndex, match.index));
					}
					break;
				case MarkupReadStateEnum.rawText:
					// Raw text content of <script> and <style> elements.

					if (match[2]) {
						this.parseRawText(match[2], html.substring(this.startTagIndex, match.index));
					}
					break;
			}

			lastIndex = this.markupRegExp.lastIndex;
		}

		// Plain text after tags.

		if (lastIndex !== html.length && this.nodeStack.length > 1) {
			this.parsePlainText(html.substring(lastIndex));
		}

		return this.rootNode;
	}

	/**
	 * Parses plain text.
	 *
	 * @param text Text.
	 */
	private parsePlainText(text: string): void {
		if (this.documentStructure) {
			const level = this.documentStructure.level;
			const { documentElement, head, body } = this.documentStructure.nodes;

			// We should remove space in beginning inside the document and the <html> tag.
			const htmlText =
				(this.currentNode === this.rootNode || this.currentNode === documentElement) &&
				level < HTMLDocumentStructureLevelEnum.head &&
				body[PropertySymbol.elementArray].length === 0
					? text.replace(SPACE_IN_BEGINNING_REGEXP, '')
					: text;

			if (htmlText) {
				const textNode = this.rootDocument.createTextNode(
					XMLEncodeUtility.decodeHTMLEntities(htmlText)
				);
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
					} else if (body.lastChild?.[PropertySymbol.nodeType] === NodeTypeEnum.textNode) {
						// If the last child of the body is a text node, we should append the text to it.
						body.lastChild[PropertySymbol.data] += text;
					} else {
						// Nodes outside <html>, <head> and <body> should be appended to the body
						body[PropertySymbol.appendChild](textNode, true);
					}
				} else {
					this.currentNode[PropertySymbol.appendChild](textNode, true);
				}
			}
		} else {
			const textNode = this.rootDocument.createTextNode(XMLEncodeUtility.decodeHTMLEntities(text));
			this.currentNode[PropertySymbol.appendChild](textNode, true);
		}
	}

	/**
	 * Returns attributes.
	 *
	 * @param attributeString Attribute string.
	 * @returns Attributes or null if the string wasn't complete.
	 */
	private parseAttributes(attributeString: string): Map<string, string> | null {
		const attributes: Map<string, string> = new Map();
		let match: RegExpExecArray;

		if (attributeString.length === 0) {
			return attributes;
		}

		while ((match = ATTRIBUTE_REGEXP.exec(attributeString))) {
			const name = StringUtility.asciiLowerCase(match[1] || match[3] || match[6] || match[9]);
			const value = match[2] || match[4] || match[7] || '';

			// Missing end apostrophe, e.g. <div name="value>
			// We should ignore the attribute string and read until the next end of start tag.
			if ((match[3] && !match[5]) || (match[6] && !match[8])) {
				return null;
			}

			if (!attributes.has(name)) {
				attributes.set(name, value);
			}
		}

		return attributes;
	}

	/**
	 * Parses a start tag.
	 *
	 * @param name Tag name.
	 * @param attributes Attributes.
	 * @param isSelfClosed Is self closed.
	 */
	private parseStartTag(
		name: string,
		attributes: Map<string, string>,
		isSelfClosed: boolean
	): void {
		const tagName = StringUtility.asciiLowerCase(name);
		const currentNode = this.getCurrentNode();

		switch (currentNode[PropertySymbol.namespaceURI]) {
			case NamespaceURI.html:
				switch (this.insertionMode) {
					// https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode
					case InsertionModeEnum.beforeHTML:
						switch (tagName) {
							case 'html':
								this.appendElement(tagName, attributes);
								this.insertionMode = InsertionModeEnum.beforeHead;
								break;
							default:
								this.appendElement('html');
								this.insertionMode = InsertionModeEnum.beforeHead;
								this.parseStartTag(tagName, attributes, isSelfClosed);
								break;
						}
						break;
					// https://html.spec.whatwg.org/multipage/parsing.html#the-before-head-insertion-mode
					case InsertionModeEnum.beforeHead:
						switch (tagName) {
							case 'head':
								this.appendElement(tagName, attributes);
								this.insertionMode = InsertionModeEnum.inHead;
								break;
							default:
								this.appendElement('head');
								this.insertionMode = InsertionModeEnum.inHead;
								this.parseStartTag(tagName, attributes, isSelfClosed);
								break;
						}
						break;
					// https://html.spec.whatwg.org/multipage/parsing.html#the-in-head-insertion-mode
					case InsertionModeEnum.inHead:
						switch (tagName) {
							case 'html':
								this.insertionMode = InsertionModeEnum.inBody;
								this.parseStartTag(tagName, attributes, isSelfClosed);
								break;
							case 'base':
							case 'basefont':
							case 'bgsound':
							case 'link':
								this.appendElement(tagName, attributes);
								this.popCurrentNode();
								break;
							case 'meta':
								/**
								 * TODO: If the element has a charset attribute, and getting an encoding from its value results in an encoding, and the confidence is currently tentative, then change the encoding to the resulting encoding.
								 */
								this.appendElement('meta', attributes);
								this.popCurrentNode();
								break;
							case 'title':
								this.appendElement(tagName, attributes);
								break;
							case 'noscript':
								if (this.enableScripts) {
									this.appendElement('noscript', attributes);
									this.readState = MarkupReadStateEnum.rawText;
								} else {
									this.appendElement('noscript', attributes);
									this.insertionMode = InsertionModeEnum.inHeadNoscript;
									this.parseStartTag(tagName, attributes, isSelfClosed);
								}
								break;
							case 'noframes':
							case 'style':
							case 'script':
								this.appendElement(tagName, attributes);
								this.readState = MarkupReadStateEnum.rawText;
								break;
							case 'template':
								this.appendElement('template', attributes);
								break;
							default:
								this.insertionMode = InsertionModeEnum.afterHead;
								this.popCurrentNode();
								this.parseStartTag(tagName, attributes, isSelfClosed);
								break;
						}
						break;
					// https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inheadnoscript
					case InsertionModeEnum.inHeadNoscript:
						switch (tagName) {
							case 'html':
								this.insertionMode = InsertionModeEnum.inBody;
								this.parseStartTag(tagName, attributes, isSelfClosed);
								break;
							case 'base':
							case 'basefont':
							case 'bgsound':
							case 'link':
							case 'meta':
							case 'noframes':
							case 'style':
								this.appendElement(tagName, attributes);
								this.popCurrentNode();
								break;
							case 'head':
							case 'noscript':
								// Parse error
								break;
							default:
								// Parse error
								this.popCurrentNode();
								this.insertionMode = InsertionModeEnum.inHead;
								this.parseStartTag(tagName, attributes, isSelfClosed);
								break;
						}
						break;
					// https://html.spec.whatwg.org/multipage/parsing.html#the-after-head-insertion-mode
					case InsertionModeEnum.afterHead:
						switch (tagName) {
							case 'html':
								this.insertionMode = InsertionModeEnum.inBody;
								this.parseStartTag(tagName, attributes, isSelfClosed);
								break;
							case 'body':
								this.appendElement('body', attributes);
								this.framesetOk = false;
								this.insertionMode = InsertionModeEnum.inBody;
								break;
							case 'frameset':
								this.appendElement('frameset', attributes);
								this.insertionMode = InsertionModeEnum.inFrameset;
								break;
							case 'base':
							case 'basefont':
							case 'bgsound':
							case 'link':
							case 'meta':
							case 'noframes':
							case 'script':
							case 'style':
							case 'template':
							case 'title':
								// Parse error

								// The head element pointer cannot be null at this point.
								if (this.elementPointer.head) {
									// Push the node pointed to by the head element pointer onto the stack of open elements.
									this.nodeStack.push(this.elementPointer.head);
									this.insertionMode = InsertionModeEnum.inHead;
									this.parseStartTag(tagName, attributes, isSelfClosed);

									// Remove the node pointed to by the head element pointer from the stack of open elements. (It might not be the current node at this point.)
									const index = this.nodeStack.indexOf(this.elementPointer.head);
									if (index !== -1) {
										this.nodeStack.splice(index, 1);
									}
								}
								break;
							case 'head':
								// Parse error
								// Ignore the token
								break;
							default:
								this.appendElement('body');
								this.insertionMode = InsertionModeEnum.inBody;
								this.parseStartTag(tagName, attributes, isSelfClosed);
								break;
						}
						break;
					// https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody
					case InsertionModeEnum.inBody:
						switch (tagName) {
							case 'html':
								// Parse error
								// If there is a template element on the stack of open elements, then ignore the token.
								// Otherwise, for each attribute on the token, check to see if the attribute is already present on the top element of the stack of open elements. If it is not, add the attribute and its corresponding value to that element.

								if (this.elementPointer.html && !this.tagNameStack.includes('template')) {
									this.applyElementAttributes(this.elementPointer.html, attributes);
								}
								break;
							case 'base':
							case 'basefont':
							case 'bgsound':
							case 'link':
							case 'meta':
							case 'noframes':
							case 'script':
							case 'style':
							case 'template':
							case 'title':
								this.appendElement(tagName, attributes);
								break;
							case 'body':
								// Parse error
								// If the stack of open elements has only one node on it, if the second element on the stack of open elements is not a body element, or if there is a template element on the stack of open elements, then ignore the token. (fragment case or there is a template element on the stack)
								// Otherwise, set the frameset-ok flag to "not ok"; then, for each attribute on the token, check to see if the attribute is already present on the body element (the second element) on the stack of open elements, and if it is not, add the attribute and its corresponding value to that element.
								if (
									this.elementPointer.body &&
									this.nodeStack[1] === this.elementPointer.body &&
									!this.tagNameStack.includes('template')
								) {
									this.framesetOk = false;
									this.applyElementAttributes(this.elementPointer.body, attributes);
								}
								break;
							case 'frameset':
								// Parse error
								// If the stack of open elements has only one node on it, or if the second element on the stack of open elements is not a body element, then ignore the token. (fragment case or there is a template element on the stack)
								// If the frameset-ok flag is set to "not ok", ignore the token.

								if (
									this.nodeStack.length !== 1 &&
									this.nodeStack[1] === this.elementPointer.body &&
									!this.tagNameStack.includes('template') &&
									this.framesetOk
								) {
									// Otherwise, run the following steps:

									// 1. Remove the second element on the stack of open elements from its parent node, if it has one.
									this.elementPointer.body.remove();

									// 2. Pop all the nodes from the bottom of the stack of open elements, from the current node up to, but not including, the root html element.
									this.nodeStack.splice(1);
									this.tagNameStack.splice(1);
									this.elementPointer.body = null;
									this.elementPointer.html = null;
									this.elementPointer.head = null;

									// 3. Insert an HTML element for the token.
									this.appendElement('frameset', attributes);

									// 4. Switch the insertion mode to "in frameset".
									this.insertionMode = InsertionModeEnum.inFrameset;
								}
								break;
							case 'address':
							case 'article':
							case 'aside':
							case 'blockquote':
							case 'center':
							case 'details':
							case 'dialog':
							case 'dir':
							case 'div':
							case 'dl':
							case 'fieldset':
							case 'figcaption':
							case 'figure':
							case 'footer':
							case 'header':
							case 'hgroup':
							case 'main':
							case 'menu':
							case 'nav':
							case 'ol':
							case 'p':
							case 'search':
							case 'section':
							case 'summary':
							case 'ul':
								// If the stack of open elements has a p element in button scope, then close a p element.
								this.popTagName('p');
								this.appendElement(tagName, attributes);
								break;
							case 'h1':
							case 'h2':
							case 'h3':
							case 'h4':
							case 'h5':
							case 'h6':
								// If the stack of open elements has a p element in button scope, then close a p element.
								this.popTagName('p');
								// If the current node is an HTML element whose tag name is one of "h1", "h2", "h3", "h4", "h5", or "h6", then this is a parse error; pop the current node off the stack of open elements.
								switch (currentNode[PropertySymbol.tagName]) {
									case 'H1':
									case 'H2':
									case 'H3':
									case 'H4':
									case 'H5':
									case 'H6':
										// Parse error
										this.popCurrentNode();
										break;
								}
								this.appendElement(tagName, attributes);
								break;
							case 'pre':
							case 'listing':
								// If the stack of open elements has a p element in button scope, then close a p element.
								this.popTagName('p');
								this.appendElement(tagName, attributes);
								// Ignore the next line feed (LF) character token that would otherwise be appended to the current node.
								this.framesetOk = false;
								break;
							case 'form':
								// If the form element pointer is not null, and there is no template element on the stack of open elements, then this is a parse error; ignore the token.
								if (this.tagNameStack.includes('template')) {
									// If the stack of open elements has a p element in button scope, then close a p element.
									this.popTagName('p');
									this.appendElement(tagName, attributes);
								} else if (!this.elementPointer.form) {
									// If the stack of open elements has a p element in button scope, then close a p element.
									this.popTagName('p');
									this.elementPointer.form = <HTMLFormElement>(
										this.appendElement(tagName, attributes)
									);
								}
								break;
							case 'li':
								this.framesetOk = false;
                                for(let i = this.nodeStack.length - 1; i >= 0; i--){
                                    const node = this.nodeStack[i];
                                    if(node[PropertySymbol.tagName] === 'LI'){
                                        this.popTagName('li');
                                    }
                                }
								this.popTagName('li');
                                if()
						}
						break;
				}
				break;
			case NamespaceURI.svg:
				break;
		}

		if (tagName === 'SVG' || this.currentNode[PropertySymbol.namespaceURI] === NamespaceURI.svg) {
		}

		// New element content model
		if (config) {
			switch (config.contentModel) {
				case HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants:
					if (this.tagNameStack[this.tagNameStack.length - 1] === tagName) {
						this.ignoredTagNameStack.push(this.currentNode[PropertySymbol.tagName]);
						this.parseEndTag(tagName);
					}
					break;
				case HTMLElementConfigContentModelEnum.noSelfDescendants:
					if (this.tagNameStack.includes(tagName)) {
						this.ignoredTagNameStack.push(this.currentNode[PropertySymbol.tagName]);
						this.parseEndTag(tagName);
					}
					break;
			}
		}

		// Parent content model
		const parentConfig =
			this.currentNode[PropertySymbol.namespaceURI] === NamespaceURI.html
				? HTMLElementConfig[this.currentNode[PropertySymbol.tagName]?.toLowerCase()]
				: null;
		if (parentConfig) {
			switch (parentConfig.contentModel) {
				case HTMLElementConfigContentModelEnum.noForbiddenFirstLevelDescendants:
					if (parentConfig.forbiddenDescendants?.includes(lowerTagName)) {
						this.ignoredTagNameStack.push(this.currentNode[PropertySymbol.tagName]);
						this.parseEndTag(this.currentNode[PropertySymbol.tagName]);
					}
					break;
			}
		}

		if (this.nextElement[PropertySymbol.namespaceURI] === NamespaceURI.html) {
			switch (this.insertionMode) {
				case InsertionModeEnum.default:
					switch (tagName) {
						case 'TABLE':
							this.insertionMode = InsertionModeEnum.inTable;
							break;
					}
					break;
				// https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-intable
				case InsertionModeEnum.inTable:
					switch (tagName) {
						case 'CAPTION':
							this.insertionMode = InsertionModeEnum.inCaption;
							break;
						case 'COLGROUP':
							this.insertionMode = InsertionModeEnum.inColumnGroup;
							return;
						case 'COL':
							this.currentNode[PropertySymbol.appendChild](
								this.rootDocument.createElementNS(NamespaceURI.html, 'colgroup'),
								true
							);
							this.currentNode = this.currentNode.lastChild;
							this.insertionMode = InsertionModeEnum.inColumnGroup;
							break;
						case 'TBODY':
						case 'TFOOT':
						case 'THEAD':
							this.insertionMode = InsertionModeEnum.inTableBody;
							break;
						case 'TD':
						case 'TH':
						case 'TR':
							this.currentNode[PropertySymbol.appendChild](
								this.rootDocument.createElementNS(NamespaceURI.html, 'tbody'),
								true
							);
							this.currentNode = this.currentNode.lastChild;
							this.insertionMode = InsertionModeEnum.inTableBody;
							break;
						case 'TABLE':
							this.parseEndTag('TABLE');
							this.insertionMode = InsertionModeEnum.default;
							break;
						case 'FORM':
						case 'INPUT':
							break;
						default:
					}
					break;
			}
		}

		// Appends the new element to its parent
		if (this.documentStructure) {
			const { documentElement, head, body } = this.documentStructure.nodes;
			const level = this.documentStructure.level;
			// Appends the new node to its parent and sets is as current node.

			// Raw text elements (e.g. <script>) should be appended after the raw text has been added as content to the element.
			// <html>, <head> and <body> are special elements with context constraints. They are already available in the document.
			if (
				(!config || config.contentModel !== HTMLElementConfigContentModelEnum.rawText) &&
				this.nextElement !== documentElement &&
				this.nextElement !== head &&
				this.nextElement !== body
			) {
				// When parser mode is "htmlDocument", any element added directly to the document or document element should be added to the body.
				if (
					documentElement &&
					(this.currentNode === this.rootNode ||
						this.currentNode === documentElement ||
						(this.currentNode === head && level >= HTMLDocumentStructureLevelEnum.body))
				) {
					if (level < HTMLDocumentStructureLevelEnum.body) {
						this.documentStructure.level = HTMLDocumentStructureLevelEnum.afterBody;
					}
					body[PropertySymbol.appendChild](this.nextElement, true);
				} else {
					this.currentNode[PropertySymbol.appendChild](this.nextElement, true);
				}
			}
		} else {
			this.currentNode[PropertySymbol.appendChild](this.nextElement, true);
		}

		// Sets the new element as the current node.

		if (
			!this.documentStructure ||
			this.nextElement !== this.documentStructure.nodes.body ||
			this.documentStructure.level <= HTMLDocumentStructureLevelEnum.body
		) {
			this.currentNode = this.nextElement;
			this.nodeStack.push(this.currentNode);
			this.tagNameStack.push(tagName);

			if (this.documentStructure && this.nextElement === this.documentStructure.nodes.body) {
				this.documentStructure.level = HTMLDocumentStructureLevelEnum.afterBody;
			}

			// Check if the tag is a void element and should be closed immediately.
			// Elements in the SVG namespace can be self-closed (e.g. "/>").
			// "/>" will be ignored in the HTML namespace.
			if (
				config?.contentModel === HTMLElementConfigContentModelEnum.noDescendants ||
				(isSelfClosed &&
					(<Element>this.currentNode)[PropertySymbol.namespaceURI] === NamespaceURI.svg)
			) {
				this.nodeStack.pop();
				this.tagNameStack.pop();
				this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
				this.readState = MarkupReadStateEnum.any;
			} else {
				// We will set the read state to "rawText" for raw text elements such as <script> and <style> elements.
				this.readState =
					config?.contentModel === HTMLElementConfigContentModelEnum.rawText
						? MarkupReadStateEnum.rawTextElement
						: MarkupReadStateEnum.any;
			}
		} else {
			this.readState = MarkupReadStateEnum.any;
		}

		this.startTagIndex = this.markupRegExp.lastIndex;
	}

	/**
	 * Parses end tag.
	 *
	 * @param tagName Tag name.
	 */
	private parseEndTag(tagName: string): void {
		// SVG elements are case-sensitive.
		const name =
			this.currentNode[PropertySymbol.namespaceURI] === NamespaceURI.html
				? StringUtility.asciiUpperCase(tagName)
				: SVGElementConfig[tagName.toLowerCase()]?.localName || tagName;
		const index = this.tagNameStack.lastIndexOf(name);

		// We close all tags up until the first tag that matches the end tag.
		if (index !== -1) {
			this.nodeStack.splice(index, this.nodeStack.length - index);
			this.tagNameStack.splice(index, this.tagNameStack.length - index);
			this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
		} else if (this.currentNode[PropertySymbol.namespaceURI] === NamespaceURI.html) {
			const lowerName = StringUtility.asciiLowerCase(tagName);
			// An end tag whose tag name is "p"
			// If the stack of open elements does not have a p element in button scope, then this is a parse error; insert an HTML element for a "p" start tag token with no attributes.
			// https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody:close-a-p-element-8
			if (HTMLElementConfig[lowerName]?.appendElementForNonMatchingEndTag) {
				const index = this.ignoredTagNameStack.lastIndexOf(name);
				if (index !== -1) {
					this.ignoredTagNameStack.splice(index, 1);
				} else {
					this.currentNode[PropertySymbol.appendChild](
						this.rootDocument.createElementNS(NamespaceURI.html, lowerName),
						true
					);
				}
			}
		}
	}

	/**
	 * Parses comment.
	 *
	 * @param comment Comment.
	 */
	private parseComment(comment: string): void {
		const commentNode = this.rootDocument.createComment(
			XMLEncodeUtility.decodeHTMLEntities(comment)
		);

		if (this.documentStructure) {
			const level = this.documentStructure.level;
			const { documentElement, head, body } = this.documentStructure.nodes;

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
		} else {
			this.currentNode[PropertySymbol.appendChild](commentNode, true);
		}

		this.readState = MarkupReadStateEnum.any;
	}

	/**
	 * Parses document type.
	 *
	 * @param text Text.
	 */
	private parseDocumentType(text: string): void {
		const decodedText = XMLEncodeUtility.decodeHTMLEntities(text);

		if (this.documentStructure) {
			let { doctype } = this.documentStructure.nodes;
			const documentType = this.getDocumentType(decodedText);
			// Document type nodes are only allowed at the beginning of the document.
			if (documentType) {
				if (
					this.currentNode === this.rootNode &&
					this.documentStructure.level === HTMLDocumentStructureLevelEnum.root
				) {
					if (doctype) {
						doctype[PropertySymbol.name] = documentType.name;
						doctype[PropertySymbol.publicId] = documentType.publicId;
						doctype[PropertySymbol.systemId] = documentType.systemId;
					} else {
						doctype = (<Document>this.rootNode).implementation.createDocumentType(
							documentType.name,
							documentType.publicId,
							documentType.systemId
						);
						(<Document>this.rootNode).insertBefore(
							doctype,
							(<Document>this.rootNode).documentElement
						);
					}

					this.documentStructure.level = HTMLDocumentStructureLevelEnum.doctype;
				}
			} else {
				this.parseComment(decodedText);
			}
		} else {
			// Document type nodes are only allowed at the beginning of the document.
			if (!this.getDocumentType(decodedText)) {
				this.parseComment(decodedText);
			}
		}

		this.readState = MarkupReadStateEnum.any;
	}

	/**
	 * Parses raw text content for elements such as <script> and <style>.
	 *
	 * @param tagName End tag name.
	 * @param text Text.
	 */
	private parseRawText(tagName: string, text: string): void {
		const upperTagName =
			this.currentNode[PropertySymbol.namespaceURI] === NamespaceURI.html
				? StringUtility.asciiUpperCase(tagName)
				: tagName;

		if (upperTagName !== this.currentNode[PropertySymbol.tagName]) {
			return;
		}

		// Scripts are not allowed to be executed when they are parsed using innerHTML, outerHTML, replaceWith() etc.
		// However, they are allowed to be executed when document.write() is used.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
		if (upperTagName === 'SCRIPT') {
			(<HTMLScriptElement>this.currentNode)[PropertySymbol.evaluateScript] = this.enableScripts;
		} else if (upperTagName === 'LINK') {
			// An assumption that the same rule should be applied for the HTMLLinkElement is made here.
			(<HTMLLinkElement>this.currentNode)[PropertySymbol.evaluateCSS] = this.enableScripts;
		}

		// Plain text elements such as <script> and <style> should only contain text.
		// Plain text elements should not decode entities. See #1564.
		this.currentNode[PropertySymbol.appendChild](this.rootDocument.createTextNode(text), true);

		const rawTextElement = this.currentNode;

		this.nodeStack.pop();
		this.tagNameStack.pop();
		this.currentNode = this.nodeStack[this.nodeStack.length - 1] || this.rootNode;
		this.readState = MarkupReadStateEnum.any;

		// Appends the raw text element to its parent.

		if (this.documentStructure) {
			const { documentElement, body } = this.documentStructure.nodes;

			// When parser mode is "htmlDocument", any element added directly to the document or document element should be added to the body.
			if (
				documentElement &&
				(this.currentNode === this.rootNode || this.currentNode === documentElement)
			) {
				body[PropertySymbol.appendChild](rawTextElement, true);
			} else {
				this.currentNode[PropertySymbol.appendChild](rawTextElement, true);
			}
		} else {
			this.currentNode[PropertySymbol.appendChild](rawTextElement, true);
		}
	}

	/**
	 * Creates an element or returns a reference to it.
	 *
	 * @param tagName Tag name.
	 */
	private getStartTagElement(tagName: string): Element {
		const lowerTagName = StringUtility.asciiLowerCase(tagName);

		// Namespace URI is inherited from the parent element.
		const namespaceURI = this.currentNode[PropertySymbol.namespaceURI];

		// Namespace URI should be MathML when the tag name is "math".
		if (lowerTagName === 'math' || namespaceURI === NamespaceURI.mathML) {
			// <mi> is a special case where children of it can escape the Math ML namespace if it isn't a known Math ML element.
			if (this.currentNode[PropertySymbol.tagName] === 'mi' && !MathMLElementConfig[lowerTagName]) {
				if (lowerTagName === 'svg') {
					return this.rootDocument.createElementNS(NamespaceURI.svg, 'svg');
				}
				return this.rootDocument.createElementNS(NamespaceURI.html, lowerTagName);
			}
			return this.rootDocument.createElementNS(NamespaceURI.mathML, tagName);
		}

		// Namespace URI should be SVG when the tag name is "svg".
		if (lowerTagName === 'svg') {
			return this.rootDocument.createElementNS(NamespaceURI.svg, 'svg');
		}

		if (namespaceURI === NamespaceURI.svg) {
			// <foreignObject> is a special case where children of it escapes the SVG namespace.
			// @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject
			if (this.currentNode[PropertySymbol.tagName] === 'foreignObject') {
				return this.rootDocument.createElementNS(NamespaceURI.html, lowerTagName);
			}
			const config = SVGElementConfig[lowerTagName];
			if (config) {
				return this.rootDocument.createElementNS(NamespaceURI.svg, config.localName);
			}
			// Some HTML tags escapes the SVG namespace
			// We should then end all SVG elements up to the first matching <svg> tag
			if (HTMLElementConfig[lowerTagName]?.escapesSVGNamespace) {
				this.parseEndTag('svg');
			} else {
				return this.rootDocument.createElementNS(NamespaceURI.svg, tagName);
			}
		}

		// New element.
		switch (lowerTagName) {
			case 'html':
				if (!this.documentStructure) {
					return null;
				}
				if (this.documentStructure.level < HTMLDocumentStructureLevelEnum.documentElement) {
					this.documentStructure.level = HTMLDocumentStructureLevelEnum.documentElement;
				}
				return this.documentStructure.nodes.documentElement ?? null;
			case 'head':
				if (!this.documentStructure) {
					return null;
				}
				if (this.documentStructure.level < HTMLDocumentStructureLevelEnum.head) {
					this.documentStructure.level = HTMLDocumentStructureLevelEnum.head;
				} else if (this.documentStructure.level === HTMLDocumentStructureLevelEnum.head) {
					this.documentStructure.level = HTMLDocumentStructureLevelEnum.additionalHeadWithoutBody;
				}
				return this.documentStructure.nodes.head ?? null;
			case 'body':
				if (!this.documentStructure) {
					return null;
				}
				if (this.documentStructure.level < HTMLDocumentStructureLevelEnum.body) {
					this.documentStructure.level = HTMLDocumentStructureLevelEnum.body;
				}
				return this.documentStructure.nodes.body ?? null;
			default:
				return this.rootDocument.createElementNS(NamespaceURI.html, lowerTagName);
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

		const docTypeSplit = value.split(SPACE_REGEXP);

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

	/**
	 * Applies attributes to an element.
	 *
	 * @param element Element.
	 * @param attributes Attributes.
	 */
	private applyElementAttributes(element: Element, attributes: Map<string, string> | null): void {
		if (!attributes) {
			return;
		}

		switch (element[PropertySymbol.namespaceURI]) {
			case NamespaceURI.html:
				for (const [name, value] of attributes) {
					if (!element.hasAttribute(name)) {
						element.setAttribute(name, value);
					}
				}
				break;
			case NamespaceURI.svg:
				for (const [name, value] of attributes) {
					// @see https://html.spec.whatwg.org/multipage/parsing.html#adjust-svg-attributes
					if (!element.hasAttribute(name)) {
						if (ForeignAttributeConfig[name]) {
							element.setAttributeNS(ForeignAttributeConfig[name], name, value);
						} else if (SVGAttributeConfig[name]) {
							element.setAttributeNS(null, SVGAttributeConfig[name], value);
						} else {
							element.setAttribute(name, value);
						}
					}
				}
				break;
			case NamespaceURI.mathML:
				for (const [name, value] of attributes) {
					// @see https://html.spec.whatwg.org/multipage/parsing.html#adjust-mathml-attributes
					if (!element.hasAttribute(name)) {
						if (ForeignAttributeConfig[name]) {
							element.setAttributeNS(ForeignAttributeConfig[name], name, value);
						} else if (MathMLAttributeConfig[name]) {
							element.setAttributeNS(null, MathMLAttributeConfig[name], value);
						} else {
							element.setAttribute(name, value);
						}
					}
				}
				break;
		}
	}

	/**
	 * Creates an element in the current namespace.
	 *
	 * @param tagName Tag name.
	 * @param attributes Attributes.
	 * @returns Element.
	 */
	private createElementInCurrentNamespace(
		tagName: string,
		attributes: Map<string, string> | null = null
	): Element {
		const currentNode = this.getCurrentNode();
		let newElement: Element;

		switch (currentNode[PropertySymbol.namespaceURI]) {
			case NamespaceURI.html:
				switch (tagName) {
					case 'svg':
						newElement = this.rootDocument.createElementNS(NamespaceURI.svg, tagName);
						this.applyElementAttributes(newElement, attributes);
						break;
					case 'math':
						newElement = this.rootDocument.createElementNS(NamespaceURI.mathML, tagName);
						this.applyElementAttributes(newElement, attributes);
						break;
					case 'html':
						if (this.elementPointer.html) {
							newElement = this.elementPointer.html;
						} else {
							newElement = this.rootDocument.createElementNS(NamespaceURI.html, tagName);
							this.elementPointer.html = <HTMLHtmlElement>newElement;
							this.applyElementAttributes(newElement, attributes);
						}
						break;
					case 'head':
						if (this.elementPointer.head) {
							newElement = this.elementPointer.head;
						} else {
							newElement = this.rootDocument.createElementNS(NamespaceURI.html, tagName);
							this.elementPointer.head = <HTMLHeadElement>newElement;
							this.applyElementAttributes(newElement, attributes);
						}
						break;
					case 'body':
						if (this.elementPointer.body) {
							newElement = this.elementPointer.body;
						} else {
							newElement = this.rootDocument.createElementNS(NamespaceURI.html, tagName);
							this.elementPointer.body = <HTMLBodyElement>newElement;
							this.applyElementAttributes(newElement, attributes);
						}
						break;
					default:
						newElement = this.rootDocument.createElementNS(NamespaceURI.html, tagName);
						this.applyElementAttributes(newElement, attributes);
						break;
				}
				break;
			case NamespaceURI.svg:
				newElement = this.rootDocument.createElementNS(NamespaceURI.svg, tagName);
				this.applyElementAttributes(newElement, attributes);
				break;
			case NamespaceURI.mathML:
				newElement = this.rootDocument.createElementNS(NamespaceURI.mathML, tagName);
				this.applyElementAttributes(newElement, attributes);
				break;
		}

		return newElement;
	}

	/**
	 * Creates an element and appends it to the current node.
	 *
	 * Sets the new element as the current node.
	 *
	 * @param tagName Tag name.
	 * @param attributes Attributes.
	 * @returns Element.
	 */
	private appendElement(tagName: string, attributes: Map<string, string> | null = null): Element {
		const currentNode = this.getCurrentNode();
		const newElement = this.createElementInCurrentNamespace(tagName, attributes);

		currentNode[PropertySymbol.appendChild](newElement, true);

		this.nodeStack.push(newElement);
		this.tagNameStack.push(tagName);

		return newElement;
	}

	/**
	 * Pops the current node from the stack.
	 */
	private popCurrentNode(): void {
		this.tagNameStack.pop();
		this.nodeStack.pop();
	}

	/**
	 * If a tag name is found in the stack, nodes will be popped until that tag name is found.
	 *
	 * @param tagName Tag name.
	 */
	private popTagName(tagName: string): void {
		const index = this.tagNameStack.lastIndexOf(tagName);

		if (index === -1) {
			return;
		}

		this.tagNameStack.splice(index);
		this.nodeStack.splice(index);
	}

	/**
	 * Returns the current node.
	 *
	 * @returns Current node.
	 */
	private getCurrentNode(): Node {
		return this.nodeStack[this.nodeStack.length - 1];
	}

	/**
	 * Returns the initial insertion mode.
	 *
	 * @param rootNode Root node.
	 * @returns Insertion mode.
	 */
	private getInitialInsertionMode(
		rootNode: Element | DocumentFragment | Document
	): InsertionModeEnum {
		if (rootNode instanceof Document) {
			return InsertionModeEnum.initial;
		}

		if (rootNode instanceof DocumentFragment) {
			return InsertionModeEnum.inBody;
		}

		switch (rootNode[PropertySymbol.tagName]) {
			case 'HTML':
				return InsertionModeEnum.beforeHTML;
			case 'HEAD':
				return InsertionModeEnum.inHead;
			case 'BODY':
				return InsertionModeEnum.inBody;
			case 'FRAMESET':
				return InsertionModeEnum.inFrameset;
			case 'SELECT':
				return InsertionModeEnum.inSelect;
			case 'TABLE':
				return InsertionModeEnum.inTable;
			case 'CAPTION':
				return InsertionModeEnum.inCaption;
			case 'COLGROUP':
				return InsertionModeEnum.inColumnGroup;
			case 'TBODY':
			case 'TFOOT':
			case 'THEAD':
				return InsertionModeEnum.inTableBody;
			case 'TR':
				return InsertionModeEnum.inRow;
			case 'TD':
			case 'TH':
				return InsertionModeEnum.inCell;
			case 'TEMPLATE':
				return InsertionModeEnum.inTemplate;
			default:
				return InsertionModeEnum.inBody;
		}
	}
}
