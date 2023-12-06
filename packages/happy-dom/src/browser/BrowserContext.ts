import CookieContainer from '../cookie/CookieContainer.js';
import ICookieContainer from '../cookie/types/ICookieContainer.js';
import FetchCache from '../fetch/cache/FetchCache.js';
import IFetchCache from '../fetch/types/IFetchCache.js';
import Browser from './Browser.js';
import BrowserFrame from './BrowserFrame.js';
import BrowserPage from './BrowserPage.js';
import IBrowserContext from './types/IBrowserContext.js';

/**
 * Browser context.
 */
export default class BrowserContext implements IBrowserContext {
	public readonly pages: BrowserPage[] = [];
	public readonly browser: Browser;
	public readonly cookieContainer: ICookieContainer;
	public readonly responseCache: IFetchCache;

	/**
	 * Constructor.
	 *
	 * @param browser
	 */
	constructor(
		browser: Browser,
		options?: { cookieContainer?: ICookieContainer; responseCache?: IFetchCache }
	) {
		this.browser = browser;
		this.cookieContainer = options?.cookieContainer ?? new CookieContainer();
		this.responseCache = options?.responseCache ?? new FetchCache();
	}

	/**
	 * Aborts all ongoing operations and destroys the context.
	 */
	public close(): void {
		const index = this.browser.contexts.indexOf(this);
		this.browser.contexts.splice(index, 1);
		for (const page of this.pages.slice()) {
			page.close();
		}
		if (this.browser.contexts.length === 0) {
			this.browser.close();
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
	public newPage(opener?: BrowserFrame): BrowserPage {
		const page = new BrowserPage(this);
		(<BrowserFrame | null>(<unknown>page.mainFrame.opener)) = opener || null;
		this.pages.push(page);
		return page;
	}
}
