import IDocument from '../nodes/document/IDocument.js';
import IWindow from '../window/IWindow.js';
import Event from '../event/Event.js';
import Window from '../window/Window.js';
import IBrowserSettings from './IBrowserSettings.js';
import BrowserContext from './BrowserContext.js';
import PackageVersion from '../version.js';
import IOptionalBrowserSettings from './IOptionalBrowserSettings.js';

/**
 * Browser context.
 */
export default class Browser {
	public browserContexts: BrowserContext[];
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
	 * Aborts asynchronous tasks and destroys the context.
	 *
	 * @returns Promise.
	 */
	public async close(): Promise<void> {
		await Promise.all(this.browserContexts.map((browserContext) => browserContext.close()));
	}

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public async whenAsyncTasksComplete(): Promise<void> {
		await this._asyncTaskManager.whenComplete();
	}

	/**
	 * Aborts all async tasks.
	 *
	 * @returns Promise.
	 */
	public async abortAsyncTasks(): Promise<void> {
		this._asyncTaskManager.cancelAll();
	}

	/**
	 * Sets the window size and triggers a resize event.
	 *
	 * @param options Options.
	 * @param options.width Width.
	 * @param options.height Height.
	 */
	public resizeWindow(options: { width?: number; height?: number }): void {
		if (
			(options.width !== undefined && this.window.innerWidth !== options.width) ||
			(options.height !== undefined && this.window.innerHeight !== options.height)
		) {
			if (options.width !== undefined && this.window.innerWidth !== options.width) {
				(<number>this.window.innerWidth) = options.width;
				(<number>this.window.outerWidth) = options.width;
			}

			if (options.height !== undefined && this.window.innerHeight !== options.height) {
				(<number>this.window.innerHeight) = options.height;
				(<number>this.window.outerHeight) = options.height;
			}

			this.window.dispatchEvent(new Event('resize'));
		}
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	public async goto(url: string): Promise<void> {
		this.window.location.href = url;

		const response = await this.window.fetch(url);
		const responseText = await response.text();

		this.document.write(responseText);
	}
}
