import IBrowserSettings from '../browser/types/IBrowserSettings.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IBrowserWindow from './IBrowserWindow.js';

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
	public static getSettings(window: IBrowserWindow): IBrowserSettings | null {
		const id = window[PropertySymbol.happyDOMSettingsID];

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
	public static setSettings(window: IBrowserWindow, settings: IBrowserSettings): void {
		if (window[PropertySymbol.happyDOMSettingsID] !== undefined) {
			return;
		}
		window[PropertySymbol.happyDOMSettingsID] = this.#settings.length;
		this.#settings.push(settings);
	}

	/**
	 * Removes browser settings.
	 *
	 * @param window Window.
	 */
	public static removeSettings(window: IBrowserWindow): void {
		const id = window[PropertySymbol.happyDOMSettingsID];

		if (id !== undefined && this.#settings[id]) {
			delete this.#settings[id];
		}

		delete window[PropertySymbol.happyDOMSettingsID];
	}
}
