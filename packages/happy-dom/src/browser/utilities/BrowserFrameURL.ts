import type IBrowserFrame from '../types/IBrowserFrame.js';
import { URL } from 'url';
import * as PropertySymbol from '../../PropertySymbol.js';
import type IInheritedOrigin from '../types/IInheritedOrigin.js';
import type Location from '../../location/Location.js';

/**
 * Browser frame URL utility.
 */
export default class BrowserFrameURL {
	/**
	 * Returns the origin of the document in a frame.
	 *
	 * "about:blank", "about:srcdoc" and "javascript:" documents inherit the origin that the initiator had when the document was created.
	 * The inherited origin is a snapshot, so it isn't affected if the URL of the initiator changes afterwards.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy#inherited_origins
	 * @param frame Frame.
	 * @returns Inherited origin.
	 */
	public static getInheritedOrigin(frame: IBrowserFrame): IInheritedOrigin {
		// Use internal PropertySymbol.location to avoid being affected by mocks on window.location
		const location = frame.window[PropertySymbol.location];

		// A destroyed frame doesn't have a document.
		if (!location) {
			return { origin: 'null', window: frame.window };
		}

		if (this.hasInheritedOrigin(location) && frame[PropertySymbol.inheritedOrigin]) {
			return frame[PropertySymbol.inheritedOrigin];
		}

		return {
			origin: location.origin,
			window: location.origin === 'null' ? frame.window : null
		};
	}

	/**
	 * Returns whether the documents in two frames have the same origin.
	 *
	 * An opaque origin ("null") is only the same origin as itself.
	 *
	 * @param frame Frame.
	 * @param otherFrame Other frame.
	 * @returns True if they have the same origin.
	 */
	public static isSameOrigin(frame: IBrowserFrame, otherFrame: IBrowserFrame): boolean {
		const origin = this.getInheritedOrigin(frame);
		const otherOrigin = this.getInheritedOrigin(otherFrame);

		return (
			origin.origin === otherOrigin.origin &&
			(origin.origin !== 'null' || origin.window === otherOrigin.window)
		);
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
	 * Returns whether a document with the URL inherits its origin.
	 *
	 * @param targetURL Target URL.
	 * @returns Whether the URL has an inherited origin.
	 */
	private static hasInheritedOrigin(targetURL: URL | Location): boolean {
		return (
			targetURL.protocol === 'javascript:' ||
			(targetURL.protocol === 'about:' &&
				(targetURL.pathname === 'blank' || targetURL.pathname === 'srcdoc'))
		);
	}
}
