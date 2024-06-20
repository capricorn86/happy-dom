import Event from '../../event/Event.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import Document from '../document/Document.js';
import HTMLElement from '../html-element/HTMLElement.js';
import CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';
import Attr from '../attr/Attr.js';
import BrowserFrameFactory from '../../browser/utilities/BrowserFrameFactory.js';
import BrowserFrameURL from '../../browser/utilities/BrowserFrameURL.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import IRequestReferrerPolicy from '../../fetch/types/IRequestReferrerPolicy.js';

const SANDBOX_FLAGS = [
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

/**
 * HTML Iframe Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement.
 */
export default class HTMLIFrameElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLIFrameElement;

	// Events
	public onload: (event: Event) => void | null = null;
	public onerror: (event: Event) => void | null = null;

	// Internal properties
	public [PropertySymbol.sandbox]: DOMTokenList = null;

	// Private properties
	#contentWindowContainer: { window: BrowserWindow | CrossOriginBrowserWindow | null } = {
		window: null
	};
	#browserFrame: IBrowserFrame;
	#browserChildFrame: IBrowserFrame;
	#loadedSrcdoc: string | null = null;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		super();
		this.#browserFrame = browserFrame;

		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'set',
			this.#onSetAttribute.bind(this)
		);
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'remove',
			this.#onRemoveAttribute.bind(this)
		);
	}

	/**
	 * Returns source.
	 *
	 * @returns Source.
	 */
	public get src(): string {
		if (!this.hasAttribute('src')) {
			return '';
		}

		try {
			return new URL(this.getAttribute('src'), this[PropertySymbol.ownerDocument].location.href)
				.href;
		} catch (e) {
			return this.getAttribute('src');
		}
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
	public override [PropertySymbol.connectedToDocument](): void {
		super[PropertySymbol.connectedToDocument]();
		this.#loadPage();
	}

	/**
	 * Called when disconnected from document.
	 * @param e
	 */
	public [PropertySymbol.disconnectedFromDocument](): void {
		super[PropertySymbol.disconnectedFromDocument]();
		this.#unloadPage();
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLIFrameElement {
		return <HTMLIFrameElement>super[PropertySymbol.cloneNode](deep);
	}

	/**
	 * Triggered when an attribute is set.
	 *
	 * @param attribute Attribute.
	 * @param replacedAttribute Replaced attribute.
	 */
	#onSetAttribute(attribute: Attr, replacedAttribute: Attr | null): void {
		if (attribute[PropertySymbol.name] === 'srcdoc') {
			this.#loadPage();
		}

		if (
			attribute[PropertySymbol.name] === 'src' &&
			attribute[PropertySymbol.value] &&
			this[PropertySymbol.attributes]['srcdoc']?.value === undefined &&
			attribute[PropertySymbol.value] !== replacedAttribute?.[PropertySymbol.value]
		) {
			this.#loadPage();
		}

		if (attribute[PropertySymbol.name] === 'sandbox') {
			if (!this[PropertySymbol.sandbox]) {
				this[PropertySymbol.sandbox] = new DOMTokenList(this, 'sandbox');
			} else {
				this[PropertySymbol.sandbox][PropertySymbol.updateIndices]();
			}

			this.#validateSandboxFlags();
		}
	}

	/**
	 * Triggered when an attribute is removed.
	 *
	 * @param removedAttribute Removed attribute.
	 */
	#onRemoveAttribute(removedAttribute: Attr): void {
		if (
			removedAttribute[PropertySymbol.name] === 'srcdoc' ||
			removedAttribute[PropertySymbol.name] === 'src'
		) {
			this.#loadPage();
		}
	}

	/**
	 *
	 * @param tokens
	 * @param vconsole
	 */
	#validateSandboxFlags(): void {
		const window = this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow];
		const values = this[PropertySymbol.sandbox].values();
		const invalidFlags: string[] = [];

		for (const token of values) {
			if (!SANDBOX_FLAGS.includes(token)) {
				invalidFlags.push(token);
			}
		}

		if (invalidFlags.length === 1) {
			window.console.error(
				`Error while parsing the 'sandbox' attribute: '${invalidFlags[0]}' is an invalid sandbox flag.`
			);
		} else if (invalidFlags.length > 1) {
			window.console.error(
				`Error while parsing the 'sandbox' attribute: '${invalidFlags.join(
					`', '`
				)}' are invalid sandbox flags.`
			);
		}
	}

	/**
	 * Loads an iframe page.
	 */
	#loadPage(): void {
		if (!this[PropertySymbol.isConnected]) {
			this.#unloadPage();
			return;
		}

		const srcdoc = this.getAttribute('srcdoc');
		const window = this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow];

		if (srcdoc !== null) {
			if (this.#loadedSrcdoc === srcdoc) {
				return;
			}

			this.#unloadPage();

			this.#browserChildFrame = BrowserFrameFactory.createChildFrame(this.#browserFrame);
			this.#browserChildFrame.url = 'about:srcdoc';

			this.#contentWindowContainer.window = this.#browserChildFrame.window;

			(<BrowserWindow>this.#browserChildFrame.window.top) = this.#browserFrame.window.top;
			(<BrowserWindow>this.#browserChildFrame.window.parent) = this.#browserFrame.window;

			this.#browserChildFrame.window.document.open();
			this.#browserChildFrame.window.document.write(srcdoc);

			this.#loadedSrcdoc = srcdoc;

			this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].requestAnimationFrame(() =>
				this.dispatchEvent(new Event('load'))
			);
			return;
		}

		if (this.#loadedSrcdoc !== null) {
			this.#unloadPage();
		}

		const originURL = this.#browserFrame.window.location;
		const targetURL = BrowserFrameURL.getRelativeURL(this.#browserFrame, this.src);

		if (
			this.#browserChildFrame &&
			this.#browserChildFrame.window.location.href === targetURL.href
		) {
			return;
		}

		if (this.#browserFrame.page.context.browser.settings.disableIframePageLoading) {
			WindowErrorUtility.dispatchError(
				this,
				new DOMException(
					`Failed to load iframe page "${targetURL.href}". Iframe page loading is disabled.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
			return;
		}

		// Iframes has a special rule for CORS and doesn't allow access between frames when the origin is different.
		const isSameOrigin = originURL.origin === targetURL.origin || targetURL.origin === 'null';
		const parentWindow = isSameOrigin ? window : new CrossOriginBrowserWindow(window);

		this.#browserChildFrame =
			this.#browserChildFrame ?? BrowserFrameFactory.createChildFrame(this.#browserFrame);

		(<BrowserWindow | CrossOriginBrowserWindow>(<unknown>this.#browserChildFrame.window.top)) =
			parentWindow;
		(<BrowserWindow | CrossOriginBrowserWindow>(<unknown>this.#browserChildFrame.window.parent)) =
			parentWindow;

		this.#browserChildFrame
			.goto(targetURL.href, {
				referrer: originURL.origin,
				referrerPolicy: <IRequestReferrerPolicy>this.referrerPolicy
			})
			.then(() => this.dispatchEvent(new Event('load')))
			.catch((error) => WindowErrorUtility.dispatchError(this, error));

		this.#contentWindowContainer.window = isSameOrigin
			? this.#browserChildFrame.window
			: new CrossOriginBrowserWindow(this.#browserChildFrame.window, window);
	}

	/**
	 * Unloads an iframe page.
	 */
	#unloadPage(): void {
		if (this.#browserChildFrame) {
			BrowserFrameFactory.destroyFrame(this.#browserChildFrame);
			this.#browserChildFrame = null;
		}
		this.#contentWindowContainer.window = null;
		this.#loadedSrcdoc = null;
	}
}
