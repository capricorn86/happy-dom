import URL from '../../url/URL.js';
import Event from '../../event/Event.js';
import ErrorEvent from '../../event/events/ErrorEvent.js';
import IWindow from '../../window/IWindow.js';
import IFrameCrossOriginWindow from './IFrameCrossOriginWindow.js';
import HTMLIFrameElement from './HTMLIFrameElement.js';

/**
 * HTML Iframe Utility.
 */
export default class HTMLIFrameUtility {
	/**
	 * Loads an iframe page.
	 *
	 * @param element
	 */
	public static async loadPage(element: HTMLIFrameElement): Promise<void> {
		if (
			element.isConnected &&
			!element.ownerDocument.defaultView.happyDOM.settings.disableIframePageLoading
		) {
			const src = element.src;

			if (src) {
				// To avoid circular dependency, we use a reference to the window class instead of importing it.
				const contentWindow = <IWindow>new element.ownerDocument['_windowClass']({
					url: new URL(src, element.ownerDocument.defaultView.location.href).href,
					settings: {
						...element.ownerDocument.defaultView.happyDOM.settings
					}
				});

				(<IWindow>contentWindow.parent) = element.ownerDocument.defaultView;
				(<IWindow>contentWindow.top) = element.ownerDocument.defaultView;

				if (src === 'about:blank') {
					element._contentWindow = contentWindow;
					return;
				}

				if (src.startsWith('javascript:')) {
					element._contentWindow = contentWindow;
					element._contentWindow.eval(src.replace('javascript:', ''));
					return;
				}

				const originURL = element.ownerDocument.defaultView.location;
				const targetURL = new URL(src, originURL);
				const isCORS =
					(originURL.hostname !== targetURL.hostname &&
						!originURL.hostname.endsWith(targetURL.hostname)) ||
					originURL.protocol !== targetURL.protocol;

				let responseText: string;

				element._contentWindow = null;

				try {
					const response = await element.ownerDocument.defaultView.fetch(src);
					responseText = await response.text();
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
					element.ownerDocument.defaultView.console.error(error);
					return;
				}

				element._contentWindow = isCORS
					? new IFrameCrossOriginWindow(element.ownerDocument.defaultView, contentWindow)
					: contentWindow;
				contentWindow.document.write(responseText);
				element.dispatchEvent(new Event('load'));
			}
		}
	}
}
