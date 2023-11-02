import { URL } from 'url';
import IWindow from './IWindow.js';
import CrossOriginWindow from './CrossOriginWindow.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import FetchCORSUtility from '../fetch/utilities/FetchCORSUtility.js';
import ICrossOriginWindow from './ICrossOriginWindow.js';
import DetachedBrowserFrame from '../browser/detached-browser/DetachedBrowserFrame.js';

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
		const target = options?.target !== undefined ? String(options.target) : null;
		let targetFrame: IBrowserFrame;

		// When using the Window instance directly and not via the Browser API we should not navigate the browser frame.
		if (
			browserFrame instanceof DetachedBrowserFrame &&
			(target === '_self' || target === '_top' || target === '_parent')
		) {
			return null;
		}

		switch (target) {
			case '_self':
				targetFrame = browserFrame;
				break;
			case '_top':
				targetFrame = browserFrame.page.mainFrame;
				break;
			case '_parent':
				targetFrame = browserFrame.parentFrame ?? browserFrame;
				break;
			case '_blank':
			default:
				const newPage = browserFrame.page.context.newPage();
				targetFrame = newPage.mainFrame;
				break;
		}

		let url = options.url || 'about:blank';

		if (!url.startsWith('about:') && !url.startsWith('javascript:')) {
			url = new URL(url, browserFrame.window.location).href;
		}

		targetFrame.goto(url, {
			referrer: features.noreferrer ? 'no-referrer' : undefined
		});

		if (url.startsWith('javascript:')) {
			return targetFrame.window;
		}

		if (targetFrame === browserFrame) {
			return null;
		}

		if (features.popup && target !== '_self' && target !== '_top' && target !== '_parent') {
			if (features?.width || features?.height) {
				targetFrame.page.setViewport({
					width: features?.width,
					height: features?.height
				});
			}

			if (features?.left) {
				(<number>targetFrame.window.screenLeft) = features.left;
				(<number>targetFrame.window.screenX) = features.left;
			}

			if (features?.top) {
				(<number>targetFrame.window.screenTop) = features.top;
				(<number>targetFrame.window.screenY) = features.top;
			}
		}

		if (target) {
			(<string>targetFrame.window.name) = target;
		}

		const originURL = browserFrame.window.location;
		const targetURL = new URL(targetFrame.url, originURL);
		const isCORS = FetchCORSUtility.isCORS(originURL, targetURL);

		if (!features.noopener && !features.noreferrer) {
			(<IWindow | ICrossOriginWindow>targetFrame.window.opener) = isCORS
				? new CrossOriginWindow(browserFrame.window)
				: browserFrame.window;
		}

		if (features.noopener || features.noreferrer) {
			return null;
		}

		if (isCORS) {
			return new CrossOriginWindow(targetFrame.window, browserFrame.window);
		}

		return targetFrame.window;
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
