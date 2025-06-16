import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElement from '../html-element/HTMLElement.js';
import Event from '../../event/Event.js';
import DOMTokenList from '../../dom/DOMTokenList.js';
import Attr from '../attr/Attr.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import WindowBrowserContext from '../../window/WindowBrowserContext.js';
import Fetch from '../../fetch/Fetch.js';
import BrowserErrorCaptureEnum from '../../browser/enums/BrowserErrorCaptureEnum.js';
import ModuleFactory from '../../module/ModuleFactory.js';
import PreloadUtility from '../../fetch/preload/PreloadUtility.js';
import PreloadEntry from '../../fetch/preload/PreloadEntry.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';

/**
 * HTML Link Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement.
 */
export default class HTMLLinkElement extends HTMLElement {
	// Internal properties
	public [PropertySymbol.sheet]: CSSStyleSheet | null = null;
	public [PropertySymbol.evaluateCSS] = true;
	public [PropertySymbol.relList]: DOMTokenList | null = null;
	#loadedStyleSheetURL: string | null = null;

	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get onerror(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onerror');
	}

	public set onerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onerror', value);
	}

	public get onload(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onload');
	}

	public set onload(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onload', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Returns sheet.
	 */
	public get sheet(): CSSStyleSheet | null {
		return this[PropertySymbol.sheet];
	}

	/**
	 * Returns rel list.
	 *
	 * @returns Rel list.
	 */
	public get relList(): DOMTokenList {
		if (!this[PropertySymbol.relList]) {
			this[PropertySymbol.relList] = new DOMTokenList(
				PropertySymbol.illegalConstructor,
				this,
				'rel',
				['stylesheet', 'modulepreload', 'preload']
			);
		}
		return <DOMTokenList>this[PropertySymbol.relList];
	}

	/**
	 * Sets rel list.
	 *
	 * @param value Value.
	 */
	public set relList(value: string) {
		this.setAttribute('rel', value);
	}

	/**
	 * Returns as.
	 *
	 * @returns As.
	 */
	public get as(): string {
		return this.getAttribute('as') || '';
	}

	/**
	 * Sets as.
	 *
	 * @param as As.
	 */
	public set as(as: string) {
		this.setAttribute('as', as);
	}

	/**
	 * Returns crossOrigin.
	 *
	 * @returns CrossOrigin.
	 */
	public get crossOrigin(): string {
		return this.getAttribute('crossorigin') || '';
	}

	/**
	 * Sets crossOrigin.
	 *
	 * @param crossOrigin CrossOrigin.
	 */
	public set crossOrigin(crossOrigin: string) {
		this.setAttribute('crossorigin', crossOrigin);
	}

	/**
	 * Returns href.
	 *
	 * @returns Href.
	 */
	public get href(): string {
		if (!this.hasAttribute('href')) {
			return '';
		}

		try {
			return new URL(this.getAttribute('href')!, this[PropertySymbol.ownerDocument].location.href)
				.href;
		} catch (e) {
			return this.getAttribute('href')!;
		}
	}

	/**
	 * Sets href.
	 *
	 * @param href Href.
	 */
	public set href(href: string) {
		this.setAttribute('href', href);
	}

	/**
	 * Returns hreflang.
	 *
	 * @returns Hreflang.
	 */
	public get hreflang(): string {
		return this.getAttribute('hreflang') || '';
	}

	/**
	 * Sets hreflang.
	 *
	 * @param hreflang Hreflang.
	 */
	public set hreflang(hreflang: string) {
		this.setAttribute('hreflang', hreflang);
	}

	/**
	 * Returns media.
	 *
	 * @returns Media.
	 */
	public get media(): string {
		return this.getAttribute('media') || '';
	}

	/**
	 * Sets media.
	 *
	 * @param media Media.
	 */
	public set media(media: string) {
		this.setAttribute('media', media);
	}

	/**
	 * Returns referrerPolicy.
	 *
	 * @returns ReferrerPolicy.
	 */
	public get referrerPolicy(): string {
		return this.getAttribute('referrerPolicy') || '';
	}

	/**
	 * Sets referrerPolicy.
	 *
	 * @param referrerPolicy ReferrerPolicy.
	 */
	public set referrerPolicy(referrerPolicy: string) {
		this.setAttribute('referrerPolicy', referrerPolicy);
	}

	/**
	 * Returns rel.
	 *
	 * @returns Rel.
	 */
	public get rel(): string {
		return this.getAttribute('rel') || '';
	}

	/**
	 * Sets rel.
	 *
	 * @param rel Rel.
	 */
	public set rel(rel: string) {
		this.setAttribute('rel', rel);
	}

	/**
	 * Returns type.
	 *
	 * @returns Type.
	 */
	public get type(): string {
		return this.getAttribute('type') || '';
	}

	/**
	 * Sets type.
	 *
	 * @param type Type.
	 */
	public set type(type: string) {
		this.setAttribute('type', type);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectedToDocument](): void {
		super[PropertySymbol.connectedToDocument]();

		const rel = this.getAttribute('rel');
		const href = this.getAttribute('href');

		if (rel && href) {
			switch (rel) {
				case 'stylesheet':
					this.#loadStyleSheet(href);
					break;
				case 'modulepreload':
					this.#preloadModule(href);
					break;
				case 'preload':
					this.#preloadResource(href);
					break;
			}
		}
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.onSetAttribute](
		attribute: Attr,
		replacedAttribute: Attr | null
	): void {
		super[PropertySymbol.onSetAttribute](attribute, replacedAttribute);

		if (attribute[PropertySymbol.name] === 'rel' || attribute[PropertySymbol.name] === 'href') {
			const rel = this.getAttribute('rel');
			const href = this.getAttribute('href');

			if (rel && href) {
				switch (rel) {
					case 'stylesheet':
						this.#loadStyleSheet(href);
						break;
					case 'modulepreload':
						this.#preloadModule(href);
						break;
					case 'preload':
						this.#preloadResource(href);
						break;
				}
			}
		}
	}

	/**
	 * Preloads a module.
	 *
	 * @param url URL.
	 */
	async #preloadModule(url: string): Promise<void> {
		const absoluteURL = new URL(url, this[PropertySymbol.ownerDocument].location.href);
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();
		const browserSettings = new WindowBrowserContext(window).getSettings();

		if (
			!browserFrame ||
			!browserSettings ||
			!this[PropertySymbol.isConnected] ||
			browserSettings.disableJavaScriptFileLoading ||
			browserSettings.disableJavaScriptEvaluation
		) {
			return;
		}

		if (
			browserSettings.disableErrorCapturing ||
			browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
		) {
			const module = await ModuleFactory.getModule(window, absoluteURL, url);
			await module.preload();
		} else {
			try {
				const module = await ModuleFactory.getModule(window, absoluteURL, url);
				await module.preload();
			} catch (error) {
				browserFrame.page.console.error(error);
				window[PropertySymbol.dispatchError](<Error>error);
				return;
			}
		}
	}

	/**
	 * Preloads a resource.
	 *
	 * @param url URL.
	 */
	async #preloadResource(url: string): Promise<void> {
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();
		const as = this.as;

		// Only "script", "style" and "fetch" are supported for now.
		if (
			!browserFrame ||
			!this[PropertySymbol.isConnected] ||
			(as !== 'script' && as !== 'style' && as !== 'fetch')
		) {
			return;
		}

		const browserSettings = browserFrame.page.context.browser.settings;

		if (
			as === 'script' &&
			(browserSettings.disableJavaScriptFileLoading || browserSettings.disableJavaScriptEvaluation)
		) {
			return;
		}

		if (as === 'style' && browserSettings.disableCSSFileLoading) {
			return;
		}

		const absoluteURL = new URL(url, window.location.href).href;

		const preloadKey = PreloadUtility.getKey({
			url: absoluteURL,
			destination: as,
			mode: 'cors',
			credentialsMode: this.crossOrigin === 'use-credentials' ? 'include' : 'same-origin'
		});

		if (window.document[PropertySymbol.preloads].has(preloadKey)) {
			return;
		}

		const preloadEntry = new PreloadEntry();

		window.document[PropertySymbol.preloads].set(preloadKey, preloadEntry);

		const fetch = new Fetch({
			browserFrame,
			window,
			url: absoluteURL,
			disableSameOriginPolicy: as === 'script' || as === 'style',
			disablePreload: true,
			init: {
				credentials: this.crossOrigin === 'use-credentials' ? 'include' : 'same-origin'
			}
		});

		try {
			const response = await fetch.send();

			if (!response[PropertySymbol.buffer]) {
				await response.buffer();
			}

			preloadEntry.responseAvailable(null, response);
		} catch (error) {
			preloadEntry.responseAvailable(<Error>error, null);
			window.document[PropertySymbol.preloads].delete(preloadKey);

			browserFrame.page.console.error(
				`Failed to preload resource "${absoluteURL}": ${(<Error>error).message}`
			);
		}
	}

	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param url URL.
	 * @param rel Rel.
	 */
	async #loadStyleSheet(url: string | null): Promise<void> {
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame || url === null) {
			return;
		}

		const browserSettings = browserFrame.page.context.browser.settings;

		if (!this[PropertySymbol.evaluateCSS] || !this[PropertySymbol.isConnected]) {
			return;
		}

		let absoluteURL: string;
		try {
			absoluteURL = new URL(url, window.location.href).href;
		} catch (error) {
			return;
		}

		if (this.#loadedStyleSheetURL === absoluteURL) {
			return;
		}

		if (browserSettings && browserSettings.disableCSSFileLoading) {
			if (browserSettings.handleDisabledFileLoadingAsSuccess) {
				this.dispatchEvent(new Event('load'));
			} else {
				const error = new window.DOMException(
					`Failed to load external stylesheet "${absoluteURL}". CSS file loading is disabled.`,
					DOMExceptionNameEnum.notSupportedError
				);

				browserFrame.page.console.error(error);
				this.dispatchEvent(new Event('error'));
			}
			return;
		}

		const resourceFetch = new ResourceFetch(window);
		const readyStateManager = window[PropertySymbol.readyStateManager];

		this.#loadedStyleSheetURL = absoluteURL;

		readyStateManager.startTask();

		let code: string | null = null;
		let error: Error | null = null;

		try {
			code = await resourceFetch.fetch(absoluteURL, 'style', {
				credentials: this.crossOrigin === 'use-credentials' ? 'include' : 'same-origin'
			});
		} catch (e) {
			error = <Error>e;
		}

		readyStateManager.endTask();

		if (error) {
			browserFrame.page.console.error(error);
			this.dispatchEvent(new Event('error'));
		} else {
			const styleSheet = new this[PropertySymbol.ownerDocument][
				PropertySymbol.window
			].CSSStyleSheet();
			styleSheet.replaceSync(code!);
			this[PropertySymbol.sheet] = styleSheet;

			// Computed style cache is affected by all mutations.
			const document = this[PropertySymbol.ownerDocument];
			if (document) {
				for (const item of document[PropertySymbol.affectsComputedStyleCache]) {
					item.result = null;
				}
				document[PropertySymbol.affectsComputedStyleCache] = [];
			}

			this.dispatchEvent(new Event('load'));
		}
	}
}
