import Document from '../document/Document.js';
import Event from '../../event/Event.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import HTMLScriptElement from './HTMLScriptElement.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';

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

		if (
			element.ownerDocument.defaultView.happyDOM.settings.disableJavaScriptFileLoading ||
			element.ownerDocument.defaultView.happyDOM.settings.disableJavaScriptEvaluation
		) {
			const error = new DOMException(
				`Failed to load external script "${src}". JavaScript file loading is disabled.`,
				DOMExceptionNameEnum.notSupportedError
			);
			WindowErrorUtility.dispatchError(element, error);
			if (element.ownerDocument.defaultView.happyDOM.settings.disableErrorCapturing) {
				throw error;
			}
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
				if (element.ownerDocument.defaultView.happyDOM.settings.disableErrorCapturing) {
					throw error;
				}
			} else {
				element.ownerDocument['_currentScript'] = element;
				if (element.ownerDocument.defaultView.happyDOM.settings.disableErrorCapturing) {
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
				if (element.ownerDocument.defaultView.happyDOM.settings.disableErrorCapturing) {
					throw error;
				}
			} else {
				element.ownerDocument['_currentScript'] = element;
				if (element.ownerDocument.defaultView.happyDOM.settings.disableErrorCapturing) {
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
