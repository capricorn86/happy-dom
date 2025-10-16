import BrowserErrorCaptureEnum from '../enums/BrowserErrorCaptureEnum.js';
import BrowserNavigationCrossOriginPolicyEnum from '../enums/BrowserNavigationCrossOriginPolicyEnum.js';
import IFetchInterceptor from '../../fetch/types/IFetchInterceptor.js';
import IVirtualServer from '../../fetch/types/IVirtualServer.js';
import IFetchRequestHeaders from '../../fetch/types/IFetchRequestHeaders.js';
import IBrowserPageViewport from './IBrowserPageViewport.js';
import IOptionalTimerLoopsLimit from '../../window/IOptionalTimerLoopsLimit.js';
import BrowserWindow from '../../window/BrowserWindow.js';

/**
 * Browser settings.
 */
export default interface IBrowserSettings {
	/**
	 * Disables JavaScript evaluation.
	 *
	 * @deprecated Javascript evaluation is now disabled by default. Use "enableJavaScriptEvaluation" if you want to enable it.
	 */
	disableJavaScriptEvaluation: boolean;

	/**
	 * Enables JavaScript evaluation.
	 *
	 * A VM Context is not an isolated environment, and if you run untrusted code you are at risk of RCE (Remote Code Execution) attacks.
	 * It is recommended to disable code generation at process level by running node with the "--disallow-code-generation-from-strings" flag enabled to protect against these types of attacks.
	 *
	 * @see https://github.com/capricorn86/happy-dom/wiki/Code-Generation-From-Strings-Warning
	 */
	enableJavaScriptEvaluation: boolean;

	/** Disables JavaScript file loading. */
	disableJavaScriptFileLoading: boolean;

	/** Disables CSS file loading. */
	disableCSSFileLoading: boolean;

	/** Disables computed style rendering. */
	disableComputedStyleRendering: boolean;

	/** Handle disabled resource loading as success */
	handleDisabledFileLoadingAsSuccess: boolean;

	/**
	 * Suppresses the warning that is printed when code generation from strings is enabled at process level.
	 *
	 * @deprecated Use "suppressInsecureJavaScriptEnvironmentWarning" instead.
	 */
	suppressCodeGenerationFromStringsWarning: boolean;

	/** Suppresses the warning that is printed when the JavaScript execution environment is insecure. */
	suppressInsecureJavaScriptEnvironmentWarning: boolean;

	/**
	 * Settings for timers
	 */
	timer: {
		maxTimeout: number;
		maxIntervalTime: number;
		maxIntervalIterations: number;
		preventTimerLoops: boolean | IOptionalTimerLoopsLimit;
	};

	/**
	 * Settings for fetch
	 */
	fetch: {
		/**
		 * Disables same-origin policy (CORS)
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
		 */
		disableSameOriginPolicy: boolean;

		/**
		 * Disables validation of certificates against the list of supplied CAs.
		 *
		 * Disabling this feature makes it possible to use self-signed certificates or certificates that are not signed by a trusted CA.
		 */
		disableStrictSSL: boolean;

		/**
		 * Fetch interceptor.
		 */
		interceptor: IFetchInterceptor | null;

		/**
		 * Add request headers to specific URLs.
		 */
		requestHeaders: IFetchRequestHeaders[] | null;

		/**
		 * Virtual servers used for simulating a server that reads from the file system.
		 */
		virtualServers: IVirtualServer[] | null;
	};

	/**
	 * Disables error capturing.
	 *
	 * @deprecated Use errorCapture instead.
	 */
	disableErrorCapturing: boolean;

	/**
	 * Error capturing policy.
	 */
	errorCapture: BrowserErrorCaptureEnum;

	/**
	 * @deprecated Not something that browsers support anymore as it is not secure.
	 */
	enableFileSystemHttpRequests: boolean;

	/**
	 * @deprecated Use navigation.disableChildFrameNavigation instead.
	 */
	disableIframePageLoading: boolean;

	/**
	 * Settings for the browser's navigation (when following links or opening windows).
	 */
	navigation: {
		/** Disables navigation to other pages in the main frame or a page. */
		disableMainFrameNavigation: boolean;

		/** Disables navigation to other pages in child frames (such as iframes). */
		disableChildFrameNavigation: boolean;

		/** Disables navigation to other pages in child pages (such as popup windows). */
		disableChildPageNavigation: boolean;

		/** Disables the fallback to setting the URL when navigating to a page is disabled or when inside a detached browser frame. */
		disableFallbackToSetURL: boolean;

		/** Sets the policy for cross-origin navigation. */
		crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum;

		/** Triggered before content is loaded into the document */
		beforeContentCallback: ((window: BrowserWindow) => void) | null;
	};

	/**
	 * Settings for the browser's navigator.
	 */
	navigator: {
		userAgent: string;
		maxTouchPoints: number;
	};

	/**
	 * Settings for the browser's device.
	 */
	device: {
		prefersColorScheme: string;
		prefersReducedMotion: string;
		mediaType: string;
		forcedColors: string;
	};

	/**
	 * Debug settings.
	 */
	debug: {
		traceWaitUntilComplete: number;
	};

	/**
	 * Default page viewport.
	 */
	viewport: IBrowserPageViewport;
}
