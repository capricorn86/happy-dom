import DetachedBrowserPage from './DetachedBrowserPage.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from '../types/IBrowserFrame.js';
import Location from '../../location/Location.js';
import IResponse from '../../fetch/types/IResponse.js';
import IGoToOptions from '../types/IGoToOptions.js';
import { Script } from 'vm';
import BrowserFrameURL from '../utilities/BrowserFrameURL.js';
import BrowserFrameScriptEvaluator from '../utilities/BrowserFrameScriptEvaluator.js';
import BrowserFrameNavigator from '../utilities/BrowserFrameNavigator.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import IReloadOptions from '../types/IReloadOptions.js';
import BrowserErrorCapturingEnum from '../enums/BrowserErrorCapturingEnum.js';
import BrowserFrameExceptionObserver from '../utilities/BrowserFrameExceptionObserver.js';
import IDocument from '../../nodes/document/IDocument.js';

/**
 * Browser frame used when constructing a Window instance without a browser.
 */
export default class DetachedBrowserFrame implements IBrowserFrame {
	public readonly childFrames: DetachedBrowserFrame[] = [];
	public readonly parentFrame: DetachedBrowserFrame | null = null;
	public readonly opener: DetachedBrowserFrame | null = null;
	public readonly page: DetachedBrowserPage;
	// Needs to be injected from the outside when the browser frame is constructed.
	public window: IBrowserWindow;
	public [PropertySymbol.asyncTaskManager] = new AsyncTaskManager();
	public [PropertySymbol.exceptionObserver]: BrowserFrameExceptionObserver | null = null;

	/**
	 * Constructor.
	 *
	 * @param page Page.
	 * @param [window] Window.
	 */
	constructor(page: DetachedBrowserPage) {
		this.page = page;
		if (page.context.browser.contexts[0]?.pages[0]?.mainFrame) {
			this.window = new this.page.context.browser.windowClass(this);
		}

		// Attach process level error capturing.
		if (page.context.browser.settings.errorCapturing === BrowserErrorCapturingEnum.processLevel) {
			this[PropertySymbol.exceptionObserver] = new BrowserFrameExceptionObserver();
			this[PropertySymbol.exceptionObserver].observe(this);
		}
	}

	/**
	 * Returns the content.
	 *
	 * @returns Content.
	 */
	public get content(): string {
		if (!this.window) {
			throw new Error('The frame has been destroyed, the "window" property is not set.');
		}
		return this.window.document.documentElement.outerHTML;
	}

	/**
	 * Sets the content.
	 *
	 * @param content Content.
	 */
	public set content(content) {
		if (!this.window) {
			throw new Error('The frame has been destroyed, the "window" property is not set.');
		}
		this.window.document[PropertySymbol.isFirstWrite] = true;
		this.window.document[PropertySymbol.isFirstWriteAfterOpen] = false;
		this.window.document.open();
		this.window.document.write(content);
	}

	/**
	 * Returns the URL.
	 *
	 * @returns URL.
	 */
	public get url(): string {
		if (!this.window) {
			throw new Error('The frame has been destroyed, the "window" property is not set.');
		}
		return this.window.location.href;
	}

	/**
	 * Sets the content.
	 *
	 * @param url URL.
	 */
	public set url(url) {
		if (!this.window) {
			throw new Error('The frame has been destroyed, the "window" property is not set.');
		}
		(<Location>this.window.location) = new Location(
			this,
			BrowserFrameURL.getRelativeURL(this, url).href
		);
	}

	/**
	 * Returns document.
	 *
	 * @returns Document.
	 */
	public get document(): IDocument {
		return this.window?.document ?? null;
	}

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await Promise.all([
			this[PropertySymbol.asyncTaskManager].whenComplete(),
			...this.childFrames.map((frame) => frame.whenComplete())
		]);
	}

	/**
	 * Aborts all ongoing operations.
	 */
	public abort(): Promise<void> {
		if (!this.childFrames.length) {
			return this[PropertySymbol.asyncTaskManager].abort();
		}
		return new Promise((resolve, reject) => {
			// Using Promise instead of async/await to prevent microtask
			Promise.all(
				this.childFrames.map((frame) => frame.abort()).concat([this[PropertySymbol.asyncTaskManager].abort()])
			)
				.then(() => resolve())
				.catch(reject);
		});
	}

	/**
	 * Evaluates code or a VM Script in the page's context.
	 *
	 * @param script Script.
	 * @returns Result.
	 */
	public evaluate(script: string | Script): any {
		return BrowserFrameScriptEvaluator.evaluate(this, script);
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 * @param [options] Options.
	 * @returns Response.
	 */
	public goto(url: string, options?: IGoToOptions): Promise<IResponse | null> {
		return BrowserFrameNavigator.goto(this.page.context.browser.windowClass, this, url, options);
	}

	/**
	 * Reloads the current frame.
	 *
	 * @param [options] Options.
	 * @returns Response.
	 */
	public reload(options: IReloadOptions): Promise<IResponse | null> {
		return BrowserFrameNavigator.goto(
			this.page.context.browser.windowClass,
			this,
			this.url,
			options
		);
	}
}
