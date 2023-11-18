import BrowserNavigationEnum from './BrowserNavigationEnum.js';

/**
 * Browser settings.
 */
export default interface IBrowserSettings {
	disableJavaScriptEvaluation: boolean;
	disableJavaScriptFileLoading: boolean;
	disableCSSFileLoading: boolean;
	disableIframePageLoading: boolean;
	disableWindowOpenPageLoading: boolean;
	disableComputedStyleRendering: boolean;
	disableErrorCapturing: boolean;
	enableFileSystemHttpRequests: boolean;
	browserNavigation: BrowserNavigationEnum[];
	navigator: {
		userAgent: string;
		maxTouchPoints: number;
	};
	device: {
		prefersColorScheme: string;
		mediaType: string;
	};
}