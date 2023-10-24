import DetachedBrowser from './DetachedBrowser.js';
import DetachedBrowserPage from './DetachedBrowserPage.js';
import IBrowserContext from '../types/IBrowserContext.js';
import IWindow from '../../window/IWindow.js';

/**
 * Detached browser context.
 */
export default class DetachedBrowserContext implements IBrowserContext {
	public readonly pages: DetachedBrowserPage[];
	public readonly browser: DetachedBrowser;
	#windowClass: new () => IWindow;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param browser Browser.
	 */
	constructor(window: IWindow, browser: DetachedBrowser) {
		this.browser = browser;
		this.pages = [new DetachedBrowserPage(window, this)];
		this.#windowClass = <new () => IWindow>window.constructor;
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
	public newPage(): DetachedBrowserPage {
		const page = new DetachedBrowserPage(new this.#windowClass(), this);
		this.pages.push(page);
		return page;
	}
}
