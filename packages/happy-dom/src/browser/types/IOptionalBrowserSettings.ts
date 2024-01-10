import BrowserErrorCaptureEnum from '../enums/BrowserErrorCaptureEnum.js';
import BrowserNavigationCrossOriginPolicyEnum from '../enums/BrowserNavigationCrossOriginPolicyEnum.js';

export default interface IOptionalBrowserSettings {
	/** Disables JavaScript evaluation. */
	disableJavaScriptEvaluation?: boolean;

	/** Disables JavaScript file loading. */
	disableJavaScriptFileLoading?: boolean;

	/** Disables CSS file loading. */
	disableCSSFileLoading?: boolean;

	/** Disables computed style rendering. */
	disableComputedStyleRendering?: boolean;

	/**
	 * Disables error capturing.
	 *
	 * @deprecated Use errorCapture instead.
	 */
	disableErrorCapturing?: boolean;

	/**
	 * Error capturing policy.
	 */
	errorCapture?: BrowserErrorCaptureEnum;

	/**
	 * @deprecated Not something that browsers support anymore as it is not secure.
	 */
	enableFileSystemHttpRequests?: boolean;

	/**
	 * @deprecated Use navigation.disableChildFrameNavigation instead.
	 */
	disableIframePageLoading?: boolean;

	/**
	 * Settings for the browser's navigation (when following links or opening windows).
	 */
	navigation?: {
		/** Disables navigation to other pages in the main frame or a page. */
		disableMainFrameNavigation?: boolean;

		/** Disables navigation to other pages in child frames (such as iframes). */
		disableChildFrameNavigation?: boolean;

		/** Disables navigation to other pages in child pages (such as popup windows). */
		disableChildPageNavigation?: boolean;

		/** Disables the fallback to setting the URL when navigating to a page is disabled or when inside a detached browser frame. */
		disableFallbackToSetURL?: boolean;

		/** Sets the policy for cross-origin navigation. */
		crossOriginPolicy?: BrowserNavigationCrossOriginPolicyEnum;
	};

	/**
	 * Settings for the browser's navigator.
	 */
	navigator?: {
		userAgent?: string;
		maxTouchPoints?: number;
	};

	/**
	 * Settings for the browser's device.
	 */
	device?: {
		prefersColorScheme?: string;
		mediaType?: string;
	};
}
