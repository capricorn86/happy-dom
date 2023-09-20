import { GlobalWindow } from 'happy-dom';

const IGNORE_LIST = ['undefined', 'NaN', 'global', 'globalThis', 'window', 'globalThis'];
const SELF_REFERING = ['self', 'top', 'parent', 'window'];

/**
 *
 */
export default class GlobalRegistrator {
	private static registered: { [key: string]: string } | null = null;

	/**
	 * Registers Happy DOM globally.
	 */
	public static register(): void {
		if (this.registered !== null) {
			throw new Error('Failed to register. Happy DOM has already been globally registered.');
		}

		const window = new GlobalWindow();

		this.registered = {};

		for (const key of Object.keys(window)) {
			if (global[key] !== window[key] && !IGNORE_LIST.includes(key)) {
				this.registered[key] = global[key] !== window[key] ? global[key] : undefined;
				global[key] = window[key];
			}
		}

		for (const key of SELF_REFERING) {
			this.registered[key] = undefined;
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
			if (this.registered[key] !== undefined) {
				global[key] = this.registered[key];
			} else {
				delete global[key];
			}
		}

		this.registered = null;
	}
}
