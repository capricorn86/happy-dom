import IBrowserSettings from '../browser/types/IBrowserSettings.js';
import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import BrowserSettingsFactory from '../browser/BrowserSettingsFactory.js';
import IReadOnlyBrowserSettings from '../browser/types/IReadOnlyBrowserSettings.js';
import IBrowserPageViewport from '../browser/types/IBrowserPageViewport.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import DetachedBrowserFrame from '../browser/detached-browser/DetachedBrowserFrame.js';

/**
 * API for detached windows to be able to access features of the owner window.
 */
export default class HappyDOMWindowAPI {
	#browserFrame?: IBrowserFrame;
	#settings: IBrowserSettings | null = null;

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
	 * @deprecated Settings should not be read or written from Window. Use the Browser class instead to access settings.
	 * @returns Settings.
	 */
	public get settings(): IReadOnlyBrowserSettings {
		if (!this.#settings) {
			this.#settings = BrowserSettingsFactory.getReadOnlySettings(
				this.#browserFrame.page.context.browser.settings
			);
		}
		return this.#settings;
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
	 * @deprecated Use whenComplete() instead.
	 * @returns Promise.
	 */
	public async whenAsyncComplete(): Promise<void> {
		return await this.whenComplete();
	}

	/**
	 * Waits for all async tasks to complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		return await this.#browserFrame.whenComplete();
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
	 * Aborts all async tasks.
	 */
	public abort(): void {
		this.#browserFrame.abort();
	}

	/**
	 * Sets the URL on a detached window.
	 * It will throw an exception if the window is not detached as a script could potentially use this method to bypass CORS.
	 *
	 * @param url URL.
	 */
	public setURL(url: string): void {
		if (!(this.#browserFrame instanceof DetachedBrowserFrame)) {
			throw new Error(
				'Only detached browser frames can use the setURL() method for security reasons. Use the Browser API instead for setting URL.'
			);
		}
		this.#browserFrame.url = url;
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
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: IBrowserPageViewport): void {
		this.#browserFrame.setViewport(viewport);
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
