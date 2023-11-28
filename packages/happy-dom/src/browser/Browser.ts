import IBrowserSettings from './types/IBrowserSettings.js';
import BrowserContext from './BrowserContext.js';
import IOptionalBrowserSettings from './types/IOptionalBrowserSettings.js';
import BrowserSettingsFactory from './BrowserSettingsFactory.js';
import IBrowserPage from './types/IBrowserPage.js';
import IBrowser from './types/IBrowser.js';
import IBrowserFrame from './types/IBrowserFrame.js';
import ICookieContainer from '../cookie/types/ICookieContainer.js';
import IBrowserContext from './types/IBrowserContext.js';

/**
 * Browser.
 *
 * Much of the interface for the browser has been taken from Puppeteer and Playwright, so that the API is familiar.
 */
export default class Browser implements IBrowser {
	public readonly contexts: IBrowserContext[];
	public readonly settings: IBrowserSettings;
	public readonly console: Console | null;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.settings] Browser settings.
	 * @param [options.console] Console.
	 */
	constructor(options?: {
		settings?: IOptionalBrowserSettings;
		console?: Console;
		cookieContainer?: ICookieContainer;
	}) {
		this.console = options?.console || null;
		this.settings = BrowserSettingsFactory.getSettings(options?.settings);
		this.contexts = [new BrowserContext(this, { cookieContainer: options?.cookieContainer })];
	}

	/**
	 * Returns the default context.
	 *
	 * @returns Default context.
	 */
	public get defaultContext(): IBrowserContext {
		if (this.contexts.length === 0) {
			throw new Error('No default context. The browser has been closed.');
		}
		return this.contexts[0];
	}

	/**
	 * Aborts all ongoing operations and destroys the browser.
	 */
	public close(): void {
		for (const context of this.contexts) {
			context.close();
		}
		(<BrowserContext[]>this.contexts) = [];
	}

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all async tasks such as timers are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		if (this.contexts.length === 0) {
			throw new Error('No default context. The browser has been closed.');
		}
		await Promise.all(this.contexts.map((page) => page.whenComplete()));
	}

	/**
	 * Aborts all ongoing operations.
	 */
	public abort(): void {
		for (const context of this.contexts.slice()) {
			context.abort();
		}
	}

	/**
	 * Creates a new incognito context.
	 *
	 * @returns Context.
	 */
	public newIncognitoContext(): BrowserContext {
		if (this.contexts.length === 0) {
			throw new Error('No default context. The browser has been closed.');
		}
		const context = new BrowserContext(this);
		this.contexts.push(context);
		return context;
	}

	/**
	 * Creates a new page.
	 *
	 * @param [opener] Opener.
	 * @returns Page.
	 */
	public newPage(opener?: IBrowserFrame): IBrowserPage {
		if (this.contexts.length === 0) {
			throw new Error('No default context. The browser has been closed.');
		}
		return this.contexts[0].newPage(opener);
	}
}
