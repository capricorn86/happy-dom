import BrowserErrorCaptureEnum from '../../browser/enums/BrowserErrorCaptureEnum.js';
import WindowBrowserContext from '../../window/WindowBrowserContext.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import Element from './Element.js';

/**
 * ECMAScript module compiler.
 */
export default class ElementEventAttributeUtility {
	/**
	 * Evaluates code in attribute and returns event listener.
	 *
	 * @param element
	 * @param property Property.
	 * @returns Result.
	 */
	public static getEventListener(
		element: Element,
		property: string
	): ((event: Event) => void) | null {
		const cached = element[PropertySymbol.propertyEventListeners].get(property);
		if (cached) {
			return cached;
		}

		const window = element[PropertySymbol.ownerDocument][PropertySymbol.defaultView];

		if (!window) {
			return null;
		}

		const browserSettings = new WindowBrowserContext(window).getSettings();

		if (!browserSettings || !browserSettings.enableJavaScriptEvaluation) {
			return null;
		}

		const code = element.getAttribute(property);

		if (!code) {
			return null;
		}

		let newCode = `(function anonymous($happy_dom, event) {`;

		if (
			browserSettings &&
			!browserSettings.disableErrorCapturing &&
			browserSettings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
		) {
			newCode += 'try {\n';
		}

		newCode += code;

		if (
			browserSettings &&
			!browserSettings.disableErrorCapturing &&
			browserSettings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
		) {
			newCode += '} catch(e) { $happy_dom.dispatchError(e); }';
		}

		newCode += '})';

		let listener: ((event: Event) => void) | null = null;

		try {
			listener = window[PropertySymbol.evaluateScript](newCode, {
				filename: window.location.href
			}).bind(element, {
				dispatchError: window[PropertySymbol.dispatchError].bind(window)
			});
		} catch (e) {
			const error = new window.SyntaxError(
				`Failed to read the '${property}' property from '${element.constructor.name}': ${(<Error>e).message}`
			);
			if (
				browserSettings.disableErrorCapturing ||
				browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
			) {
				throw error;
			} else {
				window[PropertySymbol.dispatchError](error);
				return null;
			}
		}

		if (listener) {
			element[PropertySymbol.propertyEventListeners].set(property, listener);
		}

		return listener;
	}
}
