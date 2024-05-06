import Event from '../../event/Event.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import HTMLIFrameElement from './HTMLIFrameElement.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import BrowserFrameURL from '../../browser/utilities/BrowserFrameURL.js';
import BrowserFrameFactory from '../../browser/utilities/BrowserFrameFactory.js';
import IRequestReferrerPolicy from '../../fetch/types/IRequestReferrerPolicy.js';

/**
 * HTML Iframe page loader.
 */
export default class HTMLIFrameElementPageLoader {
	#element: HTMLIFrameElement;
	#contentWindowContainer: { window: BrowserWindow | CrossOriginBrowserWindow | null };
	#browserParentFrame: IBrowserFrame;
	#browserIFrame: IBrowserFrame;
	#srcdoc: string | null = null;

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
		element: HTMLIFrameElement;
		browserParentFrame: IBrowserFrame;
		contentWindowContainer: { window: BrowserWindow | CrossOriginBrowserWindow | null };
	}) {
		this.#element = options.element;
		this.#contentWindowContainer = options.contentWindowContainer;
		this.#browserParentFrame = options.browserParentFrame;
	}

	/**
	 * Loads an iframe page.
	 */
	public loadPage(): void {
		if (!this.#element[PropertySymbol.isConnected]) {
			this.unloadPage();
			return;
		}

		const srcdoc = this.#element.getAttribute('srcdoc');
		const window = this.#element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow];

		if (srcdoc !== null) {
			if (this.#srcdoc === srcdoc) {
				return;
			}

			this.unloadPage();

			this.#browserIFrame = BrowserFrameFactory.createChildFrame(this.#browserParentFrame);
			this.#browserIFrame.url = 'about:srcdoc';

			this.#contentWindowContainer.window = this.#browserIFrame.window;

			(<BrowserWindow>this.#browserIFrame.window.top) = this.#browserParentFrame.window.top;
			(<BrowserWindow>this.#browserIFrame.window.parent) = this.#browserParentFrame.window;

			this.#browserIFrame.window.document.open();
			this.#browserIFrame.window.document.write(srcdoc);

			this.#srcdoc = srcdoc;

			this.#element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].requestAnimationFrame(
				() => this.#element.dispatchEvent(new Event('load'))
			);
			return;
		}

		if (this.#srcdoc !== null) {
			this.unloadPage();
		}

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
		const parentWindow = isSameOrigin ? window : new CrossOriginBrowserWindow(window);

		this.#browserIFrame =
			this.#browserIFrame ?? BrowserFrameFactory.createChildFrame(this.#browserParentFrame);

		(<BrowserWindow | CrossOriginBrowserWindow>(<unknown>this.#browserIFrame.window.top)) =
			parentWindow;
		(<BrowserWindow | CrossOriginBrowserWindow>(<unknown>this.#browserIFrame.window.parent)) =
			parentWindow;

		this.#browserIFrame
			.goto(targetURL.href, {
				referrer: originURL.origin,
				referrerPolicy: <IRequestReferrerPolicy>this.#element.referrerPolicy
			})
			.then(() => this.#element.dispatchEvent(new Event('load')))
			.catch((error) => WindowErrorUtility.dispatchError(this.#element, error));

		this.#contentWindowContainer.window = isSameOrigin
			? this.#browserIFrame.window
			: new CrossOriginBrowserWindow(this.#browserIFrame.window, window);
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
		this.#srcdoc = null;
	}
}
