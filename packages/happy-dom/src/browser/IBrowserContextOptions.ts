/**
 * Browser context options.
 */
export default interface IBrowserContextOptions {
	width?: number;
	height?: number;
	url?: string;
	html?: string;
	console?: Console;
	settings?: {
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
	};
}
