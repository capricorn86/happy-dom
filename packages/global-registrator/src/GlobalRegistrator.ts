import { GlobalWindow } from 'happy-dom';
import type { IOptionalBrowserSettings } from 'happy-dom';

const IGNORE_LIST = ['constructor', 'undefined', 'NaN', 'global', 'globalThis'];
const SELF_REFERRING = ['self', 'top', 'parent', 'window'];

/**
 *
 */
export default class GlobalRegistrator {
	private static registered: { [key: string]: PropertyDescriptor } | null = null;

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

					if (
						typeof windowPropertyDescriptor.value === 'function' &&
						!windowPropertyDescriptor.value.toString().startsWith('class ')
					) {
						Object.defineProperty(global, key, {
							...windowPropertyDescriptor,
							value: windowPropertyDescriptor.value.bind(global)
						});
					} else {
						Object.defineProperty(global, key, windowPropertyDescriptor);
					}
				}
			}
		}

		for (const key of SELF_REFERRING) {
			this.registered[key] = null;
			global[key] = global;
		}
	}

	/**
	 * Registers Happy DOM globally.
	 */
	public static unregister(): void {
		if (this.registered === null) {
			throw new Error(
				'Failed to unregister. Happy DOM has not previously been globally registered.'
			);
		}

		for (const key of Object.keys(this.registered)) {
			if (this.registered[key] !== null) {
				Object.defineProperty(global, key, this.registered[key]);
			} else {
				delete global[key];
			}
		}

		this.registered = null;
	}
}
