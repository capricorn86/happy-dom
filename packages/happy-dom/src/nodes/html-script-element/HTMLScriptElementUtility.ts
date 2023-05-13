import Document from '../document/Document';
import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';
import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import ResourceFetch from '../../fetch/ResourceFetch';
import HTMLScriptElement from './HTMLScriptElement';

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
			this.onError(
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

			let code = null;

			try {
				code = await ResourceFetch.fetch(element.ownerDocument, src);
			} catch (error) {
				this.onError(element, error);
				return;
			}

			element.ownerDocument.defaultView.eval(code);
			element.dispatchEvent(new Event('load'));
			(<Document>element.ownerDocument)._readyStateManager.endTask();
		} else {
			let code = null;

			try {
				code = ResourceFetch.fetchSync(element.ownerDocument, src);
			} catch (error) {
				this.onError(element, error);
				return;
			}

			element.ownerDocument.defaultView.eval(code);
			element.dispatchEvent(new Event('load'));
		}
	}

	/**
	 * Triggered when an error occurs.
	 *
	 * @param element Element.
	 * @param error Error.
	 */
	private static onError(element: HTMLScriptElement, error: Error): void {
		element.dispatchEvent(
			new ErrorEvent('error', {
				message: error.message,
				error
			})
		);
		element.ownerDocument.defaultView.dispatchEvent(
			new ErrorEvent('error', {
				message: error.message,
				error
			})
		);
		if (
			!element['_listeners']['error'] &&
			!element.ownerDocument.defaultView['_listeners']['error']
		) {
			element.ownerDocument.defaultView.console.error(error);
		}
	}
}
