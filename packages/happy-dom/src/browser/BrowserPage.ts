import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import IBrowserPageViewport from './types/IBrowserPageViewport.js';
import BrowserFrame from './BrowserFrame.js';
import BrowserContext from './BrowserContext.js';
import VirtualConsole from '../console/VirtualConsole.js';
import IBrowserPage from './types/IBrowserPage.js';
import BrowserPageUtility from './utilities/BrowserPageUtility.js';
import { Script } from 'vm';
import IGoToOptions from './types/IGoToOptions.js';
import IResponse from '../fetch/types/IResponse.js';
import IReloadOptions from './types/IReloadOptions.js';

/**
 * Browser page.
 */
export default class BrowserPage implements IBrowserPage {
	public readonly virtualConsolePrinter = new VirtualConsolePrinter();
	public readonly mainFrame: BrowserFrame;
	public readonly context: BrowserContext;
	public readonly console: Console;

	/**
	 * Constructor.
	 *
	 * @param context Browser context.
	 */
	constructor(context: BrowserContext) {
		this.context = context;
		this.console = context.browser.console ?? new VirtualConsole(this.virtualConsolePrinter);
		this.mainFrame = new BrowserFrame(this);
	}

	/**
	 * Returns frames.
	 */
	public get frames(): BrowserFrame[] {
		return <BrowserFrame[]>BrowserPageUtility.getFrames(this);
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
		BrowserPageUtility.closePage(this);
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

	/**
	 * Reloads the current page.
	 *
	 * @param [options] Options.
	 * @returns Response.
	 */
	public reload(options: IReloadOptions): Promise<IResponse | null> {
		return this.mainFrame.reload(options);
	}
}
