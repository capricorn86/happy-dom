import BrowserPage from './BrowserPage.js';
import * as PropertySymbol from '../PropertySymbol.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from './types/IBrowserFrame.js';
import BrowserWindow from '../window/BrowserWindow.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import ICrossOriginBrowserWindow from '../window/ICrossOriginBrowserWindow.js';
import IResponse from '../fetch/types/IResponse.js';
import IGoToOptions from './types/IGoToOptions.js';
import { Script } from 'vm';
import BrowserFrameURL from './utilities/BrowserFrameURL.js';
import BrowserFrameScriptEvaluator from './utilities/BrowserFrameScriptEvaluator.js';
import BrowserFrameNavigator from './utilities/BrowserFrameNavigator.js';
import IReloadOptions from './types/IReloadOptions.js';
import BrowserFrameExceptionObserver from './utilities/BrowserFrameExceptionObserver.js';
import BrowserErrorCaptureEnum from './enums/BrowserErrorCaptureEnum.js';
import IDocument from '../nodes/document/IDocument.js';

/**
 * Browser frame.
 */
export default class BrowserFrame implements IBrowserFrame {
	public readonly childFrames: BrowserFrame[] = [];
	public readonly parentFrame: BrowserFrame | null = null;
	public readonly page: BrowserPage;
	public readonly window: BrowserWindow;
	public [PropertySymbol.asyncTaskManager] = new AsyncTaskManager();
	public [PropertySymbol.exceptionObserver]: BrowserFrameExceptionObserver | null = null;
	public [PropertySymbol.listeners]: { navigation: Array<() => void> } = { navigation: [] };
	public [PropertySymbol.openerFrame]: IBrowserFrame | null = null;
	public [PropertySymbol.openerWindow]: IBrowserWindow | ICrossOriginBrowserWindow | null = null;
	public [PropertySymbol.popup] = false;

	/**
	 * Constructor.
	 *
	 * @param page Page.
	 */
	constructor(page: BrowserPage) {
		this.page = page;
		this.window = new BrowserWindow(this);

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
		return this.window.document.documentElement.outerHTML;
	}

	/**
	 * Sets the content.
	 *
	 * @param content Content.
	 */
	public set content(content) {
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
		return this.window.location.href;
	}

	/**
	 * Sets the content.
	 *
	 * @param url URL.
	 */
	public set url(url) {
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
	public get document(): IDocument {
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
	public goto(url: string, options?: IGoToOptions): Promise<IResponse | null> {
		return BrowserFrameNavigator.goto(BrowserWindow, this, url, options);
	}

	/**
	 * Reloads the current frame.
	 *
	 * @param [options] Options.
	 * @returns Response.
	 */
	public reload(options: IReloadOptions): Promise<IResponse | null> {
		return BrowserFrameNavigator.goto(BrowserWindow, this, this.url, options);
	}
}
