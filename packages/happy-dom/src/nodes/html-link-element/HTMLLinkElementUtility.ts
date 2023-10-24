import Event from '../../event/Event.js';
import ResourceFetch from '../../fetch/ResourceFetch.js';
import HTMLLinkElement from './HTMLLinkElement.js';
import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import WindowBrowserSettingsReader from '../../window/WindowBrowserSettingsReader.js';
import DocumentReadyStateManager from '../document/DocumentReadyStateManager.js';

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
		const browserSettings = WindowBrowserSettingsReader.getSettings(
			element.ownerDocument._defaultView
		);

		if (href !== null && rel && rel.toLowerCase() === 'stylesheet' && element.isConnected) {
			if (browserSettings.disableCSSFileLoading) {
				WindowErrorUtility.dispatchError(
					element,
					new DOMException(
						`Failed to load external stylesheet "${href}". CSS file loading is disabled.`,
						DOMExceptionNameEnum.notSupportedError
					)
				);
				return;
			}

			(<{ _readyStateManager: DocumentReadyStateManager }>(
				(<unknown>element.ownerDocument._defaultView)
			))._readyStateManager.startTask();

			let code: string | null = null;
			let error: Error | null = null;

			try {
				code = await ResourceFetch.fetch(element.ownerDocument, href);
			} catch (e) {
				error = e;
			}

			(<{ _readyStateManager: DocumentReadyStateManager }>(
				(<unknown>element.ownerDocument._defaultView)
			))._readyStateManager.endTask();

			if (error) {
				WindowErrorUtility.dispatchError(element, error);
				if (browserSettings.disableErrorCapturing) {
					throw error;
				}
			} else {
				const styleSheet = new CSSStyleSheet();
				styleSheet.replaceSync(code);
				(<CSSStyleSheet>element.sheet) = styleSheet;
				element.dispatchEvent(new Event('load'));
			}
		}
	}
}
