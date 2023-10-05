import Cookie from './Cookie.js';
import CookieSameSiteEnum from './CookieSameSiteEnum.js';
import URL from '../url/URL.js';

/**
 * CookieJar.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie.
 */
export default class CookieJar {
	private cookies: Cookie[] = [];

	/**
	 * Adds cookie string.
	 *
	 * @param originURL Origin URL.
	 * @param cookieString Cookie string.
	 */
	public addCookieString(originURL: URL, cookieString: string): void {
		if (!cookieString) {
			return;
		}

		const newCookie = new Cookie(originURL, cookieString);

		if (!newCookie.validate()) {
			return;
		}

		for (let i = 0, max = this.cookies.length; i < max; i++) {
			if (
				this.cookies[i].key === newCookie.key &&
				this.cookies[i].originURL.hostname === newCookie.originURL.hostname &&
				// Cookies with or without values are treated differently in the browser.
				// Therefore, the cookie should only be replaced if either both has a value or if both has no value.
				// The cookie value is null if it has no value set.
				// This is a bit unlogical, so it would be nice with a link to the spec here.
				typeof this.cookies[i].value === typeof newCookie.value
			) {
				this.cookies.splice(i, 1);
				break;
			}
		}

		if (!newCookie.isExpired()) {
			this.cookies.push(newCookie);
		}
	}

	/**
	 * Get cookie string.
	 *
	 * @param targetURL Target URL.
	 * @param fromDocument If true, the caller is a document.
	 * @returns Cookie string.
	 */
	public getCookieString(targetURL: URL, fromDocument: boolean): string {
		let cookieString = '';

		for (const cookie of this.cookies) {
			if (
				(!fromDocument || !cookie.httpOnly) &&
				!cookie.isExpired() &&
				(!cookie.secure || targetURL.protocol === 'https:') &&
				(!cookie.domain || targetURL.hostname.endsWith(cookie.domain)) &&
				(!cookie.path || targetURL.pathname.startsWith(cookie.path)) &&
				// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
				((cookie.sameSite === CookieSameSiteEnum.none && cookie.secure) ||
					cookie.originURL.hostname === targetURL.hostname)
			) {
				if (cookieString) {
					cookieString += '; ';
				}
				cookieString += cookie.toString();
			}
		}

		return cookieString;
	}
}
