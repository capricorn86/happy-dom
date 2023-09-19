import IDocument from '../nodes/document/IDocument.js';
import IWindow from '../window/IWindow.js';
import Event from '../event/Event.js';
import Window from '../window/Window.js';
import IBrowserContextOptions from './IBrowserContextOptions.js';
import IBrowserContextSettings from './IBrowserSettings.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import BrowserPage from './BrowserPage.js';
import IOptionalBrowserSettings from './IOptionalBrowserSettings.js';

/**
 * Browser context.
 */
export default class BrowserContext {
	public pages: BrowserPage[] = [];
	public default = false;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.default] Default.
	 */
	constructor(options?: { default?: boolean }) {
		if (options?.default) {
			this.default = true;
		}
	}

	/**
	 * Aborts asynchronous tasks and destroys the context.
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

	/**
	 * Sets the window size and triggers a resize event.
	 *
	 * @param options Options.
	 * @param options.width Width.
	 * @param options.height Height.
	 */
	public resizeWindow(options: { width?: number; height?: number }): void {
		if (
			(options.width !== undefined && this.window.innerWidth !== options.width) ||
			(options.height !== undefined && this.window.innerHeight !== options.height)
		) {
			if (options.width !== undefined && this.window.innerWidth !== options.width) {
				(<number>this.window.innerWidth) = options.width;
				(<number>this.window.outerWidth) = options.width;
			}

			if (options.height !== undefined && this.window.innerHeight !== options.height) {
				(<number>this.window.innerHeight) = options.height;
				(<number>this.window.outerHeight) = options.height;
			}

			this.window.dispatchEvent(new Event('resize'));
		}
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	public async goto(url: string): Promise<void> {
		this.window.location.href = url;

		const response = await this.window.fetch(url);
		const responseText = await response.text();

		this.document.write(responseText);
	}
}
