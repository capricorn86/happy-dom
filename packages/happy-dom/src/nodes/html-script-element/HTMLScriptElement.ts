import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import ErrorEvent from '../../event/events/ErrorEvent.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import WindowBrowserContext from '../../window/WindowBrowserContext.js';
import BrowserErrorCaptureEnum from '../../browser/enums/BrowserErrorCaptureEnum.js';
import Attr from '../attr/Attr.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import DocumentReadyStateManager from '../document/DocumentReadyStateManager.js';
import ECMAScriptModule from '../../module/ECMAScriptModule.js';
import Location from '../../location/Location.js';
import UnresolvedModule from '../../module/UnresolvedModule.js';
import ModuleFactory from '../../module/ModuleFactory.js';

/**
 * HTML Script Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement.
 */
export default class HTMLScriptElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLScriptElement;

	// Events
	public onerror: (event: ErrorEvent) => void = null;
	public onload: (event: Event) => void = null;

	// Internal properties
	public [PropertySymbol.evaluateScript] = true;

	// Private properties
	#loadedScriptURL: string | null = null;
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
						this.#evaluateModule(this[PropertySymbol.ownerDocument].location, source);
					} else if (
						type === null ||
						type === 'application/x-ecmascript' ||
						type === 'application/x-javascript' ||
						type.startsWith('text/javascript')
					) {
						this.#evaluateScript(this[PropertySymbol.ownerDocument].location, source);
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
	 * @param url URL.
	 * @param source Source.
	 */
	async #evaluateModule(url: URL | Location, source: string): Promise<void> {
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
				WindowErrorUtility.dispatchError(this, error);
				return;
			}
		}

		readyStateManager.endTask();

		this.dispatchEvent(new Event('load'));
	}

	/**
	 * Evaluates a script.
	 *
	 * @param url URL.
	 * @param source Source.
	 */
	#evaluateScript(url: URL | Location, source: string): Promise<void> {
		const browserSettings = new WindowBrowserContext(this[PropertySymbol.window]).getSettings();

		if (!browserSettings) {
			return;
		}

		this[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = this;

		const code = `//# sourceURL=${url}\n` + source;

		if (
			browserSettings.disableErrorCapturing ||
			browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
		) {
			this[PropertySymbol.window].eval(code);
		} else {
			WindowErrorUtility.captureError(this[PropertySymbol.window], () =>
				this[PropertySymbol.window].eval(code)
			);
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
		const browserSettings = new WindowBrowserContext(window).getSettings();

		if (!browserSettings) {
			return;
		}

		const type = this.getAttribute('type');

		if (!url || !this[PropertySymbol.isConnected] || type !== 'module') {
			return;
		}

		let absoluteURL: URL;
		try {
			absoluteURL = new URL(url, window.location.href);
		} catch (error) {
			return;
		}

		if (
			browserSettings &&
			(browserSettings.disableJavaScriptFileLoading || browserSettings.disableJavaScriptEvaluation)
		) {
			if (browserSettings.handleDisabledFileLoadingAsSuccess) {
				this.dispatchEvent(new Event('load'));
			} else {
				WindowErrorUtility.dispatchError(
					this,
					new window.DOMException(
						`Failed to load module "${absoluteURL}". JavaScript file loading is disabled.`,
						DOMExceptionNameEnum.notSupportedError
					)
				);
			}
			return;
		}

		const readyStateManager = window[PropertySymbol.readyStateManager];

		readyStateManager.startTask();

		if (
			browserSettings.disableErrorCapturing ||
			browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
		) {
			const module = await ModuleFactory.getModule(window, window.location, absoluteURL.href);
			await module.evaluate();
		} else {
			try {
				const module = await ModuleFactory.getModule(window, window.location, absoluteURL.href);
				await module.evaluate();
			} catch (error) {
				WindowErrorUtility.dispatchError(window, error);
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
				WindowErrorUtility.dispatchError(
					this,
					new window.DOMException(
						`Failed to load script "${absoluteURL}". JavaScript file loading is disabled.`,
						DOMExceptionNameEnum.notSupportedError
					)
				);
			}
			return;
		}

		this.#loadedScriptURL = absoluteURLString;

		const resourceFetch = new ResourceFetch({
			browserFrame,
			window
		});
		const async = this.getAttribute('async') !== null || this.getAttribute('defer') !== null;
		let code: string | null = null;

		if (async) {
			const readyStateManager = window[PropertySymbol.readyStateManager];

			readyStateManager.startTask();

			try {
				code = await resourceFetch.fetch(absoluteURLString);
			} catch (error) {
				WindowErrorUtility.dispatchError(this, error);
				return;
			}

			readyStateManager.endTask();
		} else {
			try {
				code = resourceFetch.fetchSync(absoluteURLString);
			} catch (error) {
				WindowErrorUtility.dispatchError(this, error);
				return;
			}
		}

		this.#evaluateScript(absoluteURL, code);
		this.dispatchEvent(new Event('load'));
	}
}
