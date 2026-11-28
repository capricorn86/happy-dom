import type IBrowserFrame from '../types/IBrowserFrame.js';
import { URL } from 'url';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * Browser frame URL utility.
 */
export default class BrowserFrameURL {
	/**
	 * Returns whether a target URL has the same origin as the origin URL.
	 *
	 * @param originURL Origin URL.
	 * @param targetURL Target URL.
	 * @returns Whether the URLs have the same origin.
	 */
	public static isSameOrigin(originURL: Pick<URL, 'origin'>, targetURL: URL): boolean {
		return (
			this.hasInheritedOrigin(targetURL) ||
			(targetURL.origin !== 'null' && originURL.origin === targetURL.origin)
		);
	}

	/**
	 * Returns whether a target URL has an opaque origin instead of an inherited origin.
	 *
	 * @param targetURL Target URL.
	 * @returns Whether the URL has an opaque origin.
	 */
	public static hasOpaqueOrigin(targetURL: URL): boolean {
		return targetURL.origin === 'null' && !this.hasInheritedOrigin(targetURL);
	}

	/**
	 * Returns relative URL.
	 *
	 * @param frame Frame.
	 * @param url URL.
	 * @returns Relative URL.
	 */
	public static getRelativeURL(frame: IBrowserFrame, url?: string | URL | null): URL {
		url = url ? String(url) : 'about:blank';

		if (url.startsWith('about:') || url.startsWith('javascript:')) {
			return new URL(url);
		}

		try {
			// Use internal PropertySymbol.location to avoid being affected by mocks on window.location
			return new URL(url, frame.window[PropertySymbol.location].href);
		} catch (e) {
			return new URL('about:blank');
		}
	}

	/**
	 * Returns whether a target URL has an inherited origin.
	 *
	 * @param targetURL Target URL.
	 * @returns Whether the URL has an inherited origin.
	 */
	private static hasInheritedOrigin(targetURL: URL): boolean {
		return (
			targetURL.protocol === 'javascript:' ||
			(targetURL.protocol === 'about:' &&
				(targetURL.pathname === 'blank' || targetURL.pathname === 'srcdoc'))
		);
	}
}
