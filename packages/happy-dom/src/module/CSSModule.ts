import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import IModule from './types/IModule.js';
import CSSStyleSheet from '../css/CSSStyleSheet.js';
import IModuleInit from './types/IModuleInit.js';

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
	 * @param init Initialization options.
	 */
	constructor(init: IModuleInit) {
		this.#window = init.window;
		this.url = <URL>init.url;
		this.#source = init.source;
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
