/**
 * Happy DOM settings.
 */
export default interface IHappyDOMSettings {
	disableJavaScriptEvaluation: boolean;
	disableJavaScriptFileLoading: boolean;
	disableCSSFileLoading: boolean;
	disableIframePageLoading: boolean;
	disableComputedStyleRendering: boolean;
	disableErrorCapturing: boolean;
	enableFileSystemHttpRequests: boolean;
	navigator: {
		userAgent: string;
	};
	device: {
		prefersColorScheme: string;
		mediaType: string;
	};
}
