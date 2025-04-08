import BrowserSettingsFactory from 'happy-dom/lib/browser/BrowserSettingsFactory.js';
import IOptionalServerRendererConfiguration from './IOptionalServerRendererConfiguration.js';
import IServerRendererConfiguration from './IServerRendererConfiguration.js';
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
		const config = {
			...DefaultServerRendererConfiguration,
			...configuration,
			browser: BrowserSettingsFactory.createSettings(configuration?.browser),
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
			}
		};

		config.outputDirectory = Path.resolve(config.outputDirectory);
		config.cache.directory = Path.resolve(config.cache.directory);

		return config;
	}
}
