import Browser from './Browser.js';
import BrowserPage from './BrowserPage.js';

/**
 * Browser context.
 */
export default class BrowserContext {
	public pages: BrowserPage[] = [];
	public browser: Browser;

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
	 *
	 * @returns Promise.
	 */
	public async close(): Promise<void> {
		await Promise.all(this.pages.map((page) => page.close()));
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
	 *
	 * @returns Promise.
	 */
	public async abort(): Promise<void> {
		await Promise.all(this.pages.map((page) => page.abort()));
	}
}
