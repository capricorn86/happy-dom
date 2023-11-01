import IWindow from '../../window/IWindow.js';
import DetachedBrowserPage from './DetachedBrowserPage.js';
import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from '../types/IBrowserFrame.js';
import Location from '../../location/Location.js';
import IResponse from '../../fetch/types/IResponse.js';
import BrowserFrameUtility from '../BrowserFrameUtility.js';
import IGoToOptions from '../types/IGoToOptions.js';

/**
 * Browser frame.
 */
export default class DetachedBrowserFrame implements IBrowserFrame {
	public readonly childFrames: DetachedBrowserFrame[] = [];
	public readonly parentFrame: DetachedBrowserFrame | null = null;
	public readonly page: DetachedBrowserPage;
	public readonly window: IWindow;
	public _asyncTaskManager = new AsyncTaskManager();

	/**
	 * Constructor.
	 *
	 * @param page Page.
	 */
	constructor(page: DetachedBrowserPage) {
		this.window = page.mainFrame
			? new page.context.browser.detachedWindowClass({ browserFrame: this, console: page.console })
			: page.context.browser.detachedWindow;
		this.page = page;
	}

	/**
	 * Returns the content.
	 *
	 * @returns Content.
	 */
	public get content(): string {
		return this.window.document.documentElement.outerHTML;
	}

	/**
	 * Sets the content.
	 *
	 * @param content Content.
	 */
	public set content(content) {
		this.window.document['_isFirstWrite'] = true;
		this.window.document['_isFirstWriteAfterOpen'] = true;
		this.window.document.write(content);
	}

	/**
	 * Returns the URL.
	 *
	 * @returns URL.
	 */
	public get url(): string {
		return this.window.location.href;
	}

	/**
	 * Sets the content.
	 *
	 * @param url URL.
	 */
	public set url(url) {
		(<Location>this.window.location) = new Location(url, this);
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
	 */
	public abort(): void {
		for (const frame of this.childFrames) {
			frame.abort();
		}
		this._asyncTaskManager.abortAll();
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 * @param [options] Options.
	 */
	public async goto(url: string, options?: IGoToOptions): Promise<IResponse | null> {
		if (
			this.page.context === this.page.context.browser.defaultContext &&
			this.page.context.pages[0] === this.page &&
			this.page.mainFrame === this
		) {
			throw new Error('The main frame cannot be navigated in a detached browser.');
		}

		return await BrowserFrameUtility.goto(
			this.page.context.browser.detachedWindowClass,
			this,
			url,
			options
		);
	}
}
