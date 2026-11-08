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
		if (parentFrame === childFrame) {
			return true;
		}

		const parentOrigin = this.getInheritedOrigin(parentFrame);
		const childOrigin = this.getInheritedOrigin(childFrame);

		return parentOrigin !== null && childOrigin !== null && parentOrigin === childOrigin;
	}

	/**
	 * Returns the frame origin or an origin inherited from it's parent or opener.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy#inherited_origins
	 * @param frame Frame.
	 * @returns Frame origin, or null for data origins.
	 */
	private static getInheritedOrigin(frame: IBrowserFrame): string | null {
		const navigationURL = new URL(frame.navigationURL);

		// Data URLs are treated as unique opaque origins by modern browsers, rather than inheriting the origin of the settings object responsible for the navigation.
		// @see https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
		if (navigationURL.protocol === 'data:') {
			return `data:${frame[PropertySymbol.id]}`;
		}

		if (
			!frame[PropertySymbol.history].currentItem.inheritOrigin ||
			navigationURL.origin !== 'null'
		) {
			return navigationURL.origin;
		}

		// Popup frame
		if (frame[PropertySymbol.opener]?.frame) {
			return this.getInheritedOrigin(frame[PropertySymbol.opener].frame);
		}

		// Child frame (e.g. iframe)
		if (frame.parentFrame) {
			return this.getInheritedOrigin(frame.parentFrame);
		}

		return navigationURL.origin;
	}
}
