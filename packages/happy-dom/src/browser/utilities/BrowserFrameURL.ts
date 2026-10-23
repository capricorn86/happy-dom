import type IBrowserFrame from '../types/IBrowserFrame.js';
import { URL } from 'url';
import * as PropertySymbol from '../../PropertySymbol.js';
import type BrowserWindow from '../../window/BrowserWindow.js';

/**
 * Browser frame URL utility.
 */
export default class BrowserFrameURL {
	/**
	 * Returns the origin of the document in a frame.
	 *
	 * "about:blank", "about:srcdoc" and "javascript:" documents inherit their origin.
	 * Other documents with the origin "null" (such as "data:") have an opaque origin, which is represented by their window.
	 *
	 * @param frame Frame.
	 * @returns Origin.
	 */
	public static getOrigin(frame: IBrowserFrame): string | BrowserWindow {
		const url = new URL(frame.window[PropertySymbol.location].href);

		if (this.hasInheritedOrigin(url)) {
			return (
				frame[PropertySymbol.inheritedOrigin] ??
				(frame.parentFrame ? this.getOrigin(frame.parentFrame) : frame.window)
			);
		}

		return url.origin === 'null' ? frame.window : url.origin;
	}

	/**
	 * Returns whether the documents in two frames have the same origin.
	 *
	 * @param frame Frame.
	 * @param otherFrame Other frame.
	 * @returns True if they have the same origin.
	 */
	public static isSameOrigin(frame: IBrowserFrame, otherFrame: IBrowserFrame): boolean {
		return this.getOrigin(frame) === this.getOrigin(otherFrame);
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
	private static hasInheritedOrigin(targetURL: URL): boolean {
		return (
			targetURL.protocol === 'javascript:' ||
			(targetURL.protocol === 'about:' &&
				(targetURL.pathname === 'blank' || targetURL.pathname === 'srcdoc'))
		);
	}
}
