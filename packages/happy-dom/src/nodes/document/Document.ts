import Element from '../element/Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import Node from '../node/Node.js';
import NodeIterator from '../../tree-walker/NodeIterator.js';
import TreeWalker from '../../tree-walker/TreeWalker.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import XMLParser from '../../xml-parser/XMLParser.js';
import Event from '../../event/Event.js';
import DOMImplementation from '../../dom-implementation/DOMImplementation.js';
import HTMLElementLocalNameToClass from '../../config/HTMLElementLocalNameToClass.js';
import INodeFilter from '../../tree-walker/INodeFilter.js';
import NamespaceURI from '../../config/NamespaceURI.js';
import DocumentType from '../document-type/DocumentType.js';
import ParentNodeUtility from '../parent-node/ParentNodeUtility.js';
import QuerySelector from '../../query-selector/QuerySelector.js';
import IDocument from './IDocument.js';
import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import DOMException from '../../exception/DOMException.js';
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
import Location from '../../url/Location.js';
import Selection from '../../selection/Selection.js';
import IShadowRoot from '../shadow-root/IShadowRoot.js';
import Range from '../../range/Range.js';
import IHTMLBaseElement from '../html-base-element/IHTMLBaseElement.js';
import IAttr from '../attr/IAttr.js';
import IProcessingInstruction from '../processing-instruction/IProcessingInstruction.js';
import ElementUtility from '../element/ElementUtility.js';
import HTMLCollection from '../element/HTMLCollection.js';
import VisibilityStateEnum from './VisibilityStateEnum.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import CookieStringUtility from '../../cookie/urilities/CookieStringUtility.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import NodeFactory from '../NodeFactory.js';

const PROCESSING_INSTRUCTION_TARGET_REGEXP = /^[a-z][a-z0-9-]+$/;

/**
 * Document.
 */
export default class Document extends Node implements IDocument {
	// Internal properties
	public [PropertySymbol.children]: IHTMLCollection<IElement> = new HTMLCollection<IElement>();
	public [PropertySymbol.activeElement]: IHTMLElement = null;
	public [PropertySymbol.nextActiveElement]: IHTMLElement = null;
	public [PropertySymbol.currentScript]: IHTMLScriptElement = null;
	public [PropertySymbol.rootNode] = this;
	// Used as an unique identifier which is updated whenever the DOM gets modified.
	public [PropertySymbol.cacheID] = 0;
	public [PropertySymbol.isFirstWrite] = true;
	public [PropertySymbol.isFirstWriteAfterOpen] = false;
	public [PropertySymbol.nodeType] = NodeTypeEnum.documentNode;
	public [PropertySymbol.isConnected] = true;
	public [PropertySymbol.adoptedStyleSheets]: CSSStyleSheet[] = [];
	public [PropertySymbol.implementation] = new DOMImplementation(this);
	public [PropertySymbol.readyState] = DocumentReadyStateEnum.interactive;
	public [PropertySymbol.referrer] = '';
	public [PropertySymbol.defaultView]: IBrowserWindow | null = null;
	public [PropertySymbol.ownerWindow]: IBrowserWindow;

	// Private properties
	#selection: Selection = null;
	#browserFrame: IBrowserFrame;

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
	 * Constructor.
	 *
	 * @param injected Injected properties.
	 * @param injected.browserFrame Browser frame.
	 * @param injected.window Window.
	 */
	constructor(injected: { browserFrame: IBrowserFrame; window: IBrowserWindow }) {
		super();
		this.#browserFrame = injected.browserFrame;
		this[PropertySymbol.ownerWindow] = injected.window;
	}

	/**
	 * Returns adopted style sheets.
	 *
	 * @returns Adopted style sheets.
	 */
	public get adoptedStyleSheets(): CSSStyleSheet[] {
		return this[PropertySymbol.adoptedStyleSheets];
	}

	/**
	 * Sets adopted style sheets.
	 *
	 * @param value Adopted style sheets.
	 */
	public set adoptedStyleSheets(value: CSSStyleSheet[]) {
		this[PropertySymbol.adoptedStyleSheets] = value;
	}

	/**
	 * Returns DOM implementation.
	 *
	 * @returns DOM implementation.
	 */
	public get implementation(): DOMImplementation {
		return this[PropertySymbol.implementation];
	}

	/**
	 * Returns document ready state.
	 *
	 * @returns Document ready state.
	 */
	public get readyState(): DocumentReadyStateEnum {
		return this[PropertySymbol.readyState];
	}

	/**
	 * Returns referrer.
	 *
	 * @returns Referrer.
	 */
	public get referrer(): string {
		return this[PropertySymbol.referrer];
	}

	/**
	 * Returns default view.
	 *
	 * @returns Default view.
	 */
	public get defaultView(): IBrowserWindow | null {
		return this[PropertySymbol.defaultView];
	}

	/**
	 * Returns document children.
	 */
	public get children(): IHTMLCollection<IElement> {
		return this[PropertySymbol.children];
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
	 * Returns a collection of all form elements in a document.
	 */
	public get forms(): IHTMLCollection<IHTMLElement> {
		return <IHTMLCollection<IHTMLElement>>this.querySelectorAll('form');
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this[PropertySymbol.children].length;
	}

	/**
	 * First element child.
	 *
	 * @returns Element.
	 */
	public get firstElementChild(): IElement {
		return this[PropertySymbol.children][0] ?? null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): IElement {
		return this[PropertySymbol.children][this[PropertySymbol.children].length - 1] ?? null;
	}

	/**
	 * Returns cookie string.
	 *
	 * @returns Cookie.
	 */
	public get cookie(): string {
		return CookieStringUtility.cookiesToString(
			this.#browserFrame.page.context.cookieContainer.getCookies(
				this[PropertySymbol.ownerWindow].location,
				true
			)
		);
	}

	/**
	 * Sets a cookie string.
	 *
	 * @param cookie Cookie string.
	 */
	public set cookie(cookie: string) {
		this.#browserFrame.page.context.cookieContainer.addCookies([
			CookieStringUtility.stringToCookie(this[PropertySymbol.ownerWindow].location, cookie)
		]);
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
		for (const node of this[PropertySymbol.childNodes]) {
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
		if (
			this[PropertySymbol.activeElement] &&
			!this[PropertySymbol.activeElement][PropertySymbol.isConnected]
		) {
			this[PropertySymbol.activeElement] = null;
		}

		if (
			this[PropertySymbol.activeElement] &&
			this[PropertySymbol.activeElement] instanceof Element
		) {
			let rootNode: IShadowRoot | IDocument = <IShadowRoot | IDocument>(
				this[PropertySymbol.activeElement].getRootNode()
			);
			let activeElement: IHTMLElement = this[PropertySymbol.activeElement];
			while (rootNode !== this) {
				activeElement = <IHTMLElement>(<IShadowRoot>rootNode).host;
				rootNode = activeElement ? <IShadowRoot | IDocument>activeElement.getRootNode() : this;
			}
			return activeElement;
		}
		return this[PropertySymbol.activeElement] || this.body || this.documentElement || null;
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
		return this[PropertySymbol.ownerWindow].location;
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
		return this[PropertySymbol.ownerWindow].location.href;
	}

	/**
	 * Returns URL.
	 *
	 * @returns the URL of the current document.
	 * */
	public get URL(): string {
		return this[PropertySymbol.ownerWindow].location.href;
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
		return this[PropertySymbol.currentScript];
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
			for (const child of (<Element | Document>parentNode)[PropertySymbol.children]) {
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
		const clone = <Document>super.cloneNode(deep);

		if (deep) {
			for (const node of clone[PropertySymbol.childNodes]) {
				if (node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
					clone[PropertySymbol.children].push(<IElement>node);
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

		if (this[PropertySymbol.isFirstWrite] || this[PropertySymbol.isFirstWriteAfterOpen]) {
			if (this[PropertySymbol.isFirstWrite]) {
				if (!this[PropertySymbol.isFirstWriteAfterOpen]) {
					this.open();
				}

				this[PropertySymbol.isFirstWrite] = false;
			}

			this[PropertySymbol.isFirstWriteAfterOpen] = false;
			let documentElement = null;
			let documentTypeNode = null;

			for (const node of root[PropertySymbol.childNodes]) {
				if (node['tagName'] === 'HTML') {
					documentElement = node;
				} else if (node[PropertySymbol.nodeType] === NodeTypeEnum.documentTypeNode) {
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

					const head = <IElement>ParentNodeUtility.getElementByTagName(this, 'head');
					let body = <IElement>ParentNodeUtility.getElementByTagName(this, 'body');

					if (!body) {
						body = this.createElement('body');
						documentElement.appendChild(this.createElement('body'));
					}

					if (!head) {
						documentElement.insertBefore(this.createElement('head'), body);
					}
				} else {
					const rootBody = <Element>ParentNodeUtility.getElementByTagName(root, 'body');
					const body = ParentNodeUtility.getElementByTagName(this, 'body');
					if (rootBody && body) {
						for (const child of rootBody[PropertySymbol.childNodes].slice()) {
							body.appendChild(child);
						}
					}
				}

				// Remaining nodes outside the <html> element are added to the <body> element.
				const body = ParentNodeUtility.getElementByTagName(this, 'body');
				if (body) {
					for (const child of root[PropertySymbol.childNodes].slice()) {
						if (
							child['tagName'] !== 'HTML' &&
							child[PropertySymbol.nodeType] !== NodeTypeEnum.documentTypeNode
						) {
							body.appendChild(child);
						}
					}
				}
			} else {
				const documentElement = this.createElement('html');
				const bodyElement = this.createElement('body');
				const headElement = this.createElement('head');

				for (const child of root[PropertySymbol.childNodes].slice()) {
					bodyElement.appendChild(child);
				}

				documentElement.appendChild(headElement);
				documentElement.appendChild(bodyElement);

				this.appendChild(documentElement);
			}
		} else {
			const bodyNode = ParentNodeUtility.getElementByTagName(root, 'body');
			const body = ParentNodeUtility.getElementByTagName(this, 'body');
			for (const child of (<Element>(bodyNode || root))[PropertySymbol.childNodes].slice()) {
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
		this[PropertySymbol.isFirstWriteAfterOpen] = true;

		for (const eventType of Object.keys(this[PropertySymbol.listeners])) {
			const listeners = this[PropertySymbol.listeners][eventType];
			if (listeners) {
				for (const listener of listeners) {
					this.removeEventListener(eventType, listener);
				}
			}
		}

		for (const child of this[PropertySymbol.childNodes].slice()) {
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
		qualifiedName = String(qualifiedName);

		if (!qualifiedName) {
			throw new DOMException(
				"Failed to execute 'createElementNS' on 'Document': The qualified name provided is empty."
			);
		}

		// SVG element
		if (namespaceURI === NamespaceURI.svg) {
			const element = NodeFactory.createNode<IElement>(
				this,
				qualifiedName === 'svg'
					? this[PropertySymbol.ownerWindow].SVGSVGElement
					: this[PropertySymbol.ownerWindow].SVGElement
			);
			element[PropertySymbol.tagName] = qualifiedName;
			element[PropertySymbol.localName] = qualifiedName;
			element[PropertySymbol.namespaceURI] = namespaceURI;
			element[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;
			return element;
		}

		// Custom HTML element
		const customElement =
			this[PropertySymbol.ownerWindow].customElements[PropertySymbol.registry]?.[
				options && options.is ? String(options.is) : qualifiedName
			];

		if (customElement) {
			const element = NodeFactory.createNode<IElement>(this, customElement.elementClass);
			element[PropertySymbol.tagName] = qualifiedName.toUpperCase();
			element[PropertySymbol.localName] = qualifiedName;
			element[PropertySymbol.namespaceURI] = namespaceURI;
			element[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;
			return element;
		}

		const localName = qualifiedName.toLowerCase();
		const elementClass = this[PropertySymbol.ownerWindow][HTMLElementLocalNameToClass[localName]];

		// Known HTML element
		if (elementClass) {
			const element = NodeFactory.createNode<IElement>(this, elementClass);

			element[PropertySymbol.tagName] = qualifiedName.toUpperCase();
			element[PropertySymbol.localName] = localName;
			element[PropertySymbol.namespaceURI] = namespaceURI;
			element[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;

			return element;
		}

		// Unknown HTML element
		const element = NodeFactory.createNode<IElement>(
			this,
			// If the tag name contains a hyphen, it is an unknown custom element and we should use HTMLElement.
			localName.includes('-')
				? this[PropertySymbol.ownerWindow].HTMLElement
				: this[PropertySymbol.ownerWindow].HTMLUnknownElement
		);

		element[PropertySymbol.tagName] = qualifiedName.toUpperCase();
		element[PropertySymbol.localName] = localName;
		element[PropertySymbol.namespaceURI] = namespaceURI;
		element[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;

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
		return NodeFactory.createNode<IText>(this, this[PropertySymbol.ownerWindow].Text, data);
	}

	/**
	 * Creates a comment node.
	 *
	 * @param [data] Text data.
	 * @returns Text node.
	 */
	public createComment(data?: string): IComment {
		return NodeFactory.createNode<IComment>(this, this[PropertySymbol.ownerWindow].Comment, data);
	}

	/**
	 * Creates a document fragment.
	 *
	 * @returns Document fragment.
	 */
	public createDocumentFragment(): IDocumentFragment {
		return new this[PropertySymbol.ownerWindow].DocumentFragment();
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
		if (typeof this[PropertySymbol.ownerWindow][type] === 'function') {
			return new this[PropertySymbol.ownerWindow][type]('init');
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
		const attribute = NodeFactory.createNode<IAttr>(this, this[PropertySymbol.ownerWindow].Attr);
		attribute[PropertySymbol.namespaceURI] = namespaceURI;
		attribute[PropertySymbol.name] = qualifiedName;
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
		this.#importNode(clone);
		return clone;
	}

	/**
	 * Creates a range.
	 *
	 * @returns Range.
	 */
	public createRange(): Range {
		return new this[PropertySymbol.ownerWindow].Range();
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

		const adopted = node[PropertySymbol.parentNode]
			? node[PropertySymbol.parentNode].removeChild(node)
			: node;
		const document = this;
		Object.defineProperty(adopted, 'ownerDocument', { value: document });
		return adopted;
	}

	/**
	 * Returns selection.
	 *
	 * @returns Selection.
	 */
	public getSelection(): Selection {
		if (!this.#selection) {
			this.#selection = new Selection(this);
		}
		return this.#selection;
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
	 * Creates a Processing Instruction node.
	 *
	 * @param target Target.
	 * @param data Data.
	 * @returns IProcessingInstruction.
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
		const processingInstruction = NodeFactory.createNode<IProcessingInstruction>(
			this,
			this[PropertySymbol.ownerWindow].ProcessingInstruction,
			data
		);
		processingInstruction[PropertySymbol.target] = target;
		return processingInstruction;
	}

	/**
	 * Imports a node.
	 *
	 * @param node Node.
	 */
	#importNode(node: INode): void {
		node[PropertySymbol.ownerDocument] = this;

		for (const child of node[PropertySymbol.childNodes]) {
			this.#importNode(child);
		}
	}
}
