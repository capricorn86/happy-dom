/**
 * Webpack config.
 */
export default interface IWebpackConfig {
	entry: string | string[];
	mode: 'string';
	devtool: boolean;
	optimization: {
		minimize: boolean;
	};
}
