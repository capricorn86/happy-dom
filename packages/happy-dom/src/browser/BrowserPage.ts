import Event from '../event/Event.js';
import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import IBrowserPageViewport from './IBrowserPageViewport.js';
import BrowserFrame from './BrowserFrame.js';
import BrowserContext from './BrowserContext.js';
import VirtualConsole from '../console/VirtualConsole.js';

/**
 * Browser page.
 */
export default class BrowserPage {
	public consolePrinter: VirtualConsolePrinter | null;
	public mainFrame: BrowserFrame | null = null;
	public context: BrowserContext;
	public readonly console: Console;
	public readonly virtualConsolePrinter = new VirtualConsolePrinter();

	/**
	 * Constructor.
	 *
	 * @param context Browser context.
	 */
	constructor(context: BrowserContext) {
		this.context = context;
		this.console = context.browser.console ?? new VirtualConsole(this.virtualConsolePrinter);
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
		this.consolePrinter = null;
		this.mainFrame = null;
		this.context = null;
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
		if (
			(viewport.width !== undefined && this.mainFrame.window.innerWidth !== viewport.width) ||
			(viewport.height !== undefined && this.mainFrame.window.innerHeight !== viewport.height)
		) {
			if (viewport.width !== undefined && this.mainFrame.window.innerWidth !== viewport.width) {
				(<number>this.mainFrame.window.innerWidth) = viewport.width;
				(<number>this.mainFrame.window.outerWidth) = viewport.width;
			}

			if (viewport.height !== undefined && this.mainFrame.window.innerHeight !== viewport.height) {
				(<number>this.mainFrame.window.innerHeight) = viewport.height;
				(<number>this.mainFrame.window.outerHeight) = viewport.height;
			}

			this.mainFrame.window.dispatchEvent(new Event('resize'));
		}
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
	public _getFrames(parent: BrowserFrame): BrowserFrame[] {
		let frames = [parent];
		for (const frame of parent.childFrames) {
			frames = frames.concat(this._getFrames(frame));
		}
		return frames;
	}
}
