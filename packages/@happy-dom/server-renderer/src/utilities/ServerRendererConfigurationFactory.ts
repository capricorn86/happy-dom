import BrowserSettingsFactory from 'happy-dom/lib/browser/BrowserSettingsFactory.js';
import IOptionalServerRendererConfiguration from '../types/IOptionalServerRendererConfiguration.js';
import IServerRendererConfiguration from '../types/IServerRendererConfiguration.js';
import DefaultServerRendererConfiguration from './DefaultServerRendererConfiguration.js';
import Path from 'path';

/**
 * Server renderer configuration factory.
 */
export default class ServerRendererConfigurationFactory {
	/**
	 * Returns server renderer configuration factory.
	 *
	 * @param [configuration] Configuration.
	 * @returns Configuration.
	 */
	public static createConfiguration(
		configuration?: IOptionalServerRendererConfiguration
	): IServerRendererConfiguration {
		if (configuration) {
			this.validate(DefaultServerRendererConfiguration, configuration);
		}

		const config = {
			...DefaultServerRendererConfiguration,
			...configuration,
			browser: BrowserSettingsFactory.createSettings({
				...DefaultServerRendererConfiguration.browser,
				...configuration?.browser
			}),
			cache: {
				...DefaultServerRendererConfiguration.cache,
				...configuration?.cache
			},
			worker: {
				...DefaultServerRendererConfiguration.worker,
				...configuration?.worker
			},
			render: {
				...DefaultServerRendererConfiguration.render,
				...configuration?.render
			},
			urls: configuration?.urls || null,
			server: {
				...DefaultServerRendererConfiguration.server,
				...configuration?.server
			}
		};

		config.outputDirectory = Path.resolve(config.outputDirectory);
		config.cache.directory = Path.resolve(config.cache.directory);

		return config;
	}

	/**
	 * Validates configuration.
	 *
	 * @param target Target.
	 * @param source Source.
	 * @param [parentNamespace] Parent namespace.
	 */
	private static validate(target: object, source: object, parentNamespace?: string): void {
		for (const key of Object.keys(source)) {
			if (key === 'browser') {
				continue;
			}
			if (target[key] === undefined) {
				const namespace = parentNamespace ? parentNamespace + '.' + key : key;
				throw new Error(`Unknown configuration "${namespace}"`);
			}
			if (typeof target[key] === 'object' && !Array.isArray(target[key]) && target[key] !== null) {
				const namespace = parentNamespace ? parentNamespace + '.' + key : key;
				if (typeof source[key] !== 'object' || Array.isArray(source[key]) || source[key] === null) {
					throw new Error(`Configuration "${namespace}" cannot be null`);
				}
				this.validate(target[key], source[key], namespace);
			} else {
				if (
					(typeof target[key] === 'boolean' ||
						typeof target[key] === 'number' ||
						typeof target[key] === 'string') &&
					typeof source[key] !== typeof target[key]
				) {
					const namespace = parentNamespace ? parentNamespace + '.' + key : key;
					throw new Error(`Configuration "${namespace}" must be of type "${typeof target[key]}"`);
				}
			}
		}
	}
}
