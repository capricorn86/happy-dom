import Element from '../element/Element.js';
import HTMLUnknownElement from '../html-unknown-element/HTMLUnknownElement.js';
import Text from '../text/Text.js';
import Comment from '../comment/Comment.js';
import IWindow from '../../window/IWindow.js';
import Node from '../node/Node.js';
import NodeIterator from '../../tree-walker/NodeIterator.js';
import TreeWalker from '../../tree-walker/TreeWalker.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import XMLParser from '../../xml-parser/XMLParser.js';
import Event from '../../event/Event.js';
import DOMImplementation from '../../dom-implementation/DOMImplementation.js';
import ElementTag from '../../config/ElementTag.js';
import INodeFilter from '../../tree-walker/INodeFilter.js';
import Attr from '../attr/Attr.js';
import NamespaceURI from '../../config/NamespaceURI.js';
import DocumentType from '../document-type/DocumentType.js';
import ParentNodeUtility from '../parent-node/ParentNodeUtility.js';
import QuerySelector from '../../query-selector/QuerySelector.js';
import IDocument from './IDocument.js';
import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import DOMException from '../../exception/DOMException.js';
import CookieJar from '../../cookie/CookieJar.js';
import IElement from '../element/IElement.js';
import IHTMLScriptElement from '../html-script-element/IHTMLScriptElement.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import IDocumentType from '../document-type/IDocumentType.js';
import INode from '../node/INode.js';
import IComment from '../comment/IComment.js';
import IText from '../text/IText.js';
import IDocumentFragment from '../document-fragment/IDocumentFragment.js';
import INodeList from '../node/INodeList.js';
import NodeList from '../node/NodeList.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import IHTMLLinkElement from '../html-link-element/IHTMLLinkElement.js';
import IHTMLStyleElement from '../html-style-element/IHTMLStyleElement.js';
import DocumentReadyStateEnum from './DocumentReadyStateEnum.js';
import DocumentReadyStateManager from './DocumentReadyStateManager.js';
import Location from '../../location/Location.js';
import Selection from '../../selection/Selection.js';
import IShadowRoot from '../shadow-root/IShadowRoot.js';
import Range from '../../range/Range.js';
import IHTMLBaseElement from '../html-base-element/IHTMLBaseElement.js';
import IAttr from '../attr/IAttr.js';
import IProcessingInstruction from '../processing-instruction/IProcessingInstruction.js';
import ProcessingInstruction from '../processing-instruction/ProcessingInstruction.js';
import ElementUtility from '../element/ElementUtility.js';
import HTMLCollection from '../element/HTMLCollection.js';
import VisibilityStateEnum from './VisibilityStateEnum.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

const PROCESSING_INSTRUCTION_TARGET_REGEXP = /^[a-z][a-z0-9-]+$/;

/**
 * Document.
 */
export default class Document extends Node implements IDocument {
	public static _defaultView: IWindow = null;
	public static _windowClass: {} | null = null;
	public nodeType = Node.DOCUMENT_NODE;
	public adoptedStyleSheets: CSSStyleSheet[] = [];
	public implementation: DOMImplementation;
	public readonly readyState = DocumentReadyStateEnum.interactive;
	public readonly isConnected: boolean = true;
	public readonly defaultView: IWindow;
	public readonly referrer = '';
	public readonly _windowClass: {} | null = null;
	public readonly _readyStateManager: DocumentReadyStateManager;
	public readonly _children: IHTMLCollection<IElement> = new HTMLCollection<IElement>();
	public _activeElement: IHTMLElement = null;
	public _nextActiveElement: IHTMLElement = null;
	public _currentScript: IHTMLScriptElement = null;

	// Used as an unique identifier which is updated whenever the DOM gets modified.
	public _cacheID = 0;
	// Public in order to be accessible by the fetch and xhr.
	public _cookie = new CookieJar();

	protected _isFirstWrite = true;
	protected _isFirstWriteAfterOpen = false;

	private _selection: Selection = null;

	// Events
	public onreadystatechange: (event: Event) => void = null;
	public onpointerlockchange: (event: Event) => void = null;
	public onpointerlockerror: (event: Event) => void = null;
	public onbeforecopy: (event: Event) => void = null;
	public onbeforecut: (event: Event) => void = null;
	public onbeforepaste: (event: Event) => void = null;
	public onfreeze: (event: Event) => void = null;
	public onresume: (event: Event) => void = null;
	public onsearch: (event: Event) => void = null;
	public onvisibilitychange: (event: Event) => void = null;
	public onfullscreenchange: (event: Event) => void = null;
	public onfullscreenerror: (event: Event) => void = null;
	public onwebkitfullscreenchange: (event: Event) => void = null;
	public onwebkitfullscreenerror: (event: Event) => void = null;
	public onbeforexrselect: (event: Event) => void = null;
	public onabort: (event: Event) => void = null;
	public onbeforeinput: (event: Event) => void = null;
	public onblur: (event: Event) => void = null;
	public oncancel: (event: Event) => void = null;
	public oncanplay: (event: Event) => void = null;
	public oncanplaythrough: (event: Event) => void = null;
	public onchange: (event: Event) => void = null;
	public onclick: (event: Event) => void = null;
	public onclose: (event: Event) => void = null;
	public oncontextlost: (event: Event) => void = null;
	public oncontextmenu: (event: Event) => void = null;
	public oncontextrestored: (event: Event) => void = null;
	public oncuechange: (event: Event) => void = null;
	public ondblclick: (event: Event) => void = null;
	public ondrag: (event: Event) => void = null;
	public ondragend: (event: Event) => void = null;
	public ondragenter: (event: Event) => void = null;
	public ondragleave: (event: Event) => void = null;
	public ondragover: (event: Event) => void = null;
	public ondragstart: (event: Event) => void = null;
	public ondrop: (event: Event) => void = null;
	public ondurationchange: (event: Event) => void = null;
	public onemptied: (event: Event) => void = null;
	public onended: (event: Event) => void = null;
	public onerror: (event: Event) => void = null;
	public onfocus: (event: Event) => void = null;
	public onformdata: (event: Event) => void = null;
	public oninput: (event: Event) => void = null;
	public oninvalid: (event: Event) => void = null;
	public onkeydown: (event: Event) => void = null;
	public onkeypress: (event: Event) => void = null;
	public onkeyup: (event: Event) => void = null;
	public onload: (event: Event) => void = null;
	public onloadeddata: (event: Event) => void = null;
	public onloadedmetadata: (event: Event) => void = null;
	public onloadstart: (event: Event) => void = null;
	public onmousedown: (event: Event) => void = null;
	public onmouseenter: (event: Event) => void = null;
	public onmouseleave: (event: Event) => void = null;
	public onmousemove: (event: Event) => void = null;
	public onmouseout: (event: Event) => void = null;
	public onmouseover: (event: Event) => void = null;
	public onmouseup: (event: Event) => void = null;
	public onmousewheel: (event: Event) => void = null;
	public onpause: (event: Event) => void = null;
	public onplay: (event: Event) => void = null;
	public onplaying: (event: Event) => void = null;
	public onprogress: (event: Event) => void = null;
	public onratechange: (event: Event) => void = null;
	public onreset: (event: Event) => void = null;
	public onresize: (event: Event) => void = null;
	public onscroll: (event: Event) => void = null;
	public onsecuritypolicyviolation: (event: Event) => void = null;
	public onseeked: (event: Event) => void = null;
	public onseeking: (event: Event) => void = null;
	public onselect: (event: Event) => void = null;
	public onslotchange: (event: Event) => void = null;
	public onstalled: (event: Event) => void = null;
	public onsubmit: (event: Event) => void = null;
	public onsuspend: (event: Event) => void = null;
	public ontimeupdate: (event: Event) => void = null;
	public ontoggle: (event: Event) => void = null;
	public onvolumechange: (event: Event) => void = null;
	public onwaiting: (event: Event) => void = null;
	public onwebkitanimationend: (event: Event) => void = null;
	public onwebkitanimationiteration: (event: Event) => void = null;
	public onwebkitanimationstart: (event: Event) => void = null;
	public onwebkittransitionend: (event: Event) => void = null;
	public onwheel: (event: Event) => void = null;
	public onauxclick: (event: Event) => void = null;
	public ongotpointercapture: (event: Event) => void = null;
	public onlostpointercapture: (event: Event) => void = null;
	public onpointerdown: (event: Event) => void = null;
	public onpointermove: (event: Event) => void = null;
	public onpointerrawupdate: (event: Event) => void = null;
	public onpointerup: (event: Event) => void = null;
	public onpointercancel: (event: Event) => void = null;
	public onpointerover: (event: Event) => void = null;
	public onpointerout: (event: Event) => void = null;
	public onpointerenter: (event: Event) => void = null;
	public onpointerleave: (event: Event) => void = null;
	public onselectstart: (event: Event) => void = null;
	public onselectionchange: (event: Event) => void = null;
	public onanimationend: (event: Event) => void = null;
	public onanimationiteration: (event: Event) => void = null;
	public onanimationstart: (event: Event) => void = null;
	public ontransitionrun: (event: Event) => void = null;
	public ontransitionstart: (event: Event) => void = null;
	public ontransitionend: (event: Event) => void = null;
	public ontransitioncancel: (event: Event) => void = null;
	public oncopy: (event: Event) => void = null;
	public oncut: (event: Event) => void = null;
	public onpaste: (event: Event) => void = null;
	public onbeforematch: (event: Event) => void = null;

	/**
	 * Creates an instance of Document.
	 *
	 */
	constructor() {
		super();

		this.defaultView = (<typeof Document>this.constructor)._defaultView;
		this.implementation = new DOMImplementation(this);

		this._windowClass = (<typeof Document>this.constructor)._windowClass;
		this._readyStateManager = new DocumentReadyStateManager(this.defaultView);
		this._rootNode = this;

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
	 * Returns document children.
	 */
	public get children(): IHTMLCollection<IElement> {
		return this._children;
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
	 * Returns title.
	 *
	 * @returns Title.
	 */
	public get title(): string {
		const element = ParentNodeUtility.getElementByTagName(this, 'title');
		if (element) {
			return element.textContent;
		}
		return '';
	}

	/**
	 * Returns set title.
	 *
	 */
	public set title(title: string) {
		const element = ParentNodeUtility.getElementByTagName(this, 'title');
		if (element) {
			element.textContent = title;
		} else {
			const newElement = this.createElement('title');
			newElement.textContent = title;
			this.head.appendChild(newElement);
		}
	}

	/**
	 * Returns a collection of all area elements and a elements in a document with a value for the href attribute.
	 */
	public get links(): IHTMLCollection<IHTMLElement> {
		return <IHTMLCollection<IHTMLElement>>this.querySelectorAll('a[href],area[href]');
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this._children.length;
	}

	/**
	 * First element child.
	 *
	 * @returns Element.
	 */
	public get firstElementChild(): IElement {
		return this._children[0] ?? null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): IElement {
		return this._children[this._children.length - 1] ?? null;
	}

	/**
	 * Returns cookie string.
	 *
	 * @returns Cookie.
	 */
	public get cookie(): string {
		return this._cookie.getCookieString(this.defaultView.location, true);
	}

	/**
	 * Sets a cookie string.
	 *
	 * @param cookie Cookie string.
	 */
	public set cookie(cookie: string) {
		this._cookie.addCookieString(this.defaultView.location, cookie);
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
		for (const node of this._childNodes) {
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
		if (this._activeElement && !this._activeElement.isConnected) {
			this._activeElement = null;
		}

		if (this._activeElement && this._activeElement instanceof Element) {
			let rootNode: IShadowRoot | IDocument = <IShadowRoot | IDocument>(
				this._activeElement.getRootNode()
			);
			let activeElement: IHTMLElement = this._activeElement;
			while (rootNode !== this) {
				activeElement = <IHTMLElement>(<IShadowRoot>rootNode).host;
				rootNode = activeElement ? <IShadowRoot | IDocument>activeElement.getRootNode() : this;
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
		return this.defaultView.location;
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
	 * Returns base URI.
	 *
	 * @override
	 * @returns Base URI.
	 */
	public get baseURI(): string {
		const element = <IHTMLBaseElement | null>ParentNodeUtility.getElementByTagName(this, 'base');
		if (element) {
			return element.href;
		}
		return this.defaultView.location.href;
	}

	/**
	 * Returns URL.
	 *
	 * @returns the URL of the current document.
	 * */
	public get URL(): string {
		return this.defaultView.location.href;
	}

	/**
	 * Returns document URI.
	 *
	 * @returns the URL of the current document.
	 * */
	public get documentURI(): string {
		return this.URL;
	}

	/**
	 * Returns document visibility state.
	 *
	 * @returns the visibility state of the current document.
	 * */
	public get visibilityState(): VisibilityStateEnum {
		if (this.defaultView) {
			return VisibilityStateEnum.visible;
		}

		return VisibilityStateEnum.hidden;
	}

	/**
	 * Returns document hidden state.
	 *
	 * @returns the hidden state of the current document.
	 * */
	public get hidden(): boolean {
		if (this.defaultView) {
			return false;
		}

		return true;
	}

	/**
	 * Gets the currently executing script element.
	 *
	 * @returns the currently executing script element.
	 */
	public get currentScript(): IHTMLScriptElement {
		return this._currentScript;
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
		const getElementsByName = (
			parentNode: IElement | IDocumentFragment | IDocument,
			name: string
		): INodeList<IElement> => {
			const matches = new NodeList<IElement>();
			for (const child of (<Element | Document>parentNode)._children) {
				if (child.getAttributeNS(null, 'name') === name) {
					matches.push(child);
				}
				for (const match of getElementsByName(<IElement>child, name)) {
					matches.push(match);
				}
			}
			return matches;
		};
		return getElementsByName(this, name);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IDocument {
		(<typeof Document>this.constructor)._defaultView = this.defaultView;

		const clone = <Document>super.cloneNode(deep);

		if (deep) {
			for (const node of clone._childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					clone._children.push(<IElement>node);
				}
			}
		}

		return clone;
	}

	/**
	 * @override
	 */
	public override appendChild(node: INode): INode {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.appendChild(this, node);
	}

	/**
	 * @override
	 */
	public override removeChild(node: INode): INode {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.removeChild(this, node);
	}

	/**
	 * @override
	 */
	public override insertBefore(newNode: INode, referenceNode: INode | null): INode {
		if (arguments.length < 2) {
			throw new TypeError(
				`Failed to execute 'insertBefore' on 'Node': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.insertBefore(this, newNode, referenceNode);
	}

	/**
	 * Replaces the document HTML with new HTML.
	 *
	 * @param html HTML.
	 */
	public write(html: string): void {
		const root = <DocumentFragment>XMLParser.parse(this, html, { evaluateScripts: true });

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

			for (const node of root._childNodes) {
				if (node['tagName'] === 'HTML') {
					documentElement = node;
				} else if (node.nodeType === NodeTypeEnum.documentTypeNode) {
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
					const rootBody = <Element>ParentNodeUtility.getElementByTagName(root, 'body');
					const body = ParentNodeUtility.getElementByTagName(this, 'body');
					if (rootBody && body) {
						for (const child of rootBody._childNodes.slice()) {
							body.appendChild(child);
						}
					}
				}

				// Remaining nodes outside the <html> element are added to the <body> element.
				const body = ParentNodeUtility.getElementByTagName(this, 'body');
				if (body) {
					for (const child of root._childNodes.slice()) {
						if (child['tagName'] !== 'HTML' && child.nodeType !== NodeTypeEnum.documentTypeNode) {
							body.appendChild(child);
						}
					}
				}
			} else {
				const documentElement = this.createElement('html');
				const bodyElement = this.createElement('body');
				const headElement = this.createElement('head');

				for (const child of root._childNodes.slice()) {
					bodyElement.appendChild(child);
				}

				documentElement.appendChild(headElement);
				documentElement.appendChild(bodyElement);

				this.appendChild(documentElement);
			}
		} else {
			const bodyNode = ParentNodeUtility.getElementByTagName(root, 'body');
			const body = ParentNodeUtility.getElementByTagName(this, 'body');
			for (const child of (<Element>(bodyNode || root))._childNodes.slice()) {
				body.appendChild(child);
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

		for (const child of this._childNodes.slice()) {
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

		const elementClass: typeof Element =
			customElementClass || ElementTag[tagName] || HTMLUnknownElement;

		elementClass._ownerDocument = this;

		const element = new elementClass();
		element.tagName = tagName;
		(<IDocument>element.ownerDocument) = this;
		(<string>element.namespaceURI) = namespaceURI;
		if (element instanceof Element && options && options.is) {
			element._isValue = String(options.is);
		}

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
		Text._ownerDocument = this;
		return new Text(data);
	}

	/**
	 * Creates a comment node.
	 *
	 * @param [data] Text data.
	 * @returns Text node.
	 */
	public createComment(data?: string): IComment {
		Comment._ownerDocument = this;
		return new Comment(data);
	}

	/**
	 * Creates a document fragment.
	 *
	 * @returns Document fragment.
	 */
	public createDocumentFragment(): IDocumentFragment {
		DocumentFragment._ownerDocument = this;
		return new DocumentFragment();
	}

	/**
	 * Creates a node iterator.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	public createNodeIterator(
		root: INode,
		whatToShow = -1,
		filter: INodeFilter = null
	): NodeIterator {
		return new NodeIterator(root, whatToShow, filter);
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
		if (typeof this.defaultView[type] === 'function') {
			return new this.defaultView[type]('init');
		}
		return new Event('init');
	}

	/**
	 * Creates an Attr node.
	 *
	 * @param qualifiedName Name.
	 * @returns Attribute.
	 */
	public createAttribute(qualifiedName: string): IAttr {
		return this.createAttributeNS(null, qualifiedName.toLowerCase());
	}

	/**
	 * Creates a namespaced Attr node.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Qualified name.
	 * @returns Element.
	 */
	public createAttributeNS(namespaceURI: string, qualifiedName: string): IAttr {
		Attr._ownerDocument = this;
		const attribute = new Attr();
		attribute.namespaceURI = namespaceURI;
		attribute.name = qualifiedName;
		return <IAttr>attribute;
	}

	/**
	 * Imports a node.
	 *
	 * @param node Node to import.
	 * @param [deep=false] Set to "true" if the clone should be deep.
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
	 * Creates a range.
	 *
	 * @returns Range.
	 */
	public createRange(): Range {
		return new this.defaultView.Range();
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
		if (!this._selection) {
			this._selection = new Selection(this);
		}
		return this._selection;
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
	 * Triggered by window when it is ready.
	 */
	public _onWindowReady(): void {
		this._readyStateManager.whenComplete().then(() => {
			(<DocumentReadyStateEnum>this.readyState) = DocumentReadyStateEnum.complete;
			this.dispatchEvent(new Event('readystatechange'));
			this.dispatchEvent(new Event('load', { bubbles: true }));
		});
	}

	/**
	 * Creates a Processing Instruction node.
	 *
	 * @returns IProcessingInstruction.
	 * @param target
	 * @param data
	 */
	public createProcessingInstruction(target: string, data: string): IProcessingInstruction {
		if (!target || !PROCESSING_INSTRUCTION_TARGET_REGEXP.test(target)) {
			throw new DOMException(
				`Failed to execute 'createProcessingInstruction' on 'Document': The target provided ('${target}') is not a valid name.`
			);
		}
		if (data.includes('?>')) {
			throw new DOMException(
				`Failed to execute 'createProcessingInstruction' on 'Document': The data provided ('?>') contains '?>'`
			);
		}
		ProcessingInstruction._ownerDocument = this;
		const processingInstruction = new ProcessingInstruction(data);
		processingInstruction.target = target;
		return processingInstruction;
	}
}
