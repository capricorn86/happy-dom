import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import IModule from './IModule.js';
import CSSStyleSheet from '../css/CSSStyleSheet.js';

/**
 * CSS module.
 */
export default class CSSModule implements IModule {
	public readonly url: URL;
	readonly #window: BrowserWindow;
	readonly #source: string;
	#exports: { default: CSSStyleSheet } | null = null;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param url Module URL.
	 * @param source Source code.
	 */
	constructor(window: BrowserWindow, url: URL, source: string) {
		this.#window = window;
		this.url = url;
		this.#source = source;
	}

	/**
	 * Compiles and evaluates the module.
	 *
	 * @returns Module exports.
	 */
	public async evaluate(): Promise<{ default: CSSStyleSheet }> {
		if (this.#exports) {
			return this.#exports;
		}

		const styleSheet = new this.#window.CSSStyleSheet();
		styleSheet.replaceSync(this.#source);

		this.#exports = { default: styleSheet };

		return this.#exports;
	}

	/**
	 * Compiles and preloads the module and its imports.
	 *
	 * @returns Promise.
	 */
	public async preload(): Promise<void> {
		await this.evaluate();
	}
}
