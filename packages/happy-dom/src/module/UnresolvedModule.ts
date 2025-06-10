import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import IModule from './IModule.js';

/**
 * CSS module.
 */
export default class UnresolvedModule implements IModule {
	public readonly url: URL;
	readonly #window: BrowserWindow;
	#hooks: { resolve: (value: unknown) => void; reject: (error: Error) => void }[] = [];
	#error: Error | null = null;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param url Module URL.
	 */
	constructor(window: BrowserWindow, url: URL) {
		this.#window = window;
		this.url = url;
	}

	/**
	 * Compiles and evaluates the module.
	 *
	 * @returns Module exports.
	 */
	public async evaluate(): Promise<any> {
		throw new this.#window.TypeError('Unresolved module. We should never end up here.');
	}

	/**
	 * Compiles and preloads the module and its imports.
	 *
	 * @returns Promise.
	 */
	public async preload(): Promise<void> {
		throw new this.#window.TypeError('Unresolved module. We should never end up here.');
	}

	/**
	 * Add a hook to be called when the module is resolved.
	 *
	 * @param resolve Resolve.
	 * @param reject Reject.
	 */
	public addResolveListener(
		resolve: (value: unknown) => void,
		reject: (error: Error) => void
	): void {
		if (this.#error) {
			reject(this.#error);
			return;
		}
		this.#hooks.push({ resolve, reject });
	}

	/**
	 * Resolves the module.
	 *
	 * @param [error] Error.
	 */
	public resolve(error?: Error): void {
		if (error) {
			this.#error = error;
		}
		for (const hook of this.#hooks) {
			if (error) {
				hook.reject(error);
			} else {
				hook.resolve(null);
			}
		}
	}
}
