import URL from '../../url/URL.js';
import ICookie from '../types/ICookie.js';

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
	addCookies(cookies: ICookie[]): void;

	/**
	 * Returns cookies.
	 *
	 * @param [url] URL.
	 * @param [httpOnly] "true" if only http cookies should be returned.
	 * @returns Cookies.
	 */
	getCookies(url: URL | null, httpOnly: boolean): ICookie[];
}
