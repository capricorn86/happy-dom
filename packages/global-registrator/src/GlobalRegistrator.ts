import { GlobalWindow, PropertySymbol } from 'happy-dom';
import type { IOptionalBrowserSettings } from 'happy-dom';

const IGNORE_LIST = ['constructor', 'undefined', 'NaN', 'global', 'globalThis'];

/**
 *
 */
export default class GlobalRegistrator {
	private static registered: { [key: string | symbol]: PropertyDescriptor } | null = null;

	/**
	 * Registers Happy DOM globally.
	 *
	 * @param [options] Options.
	 * @param [options.width] Window width. Defaults to "1024".
	 * @param [options.height] Window height. Defaults to "768".
	 * @param [options.url] URL.
	 * @param [options.settings] Settings.
	 */
	public static register(options?: {
		width?: number;
		height?: number;
		url?: string;
		settings?: IOptionalBrowserSettings;
	}): void {
		if (this.registered !== null) {
			throw new Error('Failed to register. Happy DOM has already been globally registered.');
		}

		const window = new GlobalWindow({ ...options, console: global.console });

		this.registered = {};

		const propertyDescriptors = Object.getOwnPropertyDescriptors(window);

		for (const key of Object.keys(propertyDescriptors)) {
			if (!IGNORE_LIST.includes(key)) {
				const windowPropertyDescriptor = propertyDescriptors[key];
				const globalPropertyDescriptor = Object.getOwnPropertyDescriptor(global, key);

				if (
					!globalPropertyDescriptor ||
					(windowPropertyDescriptor.value !== undefined &&
						windowPropertyDescriptor.value !== globalPropertyDescriptor.value)
				) {
					this.registered[key] = globalPropertyDescriptor || null;

					if (windowPropertyDescriptor.value === window) {
						window[key] = global;
						windowPropertyDescriptor.value = global;
					}

					Object.defineProperty(global, key, windowPropertyDescriptor);
				}
			}
		}

		const propertySymbols = Object.getOwnPropertySymbols(window);
		for (const key of propertySymbols) {
			const propertyDescriptor = Object.getOwnPropertyDescriptor(window, key);
			this.registered[key] = null;
			Object.defineProperty(global, key, propertyDescriptor);
		}

		global.document[PropertySymbol.ownerWindow] = global;
		global.document[PropertySymbol.defaultView] = global;
	}

	/**
	 * Registers Happy DOM globally.
	 */
	public static async unregister(): Promise<void> {
		if (this.registered === null) {
			throw new Error(
				'Failed to unregister. Happy DOM has not previously been globally registered.'
			);
		}

		const happyDOM = global.happyDOM;

		for (const key of Object.keys(this.registered)) {
			if (this.registered[key] !== null) {
				Object.defineProperty(global, key, this.registered[key]);
			} else {
				delete global[key];
			}
		}

		this.registered = null;

		if (happyDOM) {
			await happyDOM.close();
		}
	}
}
