import URL from '../../url/URL.js';
import Event from '../../event/Event.js';
import IWindow from '../../window/IWindow.js';
import CrossOriginWindow from '../../window/CrossOriginWindow.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import ICrossOriginWindow from '../../window/ICrossOriginWindow.js';
import IHTMLIFrameElement from './IHTMLIFrameElement.js';

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
	public async loadPage(): Promise<void> {
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
			const isCORS =
				(originURL.hostname !== targetURL.hostname &&
					!originURL.hostname.endsWith(targetURL.hostname)) ||
				originURL.protocol !== targetURL.protocol;
			let responseText: string;

			try {
				const response = await window.fetch(url);
				responseText = await response.text();
			} catch (error) {
				WindowErrorUtility.dispatchError(this.#element, error);
				return;
			}

			this.#browserFrame = this.#browserMainFrame.newFrame();
			(<IWindow>this.#browserFrame.window.parent) = window;
			(<IWindow>this.#browserFrame.window.top) = window;

			this.#browserFrame.url = url;
			this.#browserFrame.content = responseText;

			this.#contentWindowContainer.window = isCORS
				? new CrossOriginWindow(window, this.#browserFrame.window)
				: this.#browserFrame.window;

			this.#element.dispatchEvent(new Event('load'));
		}
	}
}
