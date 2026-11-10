import type IBrowserFrame from '../browser/types/IBrowserFrame.js';
import HistoryScrollRestorationEnum from './HistoryScrollRestorationEnum.js';
import * as PropertySymbol from '../PropertySymbol.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import QuerySelector from '../query-selector/QuerySelector.js';

/**
 * History API.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/History.
 */
export default class History {
	#browserFrame: IBrowserFrame | null;
	#window: BrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 * @param window Owner window.
	 */
	constructor(browserFrame: IBrowserFrame, window: BrowserWindow) {
		if (!browserFrame) {
			throw new TypeError('Illegal constructor');
		}

		this.#browserFrame = browserFrame;
		this.#window = window;
	}

	/**
	 * Returns the history length.
	 *
	 * @returns History length.
	 */
	public get length(): number {
		return this.#browserFrame?.[PropertySymbol.history].items.length || 0;
	}

	/**
	 * Returns an any value representing the state at the top of the history stack. This is a way to look at the state without having to wait for a popstate event.
	 *
	 * @returns State.
	 */
	public get state(): object | null {
		return this.#browserFrame?.[PropertySymbol.history].currentItem.state || null;
	}

	/**
	 * Returns scroll restoration.
	 *
	 * @returns Sroll restoration.
	 */
	public get scrollRestoration(): HistoryScrollRestorationEnum {
		return (
			this.#browserFrame?.[PropertySymbol.history].currentItem.scrollRestoration ||
			HistoryScrollRestorationEnum.auto
		);
	}

	/**
	 * Sets scroll restoration.
	 *
	 * @param scrollRestoration Sroll restoration.
	 */
	public set scrollRestoration(scrollRestoration: HistoryScrollRestorationEnum) {
		switch (scrollRestoration) {
			case HistoryScrollRestorationEnum.auto:
			case HistoryScrollRestorationEnum.manual:
				const currentItem = this.#browserFrame?.[PropertySymbol.history].currentItem;
				if (currentItem) {
					currentItem.scrollRestoration = scrollRestoration;
				}
				break;
		}
	}

	/**
	 * Goes to the previous page in session history.
	 */
	public back(): void {
		if (!this.#window.closed) {
			this.#browserFrame?.goBack();
		}
	}

	/**
	 * Goes to the next page in session history.
	 */
	public forward(): void {
		if (!this.#window.closed) {
			this.#browserFrame?.goForward();
		}
	}

	/**
	 * Load a specific page from the session history.
	 *
	 * @param delta Delta.
	 * @param _delta
	 */
	public go(delta: number): void {
		if (!this.#window.closed) {
			this.#browserFrame?.goSteps(delta);
		}
	}

	/**
	 * Pushes the given data onto the session history stack.
	 *
	 * @param state State.
	 * @param _unused Unused.
	 * @param [url] URL.
	 */
	public pushState(state: any, _unused: any, url?: string | URL): void {
		if (!this.#browserFrame || this.#window.closed) {
			return;
		}

		const history = this.#browserFrame?.[PropertySymbol.history];

		if (!history) {
			return;
		}

		if (arguments.length < 2) {
			throw new this.#window.TypeError(
				`Failed to execute 'pushState' on 'History': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		const location = this.#window[PropertySymbol.location];
		const newURL = this.#getURL(url, 'pushState');

		history.push({
			title: this.#window.document.title,
			url: newURL.href,
			documentState: history.currentItem.documentState,
			state,
			scrollRestoration: history.currentItem.scrollRestoration
		});

		location[PropertySymbol.setURL](this.#browserFrame, history.currentItem.url);
	}

	/**
	 * This method modifies the current history entry, replacing it with a new state.
	 *
	 * @param state State.
	 * @param _unused Unused.
	 * @param [url] URL.
	 */
	public replaceState(state: any, _unused: any, url?: string | URL): void {
		if (!this.#browserFrame || this.#window.closed) {
			return;
		}

		const history = this.#browserFrame?.[PropertySymbol.history];

		if (!history) {
			return;
		}

		if (arguments.length < 2) {
			throw new this.#window.TypeError(
				`Failed to execute 'pushState' on 'History': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		const location = this.#window[PropertySymbol.location];
		const newURL = this.#getURL(url, 'replaceState');

		history.replace({
			title: this.#window.document.title,
			url: newURL.href,
			documentState: history.currentItem.documentState,
			state,
			scrollRestoration: history.currentItem.scrollRestoration
		});

		if (url) {
			location[PropertySymbol.setURL](this.#browserFrame, history.currentItem.url);
		}
	}

	/**
	 * Destroys the history.
	 *
	 * This will make sure that the History API can't access page data from the next history item.
	 */
	public [PropertySymbol.destroy](): void {
		this.#browserFrame = null;
	}

	/**
	 * Resolves a URL and checks whether the document URL can be rewritten to it.
	 *
	 * @see https://html.spec.whatwg.org/multipage/nav-history-apis.html#can-have-its-url-rewritten
	 * @param url URL.
	 * @param method History method.
	 * @returns Validated URL.
	 */
	#getURL(url: string | URL | undefined, method: 'pushState' | 'replaceState'): URL {
		const location = this.#window[PropertySymbol.location];
		const documentURL = new URL(location.href);

		if (!url) {
			return documentURL;
		}

		const urlString = String(url);
		const baseHref = this.#getBaseHref();
		let newURL: URL;

		try {
			newURL = new URL(urlString, baseHref === null ? documentURL : new URL(baseHref, documentURL));
		} catch {
			throw new this.#window.DOMException(
				`Failed to execute '${method}' on 'History': The provided URL '${urlString}' is invalid.`,
				DOMExceptionNameEnum.securityError
			);
		}

		const canRewritePath = newURL.protocol === 'http:' || newURL.protocol === 'https:';
		const canRewriteQuery = canRewritePath || newURL.protocol === 'file:';

		if (
			newURL.protocol !== documentURL.protocol ||
			newURL.username !== documentURL.username ||
			newURL.password !== documentURL.password ||
			newURL.host !== documentURL.host ||
			(!canRewritePath && newURL.pathname !== documentURL.pathname) ||
			(!canRewriteQuery && newURL.href.split('#')[0] !== documentURL.href.split('#')[0])
		) {
			throw new this.#window.DOMException(
				`Failed to execute '${method}' on 'History': A history state object with URL '${urlString}' cannot be created in a document with origin '${location.origin}' and URL '${location.href}'.`,
				DOMExceptionNameEnum.securityError
			);
		}

		return newURL;
	}

	/**
	 * Returns the first base href from internal document attributes.
	 *
	 * Note that Document.baseURI is not used here, in order to prevent overridden baseURI getters from affecting URL resolution.
	 *
	 * @returns Base href, or null if absent.
	 */
	#getBaseHref(): string | null {
		const baseElement = QuerySelector.querySelector(this.#window.document, 'base[href]');
		return (
			baseElement?.[PropertySymbol.attributes][PropertySymbol.itemsByNamespaceURI].get(':href')?.[
				PropertySymbol.value
			] ?? null
		);
	}
}
