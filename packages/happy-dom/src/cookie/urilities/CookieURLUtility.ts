import CookieDomainUtility from './CookieDomainUtility.js';
import type URL from '../../url/URL.js';
import type ICookie from '../ICookie.js';

/**
 * Cookie string.
 */
export default class CookieURLUtility {
	/**
	 * Returns "true" if cookie matches URL.
	 *
	 * @param cookie Cookie.
	 * @param url URL.
	 * @returns "true" if cookie matches URL.
	 */
	public static cookieMatchesURL(cookie: ICookie, url: URL): boolean {
		const isLocalhost = url.hostname === 'localhost' || url.hostname?.endsWith('.localhost');
		return (
			!!cookie.originURL &&
			(!cookie.secure || url.protocol === 'https:' || isLocalhost) &&
			(cookie.domain
				? CookieDomainUtility.domainMatches(url.hostname, cookie.domain)
				: cookie.originURL.hostname === url.hostname) &&
			(!cookie.path || url.pathname?.startsWith(cookie.path))
		);
	}
}
