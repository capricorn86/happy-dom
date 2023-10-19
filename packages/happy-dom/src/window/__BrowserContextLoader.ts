import { URL } from 'url';
import Document from '../nodes/document/Document.js';
import IWindow from './IWindow.js';
import CrossOriginWindow from './CrossOriginWindow.js';
import WindowErrorUtility from './WindowErrorUtility.js';
import ICrossOriginWindow from './ICrossOriginWindow.js';
import IHTMLElement from '../nodes/html-element/IHTMLElement.js';
import Window from './Window.js';
import DetachedWindowAPI from './HappyDOMWindowAPI.js';

/**
 * Browser context.
 */
export default class __BrowserContextLoader {
	/**
	 * Creates a new browser context for an iframe or a new window using Window.open().
	 *
	 * @param ownerWindow Owner window.
	 * @param [options] Options.
	 * @param [options.url] URL.
	 * @param [options.target] Target.
	 * @param [options.features] Window features.
	 * @param [options.ownerIframeElement] Owner iframe element.
	 */
	public static getBrowserContext(
		ownerWindow: IWindow,
		options?: {
			url?: string;
			target?: string;
			features?: string;
			ownerIframeElement?: IHTMLElement;
		}
	): IWindow | ICrossOriginWindow | null {
		const features = this.getWindowFeatures(options?.features || '');
		const contentWindow = <IWindow>new (<typeof Window>ownerWindow.constructor)({
			url: options?.url ? new URL(options.url, ownerWindow.location.href).href : null,
			console: ownerWindow.console,
			width: features.width || undefined,
			height: features.height || undefined,
			settings: {
				...ownerWindow.happyDOM.settings
			}
		});
		const url = options?.url || 'about:blank';
		const target = options?.target !== undefined ? String(options.target) : null;

		(<DetachedWindowAPI>contentWindow.happyDOM) = contentWindow.happyDOM;

		(<string>contentWindow.document.referrer) = !features.noreferrer
			? ownerWindow.location.href
			: '';
		if (!features.noopener) {
			(<IWindow>contentWindow.opener) = ownerWindow;
			(<IWindow>contentWindow.parent) = ownerWindow;
			(<IWindow>contentWindow.top) = ownerWindow;
		}

		if (target) {
			(<string>contentWindow.name) = target;
		}

		if (features?.left) {
			(<number>contentWindow.screenLeft) = features.left;
			(<number>contentWindow.screenX) = features.left;
		}

		if (features?.top) {
			(<number>contentWindow.screenTop) = features.top;
			(<number>contentWindow.screenY) = features.top;
		}

		if (url === 'about:blank') {
			return features.noopener ? null : contentWindow;
		}

		if (url.startsWith('javascript:')) {
			if (!ownerWindow.happyDOM.settings.disableJavaScriptEvaluation) {
				if (ownerWindow.happyDOM.settings.disableErrorCapturing) {
					contentWindow.eval(url.replace('javascript:', ''));
				} else {
					WindowErrorUtility.captureError(ownerWindow, () =>
						contentWindow.eval(url.replace('javascript:', ''))
					);
				}
			}
			return features.noopener ? null : contentWindow;
		}

		const originURL = ownerWindow.location;
		const targetURL = new URL(url, originURL);
		const isCORS =
			(originURL.hostname !== targetURL.hostname &&
				!originURL.hostname.endsWith(targetURL.hostname)) ||
			originURL.protocol !== targetURL.protocol;

		(<Document>contentWindow.document)._readyStateManager.startTask();

		ownerWindow
			.fetch(url, {
				referrer: features.noreferrer ? 'no-referrer' : undefined
			})
			.then((response) => response.text())
			.then((responseText) => {
				contentWindow.document.write(responseText);
				(<Document>contentWindow.document)._readyStateManager.endTask();
			})
			.catch((error) => {
				WindowErrorUtility.dispatchError(
					options?.ownerIframeElement ? options.ownerIframeElement : ownerWindow,
					error
				);
				(<Document>contentWindow.document)._readyStateManager.endTask();
				if (!ownerWindow.happyDOM.settings.disableErrorCapturing) {
					throw error;
				}
			});

		if (features.noopener) {
			return null;
		}

		return isCORS ? new CrossOriginWindow(ownerWindow, contentWindow) : contentWindow;
	}

	/**
	 * Returns window features.
	 *
	 * @param features Window features string.
	 * @returns Window features.
	 */
	private static getWindowFeatures(features: string): {
		popup: boolean;
		width: number;
		height: number;
		left: number;
		top: number;
		noopener: boolean;
		noreferrer: boolean;
	} {
		const parts = features.split(',');
		const result: {
			popup: boolean;
			width: number;
			height: number;
			left: number;
			top: number;
			noopener: boolean;
			noreferrer: boolean;
		} = {
			popup: false,
			width: 0,
			height: 0,
			left: 0,
			top: 0,
			noopener: false,
			noreferrer: false
		};

		for (const part of parts) {
			const [key, value] = part.split('=');
			switch (key) {
				case 'popup':
					result.popup = value === 'yes' || value === '1' || value === 'true';
					break;
				case 'width':
				case 'innerWidth':
					result.width = parseInt(value, 10);
					break;
				case 'height':
				case 'innerHeight':
					result.height = parseInt(value, 10);
					break;
				case 'left':
				case 'screenX':
					result.left = parseInt(value, 10);
					break;
				case 'top':
				case 'screenY':
					result.top = parseInt(value, 10);
					break;
				case 'noopener':
					result.noopener = true;
					break;
				case 'noreferrer':
					result.noreferrer = true;
					break;
			}
		}

		return result;
	}
}
