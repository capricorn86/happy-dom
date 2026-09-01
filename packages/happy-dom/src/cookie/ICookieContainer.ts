import type URL from '../url/URL.js';
import type ICookie from './ICookie.js';
import type IOptionalCookie from './IOptionalCookie.js';

/**
 * Cookie Container.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie.
 */
export default interface ICookieContainer {
	/**
	 * Adds or replaces cookies.
	 *
	 * @param cookies Cookies.
	 * @returns Changed cookies.
	 */
	addCookies(cookies: IOptionalCookie[]): { changed: ICookie[]; deleted: ICookie[] };

	/**
	 * Returns cookies.
	 *
	 * @param [url] URL.
	 * @param [clientSide] "true" if "httpOnly" cookies should be filtered out.
	 * @returns Cookies.
	 */
	getCookies(url?: URL | null, clientSide?: boolean): ICookie[];

	/**
	 * Clears all cookies.
	 */
	clearCookies(): void;
}
