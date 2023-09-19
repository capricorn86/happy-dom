import IWindow from '../window/IWindow.js';
import Event from '../event/Event.js';
import IBrowserContextSettings from './IBrowserSettings.js';
import IViewport from './IBrowserPageViewport.js';
import BrowserPage from './BrowserPage.js';
import { AsyncTaskManager } from '../index.js';

/**
 * Browser frame.
 */
export default class BrowserFrame {
	public childFrames: BrowserFrame[] = [];
	public detached = false;
	public page: BrowserPage | null = null;
	public window: IWindow | null = null;
	public settings: IBrowserContextSettings;
	private _asyncTaskManager = new AsyncTaskManager();

	/**
	 * Constructor.
	 *
	 * @param page Page.
	 */
	constructor(page: BrowserPage) {
		this.page = page;
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
	 * Aborts asynchronous tasks and destroys the context.
	 *
	 * @returns Promise.
	 */
	public async abort(): Promise<void> {
		await this._asyncTaskManager.cancelAll();
		this.window = null;
	}

	/**
	 * Aborts asynchronous tasks and destroys the context.
	 *
	 * @returns Promise.
	 */
	public async destroy(): Promise<void> {
		await this.abort();
		this.window = null;
	}

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: IViewport): void {
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
		this.window.location.href = url;

		const response = await this.window.fetch(url);
		const responseText = await response.text();

		this.window.document.write(responseText);
	}
}
