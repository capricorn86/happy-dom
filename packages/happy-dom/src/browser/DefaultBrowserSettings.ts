import PackageVersion from '../version.js';
import IBrowserSettings from './types/IBrowserSettings.js';

export default <IBrowserSettings>{
	disableJavaScriptEvaluation: false,
	disableJavaScriptFileLoading: false,
	disableCSSFileLoading: false,
	disableIframePageLoading: false,
	disableWindowOpenPageLoading: false,
	disableComputedStyleRendering: false,
	disableErrorCapturing: false,
	enableFileSystemHttpRequests: false,
	browserNavigation: ['allow'],
	navigator: {
		userAgent: `Mozilla/5.0 (X11; ${
			process.platform.charAt(0).toUpperCase() + process.platform.slice(1) + ' ' + process.arch
		}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${PackageVersion.version}`
	},
	device: {
		prefersColorScheme: 'light',
		mediaType: 'screen'
	}
};
