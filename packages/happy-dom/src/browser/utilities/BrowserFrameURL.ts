import IBrowserFrame from '../types/IBrowserFrame.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import { URL } from 'url';

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
	public static getRelativeURL(frame: IBrowserFrame, url: string): URL {
		url = url || 'about:blank';

		if (url.startsWith('about:') || url.startsWith('javascript:')) {
			return new URL(url);
		}

		try {
			return new URL(url, frame.window.location.href);
		} catch (e) {
			if (frame.window.location.hostname) {
				throw new DOMException(
					`Failed to construct URL from string "${url}".`,
					DOMExceptionNameEnum.uriMismatchError
				);
			} else {
				throw new DOMException(
					`Failed to construct URL from string "${url}" relative to URL "${frame.window.location.href}".`,
					DOMExceptionNameEnum.uriMismatchError
				);
			}
		}
	}
}
