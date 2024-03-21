import DetachedBrowserPage from './DetachedBrowserPage.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from '../types/IBrowserFrame.js';
import Response from '../../fetch/Response.js';
import IGoToOptions from '../types/IGoToOptions.js';
import { Script } from 'vm';
import BrowserFrameURL from '../utilities/BrowserFrameURL.js';
import BrowserFrameScriptEvaluator from '../utilities/BrowserFrameScriptEvaluator.js';
import BrowserFrameNavigator from '../utilities/BrowserFrameNavigator.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import IReloadOptions from '../types/IReloadOptions.js';
import BrowserErrorCaptureEnum from '../enums/BrowserErrorCaptureEnum.js';
import BrowserFrameExceptionObserver from '../utilities/BrowserFrameExceptionObserver.js';
import Document from '../../nodes/document/Document.js';
import CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';

/**
 * Browser frame used when constructing a Window instance without a browser.
 */
export default class DetachedBrowserFrame implements IBrowserFrame {
	public readonly childFrames: DetachedBrowserFrame[] = [];
	public readonly parentFrame: DetachedBrowserFrame | null = null;
	public readonly page: DetachedBrowserPage;
	// Needs to be injected from the outside when the browser frame is constructed.
	public window: BrowserWindow;
	public [PropertySymbol.asyncTaskManager] = new AsyncTaskManager();
	public [PropertySymbol.exceptionObserver]: BrowserFrameExceptionObserver | null = null;
	public [PropertySymbol.listeners]: { navigation: Array<() => void> } = { navigation: [] };
	public [PropertySymbol.openerFrame]: IBrowserFrame | null = null;
	public [PropertySymbol.openerWindow]: BrowserWindow | CrossOriginBrowserWindow | null = null;
	public [PropertySymbol.popup] = false;

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
		if (page.context.browser.settings.errorCapture === BrowserErrorCaptureEnum.processLevel) {
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
		this.window.location[PropertySymbol.setURL](
			this,
			BrowserFrameURL.getRelativeURL(this, url).href
		);
	}

	/**
	 * Returns document.
	 *
	 * @returns Document.
	 */
	public get document(): Document {
		return this.window?.document ?? null;
	}

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all async tasks such as timers are complete.
	 */
	public async waitUntilComplete(): Promise<void> {
		await Promise.all([
			this[PropertySymbol.asyncTaskManager].waitUntilComplete(),
			...this.childFrames.map((frame) => frame.waitUntilComplete())
		]);
	}

	/**
	 * Returns a promise that is resolved when the frame has navigated and the response HTML has been written to the document.
	 */
	public waitForNavigation(): Promise<void> {
		return new Promise((resolve) => this[PropertySymbol.listeners].navigation.push(resolve));
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
				this.childFrames
					.map((frame) => frame.abort())
					.concat([this[PropertySymbol.asyncTaskManager].abort()])
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
	public goto(url: string, options?: IGoToOptions): Promise<Response | null> {
		return BrowserFrameNavigator.navigate({
			windowClass: this.page.context.browser.windowClass,
			frame: this,
			url: url,
			goToOptions: options
		});
	}

	/**
	 * Reloads the current frame.
	 *
	 * @param [options] Options.
	 * @returns Response.
	 */
	public reload(options: IReloadOptions): Promise<Response | null> {
		return BrowserFrameNavigator.navigate({
			windowClass: this.page.context.browser.windowClass,
			frame: this,
			url: this.url,
			goToOptions: options
		});
	}
}
