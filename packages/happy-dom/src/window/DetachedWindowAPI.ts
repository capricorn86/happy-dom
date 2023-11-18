import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import IBrowserPageViewport from '../browser/types/IBrowserPageViewport.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import IBrowserSettings from '../browser/types/IBrowserSettings.js';

/**
 * API for detached windows to be able to access features of the browser.
 */
export default class DetachedWindowAPI {
	#browserFrame?: IBrowserFrame;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		this.#browserFrame = browserFrame;
	}

	/**
	 * Returns settings.
	 *
	 * @deprecated Depreacted for security reasons and will be removed in the future. Use Browser API instead to access settings (e.g. new Browser()).
	 * @returns Settings.
	 */
	public get settings(): IBrowserSettings {
		return this.#browserFrame.page.context.browser.settings;
	}

	/**
	 * Returns virtual console printer.
	 *
	 * @returns Virtual console printer.
	 */
	public get virtualConsolePrinter(): VirtualConsolePrinter {
		return this.#browserFrame.page.virtualConsolePrinter;
	}

	/**
	 * Waits for all async tasks to complete.
	 *
	 * @returns Promise.
	 */
	public whenComplete(): Promise<void> {
		return this.#browserFrame.whenComplete();
	}

	/**
	 * Waits for all async tasks to complete.
	 *
	 * @deprecated Use whenComplete() instead.
	 * @returns Promise.
	 */
	public whenAsyncComplete(): Promise<void> {
		return this.whenComplete();
	}

	/**
	 * Aborts all async tasks.
	 */
	public abort(): void {
		this.#browserFrame.abort();
	}

	/**
	 * Aborts all async tasks.
	 *
	 * @deprecated Use abort() instead.
	 */
	public cancelAsync(): void {
		this.abort();
	}

	/**
	 * Sets the URL without navigating the browser.
	 *
	 * @deprecated Depreacted for security reasons and will be removed in the future. Use Browser API instead to change URL (e.g. new Browser()).
	 * @param url URL.
	 */
	public setURL(url: string): void {
		this.#browserFrame.url = url;
	}

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: IBrowserPageViewport): void {
		this.#browserFrame.page.setViewport(viewport);
	}

	/**
	 * Sets the window size.
	 *
	 * @deprecated Use setViewport() instead.
	 * @param options Options.
	 * @param options.width Width.
	 * @param options.height Height.
	 */
	public setWindowSize(options: { width?: number; height?: number }): void {
		this.setViewport({
			width: options?.width,
			height: options?.height
		});
	}

	/**
	 * Sets the window width.
	 *
	 * @deprecated Use setViewport() instead.
	 * @param width Width.
	 */
	public setInnerWidth(width: number): void {
		this.setViewport({ width });
	}

	/**
	 * Sets the window height.
	 *
	 * @deprecated Use setViewport() instead.
	 * @param height Height.
	 */
	public setInnerHeight(height: number): void {
		this.setViewport({ height });
	}
}
