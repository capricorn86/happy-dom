import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import WindowBrowserContext from '../../window/WindowBrowserContext.js';
import BrowserErrorCaptureEnum from '../../browser/enums/BrowserErrorCaptureEnum.js';
import Attr from '../attr/Attr.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import ECMAScriptModule from '../../module/ECMAScriptModule.js';
import ModuleFactory from '../../module/ModuleFactory.js';
import DOMTokenList from '../../dom/DOMTokenList.js';
import IModuleImportMap from '../../module/IModuleImportMap.js';
import IRequestReferrerPolicy from '../../fetch/types/IRequestReferrerPolicy.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';

/**
 * HTML Script Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement.
 */
export default class HTMLScriptElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLScriptElement;

	// Internal properties
	public [PropertySymbol.evaluateScript] = true;
	public [PropertySymbol.blocking]: DOMTokenList | null = null;

	// Private properties
	#loadedScriptURL: string | null = null;

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
	 * Returns blocking.
	 */
	public get blocking(): DOMTokenList {
		if (!this[PropertySymbol.blocking]) {
			this[PropertySymbol.blocking] = new DOMTokenList(
				PropertySymbol.illegalConstructor,
				this,
				'blocking'
			);
		}
		return this[PropertySymbol.blocking];
	}

	/**
	 * Sets blocking.
	 *
	 * @param value Value.
	 */
	public set blocking(value: string) {
		this.setAttribute('blocking', value);
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
	 * Returns fetch priority.
	 *
	 * @returns Fetch priority.
	 */
	public get fetchPriority(): 'auto' | 'high' | 'low' | 'normal' {
		const fetchPriority = this.getAttribute('fetchpriority');
		switch (fetchPriority) {
			case 'high':
			case 'low':
			case 'normal':
				return fetchPriority;
			default:
				return 'auto';
		}
	}

	/**
	 * Sets fetch priority.
	 *
	 * @param fetchPriority Fetch priority.
	 */
	public set fetchPriority(fetchPriority: 'auto' | 'high' | 'low' | 'normal') {
		this.setAttribute('fetchpriority', fetchPriority);
	}

	/**
	 * Returns noModule.
	 *
	 * @returns NoModule.
	 */
	public get noModule(): boolean {
		return this.getAttribute('nomodule') !== null;
	}

	/**
	 * Sets noModule.
	 *
	 * @param noModule NoModule.
	 */
	public set noModule(noModule: boolean) {
		if (noModule) {
			this.setAttribute('nomodule', '');
		} else {
			this.removeAttribute('nomodule');
		}
	}

	/**
	 * Returns integrity.
	 *
	 * @returns Integrity.
	 */
	public get integrity(): string {
		return this.getAttribute('integrity') || '';
	}

	/**
	 * Sets integrity.
	 *
	 * @param integrity Integrity.
	 */
	public set integrity(integrity: string) {
		this.setAttribute('integrity', integrity);
	}

	/**
	 * Returns referrerPolicy.
	 *
	 * @returns ReferrerPolicy.
	 */
	public get referrerPolicy(): IRequestReferrerPolicy {
		const referrerPolicy = this.getAttribute('referrerpolicy');
		switch (referrerPolicy) {
			case 'no-referrer':
			case 'no-referrer-when-downgrade':
			case 'same-origin':
			case 'origin':
			case 'strict-origin':
			case 'origin-when-cross-origin':
			case 'strict-origin-when-cross-origin':
			case 'unsafe-url':
				return referrerPolicy;
			default:
				return '';
		}
	}

	/**
	 * Sets referrerPolicy.
	 *
	 * @param referrerPolicy ReferrerPolicy.
	 */
	public set referrerPolicy(referrerPolicy: string) {
		this.setAttribute('referrerpolicy', referrerPolicy);
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
	 * Returns charset.
	 *
	 * @returns Charset.
	 */
	public get charset(): string {
		return this.getAttribute('charset') || '';
	}

	/**
	 * Sets charset.
	 *
	 * @param charset Charset.
	 */
	public set charset(charset: string) {
		this.setAttribute('charset', charset);
	}

	/**
	 * Returns lang.
	 *
	 * @returns Lang.
	 */
	public get lang(): string {
		return this.getAttribute('lang') || '';
	}

	/**
	 * Sets lang.
	 *
	 * @param lang Lang.
	 */
	public set lang(lang: string) {
		this.setAttribute('lang', lang);
	}

	/**
	 * Returns async.
	 *
	 * @returns Async.
	 */
	public get async(): boolean {
		return this.getAttribute('async') !== null;
	}

	/**
	 * Sets async.
	 *
	 * @param async Async.
	 */
	public set async(async: boolean) {
		if (!async) {
			this.removeAttribute('async');
		} else {
			this.setAttribute('async', '');
		}
	}

	/**
	 * Returns defer.
	 *
	 * @returns Defer.
	 */
	public get defer(): boolean {
		return this.getAttribute('defer') !== null;
	}

	/**
	 * Sets defer.
	 *
	 * @param defer Defer.
	 */
	public set defer(defer: boolean) {
		if (!defer) {
			this.removeAttribute('defer');
		} else {
			this.setAttribute('defer', '');
		}
	}

	/**
	 * Returns text.
	 *
	 * @returns Text.
	 */
	public get text(): string {
		return this.textContent;
	}

	/**
	 * Sets text.
	 *
	 * @param text Text.
	 */
	public set text(text: string) {
		this.textContent = text;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLScriptElement {
		return <HTMLScriptElement>super[PropertySymbol.cloneNode](deep);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectedToDocument](): void {
		const browserSettings = new WindowBrowserContext(this[PropertySymbol.window]).getSettings();

		super[PropertySymbol.connectedToDocument]();

		if (this[PropertySymbol.evaluateScript]) {
			const src = this.getAttribute('src');

			if (src !== null) {
				if (this.getAttribute('type') === 'module') {
					this.#loadModule(src);
				} else {
					this.#loadScript(src);
				}
			} else if (browserSettings && !browserSettings.disableJavaScriptEvaluation) {
				const source = this.textContent;
				const type = this.getAttribute('type');

				if (source) {
					if (type === 'module') {
						this.#evaluateModule(source);
					} else if (type === 'importmap') {
						this.#evaluateImportMap(source);
					} else if (
						type === null ||
						type === 'application/x-ecmascript' ||
						type === 'application/x-javascript' ||
						type.startsWith('text/javascript')
					) {
						this.#evaluateScript(source);
					}
				}
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

		if (
			attribute[PropertySymbol.name] === 'src' &&
			attribute[PropertySymbol.value] !== null &&
			this[PropertySymbol.isConnected]
		) {
			if (this.getAttribute('type') === 'module') {
				this.#loadModule(attribute[PropertySymbol.value]);
			} else {
				this.#loadScript(attribute[PropertySymbol.value]);
			}
		}
	}

	/**
	 * Evaluates a module.
	 *
	 * @param source Source.
	 */
	async #evaluateModule(source: string): Promise<void> {
		const url = this[PropertySymbol.ownerDocument].location;
		const window = this[PropertySymbol.window];
		const browserSettings = new WindowBrowserContext(window).getSettings();
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame) {
			return;
		}

		const module = new ECMAScriptModule(window, url, source);
		const readyStateManager = window[PropertySymbol.readyStateManager];

		readyStateManager.startTask();

		if (
			browserSettings.disableErrorCapturing ||
			browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
		) {
			await module.evaluate();
		} else {
			try {
				await module.evaluate();
			} catch (error) {
				window[PropertySymbol.dispatchError](error);
				return;
			}
		}

		readyStateManager.endTask();

		this.dispatchEvent(new Event('load'));
	}

	/**
	 * Evaluates an import map.
	 *
	 * @param source Source.
	 */
	async #evaluateImportMap(source: string): Promise<void> {
		const window = this[PropertySymbol.window];
		const browserSettings = new WindowBrowserContext(window).getSettings();
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame || window[PropertySymbol.moduleImportMap]) {
			return;
		}

		let json: any;
		if (
			browserSettings.disableErrorCapturing ||
			browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
		) {
			json = JSON.parse(source);
		} else {
			try {
				json = JSON.parse(source);
			} catch (error) {
				window[PropertySymbol.dispatchError](error);
				return;
			}
		}

		if (json.imports || json.scopes) {
			const importMap: IModuleImportMap = {
				imports: [],
				scopes: []
			};

			if (json.imports) {
				for (const key of Object.keys(json.imports)) {
					importMap.imports.push({
						from: key,
						to: json.imports[key]
					});
				}
			}

			if (json.scopes) {
				for (const scopeKey of Object.keys(json.scopes)) {
					const scope = {
						scope: scopeKey,
						rules: []
					};
					for (const importKey of Object.keys(json.scopes[scopeKey])) {
						const value = json.scopes[scopeKey][importKey];
						scope.rules.push({
							from: importKey,
							to: value
						});
					}
					importMap.scopes.push(scope);
				}
			}

			window[PropertySymbol.moduleImportMap] = importMap;
		}
	}

	/**
	 * Evaluates a script.
	 *
	 * @param source Source.
	 */
	#evaluateScript(source: string): Promise<void> {
		const window = this[PropertySymbol.window];
		const browserSettings = new WindowBrowserContext(window).getSettings();

		if (!browserSettings) {
			return;
		}

		this[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = this;

		const code = `//# sourceURL=${this[PropertySymbol.ownerDocument].location.href}\n` + source;

		if (
			browserSettings.disableErrorCapturing ||
			browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
		) {
			window.eval(code);
		} else {
			try {
				window.eval(code);
			} catch (error) {
				window[PropertySymbol.dispatchError](error);
			}
		}

		this[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = null;
	}

	/**
	 * Loads a module.
	 *
	 * @param url URL.
	 */
	async #loadModule(url: string): Promise<void> {
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();
		const browserSettings = new WindowBrowserContext(window).getSettings();

		if (!browserSettings) {
			return;
		}

		if (!url || !this[PropertySymbol.isConnected] || this.getAttribute('type') !== 'module') {
			return;
		}

		if (
			browserSettings &&
			(browserSettings.disableJavaScriptFileLoading || browserSettings.disableJavaScriptEvaluation)
		) {
			if (browserSettings.handleDisabledFileLoadingAsSuccess) {
				this.dispatchEvent(new Event('load'));
			} else {
				const error = new window.DOMException(
					`Failed to load module "${url}". JavaScript file loading is disabled.`,
					DOMExceptionNameEnum.notSupportedError
				);
				browserFrame.page?.console.error(error);
				this.dispatchEvent(new Event('error'));
			}
			return;
		}

		const readyStateManager = window[PropertySymbol.readyStateManager];

		readyStateManager.startTask();

		// TODO: What to do with "referrerPolicy" and "crossOrigin" for modules?
		// @see https://github.com/w3c/webappsec-referrer-policy/issues/111

		if (
			browserSettings.disableErrorCapturing ||
			browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
		) {
			const module = await ModuleFactory.getModule(window, window.location, url);
			await module.evaluate();
		} else {
			try {
				const module = await ModuleFactory.getModule(window, window.location, url);
				await module.evaluate();
			} catch (error) {
				browserFrame.page?.console.error(error);
				this.dispatchEvent(new Event('error'));
				readyStateManager.endTask();
				return;
			}
		}

		readyStateManager.endTask();
		this.dispatchEvent(new Event('load'));
	}

	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param url URL.
	 */
	async #loadScript(url: string): Promise<void> {
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame) {
			return;
		}

		const browserSettings = browserFrame.page?.context?.browser?.settings;
		const type = this.getAttribute('type');

		if (
			!url ||
			!this[PropertySymbol.isConnected] ||
			(type !== null &&
				type !== 'application/x-ecmascript' &&
				type !== 'application/x-javascript' &&
				!type.startsWith('text/javascript'))
		) {
			return;
		}

		let absoluteURL: URL;
		try {
			absoluteURL = new URL(url, window.location.href);
		} catch (error) {
			return;
		}

		const absoluteURLString = absoluteURL.toString();
		if (this.#loadedScriptURL === absoluteURLString) {
			return;
		}

		if (
			browserSettings &&
			(browserSettings.disableJavaScriptFileLoading || browserSettings.disableJavaScriptEvaluation)
		) {
			if (browserSettings.handleDisabledFileLoadingAsSuccess) {
				this.dispatchEvent(new Event('load'));
			} else {
				const error = new window.DOMException(
					`Failed to load script "${absoluteURL}". JavaScript file loading is disabled.`,
					DOMExceptionNameEnum.notSupportedError
				);
				browserFrame.page?.console.error(error);
				this.dispatchEvent(new Event('error'));
			}
			return;
		}

		this.#loadedScriptURL = absoluteURLString;

		const resourceFetch = new ResourceFetch(window);
		const async = this.getAttribute('async') !== null || this.getAttribute('defer') !== null;
		let code: string | null = null;

		if (async) {
			const readyStateManager = window[PropertySymbol.readyStateManager];

			readyStateManager.startTask();

			try {
				code = await resourceFetch.fetch(absoluteURLString, 'script', {
					credentials: this.crossOrigin === 'use-credentials' ? 'include' : 'same-origin',
					referrerPolicy: this.referrerPolicy
				});
			} catch (error) {
				browserFrame.page?.console.error(error);
				this.dispatchEvent(new Event('error'));
				return;
			}

			readyStateManager.endTask();
		} else {
			try {
				code = resourceFetch.fetchSync(absoluteURLString, 'script', {
					credentials: this.crossOrigin === 'use-credentials' ? 'include' : 'same-origin',
					referrerPolicy: this.referrerPolicy
				});
			} catch (error) {
				browserFrame.page?.console.error(error);
				this.dispatchEvent(new Event('error'));
				return;
			}
		}

		this[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = this;

		code = '//# sourceURL=' + absoluteURL + '\n' + code;

		if (
			browserSettings.disableErrorCapturing ||
			browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
		) {
			this[PropertySymbol.window].eval(code);
		} else {
			try {
				this[PropertySymbol.window].eval(code);
			} catch (error) {
				this[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = null;
				window[PropertySymbol.dispatchError](error);
				return;
			}
		}

		this[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = null;
		this.dispatchEvent(new Event('load'));
	}

	/**
	 * Returns true if the given type is supported.
	 *
	 * @param type Type.
	 * @returns True if the given type is supported.
	 */
	public static supports(type: string): boolean {
		switch (type) {
			case 'classic':
			case 'module':
			case 'importmap':
				return true;
			case 'speculationrules':
			default:
				return false;
		}
	}
}
