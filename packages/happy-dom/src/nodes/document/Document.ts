import Element from '../element/Element';
import HTMLElement from '../html-element/HTMLElement';
import Text from '../text/Text';
import Comment from '../comment/Comment';
import Window from '../../window/Window';
import Node from '../node/Node';
import TreeWalker from '../../tree-walker/TreeWalker';
import DocumentFragment from '../document-fragment/DocumentFragment';
import XMLParser from '../../xml-parser/XMLParser';
import Event from '../../event/Event';
import DOMImplementation from '../../dom-implementation/DOMImplementation';
import ElementTag from '../../config/ElementTag';
import INodeFilter from '../../tree-walker/INodeFilter';
import Attr from '../../attribute/Attr';
import NamespaceURI from '../../config/NamespaceURI';
import DocumentType from '../document-type/DocumentType';
import ParentNodeUtility from '../parent-node/ParentNodeUtility';
import QuerySelector from '../../query-selector/QuerySelector';
import IDocument from './IDocument';
import CSSStyleSheet from '../../css/CSSStyleSheet';
import DOMException from '../../exception/DOMException';
import CookieUtility from '../../cookie/CookieUtility';
import IElement from '../element/IElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IDocumentType from '../document-type/IDocumentType';
import INode from '../node/INode';
import ICharacterData from '../character-data/ICharacterData';
import IDocumentFragment from '../document-fragment/IDocumentFragment';

/**
 * Document.
 */
export default class Document extends Node implements IDocument {
	public defaultView: Window = null;
	public nodeType = Node.DOCUMENT_NODE;
	public adoptedStyleSheets: CSSStyleSheet[] = [];
	protected _isConnected = true;
	protected _isFirstWrite = true;
	protected _isFirstWriteAfterOpen = false;
	public implementation: DOMImplementation;
	public readonly children: Element[] = [];
	private _cookie = '';

	/**
	 * Creates an instance of Document.
	 */
	constructor() {
		super();

		this.implementation = new DOMImplementation();
		this.implementation._ownerDocument = this;

		const doctype = this.implementation.createDocumentType('html', '', '');
		const documentElement = this.createElement('html');
		const bodyElement = this.createElement('body');
		const headElement = this.createElement('head');

		this.appendChild(doctype);
		this.appendChild(documentElement);

		documentElement.appendChild(headElement);
		documentElement.appendChild(bodyElement);
	}

	/**
	 * Last element child.
	 *
	 * @return Element.
	 */
	public get childElementCount(): number {
		return this.children.length;
	}

	/**
	 * First element child.
	 *
	 * @return Element.
	 */
	public get firstElementChild(): IElement {
		return this.children ? this.children[0] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @return Element.
	 */
	public get lastElementChild(): IElement {
		return this.children ? this.children[this.children.length - 1] || null : null;
	}

	/**
	 * Returns cookie string.
	 *
	 * @return Cookie.
	 */
	public get cookie(): string {
		return this._cookie;
	}

	/**
	 * Sets a cookie string.
	 *
	 * @param cookie Cookie string.
	 */
	public set cookie(cookie: string) {
		this._cookie = CookieUtility.getCookieString(this.defaultView.location, this._cookie, cookie);
	}

	/**
	 * Node name.
	 *
	 * @return Node name.
	 */
	public get nodeName(): string {
		return '#document';
	}

	/**
	 * Returns <html> element.
	 *
	 * @return Element.
	 */
	public get documentElement(): IHTMLElement {
		return <IHTMLElement>ParentNodeUtility.getElementByTagName(this, 'html');
	}

	/**
	 * Returns document type element.
	 *
	 * @return Document type.
	 */
	public get doctype(): IDocumentType {
		for (const node of this.childNodes) {
			if (node instanceof DocumentType) {
				return node;
			}
		}
		return null;
	}

	/**
	 * Returns <body> element.
	 *
	 * @return Element.
	 */
	public get body(): IHTMLElement {
		return <IHTMLElement>ParentNodeUtility.getElementByTagName(this, 'body');
	}

	/**
	 * Returns <head> element.
	 *
	 * @return Element.
	 */
	public get head(): IHTMLElement {
		return <IHTMLElement>ParentNodeUtility.getElementByTagName(this, 'head');
	}

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public append(...nodes: (INode | string)[]): void {
		ParentNodeUtility.append(this, ...nodes);
	}

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public prepend(...nodes: (INode | string)[]): void {
		ParentNodeUtility.prepend(this, ...nodes);
	}

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceChildren(...nodes: (INode | string)[]): void {
		ParentNodeUtility.replaceChildren(this, ...nodes);
	}

	/**
	 * Query CSS selector to find matching elments.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): IElement[] {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find a matching element.
	 *
	 * @param selector CSS selector.
	 * @return Matching element.
	 */
	public querySelector(selector: string): IElement {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching element.
	 */
	public getElementsByClassName(className: string): IElement[] {
		return <Element[]>ParentNodeUtility.getElementsByClassName(this, className);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName(tagName: string): IElement[] {
		return <Element[]>ParentNodeUtility.getElementsByTagName(this, tagName);
	}

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): IElement[] {
		return <Element[]>ParentNodeUtility.getElementsByTagNameNS(this, namespaceURI, tagName);
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @return Matching element.
	 */
	public getElementById(id: string): IElement {
		return <Element>ParentNodeUtility.getElementById(this, id);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): IDocument {
		const clone = <Document>super.cloneNode(deep);

		if (deep) {
			(<Element[]>clone.children) = <Element[]>(
				clone.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)
			);
		}

		clone.defaultView = this.defaultView;

		return clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @override
	 * @param  node Node to append.
	 * @return Appended node.
	 */
	public appendChild(node: INode): INode {
		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
			if (node.parentNode && node.parentNode['children']) {
				const index = node.parentNode['children'].indexOf(node);
				if (index !== -1) {
					node.parentNode['children'].splice(index, 1);
				}
			}
			if (node !== this && node.nodeType === Node.ELEMENT_NODE) {
				this.children.push(<Element>node);
			}
		}

		return super.appendChild(node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @override
	 * @param node Node to remove
	 */
	public removeChild(node: INode): void {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const index = this.children.indexOf(<Element>node);
			if (index !== -1) {
				this.children.splice(index, 1);
			}
		}

		super.removeChild(node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @override
	 * @param newNode Node to insert.
	 * @param [referenceNode] Node to insert before.
	 * @return Inserted node.
	 */
	public insertBefore(newNode: INode, referenceNode?: INode): INode {
		const returnValue = super.insertBefore(newNode, referenceNode);

		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (newNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
			if (newNode.parentNode && newNode.parentNode['children']) {
				const index = newNode.parentNode['children'].indexOf(newNode);
				if (index !== -1) {
					newNode.parentNode['children'].splice(index, 1);
				}
			}

			(<Element[]>this.children) = <Element[]>(
				this.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)
			);
		}

		return returnValue;
	}

	/**
	 * Replaces the document HTML with new HTML.
	 *
	 * @param html HTML.
	 */
	public write(html: string): void {
		const root = XMLParser.parse(this, html, true);

		if (this._isFirstWrite || this._isFirstWriteAfterOpen) {
			if (this._isFirstWrite) {
				if (!this._isFirstWriteAfterOpen) {
					this.open();
				}

				this._isFirstWrite = false;
			}

			this._isFirstWriteAfterOpen = false;
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
				if (!this.documentElement) {
					if (documentTypeNode) {
						this.appendChild(documentTypeNode);
					}

					this.appendChild(documentElement);
				} else {
					const rootBody = root.querySelector('body');
					const body = this.querySelector('body');
					if (rootBody && body) {
						for (const child of rootBody.childNodes.slice()) {
							body.appendChild(child);
						}
					}
				}

				const body = this.querySelector('body');
				if (body) {
					for (const child of root.childNodes.slice()) {
						if (child['tagName'] !== 'HTML' && child.nodeType !== Node.DOCUMENT_TYPE_NODE) {
							body.appendChild(child);
						}
					}
				}
			} else {
				const documentElement = this.createElement('html');
				const bodyElement = this.createElement('body');
				const headElement = this.createElement('head');

				for (const child of root.childNodes.slice()) {
					bodyElement.appendChild(child);
				}

				documentElement.appendChild(headElement);
				documentElement.appendChild(bodyElement);

				this.appendChild(documentElement);
			}
		} else {
			const bodyNode = root.querySelector('body');
			for (const child of (bodyNode || root).childNodes.slice()) {
				this.body.appendChild(child);
			}
		}
	}

	/**
	 * Opens the document.
	 *
	 * @returns Document.
	 */
	public open(): IDocument {
		this._isFirstWriteAfterOpen = true;

		for (const eventType of Object.keys(this._listeners)) {
			const callbacks = this._listeners[eventType];
			if (callbacks) {
				for (const callback of callbacks) {
					this.removeEventListener(eventType, callback);
				}
			}
		}

		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}

		return this;
	}

	/**
	 * Closes the document.
	 */
	public close(): void {}

	/**
	 * Creates an element.
	 *
	 * @param tagName Tag name.
	 * @param [options] Options.
	 * @return Element.
	 */
	public createElement(tagName: string, options?: { is: string }): IElement {
		return this.createElementNS(NamespaceURI.html, tagName, options);
	}

	/**
	 * Creates an element with the specified namespace URI and qualified name.
	 *
	 * @param tagName Tag name.
	 * @param [options] Options.
	 * @return Element.
	 */
	public createElementNS(
		namespaceURI: string,
		qualifiedName: string,
		options?: { is: string }
	): IElement {
		let customElementClass;
		if (this.defaultView && options && options.is) {
			customElementClass = this.defaultView.customElements.get(options.is);
		} else if (this.defaultView) {
			customElementClass = this.defaultView.customElements.get(qualifiedName);
		}

		const elementClass = customElementClass
			? customElementClass
			: ElementTag[qualifiedName] || HTMLElement;

		elementClass.ownerDocument = this;

		const element = new elementClass();
		element.tagName = qualifiedName.toUpperCase();
		element.ownerDocument = this;
		element.namespaceURI = namespaceURI;

		return element;
	}

	/**
	 * Creates a text node.
	 *
	 * @param  data Text data.
	 * @returns Text node.
	 */
	public createTextNode(data: string): ICharacterData {
		Text.ownerDocument = this;
		return new Text(data);
	}

	/**
	 * Creates a comment node.
	 *
	 * @param  data Text data.
	 * @returns Text node.
	 */
	public createComment(data: string): ICharacterData {
		Comment.ownerDocument = this;
		return new Comment(data);
	}

	/**
	 * Creates a document fragment.
	 *
	 * @returns Document fragment.
	 */
	public createDocumentFragment(): IDocumentFragment {
		DocumentFragment.ownerDocument = this;
		return new DocumentFragment();
	}

	/**
	 * Creates a Tree Walker.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	public createTreeWalker(root: INode, whatToShow = -1, filter: INodeFilter = null): TreeWalker {
		return new TreeWalker(root, whatToShow, filter);
	}

	/**
	 * Creates an event.
	 *
	 * @legacy
	 * @param _type Type.
	 * @returns Event.
	 */
	public createEvent(_type: string): Event {
		return new Event('init');
	}

	/**
	 * Creates an Attr node.
	 *
	 * @param name Name.
	 * @return Attribute.
	 */
	public createAttribute(name: string): Attr {
		const attribute = new Attr();
		attribute.name = name.toLowerCase();
		return attribute;
	}

	/**
	 * Creates a namespaced Attr node.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Qualified name.
	 * @return Element.
	 */
	public createAttributeNS(namespaceURI: string, qualifiedName: string): Attr {
		const attribute = new Attr();
		attribute.namespaceURI = namespaceURI;
		attribute.name = qualifiedName;
		return attribute;
	}

	/**
	 * Imports a node.
	 *
	 * @param node Node to import.
	 * @param [deep=false] Set to "true" if the clone should be deep.
	 * @param Imported node.
	 */
	public importNode(node: INode, deep = false): INode {
		if (!(node instanceof Node)) {
			throw new DOMException('Parameter 1 was not of type Node.');
		}
		const clone = node.cloneNode(deep);
		(<Document>clone.ownerDocument) = this;
		return clone;
	}
}
