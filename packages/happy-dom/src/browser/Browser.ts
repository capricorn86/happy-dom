import IBrowserSettings from './IBrowserSettings.js';
import BrowserContext from './BrowserContext.js';
import PackageVersion from '../version.js';
import IOptionalBrowserSettings from './IOptionalBrowserSettings.js';

/**
 * Browser context.
 */
export default class Browser {
	public contexts: BrowserContext[];
	public defaultBrowserContext: BrowserContext;
	public settings: IBrowserSettings = {
		disableJavaScriptEvaluation: false,
		disableJavaScriptFileLoading: false,
		disableCSSFileLoading: false,
		disableIframePageLoading: false,
		disableWindowOpenPageLoading: false,
		disableComputedStyleRendering: false,
		disableErrorCapturing: false,
		enableFileSystemHttpRequests: false,
		navigator: {
			userAgent: `Mozilla/5.0 (X11; ${
				process.platform.charAt(0).toUpperCase() + process.platform.slice(1) + ' ' + process.arch
			}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${PackageVersion.version}`
		},
		device: {
			prefersColorScheme: 'light',
			mediaType: 'screen'
		}
	};

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.settings] Browser settings.
	 */
	constructor(options?: { settings?: IOptionalBrowserSettings }) {
		if (options.settings) {
			this.settings = {
				...this.settings,
				...options.settings,
				navigator: {
					...this.settings.navigator,
					...options.settings.navigator
				},
				device: {
					...this.settings.device,
					...options.settings.device
				}
			};
		}
	}

	/**
	 * Aborts all ongoing operations and destroys the browser.
	 *
	 * @returns Promise.
	 */
	public async close(): Promise<void> {
		await Promise.all(this.contexts.map((context) => context.close()));
	}

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all async tasks such as timers are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await Promise.all(this.contexts.map((page) => page.whenComplete()));
	}

	/**
	 * Aborts all ongoing operations.
	 *
	 * @returns Promise.
	 */
	public async abort(): Promise<void> {
		await Promise.all(this.contexts.map((page) => page.abort()));
	}
}
