import IBrowserSettings from './types/IBrowserSettings.js';
import IOptionalBrowserSettings from './types/IOptionalBrowserSettings.js';
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
	public static createSettings(settings?: IOptionalBrowserSettings): IBrowserSettings {
		if (settings) {
			this.validate(DefaultBrowserSettings, settings);
		}
		return {
			...DefaultBrowserSettings,
			...settings,
			navigation: {
				...DefaultBrowserSettings.navigation,
				...settings?.navigation
			},
			navigator: {
				...DefaultBrowserSettings.navigator,
				...settings?.navigator
			},
			timer: {
				...DefaultBrowserSettings.timer,
				...settings?.timer
			},
			fetch: {
				...DefaultBrowserSettings.fetch,
				...settings?.fetch
			},
			module: {
				...DefaultBrowserSettings.module,
				...settings?.module
			},
			device: {
				...DefaultBrowserSettings.device,
				...settings?.device
			},
			debug: {
				...DefaultBrowserSettings.debug,
				...settings?.debug
			},
			viewport: {
				...DefaultBrowserSettings.viewport,
				...settings?.viewport
			}
		};
	}

	/**
	 * Validates settings.
	 *
	 * @param target Target.
	 * @param source Source.
	 * @param [parentNamespace] Parent namespace.
	 */
	private static validate(target: any, source: any, parentNamespace?: string): void {
		for (const key of Object.keys(source)) {
			if (target[key] === undefined) {
				const namespace = parentNamespace ? parentNamespace + '.' + key : key;
				throw new Error(`Unknown browser setting "${namespace}"`);
			}
			if (typeof target[key] === 'object' && !Array.isArray(target[key]) && target[key] !== null) {
				const namespace = parentNamespace ? parentNamespace + '.' + key : key;
				if (typeof source[key] !== 'object' || Array.isArray(source[key]) || source[key] === null) {
					throw new Error(`Browser setting "${namespace}" cannot be null`);
				}
				this.validate(target[key], source[key], namespace);
			} else {
				if (
					(typeof target[key] === 'boolean' ||
						typeof target[key] === 'number' ||
						typeof target[key] === 'string') &&
					typeof source[key] !== typeof target[key]
				) {
					const isValidPreventTimerLoops =
						key === 'preventTimerLoops' && typeof source[key] === 'object' && source[key] !== null;
					if (!isValidPreventTimerLoops) {
						const namespace = parentNamespace ? parentNamespace + '.' + key : key;
						throw new Error(
							`Browser setting "${namespace}" must be of type "${typeof target[key]}"`
						);
					}
				}
			}
		}
	}
}
