import IBrowserContext from './IBrowserContext.js';
import IBrowserPage from './IBrowserPage.js';
import IBrowserSettings from './IBrowserSettings.js';

/**
 * Browser.
 */
export default interface IBrowser {
	readonly defaultContext: IBrowserContext;
	readonly contexts: IBrowserContext[];
	readonly settings: IBrowserSettings;
	readonly console: Console | null;

	/**
	 * Aborts all ongoing operations and destroys the browser.
	 *
	 * @returns Promise.
	 */
	close(): Promise<void>;

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all tasks such as timers are complete.
	 *
	 * @returns Promise.
	 */
	whenComplete(): Promise<void>;

	/**
	 * Aborts all ongoing operations.
	 *
	 * @returns Promise.
	 */
	abort(): Promise<void>;

	/**
	 * Creates a new page.
	 *
	 * @returns Page.
	 */
	newPage(): IBrowserPage;
}
