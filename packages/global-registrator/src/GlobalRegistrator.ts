import { GlobalWindow } from 'happy-dom';

/**
 *
 */
export default class GlobalRegistrator {
	private static registered = [];

	/**
	 * Registers Happy DOM globally.
	 */
	public static register(): void {
		if (this.registered.length) {
			throw new Error('Failed to register. Happy DOM has already been globally registered.');
		}
		const window = new GlobalWindow();
		for (const key of Object.keys(window)) {
			if (global[key] === undefined && key !== 'undefined') {
				global[key] = window[key];
				this.registered.push(key);
			}
		}
	}

	/**
	 * Registers Happy DOM globally.
	 */
	public static unregister(): void {
		if (!this.registered.length) {
			throw new Error(
				'Failed to unregister. Happy DOM has not previously been globally registered.'
			);
		}
		while (this.registered.length) {
			const key = this.registered.pop();
			delete global[key];
		}
	}
}
