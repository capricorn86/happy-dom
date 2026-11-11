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

		return this.getOrigin(parentFrame) === this.getOrigin(childFrame);
	}

	/**
	 * Returns the origin of the document in a frame.
	 *
	 * "about:blank", "about:srcdoc" and "javascript:" documents use the origin that was inherited from the parent or opener frame when the navigation started.
	 * Opaque origins (e.g. "data:" URLs) get a unique origin, as they are only same-origin with themselves.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy#inherited_origins
	 * @param frame Frame.
	 * @returns Origin.
	 */
	public static getOrigin(frame: IBrowserFrame): string {
		const documentState = frame[PropertySymbol.history].currentItem.documentState;
		const url = new URL(documentState.url);

		if (url.origin !== 'null') {
			return url.origin;
		}

		// Data URLs are treated as unique opaque origins by modern browsers, rather than inheriting the origin of the settings object responsible for the navigation.
		// @see https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
		if (url.protocol !== 'data:' && documentState.inheritedOrigin !== null) {
			return documentState.inheritedOrigin;
		}

		// A window ID distinguishes each opaque origin, while allowing inheriting "about:blank" frames to share it.
		return `${url.protocol}${frame.window[PropertySymbol.internalId]}`;
	}

	/**
	 * Returns the origin that a document navigated in the frame can inherit from its opener or parent frame.
	 *
	 * @param frame Frame.
	 * @returns Origin, or null if there is no opener or parent frame.
	 */
	public static getInheritableOrigin(frame: IBrowserFrame): string | null {
		const sourceFrame = frame[PropertySymbol.opener]?.frame ?? frame.parentFrame;
		return sourceFrame ? this.getOrigin(sourceFrame) : null;
	}
}
