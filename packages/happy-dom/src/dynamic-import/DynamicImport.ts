import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import Module from './Module.js';
import * as PropertySymbol from '../PropertySymbol.js';

/**
 * Dynamic import.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
 */
export default class DynamicImport {
	private window: BrowserWindow;
	private parentModule: Module;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param [parentModule] Parent module.
	 */
	constructor(window: BrowserWindow, parentModule?: Module) {
		this.window = window;
		this.parentModule = parentModule || new Module(window, new URL(this.window.location.href));
	}

	/**
	 * Import a module dynamically.
	 *
	 * @param url URL of the module.
	 * @returns Promise.
	 */
	public async import(url: string): Promise<Module> {
		const absoluteURL = new URL(url, this.parentModule.url.href);
		const modules = this.window[PropertySymbol.modules];
		const module = modules.get(absoluteURL.href);

		if (module) {
			return module;
		}
	}
}
