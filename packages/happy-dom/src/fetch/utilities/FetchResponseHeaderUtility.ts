import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import CookieStringUtility from '../../cookie/urilities/CookieStringUtility.js';
import Headers from '../Headers.js';

/**
 * Fetch request validation utility.
 */
export default class FetchResponseHeaderUtility {
	/**
	 * Appends headers to response.
	 *
	 * @param nodeResponse HTTP request.
	 * @returns Headers.
	 */
	public static parseResponseHeaders(options: {
		browserFrame: IBrowserFrame;
		requestURL: URL;
		rawHeaders: string[];
	}): Headers {
		const headers = new Headers();
		let key = null;

		for (const header of options.rawHeaders) {
			if (!key) {
				key = header;
			} else {
				const lowerName = key.toLowerCase();
				// Handles setting cookie headers to the document.
				if (lowerName === 'set-cookie' || lowerName === 'set-cookie2') {
					options.browserFrame.page.context.cookieContainer.addCookies([
						CookieStringUtility.stringToCookie(options.requestURL, header)
					]);
				}
				headers.append(key, header);
				key = null;
			}
		}

		return headers;
	}
}
