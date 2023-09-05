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

			const code = await WindowErrorUtility.captureErrorAsync<string>(
				element,
				async () => await ResourceFetch.fetch(element.ownerDocument, src)
			);

			if (code) {
				WindowErrorUtility.captureErrorSync(element.ownerDocument.defaultView, () =>
					element.ownerDocument.defaultView.eval(code)
				);
				element.dispatchEvent(new Event('load'));
			}
			(<Document>element.ownerDocument)._readyStateManager.endTask();
		} else {
			const code = WindowErrorUtility.captureErrorSync<string>(element, () =>
				ResourceFetch.fetchSync(element.ownerDocument, src)
			);

			if (code) {
				WindowErrorUtility.captureErrorSync(element.ownerDocument.defaultView, () =>
					element.ownerDocument.defaultView.eval(code)
				);
				element.dispatchEvent(new Event('load'));
			}
		}
	}
}
