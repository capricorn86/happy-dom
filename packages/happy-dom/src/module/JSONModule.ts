import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import IModule from './types/IModule.js';
import IModuleInit from './types/IModuleInit.js';

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
	public async evaluate(): Promise<{ default: object }> {
		if (this.#exports) {
			return this.#exports;
		}

		let result: object;
		try {
			result = JSON.parse(this.#source);
		} catch (error) {
			throw new this.#window.TypeError(
				`Failed to parse module "${this.url.href}": ${(<Error>error).message}`
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
