import Element from '../element/Element';
import HTMLUnknownElement from '../html-unknown-element/HTMLUnknownElement';
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
import IHTMLScriptElement from '../html-script-element/IHTMLScriptElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IDocumentType from '../document-type/IDocumentType';
import INode from '../node/INode';
import IComment from '../comment/IComment';
import IText from '../text/IText';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import INodeList from '../node/INodeList';
import IHTMLCollection from '../element/IHTMLCollection';
import HTMLCollectionFactory from '../element/HTMLCollectionFactory';
import IHTMLLinkElement from '../html-link-element/IHTMLLinkElement';
import IHTMLStyleElement from '../html-style-element/IHTMLStyleElement';
import DocumentReadyStateEnum from './DocumentReadyStateEnum';
import DocumentReadyStateManager from './DocumentReadyStateManager';
import Location from '../../location/Location';
import Selection from '../../selection/Selection';
import IShadowRoot from '../shadow-root/IShadowRoot';

/**
 * Document.
 */
export default class Document extends Node implements IDocument {
	public onreadystatechange: (event: Event) => void = null;
	public nodeType = Node.DOCUMENT_NODE;
	public adoptedStyleSheets: CSSStyleSheet[] = [];
	public implementation: DOMImplementation;
	public readonly children: IHTMLCollection<IElement> = HTMLCollectionFactory.create();
	public readonly readyState = DocumentReadyStateEnum.interactive;
	public readonly isConnected: boolean = true;
	public _readyStateManager: DocumentReadyStateManager = null;
	public _activeElement: IHTMLElement = null;
	protected _isFirstWrite = true;
	protected _isFirstWriteAfterOpen = false;
	private _defaultView: Window = null;
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
	 * Returns character set.
	 *
	 * @deprecated
	 * @returns Character set.
	 */
	public get charset(): string {
		return this.characterSet;
	}

	/**
	 * Returns character set.
	 *
	 * @returns Character set.
	 */
	public get characterSet(): string {
		const charset = this.querySelector('meta[charset]')?.getAttributeNS(null, 'charset');
		return charset ? charset : 'UTF-8';
	}

	/**
	 * Returns default view.
	 *
	 * @returns Default view.
	 */
	public get defaultView(): Window {
		return this._defaultView;
	}

	/**
	 * Sets a default view.
	 *
	 * @param defaultView Default view.
	 */
	public set defaultView(defaultView: Window) {
		this._defaultView = defaultView;
		this._readyStateManager = new DocumentReadyStateManager(defaultView);
		this._readyStateManager.whenComplete().then(() => {
			(<DocumentReadyStateEnum>this.readyState) = DocumentReadyStateEnum.complete;
			this.dispatchEvent(new Event('readystatechange'));
		});
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this.children.length;
	}

	/**
	 * First element child.
	 *
	 * @returns Element.
	 */
	public get firstElementChild(): IElement {
		return this.children ? this.children[0] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): IElement {
		return this.children ? this.children[this.children.length - 1] || null : null;
	}

	/**
	 * Returns cookie string.
	 *
	 * @returns Cookie.
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
	 * @returns Node name.
	 */
	public get nodeName(): string {
		return '#document';
	}

	/**
	 * Returns <html> element.
	 *
	 * @returns Element.
	 */
	public get documentElement(): IHTMLElement {
		return <IHTMLElement>ParentNodeUtility.getElementByTagName(this, 'html');
	}

	/**
	 * Returns document type element.
	 *
	 * @returns Document type.
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
	 * @returns Element.
	 */
	public get body(): IHTMLElement {
		return <IHTMLElement>ParentNodeUtility.getElementByTagName(this, 'body');
	}

	/**
	 * Returns <head> element.
	 *
	 * @returns Element.
	 */
	public get head(): IHTMLElement {
		return <IHTMLElement>ParentNodeUtility.getElementByTagName(this, 'head');
	}

	/**
	 * Returns CSS style sheets.
	 *
	 * @returns CSS style sheets.
	 */
	public get styleSheets(): CSSStyleSheet[] {
		const styles = <INodeList<IHTMLLinkElement | IHTMLStyleElement>>(
			this.querySelectorAll('link[rel="stylesheet"][href],style')
		);
		const styleSheets = [];
		for (const style of styles) {
			const sheet = style.sheet;
			if (sheet) {
				styleSheets.push(sheet);
			}
		}
		return styleSheets;
	}

	/**
	 * Returns active element.
	 *
	 * @returns Active element.
	 */
	public get activeElement(): IHTMLElement {
		if (this._activeElement) {
			let rootNode: IShadowRoot | IDocument = <IShadowRoot | IDocument>(
				this._activeElement.getRootNode()
			);
			let activeElement: IHTMLElement = this._activeElement;
			while (rootNode !== this) {
				activeElement = <IHTMLElement>(<IShadowRoot>rootNode).host;
				rootNode = <IShadowRoot | IDocument>activeElement.getRootNode();
			}
			return activeElement;
		}
		return this._activeElement || this.body || this.documentElement || null;
	}

	/**
	 * Returns scrolling element.
	 *
	 * @returns Scrolling element.
	 */
	public get scrollingElement(): IHTMLElement {
		return this.documentElement;
	}

	/**
	 * Returns location.
	 *
	 * @returns Location.
	 */
	public get location(): Location {
		return this._defaultView.location;
	}

	/**
	 * Returns scripts.
	 *
	 * @returns Scripts.
	 */
	public get scripts(): IHTMLCollection<IHTMLScriptElement> {
		return <IHTMLCollection<IHTMLScriptElement>>this.getElementsByTagName('script');
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
	public querySelectorAll(selector: string): INodeList<IElement> {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find a matching element.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
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
	public getElementsByClassName(className: string): IHTMLCollection<IElement> {
		return ParentNodeUtility.getElementsByClassName(this, className);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName(tagName: string): IHTMLCollection<IElement> {
		return ParentNodeUtility.getElementsByTagName(this, tagName);
	}

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): IHTMLCollection<IElement> {
		return ParentNodeUtility.getElementsByTagNameNS(this, namespaceURI, tagName);
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @returns Matching element.
	 */
	public getElementById(id: string): IElement {
		return <Element>ParentNodeUtility.getElementById(this, id);
	}

	/**
	 * Returns an element by Name.
	 *
	 * @returns Matching element.
	 * @param name
	 */
	public getElementsByName(name: string): INodeList<IElement> {
		const _getElementsByName = (
			_parentNode: IElement | IDocumentFragment | IDocument,
			_name: string
		): INodeList<IElement> => {
			const matches = HTMLCollectionFactory.create();
			for (const child of _parentNode.children) {
				if ((child.getAttributeNS(null, 'name') || '') === _name) {
					matches.push(child);
				}
				for (const match of _getElementsByName(<IElement>child, _name)) {
					matches.push(match);
				}
			}
			return matches;
		};
		return _getElementsByName(this, name);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IDocument {
		const clone = <Document>super.cloneNode(deep);

		if (deep) {
			for (const node of clone.childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					clone.children.push(<IElement>node);
				}
			}
		}

		clone.defaultView = this.defaultView;

		return clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @override
	 * @param  node Node to append.
	 * @returns Appended node.
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
	 * @param node Node to remove.
	 */
	public removeChild(node: INode): INode {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const index = this.children.indexOf(<Element>node);
			if (index !== -1) {
				this.children.splice(index, 1);
			}
		}

		return super.removeChild(node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @override
	 * @param newNode Node to insert.
	 * @param [referenceNode] Node to insert before.
	 * @returns Inserted node.
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

			this.children.length = 0;

			for (const node of this.childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					this.children.push(<IElement>node);
				}
			}
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
			const listeners = this._listeners[eventType];
			if (listeners) {
				for (const listener of listeners) {
					this.removeEventListener(eventType, listener);
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

	/* eslint-disable jsdoc/valid-types */

	/**
	 * Creates an element.
	 *
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElement(qualifiedName: string, options?: { is?: string }): IElement {
		return this.createElementNS(NamespaceURI.html, qualifiedName, options);
	}

	/**
	 * Creates an element with the specified namespace URI and qualified name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElementNS(
		namespaceURI: string,
		qualifiedName: string,
		options?: { is?: string }
	): IElement {
		const tagName = String(qualifiedName).toUpperCase();

		let customElementClass;
		if (this.defaultView && options && options.is) {
			customElementClass = this.defaultView.customElements.get(String(options.is));
		} else if (this.defaultView) {
			customElementClass = this.defaultView.customElements.get(tagName);
		}

		const elementClass = customElementClass || ElementTag[tagName] || HTMLUnknownElement;

		elementClass.ownerDocument = this;

		const element = new elementClass();
		element.tagName = tagName;
		element.ownerDocument = this;
		element.namespaceURI = namespaceURI;

		return element;
	}

	/* eslint-enable jsdoc/valid-types */

	/**
	 * Creates a text node.
	 *
	 * @param [data] Text data.
	 * @returns Text node.
	 */
	public createTextNode(data?: string): IText {
		Text.ownerDocument = this;
		return new Text(data);
	}

	/**
	 * Creates a comment node.
	 *
	 * @param [data] Text data.
	 * @returns Text node.
	 */
	public createComment(data?: string): IComment {
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
	 * @deprecated
	 * @param type Type.
	 * @returns Event.
	 */
	public createEvent(type: string): Event {
		if (this.defaultView[type]) {
			return new this.defaultView[type]('init');
		}
		return new Event('init');
	}

	/**
	 * Creates an Attr node.
	 *
	 * @param name Name.
	 * @returns Attribute.
	 */
	public createAttribute(name: string): Attr {
		const attribute = new Attr();
		attribute.name = name.toLowerCase();
		(<IDocument>attribute.ownerDocument) = this;
		return attribute;
	}

	/**
	 * Creates a namespaced Attr node.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Qualified name.
	 * @returns Element.
	 */
	public createAttributeNS(namespaceURI: string, qualifiedName: string): Attr {
		const attribute = new Attr();
		attribute.namespaceURI = namespaceURI;
		attribute.name = qualifiedName;
		(<IDocument>attribute.ownerDocument) = this;
		return attribute;
	}

	/**
	 * Imports a node.
	 *
	 * @param node Node to import.
	 * @param [deep=false] Set to "true" if the clone should be deep.
	 * @param Imported Node.
	 */
	public importNode(node: INode, deep = false): INode {
		if (!(node instanceof Node)) {
			throw new DOMException('Parameter 1 was not of type Node.');
		}
		const clone = node.cloneNode(deep);
		(<Document>clone.ownerDocument) = this;
		return clone;
	}

	/**
	 * Adopts a node.
	 *
	 * @param node Node to adopt.
	 * @returns Adopted node.
	 */
	public adoptNode(node: INode): INode {
		if (!(node instanceof Node)) {
			throw new DOMException('Parameter 1 was not of type Node.');
		}

		const adopted = node.parentNode ? node.parentNode.removeChild(node) : node;
		(<Document>adopted.ownerDocument) = this;
		return adopted;
	}

	/**
	 * Returns selection.
	 *
	 * @returns Selection.
	 */
	public getSelection(): Selection {
		return new Selection();
	}

	/**
	 * Returns a boolean value indicating whether the document or any element inside the document has focus.
	 *
	 * @returns "true" if the document has focus.
	 */
	public hasFocus(): boolean {
		return !!this.activeElement;
	}

	/**
	 * @override
	 */
	public dispatchEvent(event: Event): boolean {
		const returnValue = super.dispatchEvent(event);

		if (event.bubbles && !event._propagationStopped) {
			return this.defaultView.dispatchEvent(event);
		}

		return returnValue;
	}
}
