import CookieContainer from '../cookie/CookieContainer.js';
import ICookieContainer from '../cookie/types/ICookieContainer.js';
import ResponseCache from '../cache/response/ResponseCache.js';
import IResponseCache from '../cache/response/IResponseCache.js';
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
	public readonly cookieContainer: ICookieContainer = new CookieContainer();
	public readonly responseCache: IResponseCache = new ResponseCache();

	/**
	 * Constructor.
	 *
	 * @param browser
	 */
	constructor(browser: Browser) {
		this.browser = browser;
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
