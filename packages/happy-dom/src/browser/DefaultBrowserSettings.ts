import PackageVersion from '../version.js';
import BrowserErrorCaptureEnum from './enums/BrowserErrorCaptureEnum.js';
import BrowserNavigationCrossOriginPolicyEnum from './enums/BrowserNavigationCrossOriginPolicyEnum.js';
import IBrowserSettings from './types/IBrowserSettings.js';

export default <IBrowserSettings>{
	disableJavaScriptEvaluation: false,
	disableJavaScriptFileLoading: false,
	disableCSSFileLoading: false,
	disableIframePageLoading: false,
	disableComputedStyleRendering: false,
	disableErrorCapturing: false,
	errorCapture: BrowserErrorCaptureEnum.tryAndCatch,
	enableFileSystemHttpRequests: false,
	timer: {
		maxTimeout: -1,
		maxIntervalTime: -1,
		maxIntervalIterations: -1,
		preventTimerLoops: false
	},
	navigation: {
		disableMainFrameNavigation: false,
		disableChildFrameNavigation: false,
		disableChildPageNavigation: false,
		disableFallbackToSetURL: false,
		crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.anyOrigin
	},
	navigator: {
		userAgent: `Mozilla/5.0 (X11; ${
			process.platform.charAt(0).toUpperCase() + process.platform.slice(1) + ' ' + process.arch
		}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${PackageVersion.version}`,
		maxTouchPoints: 0
	},
	device: {
		prefersColorScheme: 'light',
		mediaType: 'screen'
	}
};
