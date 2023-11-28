import IWindow from './IWindow.js';
import DetachedWindowAPI from './DetachedWindowAPI.js';
import IOptionalBrowserSettings from '../browser/types/IOptionalBrowserSettings.js';
import BrowserWindow from './BrowserWindow.js';
import DetachedBrowserPage from '../browser/DetachedBrowserPage.js';
import Browser from '../browser/Browser.js';

/**
 * Window.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class Window extends BrowserWindow implements IWindow {
	// Detached Window API.
	public readonly happyDOM: DetachedWindowAPI;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.width] Window width. Defaults to "1024".
	 * @param [options.height] Window height. Defaults to "768".
	 * @param [options.innerWidth] Inner width. Deprecated. Defaults to "1024".
	 * @param [options.innerHeight] Inner height. Deprecated. Defaults to "768".
	 * @param [options.url] URL.
	 * @param [options.console] Console.
	 * @param [options.settings] Settings.
	 */
	constructor(options?: {
		width?: number;
		height?: number;
		innerWidth?: number;
		innerHeight?: number;
		url?: string;
		console?: Console;
		settings?: IOptionalBrowserSettings;
	}) {
		const browser = new Browser();
		const browserPage = new DetachedBrowserPage(browser.defaultContext, BrowserWindow);
		const browserFrame = browserPage.mainFrame;

		super(browserFrame);

		browserFrame.window = this;

		this.happyDOM = new DetachedWindowAPI(browserFrame);

		if (options) {
			if (
				options.width !== undefined ||
				options.innerWidth !== undefined ||
				options.height !== undefined ||
				options.innerHeight !== undefined
			) {
				browserFrame.page.setViewport({
					width: options.width ?? options.innerWidth ?? 1024,
					height: options.height ?? options.innerHeight ?? 768
				});
			}

			if (options.url !== undefined) {
				browserFrame.url = options.url;
			}
		}
	}
}
