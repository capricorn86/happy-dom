import type URL from '../url/URL.js';
import DefaultCookie from './DefaultCookie.js';
import type ICookie from './ICookie.js';
import type ICookieContainer from './ICookieContainer.js';
import type IOptionalCookie from './IOptionalCookie.js';
import CookieExpireUtility from './urilities/CookieExpireUtility.js';
import CookieURLUtility from './urilities/CookieURLUtility.js';

/**
 * Cookie Container.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie.
 */
export default class CookieContainer implements ICookieContainer {
	#cookies: ICookie[] = [];

	/**
	 * Adds or replaces cookies.
	 *
	 * @param cookies Cookies.
	 * @returns Changed cookies.
	 */
	public addCookies(cookies: IOptionalCookie[]): { changed: ICookie[]; deleted: ICookie[] } {
		const changedCookies: { changed: ICookie[]; deleted: ICookie[] } = {
			changed: [],
			deleted: []
		};
		const allCookies = this.#cookies;
		for (const cookie of cookies) {
			const newCookie = Object.assign({}, DefaultCookie, cookie);

			if (newCookie && newCookie.key && newCookie.originURL) {
				const hasExpired = CookieExpireUtility.hasExpired(newCookie);

				// Checks if the cookie already exists and removes it.
				for (let i = 0, max = allCookies.length; i < max; i++) {
					const existingCookie = allCookies[i];
					if (
						existingCookie.key === newCookie.key &&
						existingCookie.originURL.hostname === newCookie.originURL.hostname &&
						existingCookie.path === newCookie.path &&
						typeof existingCookie.value === typeof newCookie.value
					) {
						if (hasExpired) {
							changedCookies.deleted.push(existingCookie);
						}
						allCookies.splice(i, 1);
						break;
					}
				}

				if (!hasExpired) {
					allCookies.push(newCookie);
					changedCookies.changed.push(newCookie);
				}
			}
		}
		return changedCookies;
	}

	/**
	 * Returns cookies.
	 *
	 * @param [url] URL.
	 * @param [clientSide] "true" if "httpOnly" cookies should be filtered out.
	 * @returns Cookies.
	 */
	public getCookies(url: URL | null = null, clientSide = false): ICookie[] {
		const cookies = [];

		for (const cookie of this.#cookies) {
			if (
				!CookieExpireUtility.hasExpired(cookie) &&
				(!clientSide || !cookie.httpOnly) &&
				(!url || CookieURLUtility.cookieMatchesURL(cookie, url))
			) {
				cookies.push(cookie);
			}
		}

		return cookies;
	}

	/**
	 * Clears all cookies.
	 */
	public clearCookies(): void {
		this.#cookies = [];
	}
}
