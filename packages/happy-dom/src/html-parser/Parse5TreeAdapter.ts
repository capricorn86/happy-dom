import type { TreeAdapter, TreeAdapterTypeMap } from 'parse5';
import { html, Token } from 'parse5';
import Document from '../nodes/document/Document.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import Element from '../nodes/element/Element.js';
import Comment from '../nodes/comment/Comment.js';
import Text from '../nodes/text/Text.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
import Node from '../nodes/node/Node.js';
import HTMLTemplateElement from '../nodes/html-template-element/HTMLTemplateElement.js';
import * as PropertySymbol from '../PropertySymbol.js';
import NamespaceURI from '../config/NamespaceURI.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement.js';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement.js';

type Attribute = Token.Attribute;
type NS = (typeof html.NS)[keyof typeof html.NS];
type DOCUMENT_MODE = (typeof html.DOCUMENT_MODE)[keyof typeof html.DOCUMENT_MODE];

const { DOCUMENT_MODE, NS } = html;

/**
 * Type map for Happy DOM nodes used with parse5.
 */
export interface IHappyDOMTreeAdapterMap
	extends TreeAdapterTypeMap<
		Node,
		Node,
		Node,
		Document,
		DocumentFragment,
		Element,
		Comment,
		Text,
		HTMLTemplateElement,
		DocumentType
	> {}

/**
 * Parse5 tree adapter for Happy DOM.
 *
 * This adapter allows parse5 to build Happy DOM nodes directly during parsing,
 * avoiding the need for post-processing conversion.
 */
export default class Parse5TreeAdapter implements TreeAdapter<IHappyDOMTreeAdapterMap> {
	#document: Document;
	#evaluateScripts: boolean;

	/**
	 * Constructor.
	 *
	 * @param window Browser window.
	 * @param [options] Options.
	 * @param [options.document] Document to use for creating nodes.
	 * @param [options.evaluateScripts] Whether to evaluate scripts.
	 */
	constructor(
		window: BrowserWindow,
		options?: {
			document?: Document;
			evaluateScripts?: boolean;
		}
	) {
		this.#document = options?.document || window.document;
		this.#evaluateScripts = options?.evaluateScripts ?? false;
	}

	/**
	 * Copies attributes to the given element. Only attributes that are not yet present in the element are copied.
	 *
	 * @param recipient Element to copy attributes into.
	 * @param attrs Attributes to copy.
	 */
	public adoptAttributes(recipient: Element, attrs: Attribute[]): void {
		for (const attr of attrs) {
			if (!recipient.hasAttribute(attr.name)) {
				this.setAttributeOnElement(recipient, attr);
			}
		}
	}

	/**
	 * Appends a child node to the given parent node.
	 *
	 * @param parentNode Parent node.
	 * @param newNode Child node.
	 */
	public appendChild(parentNode: Node, newNode: Node): void {
		parentNode[PropertySymbol.appendChild](newNode, true);
	}

	/**
	 * Creates a comment node.
	 *
	 * @param data Comment text.
	 * @returns Comment node.
	 */
	public createCommentNode(data: string): Comment {
		return this.#document.createComment(data);
	}

	/**
	 * Creates a text node.
	 *
	 * @param value Text content.
	 * @returns Text node.
	 */
	public createTextNode(value: string): Text {
		return this.#document.createTextNode(value);
	}

	/**
	 * Creates a document node.
	 *
	 * @returns Document node.
	 */
	public createDocument(): Document {
		// Create a minimal document without the default structure
		// parse5 will build the structure itself
		const doc = new this.#document[PropertySymbol.window].HTMLDocument();
		doc[PropertySymbol.defaultView] = this.#document[PropertySymbol.window];

		// Set isConnected to false so that scripts don't execute during parsing.
		// Scripts will execute when nodes are transferred to the target document.
		doc[PropertySymbol.isConnected] = false;

		// Remove the default document structure that HTMLDocument creates
		// parse5 will create its own html, head, body elements
		while (doc[PropertySymbol.nodeArray].length > 0) {
			const child = doc[PropertySymbol.nodeArray][0];
			doc[PropertySymbol.removeChild](child);
		}

		return doc;
	}

	/**
	 * Creates a document fragment node.
	 *
	 * @returns Document fragment node.
	 */
	public createDocumentFragment(): DocumentFragment {
		return this.#document.createDocumentFragment();
	}

	/**
	 * Creates an element node.
	 *
	 * @param tagName Tag name of the element.
	 * @param namespaceURI Namespace of the element.
	 * @param attrs Attribute name-value pair array.
	 * @returns Element node.
	 */
	public createElement(tagName: string, namespaceURI: NS, attrs: Attribute[]): Element {
		const ns = this.convertNamespace(namespaceURI);
		const element = this.#document.createElementNS(ns, tagName);

		for (const attr of attrs) {
			this.setAttributeOnElement(element, attr);
		}

		return element;
	}

	/**
	 * Removes a node from its parent.
	 *
	 * @param node Node to remove.
	 */
	public detachNode(node: Node): void {
		if (node.parentNode) {
			node.parentNode[PropertySymbol.removeChild](node);
		}
	}

	/**
	 * Returns the given element's attributes in an array.
	 *
	 * @param element Element.
	 * @returns Attributes array.
	 */
	public getAttrList(element: Element): Attribute[] {
		const attrs: Attribute[] = [];
		const attributes = element[PropertySymbol.attributes];

		// Use the iterator to get all attributes
		for (const attr of attributes) {
			attrs.push({
				name: attr[PropertySymbol.name] || '',
				value: attr[PropertySymbol.value] || '',
				namespace: attr[PropertySymbol.namespaceURI] || undefined,
				prefix: attr[PropertySymbol.prefix] || undefined
			});
		}

		return attrs;
	}

	/**
	 * Returns the given node's children in an array.
	 *
	 * @param node Node.
	 * @returns Children array.
	 */
	public getChildNodes(node: Node): Node[] {
		return node[PropertySymbol.nodeArray].slice();
	}

	/**
	 * Returns the given comment node's content.
	 *
	 * @param commentNode Comment node.
	 * @returns Comment content.
	 */
	public getCommentNodeContent(commentNode: Comment): string {
		return commentNode[PropertySymbol.data];
	}

	/**
	 * Returns document mode.
	 *
	 * @param _document Document node.
	 * @returns Document mode.
	 */
	public getDocumentMode(_document: Document): DOCUMENT_MODE {
		// Happy DOM always uses 'no-quirks' mode
		return DOCUMENT_MODE.NO_QUIRKS;
	}

	/**
	 * Returns the given document type node's name.
	 *
	 * @param doctypeNode Document type node.
	 * @returns Document type name.
	 */
	public getDocumentTypeNodeName(doctypeNode: DocumentType): string {
		return doctypeNode[PropertySymbol.name];
	}

	/**
	 * Returns the given document type node's public identifier.
	 *
	 * @param doctypeNode Document type node.
	 * @returns Public identifier.
	 */
	public getDocumentTypeNodePublicId(doctypeNode: DocumentType): string {
		return doctypeNode[PropertySymbol.publicId];
	}

	/**
	 * Returns the given document type node's system identifier.
	 *
	 * @param doctypeNode Document type node.
	 * @returns System identifier.
	 */
	public getDocumentTypeNodeSystemId(doctypeNode: DocumentType): string {
		return doctypeNode[PropertySymbol.systemId];
	}

	/**
	 * Returns the first child of the given node.
	 *
	 * @param node Node.
	 * @returns First child or null.
	 */
	public getFirstChild(node: Node): Node | null {
		return node[PropertySymbol.nodeArray][0] || null;
	}

	/**
	 * Returns the given element's namespace.
	 *
	 * @param element Element.
	 * @returns Namespace URI.
	 */
	public getNamespaceURI(element: Element): NS {
		const ns = element[PropertySymbol.namespaceURI];
		switch (ns) {
			case NamespaceURI.html:
				return NS.HTML;
			case NamespaceURI.svg:
				return NS.SVG;
			case NamespaceURI.mathML:
				return NS.MATHML;
			case NamespaceURI.xlink:
				return NS.XLINK;
			case NamespaceURI.xml:
				return NS.XML;
			case NamespaceURI.xmlns:
				return NS.XMLNS;
			default:
				return NS.HTML;
		}
	}

	/**
	 * Returns the given node's source code location information.
	 *
	 * @param _node Node.
	 * @returns Location info (not supported, returns null).
	 */
	public getNodeSourceCodeLocation(_node: Node): null {
		return null;
	}

	/**
	 * Returns the given node's parent.
	 *
	 * @param node Node.
	 * @returns Parent node or null.
	 */
	public getParentNode(node: Node): Node | null {
		return node[PropertySymbol.parentNode];
	}

	/**
	 * Returns the given element's tag name.
	 *
	 * @param element Element.
	 * @returns Tag name (lowercase).
	 */
	public getTagName(element: Element): string {
		return element[PropertySymbol.localName] || '';
	}

	/**
	 * Returns the given text node's content.
	 *
	 * @param textNode Text node.
	 * @returns Text content.
	 */
	public getTextNodeContent(textNode: Text): string {
		return textNode[PropertySymbol.data];
	}

	/**
	 * Returns the template element content element.
	 *
	 * @param templateElement Template element.
	 * @returns Content document fragment.
	 */
	public getTemplateContent(templateElement: HTMLTemplateElement): DocumentFragment {
		return templateElement[PropertySymbol.content];
	}

	/**
	 * Inserts a child node to the given parent node before the given reference node.
	 *
	 * @param parentNode Parent node.
	 * @param newNode Child node.
	 * @param referenceNode Reference node.
	 */
	public insertBefore(parentNode: Node, newNode: Node, referenceNode: Node): void {
		parentNode[PropertySymbol.insertBefore](newNode, referenceNode, true);
	}

	/**
	 * Inserts text into a node.
	 *
	 * @param parentNode Node to insert text into.
	 * @param text Text to insert.
	 */
	public insertText(parentNode: Node, text: string): void {
		const lastChild =
			parentNode[PropertySymbol.nodeArray][parentNode[PropertySymbol.nodeArray].length - 1];

		if (lastChild && lastChild[PropertySymbol.nodeType] === NodeTypeEnum.textNode) {
			(<Text>lastChild)[PropertySymbol.data] += text;
		} else {
			this.appendChild(parentNode, this.createTextNode(text));
		}
	}

	/**
	 * Inserts text into a sibling node that goes before the reference node.
	 *
	 * @param parentNode Node to insert text into.
	 * @param text Text to insert.
	 * @param referenceNode Node to insert text before.
	 */
	public insertTextBefore(parentNode: Node, text: string, referenceNode: Node): void {
		const nodeArray = parentNode[PropertySymbol.nodeArray];
		const index = nodeArray.indexOf(referenceNode);
		const prevSibling = index > 0 ? nodeArray[index - 1] : null;

		if (prevSibling && prevSibling[PropertySymbol.nodeType] === NodeTypeEnum.textNode) {
			(<Text>prevSibling)[PropertySymbol.data] += text;
		} else {
			this.insertBefore(parentNode, this.createTextNode(text), referenceNode);
		}
	}

	/**
	 * Determines if the given node is a comment node.
	 *
	 * @param node Node.
	 * @returns True if comment node.
	 */
	public isCommentNode(node: Node): node is Comment {
		return node[PropertySymbol.nodeType] === NodeTypeEnum.commentNode;
	}

	/**
	 * Determines if the given node is a document type node.
	 *
	 * @param node Node.
	 * @returns True if document type node.
	 */
	public isDocumentTypeNode(node: Node): node is DocumentType {
		return node[PropertySymbol.nodeType] === NodeTypeEnum.documentTypeNode;
	}

	/**
	 * Determines if the given node is an element.
	 *
	 * @param node Node.
	 * @returns True if element.
	 */
	public isElementNode(node: Node): node is Element {
		return node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode;
	}

	/**
	 * Determines if the given node is a text node.
	 *
	 * @param node Node.
	 * @returns True if text node.
	 */
	public isTextNode(node: Node): node is Text {
		return node[PropertySymbol.nodeType] === NodeTypeEnum.textNode;
	}

	/**
	 * Sets the document mode.
	 *
	 * @param _document Document node.
	 * @param _mode Document mode.
	 */
	public setDocumentMode(_document: Document, _mode: DOCUMENT_MODE): void {
		// Happy DOM doesn't track document mode
	}

	/**
	 * Sets the document type.
	 *
	 * @param document Document node.
	 * @param name Document type name.
	 * @param publicId Document type public identifier.
	 * @param systemId Document type system identifier.
	 */
	public setDocumentType(
		document: Document,
		name: string,
		publicId: string,
		systemId: string
	): void {
		let doctype = document.doctype;

		if (doctype) {
			doctype[PropertySymbol.name] = name;
			doctype[PropertySymbol.publicId] = publicId;
			doctype[PropertySymbol.systemId] = systemId;
		} else {
			doctype = document.implementation.createDocumentType(name, publicId, systemId);
			document[PropertySymbol.insertBefore](doctype, document.documentElement, true);
		}
	}

	/**
	 * Attaches source code location information to the node.
	 *
	 * @param _node Node.
	 * @param _location Location info.
	 */
	public setNodeSourceCodeLocation(_node: Node, _location: null): void {
		// Source code location is not supported
	}

	/**
	 * Updates the source code location information of the node.
	 *
	 * @param _node Node.
	 * @param _location Location info.
	 */
	public updateNodeSourceCodeLocation(_node: Node, _location: object): void {
		// Source code location is not supported
	}

	/**
	 * Sets the template element content element.
	 *
	 * @param templateElement Template element.
	 * @param contentElement Content element.
	 */
	public setTemplateContent(
		templateElement: HTMLTemplateElement,
		contentElement: DocumentFragment
	): void {
		// The template content is already set during element creation
		// We need to move children from contentElement to the template's content
		const content = templateElement[PropertySymbol.content];
		const children = contentElement[PropertySymbol.nodeArray].slice();
		for (const child of children) {
			content[PropertySymbol.appendChild](child, true);
		}
	}

	/**
	 * Callback for elements being pushed to the stack of open elements.
	 *
	 * @param element The element being pushed.
	 */
	public onItemPush(element: Element): void {
		// Mark script and link elements for evaluation control
		const tagName = element[PropertySymbol.localName];
		if (tagName === 'script') {
			(<HTMLScriptElement>element)[PropertySymbol.disableEvaluation] = !this.#evaluateScripts;
		} else if (tagName === 'link') {
			(<HTMLLinkElement>element)[PropertySymbol.disableEvaluation] = !this.#evaluateScripts;
		}
	}

	/**
	 * Callback for elements being popped from the stack of open elements.
	 *
	 * @param _item The element being popped.
	 * @param _newTop The new top of the stack.
	 */
	public onItemPop(_item: Element, _newTop: Node): void {
		// No action needed
	}

	/**
	 * Converts parse5 namespace to Happy DOM namespace.
	 *
	 * @param ns Parse5 namespace.
	 * @returns Happy DOM namespace URI.
	 */
	private convertNamespace(ns: NS): string {
		switch (ns) {
			case NS.HTML:
				return NamespaceURI.html;
			case NS.SVG:
				return NamespaceURI.svg;
			case NS.MATHML:
				return NamespaceURI.mathML;
			case NS.XLINK:
				return NamespaceURI.xlink;
			case NS.XML:
				return NamespaceURI.xml;
			case NS.XMLNS:
				return NamespaceURI.xmlns;
			default:
				return NamespaceURI.html;
		}
	}

	/**
	 * Sets an attribute on an element.
	 *
	 * @param element Element.
	 * @param attr Attribute.
	 */
	private setAttributeOnElement(element: Element, attr: Attribute): void {
		const ns = attr.namespace ? this.convertNamespace(<NS>attr.namespace) : null;

		if (ns) {
			element.setAttributeNS(ns, attr.name, attr.value);
		} else {
			element.setAttribute(attr.name, attr.value);
		}
	}
}
