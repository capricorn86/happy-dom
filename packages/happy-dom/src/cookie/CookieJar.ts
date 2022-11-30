import Location from 'src/location/Location';
import Cookie from './Cookie';

/**
 * CookieJar.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie.
 */
export default class CookieJar {
	private cookies: Cookie[] = [];

	/**
	 * Validate cookie.
	 *
	 * @param cookie
	 */
	private validateCookie(cookie: Cookie): boolean {
		if (cookie.key.toLowerCase().startsWith('__secure-') && !cookie.isSecure()) {
			return false;
		}
		if (
			cookie.key.toLowerCase().startsWith('__host-') &&
			(!cookie.isSecure() || cookie.path !== '/' || cookie.domain)
		) {
			return false;
		}
		return true;
	}

	/**
	 * Set cookie.
	 *
	 * @param cookieString
	 */
	public setCookiesString(cookieString: string): void {
		if (!cookieString) {
			return;
		}
		const newCookie = new Cookie(cookieString);
		if (!this.validateCookie(newCookie)) {
			return;
		}
		this.cookies
			.filter((cookie) => cookie.key === newCookie.key)
			.forEach((cookie) => {
				this.cookies.splice(this.cookies.indexOf(cookie), 1);
			});
		this.cookies.push(newCookie);
	}

	/**
	 * Get cookie.
	 *
	 * @param location Location.
	 * @param fromDocument If true, the caller is a document.
	 * @returns Cookie string.
	 */
	public getCookiesString(location: Location, fromDocument: boolean): string {
		const cookies = this.cookies.filter((cookie) => {
			// Skip when use document.cookie and the cookie is httponly.
			if (fromDocument && cookie.isHttpOnly()) {
				return false;
			}
			if (cookie.isExpired()) {
				return false;
			}
			if (cookie.isSecure() && location.protocol !== 'https:') {
				return false;
			}
			if (cookie.domain && !location.hostname.endsWith(cookie.domain)) {
				return false;
			}
			if (cookie.path && !location.pathname.startsWith(cookie.path)) {
				return false;
			}
			// TODO: check SameSite.
			return true;
		});
		return cookies.map((cookie) => cookie.cookieString()).join('; ');
	}
}
