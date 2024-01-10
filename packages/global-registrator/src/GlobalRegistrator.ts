import { GlobalWindow } from 'happy-dom';

const IGNORE_LIST = ['undefined', 'NaN', 'global', 'globalThis'];
const SELF_REFERRING = ['self', 'top', 'parent', 'window'];

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
				this.registered[key] =
					global[key] !== window[key] && global[key] !== undefined ? global[key] : null;
				global[key] =
					typeof window[key] === 'function' && !window[key].toString().startsWith('class ')
						? window[key].bind(global)
						: window[key];
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
				global[key] = this.registered[key];
			} else {
				delete global[key];
			}
		}

		this.registered = null;
	}
}
