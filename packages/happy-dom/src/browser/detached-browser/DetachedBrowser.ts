import IBrowserSettings from '../types/IBrowserSettings.js';
import DetachedBrowserContext from './DetachedBrowserContext.js';
import IOptionalBrowserSettings from '../types/IOptionalBrowserSettings.js';
import BrowserSettingsFactory from '../BrowserSettingsFactory.js';
import DetachedBrowserPage from './DetachedBrowserPage.js';
import IBrowser from '../types/IBrowser.js';
import IWindow from '../../window/IWindow.js';
import IBrowserFrame from '../types/IBrowserFrame.js';

/**
 * Detached browser.
 */
export default class DetachedBrowser implements IBrowser {
	public readonly contexts: DetachedBrowserContext[];
	public readonly settings: IBrowserSettings;
	public readonly console: Console | null;
	public readonly detachedWindowClass: new (options: {
		browserFrame: IBrowserFrame;
		console: Console;
		url?: string;
	}) => IWindow;
	public readonly detachedWindow: IWindow;

	/**
	 * Constructor.
	 *
	 * @param windowClass Window class.
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.settings] Browser settings.
	 * @param [options.console] Console.
	 */
	constructor(
		windowClass: new () => IWindow,
		window: IWindow,
		options?: { settings?: IOptionalBrowserSettings; console?: Console }
	) {
		this.detachedWindowClass = windowClass;
		this.detachedWindow = window;
		this.console = options?.console || null;
		this.settings = BrowserSettingsFactory.getSettings(options?.settings);
		this.contexts = [new DetachedBrowserContext(this)];
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
		(<Console | null>this.console) = null;
		(<IWindow | null>this.detachedWindow) = null;
		(<new () => IWindow | null>this.detachedWindowClass) = null;
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
