import Event from '../../event/Event.js';
import IWindow from '../../window/IWindow.js';
import CrossOriginWindow from '../../window/CrossOriginWindow.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import ICrossOriginWindow from '../../window/ICrossOriginWindow.js';
import IHTMLIFrameElement from './IHTMLIFrameElement.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import BrowserFrameURL from '../../browser/utilities/BrowserFrameURL.js';
import BrowserFrameFactory from '../../browser/utilities/BrowserFrameFactory.js';

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
				BrowserFrameFactory.destroyFrame(this.#browserIFrame);
				this.#browserIFrame = null;
			}
			this.#contentWindowContainer.window = null;
			return;
		}

		const window = this.#element.ownerDocument._defaultView;
		const originURL = this.#browserParentFrame.window.location;
		const targetURL = BrowserFrameURL.getRelativeURL(this.#browserParentFrame, this.#element.src);

		if (this.#browserIFrame && this.#browserIFrame.window.location.href === targetURL.href) {
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

		this.#browserIFrame =
			this.#browserIFrame ?? BrowserFrameFactory.newChildFrame(this.#browserParentFrame);

		(<IWindow | ICrossOriginWindow>(<unknown>this.#browserIFrame.window.top)) = parentWindow;
		(<IWindow | ICrossOriginWindow>(<unknown>this.#browserIFrame.window.parent)) = parentWindow;

		this.#browserIFrame
			.goto(targetURL.href)
			.then(() => this.#element.dispatchEvent(new Event('load')))
			.catch((error) => WindowErrorUtility.dispatchError(this.#element, error));

		this.#contentWindowContainer.window = isSameOrigin
			? this.#browserIFrame.window
			: new CrossOriginWindow(this.#browserIFrame.window, window);
	}

	/**
	 * Unloads an iframe page.
	 */
	public unloadPage(): void {
		if (this.#browserIFrame) {
			BrowserFrameFactory.destroyFrame(this.#browserIFrame);
			this.#browserIFrame = null;
		}
		this.#contentWindowContainer.window = null;
	}
}
