import Document from '../document/Document';
import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';
import ResourceFetch from '../../fetch/ResourceFetch';
import HTMLLinkElement from './HTMLLinkElement';
import CSSStyleSheet from '../../css/CSSStyleSheet';
import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class HTMLLinkElementUtility {
	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param options Options.
	 * @param options.element Element.
	 * @param element
	 */
	public static async loadExternalStylesheet(element: HTMLLinkElement): Promise<void> {
		const href = element.getAttribute('href');
		const rel = element.getAttribute('rel');

		if (href !== null && rel && rel.toLowerCase() === 'stylesheet' && element.isConnected) {
			if (element.ownerDocument.defaultView.happyDOM.settings.disableCSSFileLoading) {
				this.onError(
					element,
					new DOMException(
						`Failed to load external stylesheet "${href}". CSS file loading is disabled.`,
						DOMExceptionNameEnum.notSupportedError
					)
				);
				return;
			}

			(<Document>element.ownerDocument)._readyStateManager.startTask();

			let code: string;
			try {
				code = await ResourceFetch.fetch(element.ownerDocument, href);
			} catch (error) {
				this.onError(element, error);
				return;
			}

			const styleSheet = new CSSStyleSheet();
			styleSheet.replaceSync(code);
			(<CSSStyleSheet>element.sheet) = styleSheet;
			element.dispatchEvent(new Event('load'));
			(<Document>element.ownerDocument)._readyStateManager.endTask();
		}
	}

	/**
	 * Triggered when an error occurs.
	 *
	 * @param element Element.
	 * @param error Error.
	 */
	private static onError(element: HTMLLinkElement, error: Error): void {
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
		(<Document>element.ownerDocument)._readyStateManager.endTask();
		if (
			!element['_listeners']['error'] &&
			!element.ownerDocument.defaultView['_listeners']['error']
		) {
			element.ownerDocument.defaultView.console.error(error);
		}
	}
}
