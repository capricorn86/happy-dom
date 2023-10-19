import Document from '../document/Document.js';
import Event from '../../event/Event.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import HTMLScriptElement from './HTMLScriptElement.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import WindowBrowserSettingsReader from '../../window/WindowBrowserSettingsReader.js';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class HTMLScriptElementUtility {
	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param options Options.
	 * @param options.element Element.
	 * @param element
	 */
	public static async loadExternalScript(element: HTMLScriptElement): Promise<void> {
		const src = element.getAttribute('src');
		const async = element.getAttribute('async') !== null;
		const browserSettings = WindowBrowserSettingsReader.getSettings(
			element.ownerDocument.defaultView
		);

		if (
			browserSettings.disableJavaScriptFileLoading ||
			browserSettings.disableJavaScriptEvaluation
		) {
			WindowErrorUtility.dispatchError(
				element,
				new DOMException(
					`Failed to load external script "${src}". JavaScript file loading is disabled.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
			return;
		}

		if (async) {
			(<Document>element.ownerDocument)._readyStateManager.startTask();

			let code: string | null = null;
			let error: Error | null = null;

			try {
				code = await ResourceFetch.fetch(element.ownerDocument, src);
			} catch (e) {
				error = e;
			}

			(<Document>element.ownerDocument)._readyStateManager.endTask();

			if (error) {
				WindowErrorUtility.dispatchError(element, error);
				if (browserSettings.disableErrorCapturing) {
					throw error;
				}
			} else {
				element.ownerDocument['_currentScript'] = element;
				if (browserSettings.disableErrorCapturing) {
					element.ownerDocument.defaultView.eval(code);
				} else {
					WindowErrorUtility.captureError(element.ownerDocument.defaultView, () =>
						element.ownerDocument.defaultView.eval(code)
					);
				}
				element.ownerDocument['_currentScript'] = null;
				element.dispatchEvent(new Event('load'));
			}
		} else {
			let code: string | null = null;
			let error: Error | null = null;

			try {
				code = ResourceFetch.fetchSync(element.ownerDocument, src);
			} catch (e) {
				error = e;
			}

			if (error) {
				WindowErrorUtility.dispatchError(element, error);
				if (browserSettings.disableErrorCapturing) {
					throw error;
				}
			} else {
				element.ownerDocument['_currentScript'] = element;
				if (browserSettings.disableErrorCapturing) {
					element.ownerDocument.defaultView.eval(code);
				} else {
					WindowErrorUtility.captureError(element.ownerDocument.defaultView, () =>
						element.ownerDocument.defaultView.eval(code)
					);
				}
				element.ownerDocument['_currentScript'] = null;
				element.dispatchEvent(new Event('load'));
			}
		}
	}
}
