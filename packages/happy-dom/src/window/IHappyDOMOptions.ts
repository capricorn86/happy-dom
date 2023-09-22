/**
 * Happy DOM options.
 */
export default interface IHappyDOMOptions {
	width?: number;
	height?: number;
	url?: string;
	console?: Console;
	settings?: {
		disableJavaScriptEvaluation?: boolean;
		disableJavaScriptFileLoading?: boolean;
		disableCSSFileLoading?: boolean;
		disableIframePageLoading?: boolean;
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
	};

	/**
	 * @deprecated
	 */
	innerWidth?: number;

	/**
	 * @deprecated
	 */
	innerHeight?: number;
}
