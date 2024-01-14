import Event from '../../event/Event.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import IDocument from '../document/IDocument.js';
import HTMLElement from '../html-element/HTMLElement.js';
import INode from '../node/INode.js';
import IHTMLIFrameElement from './IHTMLIFrameElement.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import HTMLIFrameElementNamedNodeMap from './HTMLIFrameElementNamedNodeMap.js';
import ICrossOriginBrowserWindow from '../../window/ICrossOriginBrowserWindow.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import HTMLIFrameElementPageLoader from './HTMLIFrameElementPageLoader.js';

/**
 * HTML Iframe Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement.
 */
export default class HTMLIFrameElement extends HTMLElement implements IHTMLIFrameElement {
	// Events
	public onload: (event: Event) => void | null = null;
	public onerror: (event: Event) => void | null = null;

	// Internal properties
	public override [PropertySymbol.attributes]: INamedNodeMap;

	// Private properties
	#contentWindowContainer: { window: IBrowserWindow | ICrossOriginBrowserWindow | null } = {
		window: null
	};
	#pageLoader: HTMLIFrameElementPageLoader;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		super();
		this.#pageLoader = new HTMLIFrameElementPageLoader({
			element: this,
			contentWindowContainer: this.#contentWindowContainer,
			browserParentFrame: browserFrame
		});
		this[PropertySymbol.attributes] = new HTMLIFrameElementNamedNodeMap(this, this.#pageLoader);
	}

	/**
	 * Returns source.
	 *
	 * @returns Source.
	 */
	public get src(): string {
		return this.getAttribute('src') || '';
	}

	/**
	 * Sets source.
	 *
	 * @param src Source.
	 */
	public set src(src: string) {
		this.setAttribute('src', src);
	}

	/**
	 * Returns allow.
	 *
	 * @returns Allow.
	 */
	public get allow(): string {
		return this.getAttribute('allow') || '';
	}

	/**
	 * Sets allow.
	 *
	 * @param allow Allow.
	 */
	public set allow(allow: string) {
		this.setAttribute('allow', allow);
	}

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): string {
		return this.getAttribute('height') || '';
	}

	/**
	 * Sets height.
	 *
	 * @param height Height.
	 */
	public set height(height: string) {
		this.setAttribute('height', height);
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): string {
		return this.getAttribute('width') || '';
	}

	/**
	 * Sets width.
	 *
	 * @param width Width.
	 */
	public set width(width: string) {
		this.setAttribute('width', width);
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttribute('name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttribute('name', name);
	}

	/**
	 * Returns sandbox.
	 *
	 * @returns Sandbox.
	 */
	public get sandbox(): string {
		return this.getAttribute('sandbox') || '';
	}

	/**
	 * Sets sandbox.
	 *
	 * @param sandbox Sandbox.
	 */
	public set sandbox(sandbox: string) {
		this.setAttribute('sandbox', sandbox);
	}

	/**
	 * Returns srcdoc.
	 *
	 * @returns Srcdoc.
	 */
	public get srcdoc(): string {
		return this.getAttribute('srcdoc') || '';
	}

	/**
	 * Sets sandbox.
	 *
	 * @param srcdoc Srcdoc.
	 */
	public set srcdoc(srcdoc: string) {
		this.setAttribute('srcdoc', srcdoc);
	}

	/**
	 * Returns content document.
	 *
	 * @returns Content document.
	 */
	public get contentDocument(): IDocument | null {
		return (<IBrowserWindow>this.#contentWindowContainer.window)?.document ?? null;
	}

	/**
	 * Returns content window.
	 *
	 * @returns Content window.
	 */
	public get contentWindow(): IBrowserWindow | ICrossOriginBrowserWindow | null {
		return this.#contentWindowContainer.window;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectToNode](parentNode: INode = null): void {
		const isConnected = this[PropertySymbol.isConnected];
		const isParentConnected = parentNode ? parentNode[PropertySymbol.isConnected] : false;

		super[PropertySymbol.connectToNode](parentNode);

		if (isConnected !== isParentConnected) {
			if (isParentConnected) {
				this.#pageLoader.loadPage();
			} else {
				this.#pageLoader.unloadPage();
			}
		}
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLIFrameElement {
		return <IHTMLIFrameElement>super.cloneNode(deep);
	}
}
