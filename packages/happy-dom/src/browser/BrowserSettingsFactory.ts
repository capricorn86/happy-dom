import IBrowserSettings from './types/IBrowserSettings.js';
import IOptionalBrowserSettings from './types/IOptionalBrowserSettings.js';
import DefaultBrowserSettings from './DefaultBrowserSettings.js';
import IReadOnlyBrowserSettings from './types/IReadOnlyBrowserSettings.js';

/**
 * Browser settings utility.
 */
export default class BrowserSettingsFactory {
	/**
	 * Returns browser settings.
	 *
	 * @param [settings] Browser settings.
	 * @param [freezeObject] "true" to freeze the object.
	 * @returns Settings.
	 */
	public static getSettings(settings?: IOptionalBrowserSettings): IBrowserSettings {
		return {
			...DefaultBrowserSettings,
			...settings,
			navigator: {
				...DefaultBrowserSettings.navigator,
				...settings?.navigator
			},
			device: {
				...DefaultBrowserSettings.device,
				...settings?.device
			}
		};
	}
	/**
	 * Returns readonly browser settings.
	 *
	 * @param [settings] Browser settings.
	 * @param [freezeObject] "true" to freeze the object.
	 * @returns Settings.
	 */
	public static getReadOnlySettings(settings?: IOptionalBrowserSettings): IReadOnlyBrowserSettings {
		return Object.freeze({
			...DefaultBrowserSettings,
			...settings,
			navigator: Object.freeze({
				...DefaultBrowserSettings.navigator,
				...settings?.navigator
			}),
			device: Object.freeze({
				...DefaultBrowserSettings.device,
				...settings?.device
			})
		});
	}
}
