import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
 */
export default class Module {
	public readonly window: BrowserWindow;
	public readonly url: URL;
	public exports: { [k: string]: any } = {};
	public imports: Map<string, Module> = new Map();

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param url Module URL.
	 */
	constructor(window: BrowserWindow, url: URL) {
		this.window = window;
		this.url = url;
	}
}
