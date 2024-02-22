import ICookie from '../types/ICookie.js';

/**
 * Cookie expire utility.
 */
export default class CookieExpireUtility {
	/**
	 * Returns "true" if cookie has expired.
	 *
	 * @param cookie Cookie.
	 * @returns "true" if cookie has expired.
	 */
	public static hasExpired(cookie: ICookie): boolean {
		return cookie.expires && cookie.expires.getTime() < Date.now();
	}
}
