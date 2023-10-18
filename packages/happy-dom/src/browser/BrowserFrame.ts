import IWindow from '../window/IWindow.js';
import BrowserPage from './BrowserPage.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from './IBrowserFrame.js';
import Window from '../window/Window.js';
import IBrowserPageViewport from './IBrowserPageViewport.js';
import Event from '../event/Event.js';

/**
 * Browser frame.
 */
export default class BrowserFrame implements IBrowserFrame {
	public readonly childFrames: BrowserFrame[] = [];
	public detached = false;
	public readonly page: BrowserPage;
	public readonly window: IWindow;
	public _asyncTaskManager = new AsyncTaskManager();

	/**
	 * Constructor.
	 *
	 * @param page Page.
	 */
	constructor(page: BrowserPage) {
		this.page = page;
		this.window = new Window({
			browserFrame: this,
			console: page.console
		});
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
		(<BrowserPage>this.page) = null;
		(<Window>this.window) = null;
	}

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: IBrowserPageViewport): void {
		if (
			(viewport.width !== undefined && this.window.innerWidth !== viewport.width) ||
			(viewport.height !== undefined && this.window.innerHeight !== viewport.height)
		) {
			if (viewport.width !== undefined && this.window.innerWidth !== viewport.width) {
				(<number>this.window.innerWidth) = viewport.width;
				(<number>this.window.outerWidth) = viewport.width;
			}

			if (viewport.height !== undefined && this.window.innerHeight !== viewport.height) {
				(<number>this.window.innerHeight) = viewport.height;
				(<number>this.window.outerHeight) = viewport.height;
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
		await Promise.all(this.childFrames.map((frame) => frame.destroy()));
		this._asyncTaskManager.abortAll();

		this.window.location.href = url;

		const response = await this.window.fetch(url);
		const responseText = await response.text();

		this.window.document.write(responseText);
	}
}
