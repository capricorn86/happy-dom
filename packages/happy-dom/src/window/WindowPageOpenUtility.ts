import { URL } from 'url';
import IWindow from './IWindow.js';
import CrossOriginWindow from './CrossOriginWindow.js';
import WindowErrorUtility from './WindowErrorUtility.js';
import Window from './Window.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import FetchCORSUtility from '../fetch/utilities/FetchCORSUtility.js';
import ICrossOriginWindow from './ICrossOriginWindow.js';

/**
 * Window page open handler.
 */
export default class WindowPageOpenUtility {
	/**
	 * Opens a page.
	 *
	 * @param browserFrame Browser frame.
	 * @param [options] Options.
	 * @param [options.url] URL.
	 * @param [options.target] Target.
	 * @param [options.features] Window features.
	 */
	public static openPage(
		browserFrame: IBrowserFrame,
		options?: {
			url?: string;
			target?: string;
			features?: string;
		}
	): IWindow | ICrossOriginWindow | null {
		const features = this.getWindowFeatures(options?.features || '');
		const url = options?.url || 'about:blank';
		const target = options?.target !== undefined ? String(options.target) : null;
		const newPage = browserFrame.page.context.newPage();
		const newWindow = <Window>newPage.mainFrame.window;
		const originURL = browserFrame.window.location;
		const targetURL = new URL(url, originURL);
		const isCORS = FetchCORSUtility.isCORS(originURL, targetURL);

		newPage.mainFrame.url = url;

		(<string>newWindow.document.referrer) = !features.noreferrer ? browserFrame.url : '';

		if (!features.noopener) {
			(<IWindow | ICrossOriginWindow>newWindow.opener) = isCORS
				? new CrossOriginWindow(browserFrame.window)
				: browserFrame.window;
		}

		if (target) {
			(<string>newWindow.name) = target;
		}

		if (features?.left) {
			(<number>newWindow.screenLeft) = features.left;
			(<number>newWindow.screenX) = features.left;
		}

		if (features?.top) {
			(<number>newWindow.screenTop) = features.top;
			(<number>newWindow.screenY) = features.top;
		}

		if (url === 'about:blank') {
			return features.noopener ? null : newWindow;
		}

		if (url.startsWith('javascript:')) {
			if (!browserFrame.page.context.browser.settings.disableJavaScriptEvaluation) {
				if (browserFrame.page.context.browser.settings.disableErrorCapturing) {
					newWindow.eval(url.replace('javascript:', ''));
				} else {
					WindowErrorUtility.captureError(newWindow, () =>
						newWindow.eval(url.replace('javascript:', ''))
					);
				}
			}
			return features.noopener ? null : newWindow;
		}

		newWindow._readyStateManager.startTask();

		newWindow
			.fetch(url, {
				referrer: features.noreferrer ? 'no-referrer' : undefined
			})
			.then((response) => response.text())
			.then((responseText) => {
				newPage.mainFrame.content = responseText;
				newWindow._readyStateManager.endTask();
			})
			.catch((error) => {
				WindowErrorUtility.dispatchError(newWindow, error);
				newWindow._readyStateManager.endTask();
			});

		if (features.noopener) {
			return null;
		}

		return isCORS ? new CrossOriginWindow(newWindow, browserFrame.window) : newWindow;
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
