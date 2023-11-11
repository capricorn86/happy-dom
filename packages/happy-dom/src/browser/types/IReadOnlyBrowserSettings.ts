/**
 * Browser settings.
 */
export default interface IReadOnlyBrowserSettings {
	readonly disableJavaScriptEvaluation: boolean;
	readonly disableJavaScriptFileLoading: boolean;
	readonly disableCSSFileLoading: boolean;
	readonly disableIframePageLoading: boolean;
	readonly disableWindowOpenPageLoading: boolean;
	readonly disableComputedStyleRendering: boolean;
	readonly disableErrorCapturing: boolean;
	readonly enableFileSystemHttpRequests: boolean;
	readonly browserNavigation: Array<
		'allow' | 'deny' | 'sameorigin' | 'allow-children' | 'url-set-fallback'
	>;
	readonly navigator: {
		readonly userAgent: string;
	};
	readonly device: {
		readonly prefersColorScheme: string;
		readonly mediaType: string;
	};
}
