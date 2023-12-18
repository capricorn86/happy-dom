import Event from '../../event/Event.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../resource-fetch/ResourceFetch.js';
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
			element.ownerDocument.__defaultView__
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
			const readyStateManager = (<{ __readyStateManager__: DocumentReadyStateManager }>(
				(<unknown>element.ownerDocument.__defaultView__)
			)).__readyStateManager__;

			readyStateManager.startTask();

			try {
				code = await ResourceFetch.fetch(element.ownerDocument.__defaultView__, src);
			} catch (e) {
				error = e;
			}

			readyStateManager.endTask();
		} else {
			try {
				code = ResourceFetch.fetchSync(element.ownerDocument.__defaultView__, src);
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
			element.ownerDocument['__currentScript__'] = element;
			code = '//# sourceURL=' + src + '\n' + code;
			if (browserSettings.disableErrorCapturing) {
				element.ownerDocument.__defaultView__.eval(code);
			} else {
				WindowErrorUtility.captureError(element.ownerDocument.__defaultView__, () =>
					element.ownerDocument.__defaultView__.eval(code)
				);
			}
			element.ownerDocument['__currentScript__'] = null;
			element.dispatchEvent(new Event('load'));
		}
	}
}
