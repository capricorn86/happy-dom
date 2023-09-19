import Event from '../event/Event.js';
import IBrowserContextSettings from './IBrowserSettings.js';
import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import IBrowserPageViewport from './IBrowserPageViewport.js';
import BrowserFrame from './BrowserFrame.js';
import BrowserContext from './BrowserContext.js';

/**
 * Browser page.
 */
export default class BrowserPage {
	public settings: IBrowserContextSettings;
	public consolePrinter: VirtualConsolePrinter | null;
	public mainFrame: BrowserFrame | null = null;
	public frames: BrowserFrame[];
	public context: BrowserContext;

	/**
	 * Constructor.
	 *
	 * @param context Browser context.
	 */
	constructor(context: BrowserContext) {
		this.context = context;
	}

	/**
	 * Returns the viewport.
	 */
	public get content(): string {
		return this.mainFrame.window.document.documentElement.outerHTML;
	}

	/**
	 * Aborts asynchronous tasks and destroys the context.
	 *
	 * @returns Promise.
	 */
	public async close(): Promise<void> {
		await Promise.all(this.frames.map((frame) => frame.destroy()));
	}

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await Promise.all(this.frames.map((frame) => frame.whenComplete()));
	}

	/**
	 * Aborts all async tasks.
	 *
	 * @returns Promise.
	 */
	public async abort(): Promise<void> {
		await Promise.all(this.frames.map((frame) => frame.abort()));
	}

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: IBrowserPageViewport): void {
		if (
			(viewport.width !== undefined && this.window.innerWidth !== viewport.width) ||
			(viewport.height !== undefined && this.window.innerHeight !== viewport.height)
		) {
			if (viewport.width !== undefined && this.window.innerWidth !== viewport.width) {
				(<number>this.window.innerWidth) = viewport.width;
				(<number>this.window.outerWidth) = viewport.width;
			}

			if (viewport.height !== undefined && this.window.innerHeight !== viewport.height) {
				(<number>this.window.innerHeight) = viewport.height;
				(<number>this.window.outerHeight) = viewport.height;
			}

			this.window.dispatchEvent(new Event('resize'));
		}
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	public async goto(url: string): Promise<void> {
		this.window.location.href = url;

		const response = await this.window.fetch(url);
		const responseText = await response.text();

		this.document.write(responseText);
	}
}
