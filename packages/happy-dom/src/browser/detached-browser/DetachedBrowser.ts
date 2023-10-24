import IBrowserSettings from '../types/IBrowserSettings.js';
import DetachedBrowserContext from './DetachedBrowserContext.js';
import IOptionalBrowserSettings from '../types/IOptionalBrowserSettings.js';
import BrowserSettingsFactory from '../BrowserSettingsFactory.js';
import DetachedBrowserPage from './DetachedBrowserPage.js';
import IBrowser from '../types/IBrowser.js';
import IWindow from '../../window/IWindow.js';

/**
 * Detached browser.
 */
export default class DetachedBrowser implements IBrowser {
	public readonly contexts: DetachedBrowserContext[];
	public readonly settings: IBrowserSettings;
	public readonly console: Console | null;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.settings] Browser settings.
	 * @param [options.console] Console.
	 */
	constructor(
		window: IWindow,
		options?: { settings?: IOptionalBrowserSettings; console?: Console }
	) {
		this.console = options?.console || null;
		this.settings = BrowserSettingsFactory.getSettings(options?.settings);
		this.contexts = [new DetachedBrowserContext(window, this)];
	}

	/**
	 * Returns the default context.
	 *
	 * @returns Default context.
	 */
	public get defaultContext(): DetachedBrowserContext {
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
		(<DetachedBrowserContext[]>this.contexts) = [];
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
	 */
	public abort(): void {
		for (const context of this.contexts) {
			context.abort();
		}
	}

	/**
	 * Creates a new incognito context.
	 *
	 * @returns Context.
	 */
	public newIncognitoContext(): DetachedBrowserContext {
		throw new Error('Not possible to create a new context on a detached browser.');
	}

	/**
	 * Creates a new page.
	 *
	 * @returns Page.
	 */
	public newPage(): DetachedBrowserPage {
		if (this.contexts.length === 0) {
			throw new Error('No default context. The browser has been closed.');
		}
		return this.contexts[0].newPage();
	}
}
