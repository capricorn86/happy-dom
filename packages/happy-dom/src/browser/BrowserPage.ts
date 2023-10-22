import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import IBrowserPageViewport from './IBrowserPageViewport.js';
import BrowserFrame from './BrowserFrame.js';
import BrowserContext from './BrowserContext.js';
import VirtualConsole from '../console/VirtualConsole.js';
import IBrowserPage from './IBrowserPage.js';

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
		return this._getFrames(this.mainFrame);
	}

	/**
	 * Returns the viewport.
	 */
	public get content(): string {
		return this.mainFrame.window.document.documentElement.outerHTML;
	}

	/**
	 * Aborts all ongoing operations and destroys the page.
	 *
	 * @returns Promise.
	 */
	public async close(): Promise<void> {
		await this.mainFrame.destroy();
		const index = this.context.pages.indexOf(this);
		if (index !== -1) {
			this.context.pages.splice(index, 1);
		}
		(<VirtualConsolePrinter | null>this.virtualConsolePrinter) = null;
		(<BrowserFrame | null>this.mainFrame) = null;
		(<BrowserContext | null>this.context) = null;
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
	 *
	 * @returns Promise.
	 */
	public async abort(): Promise<void> {
		await this.mainFrame.abort();
	}

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: IBrowserPageViewport): void {
		this.mainFrame.setViewport(viewport);
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	public async goto(url: string): Promise<void> {
		this.mainFrame.goto(url);
	}

	/**
	 * Returns frames.
	 *
	 * @param parent Parent frame.
	 */
	private _getFrames(parent: BrowserFrame): BrowserFrame[] {
		let frames = [parent];
		for (const frame of parent.childFrames) {
			frames = frames.concat(this._getFrames(frame));
		}
		return frames;
	}
}
