import VirtualConsolePrinter from '../../console/VirtualConsolePrinter.js';
import IBrowserPageViewport from '../types/IBrowserPageViewport.js';
import DetachedBrowserFrame from './DetachedBrowserFrame.js';
import DetachedBrowserContext from './DetachedBrowserContext.js';
import VirtualConsole from '../../console/VirtualConsole.js';
import IBrowserPage from '../types/IBrowserPage.js';
import { Script } from 'vm';
import IGoToOptions from '../types/IGoToOptions.js';
import IResponse from '../../fetch/types/IResponse.js';
import BrowserPageUtility from '../utilities/BrowserPageUtility.js';

/**
 * Detached browser page used when constructing a Window instance without a browser.
 */
export default class DetachedBrowserPage implements IBrowserPage {
	public readonly virtualConsolePrinter = new VirtualConsolePrinter();
	public readonly mainFrame: DetachedBrowserFrame;
	public readonly context: DetachedBrowserContext;
	public readonly console: Console;

	/**
	 * Constructor.
	 *
	 * @param context Browser context.
	 */
	constructor(context: DetachedBrowserContext) {
		this.context = context;
		this.console = context.browser.console ?? new VirtualConsole(this.virtualConsolePrinter);
		this.mainFrame = new DetachedBrowserFrame(this);
	}

	/**
	 * Returns frames.
	 */
	public get frames(): DetachedBrowserFrame[] {
		return <DetachedBrowserFrame[]>BrowserPageUtility.getFrames(this);
	}

	/**
	 * Returns the viewport.
	 */
	public get content(): string {
		return this.mainFrame.content;
	}

	/**
	 * Sets the content.
	 *
	 * @param content Content.
	 */
	public set content(content) {
		this.mainFrame.content = content;
	}

	/**
	 * Returns the URL.
	 *
	 * @returns URL.
	 */
	public get url(): string {
		return this.mainFrame.url;
	}

	/**
	 * Sets the content.
	 *
	 * @param url URL.
	 */
	public set url(url) {
		this.mainFrame.url = url;
	}

	/**
	 * Aborts all ongoing operations and destroys the page.
	 */
	public close(): void {
		const context = this.context;
		BrowserPageUtility.closePage(this);
		// As we are in a detached page, a context or browser should not exist without a page as there are no references to them.
		if (context.pages[0] === this) {
			context.close();
		}
	}

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await this.mainFrame.whenComplete();
	}

	/**
	 * Aborts all ongoing operations.
	 */
	public abort(): void {
		this.mainFrame.abort();
	}

	/**
	 * Evaluates code or a VM Script in the page's context.
	 *
	 * @param script Script.
	 * @returns Result.
	 */
	public evaluate(script: string | Script): any {
		return this.mainFrame.evaluate(script);
	}

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: IBrowserPageViewport): void {
		BrowserPageUtility.setViewport(this, viewport);
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 * @param [options] Options.
	 * @returns Response.
	 */
	public goto(url: string, options?: IGoToOptions): Promise<IResponse | null> {
		return this.mainFrame.goto(url, options);
	}
}
