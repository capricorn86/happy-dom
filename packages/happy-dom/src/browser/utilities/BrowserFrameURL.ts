import type IBrowserFrame from '../types/IBrowserFrame.js';
import { URL } from 'url';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * Browser frame URL utility.
 */
export default class BrowserFrameURL {
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
	 * Checks if the child frame is same-origin as the parent frame.
	 *
	 * @param parentFrame Parent frame.
	 * @param childFrame Child frame.
	 * @returns True if same-origin.
	 */
	public static isSameOrigin(parentFrame: IBrowserFrame, childFrame: IBrowserFrame): boolean {
		const parentURL = this.getInheritedFrameURL(parentFrame);
		const childURL = this.getInheritedFrameURL(childFrame);
		// Data URLs are treated as unique opaque origins by modern browsers, rather than inheriting the origin of the settings object responsible for the navigation.
		// @see https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
		return (
			new URL(childFrame.url).protocol !== 'data:' &&
			(parentURL === null || childURL === null || parentURL.origin === childURL.origin)
		);
	}

	/**
	 * Returns the frame URL or the inherited frame URL if the frame has no source URL.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy#inherited_origins
	 * @param frame Frame.
	 * @returns Frame URL or inherited frame URL, or null if opaque origin.
	 */
	private static getInheritedFrameURL(frame: IBrowserFrame): URL | null {
		// Popup frame
		if (frame[PropertySymbol.openerFrame]) {
			// We use the fetched source URL if available, otherwise we inherit from the opener frame.
			if (frame.sourceURL) {
				return new URL(frame.sourceURL);
			}
			return this.getInheritedFrameURL(frame[PropertySymbol.openerFrame]);
		}
		// Child frame (e.g. iframe)
		if (frame.parentFrame) {
			// We use the fetched source URL if available, otherwise we inherit from the parent frame.
			if (frame.sourceURL) {
				return new URL(frame.sourceURL);
			}
			return this.getInheritedFrameURL(frame.parentFrame);
		}
		return null;
	}
}
