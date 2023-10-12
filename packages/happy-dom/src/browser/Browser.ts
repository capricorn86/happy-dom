import IBrowserSettings from './IBrowserSettings.js';
import BrowserContext from './BrowserContext.js';
import IOptionalBrowserSettings from './IOptionalBrowserSettings.js';
import BrowserSettingsFactory from './BrowserSettingsFactory.js';
import BrowserPage from './BrowserPage.js';

/**
 * Browser context.
 */
export default class Browser {
	public defaultContext: BrowserContext | null = new BrowserContext(this);
	public contexts: BrowserContext[] = [this.defaultContext];
	public settings: IBrowserSettings;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.settings] Browser settings.
	 */
	constructor(options?: { settings?: IOptionalBrowserSettings }) {
		this.settings = BrowserSettingsFactory.getSettings(options?.settings);
	}

	/**
	 * Aborts all ongoing operations and destroys the browser.
	 *
	 * @returns Promise.
	 */
	public async close(): Promise<void> {
		await Promise.all(this.contexts.map((context) => context.close()));
		this.contexts = [];
		this.defaultContext = null;
	}

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all async tasks such as timers are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await Promise.all(this.contexts.map((page) => page.whenComplete()));
	}

	/**
	 * Aborts all ongoing operations.
	 *
	 * @returns Promise.
	 */
	public async abort(): Promise<void> {
		await Promise.all(this.contexts.map((page) => page.abort()));
	}

	/**
	 * Creates a new page.
	 *
	 * @returns Page.
	 */
	public newPage(): BrowserPage {
		return this.defaultContext.newPage();
	}
}
