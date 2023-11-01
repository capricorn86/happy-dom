import { URL } from 'url';

/**
 * Fetch CORS utility.
 */
export default class FetchCORSUtility {
	/**
	 * Validates request headers.
	 *
	 * @param originURL Origin URL.
	 * @param targetURL Target URL.
	 */
	public static isCORS(originURL: URL, targetURL: URL): boolean {
		if (targetURL.protocol === 'about:' || targetURL.protocol === 'javascript:') {
			return false;
		}
		return (
			(originURL.hostname !== targetURL.hostname &&
				!originURL.hostname.endsWith(targetURL.hostname)) ||
			originURL.protocol !== targetURL.protocol
		);
	}
}
