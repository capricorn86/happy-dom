import { Document } from '../..';
import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';
import ResourceFetch from '../../fetch/ResourceFetch';
import HTMLScriptElement from './HTMLScriptElement';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class ScriptUtility {
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
			return;
		}

		if (async) {
			let code = null;
			(<Document>element.ownerDocument)._readyStateManager.startTask();
			try {
				code = await ResourceFetch.fetch(element.ownerDocument, src);
			} catch (error) {
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
			if (code) {
				element.ownerDocument.defaultView.eval(code);
				element.dispatchEvent(new Event('load'));
			}
			(<Document>element.ownerDocument)._readyStateManager.endTask();
		} else {
			let code = null;
			try {
				code = ResourceFetch.fetchSync(element.ownerDocument, src);
			} catch (error) {
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
			if (code) {
				element.ownerDocument.defaultView.eval(code);
				element.dispatchEvent(new Event('load'));
			}
		}
	}
}
