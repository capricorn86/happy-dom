import URL from '../../url/URL.js';
import Event from '../../event/Event.js';
import IWindow from '../../window/IWindow.js';
import CrossOriginWindow from '../../window/CrossOriginWindow.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import ICrossOriginWindow from '../../window/ICrossOriginWindow.js';
import IHTMLIFrameElement from './IHTMLIFrameElement.js';
import DocumentReadyStateManager from '../document/DocumentReadyStateManager.js';
import IResponse from '../../fetch/types/IResponse.js';

/**
 * HTML Iframe page loader.
 */
export default class HTMLIframePageLoader {
	#element: IHTMLIFrameElement;
	#contentWindowContainer: { window: IWindow | ICrossOriginWindow | null };
	#browserMainFrame: IBrowserFrame;
	#browserFrame: IBrowserFrame;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.element Iframe element.
	 * @param options.contentWindowContainer Content window container.
	 * @param options.browserMainFrame Main browser frame.
	 * @param options.contentWindowContainer.window Content window.
	 */
	constructor(options: {
		element: IHTMLIFrameElement;
		contentWindowContainer: { window: IWindow | ICrossOriginWindow | null };
		browserMainFrame: IBrowserFrame;
	}) {
		this.#element = options.element;
		this.#contentWindowContainer = options.contentWindowContainer;
		this.#browserMainFrame = options.browserMainFrame;
	}

	/**
	 * Loads an iframe page.
	 */
	public loadPage(): void {
		const url = this.#element.src;

		if (this.#browserFrame && url !== this.#browserFrame.url) {
			this.#browserFrame.destroy();
			this.#browserFrame = null;
		}

		this.#contentWindowContainer.window = null;

		if (!url) {
			return;
		}

		if (!this.#browserMainFrame.page.context.browser.settings.disableIframePageLoading) {
			const window = this.#element.ownerDocument._defaultView;

			if (url === 'about:blank') {
				this.#browserFrame = this.#browserMainFrame.newFrame();
				(<IWindow>this.#browserFrame.window.parent) = window;
				(<IWindow>this.#browserFrame.window.top) = window;
				this.#contentWindowContainer.window = this.#browserFrame.window;
				return;
			}

			if (url.startsWith('javascript:')) {
				if (!this.#browserMainFrame.page.context.browser.settings.disableJavaScriptEvaluation) {
					if (this.#browserMainFrame.page.context.browser.settings.disableErrorCapturing) {
						this.#browserFrame.window.eval(url.replace('javascript:', ''));
					} else {
						WindowErrorUtility.captureError(this.#browserFrame.window, () =>
							this.#browserFrame.window.eval(url.replace('javascript:', ''))
						);
					}
				}
				this.#browserFrame = this.#browserMainFrame.newFrame();
				(<IWindow>this.#browserFrame.window.parent) = window;
				(<IWindow>this.#browserFrame.window.top) = window;
				this.#contentWindowContainer.window = this.#browserFrame.window;
				return;
			}

			const originURL = window.location;
			const targetURL = new URL(url, originURL);

			// Iframes has a special rule for CORS and doesn't allow access between frames when the origin is different.
			const isSameOrigin = originURL.origin !== targetURL.origin;

			this.#browserFrame = this.#browserMainFrame.newFrame();
			this.#browserFrame.url = url;
			const readyStateManager = (<{ _readyStateManager: DocumentReadyStateManager }>(
				(<unknown>this.#browserMainFrame.window)
			))._readyStateManager;

			readyStateManager.startTask();

			this.#browserFrame.window
				.fetch(url)
				.then((response) => {
					const xFrameOptions = response.headers.get('X-Frame-Options')?.toLowerCase();
					if (xFrameOptions === 'deny' || (xFrameOptions === 'sameorigin' && !isSameOrigin)) {
						throw new Error(
							`Refused to display '${url}' in a frame because it set 'X-Frame-Options' to '${xFrameOptions}'.`
						);
					}
					return response;
				})
				.then((response: IResponse) => response.text())
				.then((responseText: string) => {
					this.#browserFrame.content = responseText;
					readyStateManager.endTask();
				})
				.catch((error) => {
					readyStateManager.endTask();
					WindowErrorUtility.dispatchError(this.#element, error);
				});

			const parentWindow = isSameOrigin ? window : new CrossOriginWindow(window);
			(<IWindow | CrossOriginWindow>this.#browserFrame.window.parent) = parentWindow;
			(<IWindow | CrossOriginWindow>this.#browserFrame.window.top) = parentWindow;

			this.#contentWindowContainer.window = isSameOrigin
				? this.#browserFrame.window
				: new CrossOriginWindow(this.#browserFrame.window, window);

			this.#element.dispatchEvent(new Event('load'));
		}
	}
}
