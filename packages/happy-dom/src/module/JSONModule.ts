import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import IModule from './IModule.js';

/**
 * JSON module.
 */
export default class JSONModule implements IModule {
	public readonly url: URL;
	readonly #window: BrowserWindow;
	readonly #source: string;
	#exports: { default: object } | null = null;

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
	public async evaluate(): Promise<{ default: object }> {
		if (this.#exports) {
			return this.#exports;
		}

		let result: object;
		try {
			result = JSON.parse(this.#source);
		} catch (error) {
			throw new this.#window.TypeError(
				`Failed to parse module "${this.url.href}": ${error.message}`
			);
		}

		this.#exports = { default: result };

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
