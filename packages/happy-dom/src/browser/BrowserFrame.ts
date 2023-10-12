import IWindow from '../window/IWindow.js';
import BrowserPage from './BrowserPage.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';

/**
 * Browser frame.
 */
export default class BrowserFrame {
	public childFrames: BrowserFrame[] = [];
	public detached = false;
	public page: BrowserPage | null = null;
	public window: IWindow | null = null;
	public _asyncTaskManager = new AsyncTaskManager();

	/**
	 * Constructor.
	 *
	 * @param options
	 * @param page Page.
	 * @param [window] Window.
	 * @param options.page
	 * @param options.window
	 */
	constructor(options: { page?: BrowserPage; window: IWindow }) {
		this.page = options.page ?? null;
		this.window = options.window;
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
		await this._asyncTaskManager.cancelAll();
	}

	/**
	 * Aborts all ongoing operations and destroys the frame.
	 *
	 * @returns Promise.
	 */
	public async close(): Promise<void> {
		await this.abort();
		this.page = null;
		this.window = null;
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	public async goto(url: string): Promise<void> {
		await Promise.all(this.childFrames.map((frame) => frame.close()));
		this._asyncTaskManager.cancelAll();

		this.window.location.href = url;

		const response = await this.window.fetch(url);
		const responseText = await response.text();

		this.window.document.write(responseText);
	}
}
