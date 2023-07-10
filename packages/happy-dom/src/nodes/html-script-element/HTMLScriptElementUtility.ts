import Document from '../document/Document.js';
import Event from '../../event/Event.js';
import ErrorEvent from '../../event/events/ErrorEvent.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import HTMLScriptElement from './HTMLScriptElement.js';

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

			this.eval(element, code);
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

			this.eval(element, code);
			element.dispatchEvent(new Event('load'));
		}
	}

	/**
	 * Evaluates a script code.
	 *
	 * @param element Element.
	 * @param code Code.
	 */
	public static eval(element: HTMLScriptElement, code: string): void {
		try {
			element.ownerDocument.defaultView.eval(code);
		} catch (error) {
			element.ownerDocument.defaultView.console.error(error);
			element.ownerDocument.defaultView.dispatchEvent(
				new ErrorEvent('error', {
					message: error.message,
					error: error
				})
			);
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
		element.ownerDocument.defaultView.console.error(error);
	}
}
