import Event from '../../event/Event.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import Document from '../document/Document.js';
import HTMLElement from '../html-element/HTMLElement.js';
import Node from '../node/Node.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import HTMLIFrameElementNamedNodeMap from './HTMLIFrameElementNamedNodeMap.js';
import CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import HTMLIFrameElementPageLoader from './HTMLIFrameElementPageLoader.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';
import { afterSetAttribute } from '../element/Element.js';

const sandboxFlags = [
	'allow-downloads',
	'allow-forms',
	'allow-modals',
	'allow-orientation-lock',
	'allow-pointer-lock',
	'allow-popups',
	'allow-popups-to-escape-sandbox',
	'allow-presentation',
	'allow-same-origin',
	'allow-scripts',
	'allow-top-navigation',
	'allow-top-navigation-by-user-activation',
	'allow-top-navigation-to-custom-protocols'
];

function checkSandboxFlags(tokens: DOMTokenList, vconsole: Console): void {
	const values = tokens.values();
	const invalidFlags: string[] = [];
	for (const token of values) {
		if (!sandboxFlags.includes(token)) {
			invalidFlags.push(token);
		}
	}
	if (invalidFlags.length > 0) {
		/* eslint-disable-next-line no-console */
		vconsole.error(
			`while parsing the 'sandbox' attribute: ` +
				(invalidFlags.length === 1
					? `'${invalidFlags[0]}' is an invalid sandbox flag.`
					: `${invalidFlags.map((f) => `'${f}'`).join(', ')} are invalid sandbox flags.`)
		);
	}
}

/**
 * HTML Iframe Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement.
 */
export default class HTMLIFrameElement extends HTMLElement {
	// Events
	public onload: (event: Event) => void | null = null;
	public onerror: (event: Event) => void | null = null;

	// Internal properties
	public override [PropertySymbol.attributes]: NamedNodeMap;
	private [PropertySymbol.sandbox]: DOMTokenList = null;
	// Private properties
	#contentWindowContainer: { window: BrowserWindow | CrossOriginBrowserWindow | null } = {
		window: null
	};
	#pageLoader: HTMLIFrameElementPageLoader;
	#console: Console;

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
		this.#console = browserFrame.page.console;
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
	public get sandbox(): DOMTokenList {
		if (!this[PropertySymbol.sandbox]) {
			this[PropertySymbol.sandbox] = new DOMTokenList(this, 'sandbox');
		}
		return <DOMTokenList>this[PropertySymbol.sandbox];
	}

	/**
	 * Sets sandbox.
	 */
	public set sandbox(domString: string) {
		const tokens = new DOMTokenList(this, 'sandbox');
		this[PropertySymbol.sandbox] = tokens;
		tokens.value = domString;
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
	 * Sets srcdoc.
	 *
	 * @param srcdoc Srcdoc.
	 */
	public set srcdoc(srcdoc: string) {
		this.setAttribute('srcdoc', srcdoc);
	}

	/**
	 * Returns referrer policy.
	 */
	public get referrerPolicy(): string {
		return this.getAttribute('referrerpolicy') || '';
	}

	/**
	 * Sets referrer policy.
	 *
	 * @param referrerPolicy Referrer policy.
	 */
	public set referrerPolicy(referrerPolicy: string) {
		this.setAttribute('referrerpolicy', referrerPolicy);
	}

	/**
	 * Returns content document.
	 *
	 * @returns Content document.
	 */
	public get contentDocument(): Document | null {
		return (<BrowserWindow>this.#contentWindowContainer.window)?.document ?? null;
	}

	/**
	 * Returns content window.
	 *
	 * @returns Content window.
	 */
	public get contentWindow(): BrowserWindow | CrossOriginBrowserWindow | null {
		return this.#contentWindowContainer.window;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectToNode](parentNode: Node = null): void {
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
	public cloneNode(deep = false): HTMLIFrameElement {
		return <HTMLIFrameElement>super.cloneNode(deep);
	}

	/**
	 * after sandbox attribute have been set
	 * @override
	 * @param name
	 */
	public [afterSetAttribute](name: string): void {
		if (name === 'sandbox' && this[PropertySymbol.sandbox] !== null) {
			checkSandboxFlags(this[PropertySymbol.sandbox], this.#console);
		}
	}
}
