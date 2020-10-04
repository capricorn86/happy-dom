import * as VM from 'vm';
import MemoryFs from 'memory-fs';
import Webpack from 'webpack';
import IWebpackConfig from './IWebpackConfig';

const DEFAULT_CONFIG = {
	mode: 'production',
	devtool: false,
	optimization: {
		minimize: false
	}
};

/**
 * This class is used for handling a web component server dom.
 */
export default class WebpackScriptCompiler {
	/**
	 * Setup of scripts.
	 *
	 * @param [config] Webpack config.
	 * @return Promise.
	 */
	public static compile(config: IWebpackConfig = null): Promise<VM.Script> {
		return new Promise((resolve, reject) => {
			const compiler = Webpack(
				Object.assign({}, DEFAULT_CONFIG, config, {
					output: {
						filename: 'output.js',
						path: '/'
					}
				})
			);

			compiler.outputFileSystem = new MemoryFs();

			compiler.run((error, stats) => {
				if (error) {
					reject(error);
				} else {
					if (stats.hasErrors()) {
						reject(
							new Error(
								'Errors occured during compilation. Error message: ' +
									stats.toJson('errors-only').errors.join('\n')
							)
						);
					} else {
						const result = compiler.outputFileSystem.data['output.js'].toString();
						resolve(new VM.Script(result));
					}
				}
			});
		});
	}
}
