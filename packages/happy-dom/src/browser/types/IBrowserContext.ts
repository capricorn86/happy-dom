import IBrowser from './IBrowser.js';
import IBrowserFrame from './IBrowserFrame.js';
import IBrowserPage from './IBrowserPage.js';

/**
 * Browser context.
 */
export default interface IBrowserContext {
	readonly pages: IBrowserPage[];
	readonly browser: IBrowser;

	/**
	 * Aborts all ongoing operations and destroys the context.
	 */
	close(): void;

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all tasks such as timers are complete.
	 *
	 * @returns Promise.
	 */
	whenComplete(): Promise<void>;

	/**
	 * Aborts all ongoing operations.
	 */
	abort(): void;

	/**
	 * Creates a new page.
	 *
	 * @param [opener] Opener.
	 * @returns Page.
	 */
	newPage(opener?: IBrowserFrame): IBrowserPage;
}
