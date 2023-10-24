import IBrowserSettings from '../browser/types/IBrowserSettings.js';
import IWindow from './IWindow.js';

/**
 * Browser settings reader that will allow to read settings more securely as it is not possible to override a settings object to make DOM functionality act on it.
 */
export default class WindowBrowserSettingsReader {
	static #settings: IBrowserSettings[] = [];

	/**
	 * Returns browser settings.
	 *
	 * @param window Window.
	 * @returns Settings.
	 */
	public static getSettings(window: IWindow): IBrowserSettings | null {
		const id = window['__happyDOMSettingsID__'];

		if (id === undefined || !this.#settings[id]) {
			return null;
		}

		return this.#settings[id];
	}

	/**
	 * Sets browser settings.
	 *
	 * @param window Window.
	 * @param settings Settings.
	 */
	public static setSettings(window: IWindow, settings: IBrowserSettings): void {
		if (window['__happyDOMSettingsID__'] !== undefined) {
			return;
		}
		window['__happyDOMSettingsID__'] = this.#settings.length;
		this.#settings.push(settings);
	}

	/**
	 * Removes browser settings.
	 *
	 * @param window Window.
	 */
	public static removeSettings(window: IWindow): void {
		const id = window['__happyDOMSettingsID__'];

		if (id !== undefined && this.#settings[id]) {
			delete this.#settings[id];
		}

		delete window['__happyDOMSettingsID__'];
	}
}
