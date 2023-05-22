/**
 * Happy DOM options.
 */
export default interface IHappyDOMOptions {
	innerWidth?: number;
	innerHeight?: number;
	url?: string;
	settings?: {
		disableJavaScriptEvaluation?: boolean;
		disableJavaScriptFileLoading?: boolean;
		disableCSSFileLoading?: boolean;
		disableIframePageLoading?: boolean;
		disableComputedStyleRendering?: boolean;
		enableFileSystemHttpRequests?: boolean;
		device?: {
			prefersColorScheme?: string;
			mediaType?: string;
		};
	};
}
