import IBrowserSettings from './IBrowserSettings.js';
import IOptionalBrowserSettings from './IOptionalBrowserSettings.js';
import DefaultBrowserSettings from './DefaultBrowserSettings.js';

/**
 * Browser settings utility.
 */
export default class BrowserSettingsFactory {
	/**
	 * Returns browser settings.
	 *
	 * @param [settings] Browser settings.
	 * @returns Settings.
	 */
	public static getSettings(settings?: IOptionalBrowserSettings): IBrowserSettings {
		return {
			...DefaultBrowserSettings,
			...settings,
			navigator: {
				...DefaultBrowserSettings.navigator,
				...settings.navigator
			},
			device: {
				...DefaultBrowserSettings.device,
				...settings.device
			}
		};
	}
}
