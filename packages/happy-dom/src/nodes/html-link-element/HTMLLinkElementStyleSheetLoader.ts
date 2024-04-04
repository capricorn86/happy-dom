import Event from '../../event/Event.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import DocumentReadyStateManager from '../document/DocumentReadyStateManager.js';
import HTMLLinkElement from './HTMLLinkElement.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class HTMLLinkElementStyleSheetLoader {
	#element: HTMLLinkElement;
	#browserFrame: IBrowserFrame;
	#loadedStyleSheetURL: string | null = null;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.element Element.
	 * @param options.browserFrame Browser frame.
	 */
	constructor(options: { element: HTMLLinkElement; browserFrame: IBrowserFrame }) {
		this.#element = options.element;
		this.#browserFrame = options.browserFrame;
	}

	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param url URL.
	 * @param rel Rel.
	 */
	public async loadStyleSheet(url: string | null, rel: string | null): Promise<void> {
		const element = this.#element;
		const browserSettings = this.#browserFrame.page.context.browser.settings;
		const window = element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow];

		if (
			!url ||
			!rel ||
			rel.toLowerCase() !== 'stylesheet' ||
			!element[PropertySymbol.isConnected]
		) {
			return;
		}

		let absoluteURL: string;
		try {
			absoluteURL = new URL(url, window.location.href).href;
		} catch (error) {
			return;
		}

		if (this.#loadedStyleSheetURL === absoluteURL) {
			return;
		}

		if (browserSettings.disableCSSFileLoading) {
			if (browserSettings.handleDisabledFileLoadingAsSuccess) {
				element.dispatchEvent(new Event('load'));
			} else {
				WindowErrorUtility.dispatchError(
					element,
					new DOMException(
						`Failed to load external stylesheet "${absoluteURL}". CSS file loading is disabled.`,
						DOMExceptionNameEnum.notSupportedError
					)
				);
			}
			return;
		}

		const resourceFetch = new ResourceFetch({
			browserFrame: this.#browserFrame,
			window: window
		});
		const readyStateManager = (<{ [PropertySymbol.readyStateManager]: DocumentReadyStateManager }>(
			(<unknown>window)
		))[PropertySymbol.readyStateManager];

		this.#loadedStyleSheetURL = absoluteURL;

		readyStateManager.startTask();

		let code: string | null = null;
		let error: Error | null = null;

		try {
			code = await resourceFetch.fetch(absoluteURL);
		} catch (e) {
			error = e;
		}

		readyStateManager.endTask();

		if (error) {
			WindowErrorUtility.dispatchError(element, error);
		} else {
			const styleSheet = new CSSStyleSheet();
			styleSheet.replaceSync(code);
			element[PropertySymbol.sheet] = styleSheet;
			element.dispatchEvent(new Event('load'));
		}
	}
}
