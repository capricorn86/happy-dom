/**
 * Browser settings.
 */
export default interface IOptionalBrowserSettings {
	disableJavaScriptEvaluation?: boolean;
	disableJavaScriptFileLoading?: boolean;
	disableCSSFileLoading?: boolean;
	disableIframePageLoading?: boolean;
	disableWindowOpenPageLoading?: boolean;
	disableComputedStyleRendering?: boolean;
	disableErrorCapturing?: boolean;
	enableFileSystemHttpRequests?: boolean;
	navigator?: {
		userAgent?: string;
	};
	device?: {
		prefersColorScheme?: string;
		mediaType?: string;
	};
}
