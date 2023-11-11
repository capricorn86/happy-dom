import IWindow from '../../window/IWindow.js';
import DetachedBrowserPage from './DetachedBrowserPage.js';
import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from '../types/IBrowserFrame.js';
import Location from '../../location/Location.js';
import IResponse from '../../fetch/types/IResponse.js';
import BrowserFrameUtility from '../BrowserFrameUtility.js';
import IGoToOptions from '../types/IGoToOptions.js';
import { Script } from 'vm';

/**
 * Browser frame used when constructing a Window instance without a browser.
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
		this.page = page;
		this.window = page.context.browser.contexts[0]?.pages[0]?.mainFrame
			? new page.context.browser.detachedWindowClass({
					browserFrame: this,
					console: page.console
			  })
			: page.context.browser.detachedWindow;
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
		this.window.document['_isFirstWriteAfterOpen'] = false;
		this.window.document.open();
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
		(<Location>this.window.location) = new Location(
			this,
			BrowserFrameUtility.getRelativeURL(this, url)
		);
	}

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await Promise.all([
			this._asyncTaskManager.whenComplete(),
			...this.childFrames.map((frame) => frame.whenComplete())
		]);
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
	 * Evaluates code or a VM Script in the page's context.
	 *
	 * @param script Script.
	 * @returns Result.
	 */
	public evaluate(script: string | Script): any {
		return BrowserFrameUtility.evaluate(this, script);
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 * @param [options] Options.
	 */
	public async goto(url: string, options?: IGoToOptions): Promise<IResponse | null> {
		return await BrowserFrameUtility.goto(
			this.page.context.browser.detachedWindowClass,
			this,
			url,
			options
		);
	}
}
