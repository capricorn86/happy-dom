import Browser from './Browser.js';
import BrowserPage from './BrowserPage.js';
import IBrowserContext from './types/IBrowserContext.js';

/**
 * Browser context.
 */
export default class BrowserContext implements IBrowserContext {
	public readonly pages: BrowserPage[] = [];
	public readonly browser: Browser;

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
		for (const page of this.pages) {
			page.close();
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
	 * @returns Page.
	 */
	public newPage(): BrowserPage {
		const page = new BrowserPage(this);
		this.pages.push(page);
		return page;
	}
}
