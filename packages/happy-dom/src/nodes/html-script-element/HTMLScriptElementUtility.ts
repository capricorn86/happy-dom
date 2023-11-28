import Event from '../../event/Event.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import HTMLScriptElement from './HTMLScriptElement.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import WindowBrowserSettingsReader from '../../window/WindowBrowserSettingsReader.js';
import DocumentReadyStateManager from '../document/DocumentReadyStateManager.js';

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
			element.ownerDocument._defaultView
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

		let code: string | null = null;
		let error: Error | null = null;

		if (async) {
			(<{ _readyStateManager: DocumentReadyStateManager }>(
				(<unknown>element.ownerDocument._defaultView)
			))._readyStateManager.startTask();

			try {
				code = await ResourceFetch.fetch(element.ownerDocument._defaultView, src);
			} catch (e) {
				error = e;
			}

			(<{ _readyStateManager: DocumentReadyStateManager }>(
				(<unknown>element.ownerDocument._defaultView)
			))._readyStateManager.endTask();
		} else {
			try {
				code = ResourceFetch.fetchSync(element.ownerDocument._defaultView, src);
			} catch (e) {
				error = e;
			}
		}

		if (error) {
			WindowErrorUtility.dispatchError(element, error);
			if (browserSettings.disableErrorCapturing) {
				throw error;
			}
		} else {
			element.ownerDocument['_currentScript'] = element;
			code = '//# sourceURL=' + src + '\n' + code;
			if (browserSettings.disableErrorCapturing) {
				element.ownerDocument._defaultView.eval(code);
			} else {
				WindowErrorUtility.captureError(element.ownerDocument._defaultView, () =>
					element.ownerDocument._defaultView.eval(code)
				);
			}
			element.ownerDocument['_currentScript'] = null;
			element.dispatchEvent(new Event('load'));
		}
	}
}
