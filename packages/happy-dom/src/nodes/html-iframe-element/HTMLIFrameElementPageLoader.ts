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
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import BrowserFrameUtility from '../../browser/BrowserFrameUtility.js';

/**
 * HTML Iframe page loader.
 */
export default class HTMLIFrameElementPageLoader {
	#element: IHTMLIFrameElement;
	#contentWindowContainer: { window: IWindow | ICrossOriginWindow | null };
	#browserParentFrame: IBrowserFrame;
	#browserIFrame: IBrowserFrame;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.element Iframe element.
	 * @param options.browserParentFrame Main browser frame.
	 * @param options.contentWindowContainer Content window container.
	 * @param options.contentWindowContainer.window Content window.
	 */
	constructor(options: {
		element: IHTMLIFrameElement;
		browserParentFrame: IBrowserFrame;
		contentWindowContainer: { window: IWindow | ICrossOriginWindow | null };
	}) {
		this.#element = options.element;
		this.#contentWindowContainer = options.contentWindowContainer;
		this.#browserParentFrame = options.browserParentFrame;
	}

	/**
	 * Loads an iframe page.
	 */
	public loadPage(): void {
		if (!this.#element.isConnected) {
			if (this.#browserIFrame) {
				BrowserFrameUtility.closeFrame(this.#browserIFrame);
				this.#browserIFrame = null;
			}
			this.#contentWindowContainer.window = null;
			return;
		}

		const window = this.#element.ownerDocument._defaultView;
		const originURL = this.#browserParentFrame.window.location;
		const targetURL = BrowserFrameUtility.getRelativeURL(
			this.#browserParentFrame,
			this.#element.src
		);

		if (this.#browserIFrame && originURL.href === targetURL.href) {
			return;
		}

		if (this.#browserParentFrame.page.context.browser.settings.disableIframePageLoading) {
			WindowErrorUtility.dispatchError(
				this.#element,
				new DOMException(
					`Failed to load iframe page "${targetURL.href}". Iframe page loading is disabled.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
			return;
		}

		// Iframes has a special rule for CORS and doesn't allow access between frames when the origin is different.
		const isSameOrigin = originURL.origin === targetURL.origin || targetURL.origin === 'null';
		const parentWindow = isSameOrigin ? window : new CrossOriginWindow(window);

		this.#browserIFrame = BrowserFrameUtility.newFrame(this.#browserParentFrame);

		this.#browserIFrame.goto(targetURL.href).then((response) => {
			this.#contentWindowContainer.window = isSameOrigin
				? this.#browserIFrame.window
				: new CrossOriginWindow(this.#browserIFrame.window, window);
			this.#element.dispatchEvent(new Event('load'));
		});

		if (url === 'about:blank' || url.startsWith('javascript:')) {
			(<IWindow>this.#browserIFrame.window.parent) = window;
			(<IWindow>this.#browserIFrame.window.top) = window;
			this.#contentWindowContainer.window = this.#browserIFrame.window;

			if (
				url !== 'about:blank' &&
				!this.#browserParentFrame.page.context.browser.settings.disableJavaScriptEvaluation
			) {
				const code = '//# sourceURL=about:blank\n' + url.replace('javascript:', '');
				if (this.#browserParentFrame.page.context.browser.settings.disableErrorCapturing) {
					this.#browserIFrame.window.eval(code);
				} else {
					WindowErrorUtility.captureError(this.#browserIFrame.window, () =>
						this.#browserIFrame.window.eval(code)
					);
				}
			}

			this.#element.dispatchEvent(new Event('load'));
			return;
		}

		this.#contentWindowContainer.window = isSameOrigin
			? this.#browserIFrame.window
			: new CrossOriginWindow(this.#browserIFrame.window, window);

		// TODO: Use BrowserFrame.goto()
		this.#browserIFrame.window
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
				this.#browserIFrame.content = responseText;
				readyStateManager.endTask();
				this.#element.dispatchEvent(new Event('load'));
			})
			.catch((error) => {
				readyStateManager.endTask();
				WindowErrorUtility.dispatchError(this.#element, error);
			});
	}

	/**
	 * Unloads an iframe page.
	 */
	public unloadPage(): void {
		if (this.#browserIFrame) {
			BrowserFrameUtility.closeFrame(this.#browserIFrame);
			this.#browserIFrame = null;
		}
		this.#contentWindowContainer.window = null;
	}
}
