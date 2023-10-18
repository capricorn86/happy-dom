import IWindow from '../window/IWindow.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from './IBrowserFrame.js';
import Window from '../window/Window.js';
import IBrowserSettings from './IBrowserSettings.js';
import { VirtualConsolePrinter } from '../index.js';
import BrowserSettingsFactory from './BrowserSettingsFactory.js';

/**
 * Browser frame.
 */
export default class DetachedBrowserFrame implements IBrowserFrame {
	public readonly childFrames: DetachedBrowserFrame[] = [];
	public detached = false;
	public readonly window: IWindow;
	public _asyncTaskManager = new AsyncTaskManager();
	public readonly virtualConsolePrinter = new VirtualConsolePrinter();
	public readonly settings: IBrowserSettings;
	public readonly console: Console;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.window Window.
	 * @param [options.settings] Browser settings.
	 */
	constructor(options: { window: Window; settings?: IBrowserSettings }) {
		this.window = options.window;
		this.settings = BrowserSettingsFactory.getSettings(options.settings);
	}

	/**
	 * Returns the viewport.
	 */
	public get content(): string {
		return this.window.document.documentElement.outerHTML;
	}

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await this._asyncTaskManager.whenComplete();
	}

	/**
	 * Aborts all ongoing operations.
	 *
	 * @returns Promise.
	 */
	public async abort(): Promise<void> {
		await Promise.all(this.childFrames.map((frame) => frame.abort()));
		await this._asyncTaskManager.abortAll();
	}

	/**
	 * Aborts all ongoing operations and destroys the frame.
	 *
	 * @returns Promise.
	 */
	public async destroy(): Promise<void> {
		await Promise.all(this.childFrames.map((frame) => frame.destroy()));
		await this._asyncTaskManager.destroy();
		(<Window | null>this.window) = null;
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	public async goto(url: string): Promise<void> {
		await Promise.all(this.childFrames.map((frame) => frame.destroy()));
		this._asyncTaskManager.abortAll();

		this.window.location.href = url;

		const response = await this.window.fetch(url);
		const responseText = await response.text();

		this.window.document.write(responseText);
	}
}
