import Event from '../../event/Event.js';
import ResourceFetch from '../../resource-fetch/ResourceFetch.js';
import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import DocumentReadyStateManager from '../document/DocumentReadyStateManager.js';
import IHTMLLinkElement from './IHTMLLinkElement.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class HTMLLinkElementStyleSheetLoader {
	#element: IHTMLLinkElement;
	#browserFrame: IBrowserFrame;
	#loadedStyleSheetURL: string | null = null;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.element Element.
	 * @param options.browserFrame Browser frame.
	 */
	constructor(options: { element: IHTMLLinkElement; browserFrame: IBrowserFrame }) {
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

		if (!url || !rel || rel.toLowerCase() !== 'stylesheet' || !element.isConnected) {
			return;
		}

		let absoluteURL: string;
		try {
			absoluteURL = new URL(url, element.ownerDocument.__defaultView__.location).href;
		} catch (error) {
			this.#loadedStyleSheetURL = null;
			element.dispatchEvent(new Event('error'));
			return;
		}

		if (this.#loadedStyleSheetURL === absoluteURL) {
			return;
		}

		if (browserSettings.disableCSSFileLoading) {
			WindowErrorUtility.dispatchError(
				element,
				new DOMException(
					`Failed to load external stylesheet "${absoluteURL}". CSS file loading is disabled.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
			return;
		}

		const resourceFetch = new ResourceFetch({
			browserFrame: this.#browserFrame,
			window: element.ownerDocument.__defaultView__
		});
		const readyStateManager = (<{ __readyStateManager__: DocumentReadyStateManager }>(
			(<unknown>element.ownerDocument.__defaultView__)
		)).__readyStateManager__;

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
			if (browserSettings.disableErrorCapturing) {
				throw error;
			}
		} else {
			const styleSheet = new CSSStyleSheet();
			styleSheet.replaceSync(code);
			(<CSSStyleSheet>element.sheet) = styleSheet;
			element.dispatchEvent(new Event('load'));
		}
	}
}
