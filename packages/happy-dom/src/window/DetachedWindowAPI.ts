import BrowserSettingsFactory from '../browser/BrowserSettingsFactory.js';
import IBrowserSettings from '../browser/IBrowserSettings.js';
import IOptionalBrowserSettings from '../browser/IOptionalBrowserSettings.js';
import IVirtualConsolePrinter from '../console/types/IVirtualConsolePrinter.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import IWindow from './IWindow.js';
import Event from '../event/Event.js';

/**
 * API for detached windows to be able to access features of the owner window.
 */
export default class DetachedWindowAPI {
	public readonly asyncTaskManager = new AsyncTaskManager();
	public readonly settings: IBrowserSettings;
	public readonly virtualConsolePrinter: IVirtualConsolePrinter | null;
	#ownerWindow: IWindow;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.ownerWindow Owner window.
	 * @param [options.settings] Browser settings.
	 * @param [options.virtualConsolePrinter] Virtual console printer.
	 */
	constructor(options: {
		ownerWindow: IWindow;
		settings?: IOptionalBrowserSettings;
		virtualConsolePrinter?: IVirtualConsolePrinter;
	}) {
		this.#ownerWindow = options.ownerWindow;
		this.settings = BrowserSettingsFactory.getSettings(options.settings);
		this.virtualConsolePrinter = options.virtualConsolePrinter || null;
	}

	/**
	 * Waits for all async tasks to complete.
	 *
	 * @returns Promise.
	 */
	public async whenAsyncComplete(): Promise<void> {
		return await this.asyncTaskManager.whenComplete();
	}

	/**
	 * Aborts all async tasks.
	 */
	public cancelAsync(): void {
		this.asyncTaskManager.cancelAll();
	}

	/**
	 * Sets the URL.
	 *
	 * @param url URL.
	 */
	public setURL(url: string): void {
		this.#ownerWindow.location.href = url;
	}

	/**
	 * Sets the window size.
	 *
	 * @param options Options.
	 * @param options.width Width.
	 * @param options.height Height.
	 */
	public setWindowSize(options: { width?: number; height?: number }): void {
		if (
			(options.width !== undefined && this.#ownerWindow.innerWidth !== options.width) ||
			(options.height !== undefined && this.#ownerWindow.innerHeight !== options.height)
		) {
			if (options.width !== undefined && this.#ownerWindow.innerWidth !== options.width) {
				(<number>this.#ownerWindow.innerWidth) = options.width;
				(<number>this.#ownerWindow.outerWidth) = options.width;
			}

			if (options.height !== undefined && this.#ownerWindow.innerHeight !== options.height) {
				(<number>this.#ownerWindow.innerHeight) = options.height;
				(<number>this.#ownerWindow.outerHeight) = options.height;
			}

			this.#ownerWindow.dispatchEvent(new Event('resize'));
		}
	}

	/**
	 * Sets the window width.
	 *
	 * @deprecated Use setWindowSize() instead.
	 * @param width Width.
	 */
	public setInnerWidth(width: number): void {
		this.setWindowSize({ width });
	}

	/**
	 * Sets the window height.
	 *
	 * @deprecated Use setWindowSize() instead.
	 * @param height Height.
	 */
	public setInnerHeight(height: number): void {
		this.setWindowSize({ height });
	}
}
