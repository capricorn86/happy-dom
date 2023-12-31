import DetachedBrowser from './DetachedBrowser.js';
import DetachedBrowserPage from './DetachedBrowserPage.js';
import IBrowserContext from '../types/IBrowserContext.js';
import DetachedBrowserFrame from './DetachedBrowserFrame.js';
import ICookieContainer from '../../cookie/types/ICookieContainer.js';
import CookieContainer from '../../cookie/CookieContainer.js';
import ResponseCache from '../../fetch/cache/response/ResponseCache.js';
import IResponseCache from '../../fetch/cache/response/IResponseCache.js';
import IPreflightResponseCache from '../../fetch/cache/preflight/IPreflightResponseCache.js';
import PreflightResponseCache from '../../fetch/cache/preflight/PreflightResponseCache.js';

/**
 * Detached browser context used when constructing a Window instance without a browser.
 */
export default class DetachedBrowserContext implements IBrowserContext {
	public readonly pages: DetachedBrowserPage[];
	public readonly browser: DetachedBrowser;
	public readonly cookieContainer: ICookieContainer = new CookieContainer();
	public readonly responseCache: IResponseCache = new ResponseCache();
	public readonly preflightResponseCache: IPreflightResponseCache = new PreflightResponseCache();

	/**
	 * Constructor.
	 *
	 * @param browser Browser.
	 */
	constructor(browser: DetachedBrowser) {
		this.browser = browser;
		this.pages = [];
		this.pages.push(new DetachedBrowserPage(this));
	}

	/**
	 * Aborts all ongoing operations and destroys the context.
	 */
	public close(): void {
		if (!this.browser) {
			return;
		}
		for (const page of this.pages.slice()) {
			page.close();
		}
		const browser = this.browser;
		(<DetachedBrowserPage[]>this.pages) = [];
		(<DetachedBrowser | null>this.browser) = null;
		if (browser.defaultContext === this) {
			browser.close();
		}
	}

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all async tasks such as timers are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await Promise.all(this.pages.map((page) => page.whenComplete()));
	}

	/**
	 * Aborts all ongoing operations.
	 */
	public abort(): void {
		for (const page of this.pages) {
			page.abort();
		}
	}

	/**
	 * Creates a new page.
	 *
	 * @param [opener] Opener.
	 * @returns Page.
	 */
	public newPage(opener?: DetachedBrowserFrame): DetachedBrowserPage {
		const page = new DetachedBrowserPage(this);
		(<DetachedBrowserFrame | null>(<unknown>page.mainFrame.opener)) = opener || null;
		this.pages.push(page);
		return page;
	}
}
