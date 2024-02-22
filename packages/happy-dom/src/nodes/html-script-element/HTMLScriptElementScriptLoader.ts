import Event from '../../event/Event.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import DocumentReadyStateManager from '../document/DocumentReadyStateManager.js';
import IHTMLScriptElement from './IHTMLScriptElement.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import BrowserErrorCaptureEnum from '../../browser/enums/BrowserErrorCaptureEnum.js';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class HTMLScriptElementScriptLoader {
	#element: IHTMLScriptElement;
	#browserFrame: IBrowserFrame;
	#loadedScriptURL: string | null = null;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.element Element.
	 * @param options.browserFrame Browser frame.
	 */
	constructor(options: { element: IHTMLScriptElement; browserFrame: IBrowserFrame }) {
		this.#element = options.element;
		this.#browserFrame = options.browserFrame;
	}

	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param url URL.
	 */
	public async loadScript(url: string): Promise<void> {
		const browserSettings = this.#browserFrame.page.context.browser.settings;
		const element = this.#element;
		const async = element.getAttribute('async') !== null;

		if (!url || !element[PropertySymbol.isConnected]) {
			return;
		}

		let absoluteURL: string;
		try {
			absoluteURL = new URL(
				url,
				element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].location
			).href;
		} catch (error) {
			this.#loadedScriptURL = null;
			element.dispatchEvent(new Event('error'));
			return;
		}

		if (this.#loadedScriptURL === absoluteURL) {
			return;
		}

		if (
			browserSettings.disableJavaScriptFileLoading ||
			browserSettings.disableJavaScriptEvaluation
		) {
			WindowErrorUtility.dispatchError(
				element,
				new DOMException(
					`Failed to load external script "${absoluteURL}". JavaScript file loading is disabled.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
			return;
		}

		const resourceFetch = new ResourceFetch({
			browserFrame: this.#browserFrame,
			window: element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow]
		});
		let code: string | null = null;
		let error: Error | null = null;

		this.#loadedScriptURL = absoluteURL;

		if (async) {
			const readyStateManager = (<
				{ [PropertySymbol.readyStateManager]: DocumentReadyStateManager }
			>(<unknown>element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow]))[
				PropertySymbol.readyStateManager
			];

			readyStateManager.startTask();

			try {
				code = await resourceFetch.fetch(absoluteURL);
			} catch (e) {
				error = e;
			}

			readyStateManager.endTask();
		} else {
			try {
				code = resourceFetch.fetchSync(absoluteURL);
			} catch (e) {
				error = e;
			}
		}

		if (error) {
			WindowErrorUtility.dispatchError(element, error);
		} else {
			element[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = element;
			code = '//# sourceURL=' + absoluteURL + '\n' + code;

			if (
				browserSettings.disableErrorCapturing ||
				browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
			) {
				element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].eval(code);
			} else {
				WindowErrorUtility.captureError(
					element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow],
					() => element[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].eval(code)
				);
			}
			element[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = null;
			element.dispatchEvent(new Event('load'));
		}
	}
}
