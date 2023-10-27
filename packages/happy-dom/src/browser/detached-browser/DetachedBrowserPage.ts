import VirtualConsolePrinter from '../../console/VirtualConsolePrinter.js';
import IBrowserPageViewport from '../types/IBrowserPageViewport.js';
import DetachedBrowserFrame from './DetachedBrowserFrame.js';
import DetachedBrowserContext from './DetachedBrowserContext.js';
import VirtualConsole from '../../console/VirtualConsole.js';
import IBrowserPage from '../types/IBrowserPage.js';
import IWindow from '../../window/IWindow.js';

/**
 * Detached browser page.
 */
export default class DetachedBrowserPage implements IBrowserPage {
	public readonly virtualConsolePrinter = new VirtualConsolePrinter();
	public readonly mainFrame: DetachedBrowserFrame;
	public readonly context: DetachedBrowserContext;
	public readonly console: Console;

	/**
	 * Constructor.
	 *
	 * @param windowClass Window class.
	 * @param window Window.
	 * @param context Browser context.
	 */
	constructor(windowClass: new () => IWindow, window: IWindow, context: DetachedBrowserContext) {
		this.context = context;
		this.console = context.browser.console ?? new VirtualConsole(this.virtualConsolePrinter);
		this.mainFrame = new DetachedBrowserFrame(windowClass, window, this);
	}

	/**
	 * Returns frames.
	 */
	public get frames(): DetachedBrowserFrame[] {
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
	 */
	public close(): void {
		this.mainFrame.destroy();
		const index = this.context.pages.indexOf(this);
		if (index !== -1) {
			this.context.pages.splice(index, 1);
		}
		(<VirtualConsolePrinter | null>this.virtualConsolePrinter) = null;
		(<DetachedBrowserFrame | null>this.mainFrame) = null;
		(<DetachedBrowserContext | null>this.context) = null;
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
	private _getFrames(parent: DetachedBrowserFrame): DetachedBrowserFrame[] {
		let frames = [parent];
		for (const frame of parent.childFrames) {
			frames = frames.concat(this._getFrames(frame));
		}
		return frames;
	}
}
