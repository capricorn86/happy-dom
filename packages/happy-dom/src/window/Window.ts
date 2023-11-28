import IWindow from './IWindow.js';
import DetachedWindowAPI from './DetachedWindowAPI.js';
import IOptionalBrowserSettings from '../browser/types/IOptionalBrowserSettings.js';
import BrowserWindow from './BrowserWindow.js';
import DetachedBrowser from '../browser/detached-browser/DetachedBrowser.js';
import Location from '../location/Location.js';

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
		/** @deprecated Replaced by the "width" property. */
		innerWidth?: number;
		/** @deprecated Replaced by the "height" property. */
		innerHeight?: number;
		url?: string;
		console?: Console;
		settings?: IOptionalBrowserSettings;
	}) {
		const browser = new DetachedBrowser(BrowserWindow, {
			console: options?.console,
			settings: options?.settings
		});
		const browserFrame = browser.defaultContext.pages[0].mainFrame;

		super(browserFrame, {
			url: options?.url,
			width: options?.width ?? options?.innerWidth,
			height: options?.height ?? options?.innerHeight
		});

		browserFrame.window = this;

		this.happyDOM = new DetachedWindowAPI(browserFrame);
	}
}
