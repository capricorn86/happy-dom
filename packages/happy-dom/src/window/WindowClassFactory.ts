import IBrowserSettings from '../browser/IBrowserSettings.js';
import IWindow from './IWindow.js';
import Event from '../event/Event.js';
import BrowserFrame from '../browser/BrowserFrame.js';
import DetachedBrowserFrame from '../browser/DetachedBrowserFrame.js';
import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import BrowserSettingsFactory from '../browser/BrowserSettingsFactory.js';
import IReadOnlyBrowserSettings from '../browser/IReadOnlyBrowserSettings.js';
import IBrowserPageViewport from '../browser/IBrowserPageViewport.js';

/**
 * API for detached windows to be able to access features of the owner window.
 */
export default class HappyDOMWindowAPI {
	#window: IWindow;
	#browserFrame?: BrowserFrame | DetachedBrowserFrame;
	#settings: IBrowserSettings | null = null;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.window Owner window.
	 * @param options.browserFrame Browser frame.
	 */
	constructor(options: { window: IWindow; browserFrame: BrowserFrame | DetachedBrowserFrame }) {
		this.#window = options.window;
		this.#browserFrame = options.browserFrame;
	}

	/**
	 * Returns settings.
	 *
	 * @returns Settings.
	 */
	public get settings(): IReadOnlyBrowserSettings {
		if (!this.#settings) {
			this.#settings = BrowserSettingsFactory.getReadOnlySettings(
				this.#browserFrame instanceof DetachedBrowserFrame
					? this.#browserFrame.settings
					: this.#browserFrame.page.context.browser.settings
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
		if (this.#browserFrame instanceof DetachedBrowserFrame) {
			return this.#browserFrame.virtualConsolePrinter;
		}
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
	public async cancelAsync(): Promise<void> {
		await this.abort();
	}

	/**
	 * Aborts all async tasks.
	 */
	public async abort(): Promise<void> {
		await this.#browserFrame.abort();
	}

	/**
	 * Sets the URL.
	 *
	 * @param url URL.
	 */
	public setURL(url: string): void {
		this.#window.location.href = url;
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
