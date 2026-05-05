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
	 * Adds cookies.
	 *
	 * @param cookies Cookies.
	 */
	addCookies(cookies: IOptionalCookie[]): void;

	/**
	 * Returns cookies.
	 *
	 * @param [url] URL.
	 * @param [httpOnly] "true" if only http cookies should be returned.
	 * @returns Cookies.
	 */
	getCookies(url?: URL | null, httpOnly?: boolean): ICookie[];

	/**
	 * Clears all cookies.
	 */
	clearCookies(): void;
}
