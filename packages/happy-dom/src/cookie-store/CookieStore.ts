import EventTarget from '../event/EventTarget.js';
import BrowserWindow from '../window/BrowserWindow.js';
import ICookieStoreGetOptions from './ICookieStoreGetOptions.js';
import ICookieStoreSetOptions from './ICookieStoreSetOptions.js';
import ICookieStoreItem from './ICookieStoreItem.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import CookieSameSiteEnum from '../cookie/enums/CookieSameSiteEnum.js';
import ICookie from '../cookie/ICookie.js';
import URL from '../url/URL.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';

/**
 * CookieStore.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CookieStore
 */
export default class CookieStore extends EventTarget {
	// Internal properties
	readonly #window: BrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 */
	constructor(window: BrowserWindow) {
		super();
		if (!window) {
			throw new TypeError('Invalid constructor');
		}
		this.#window = window;
	}

	/**
	 * Returns a cookie.
	 *
	 * @param [nameOrOptions] Name or options.
	 * @returns Cookie.
	 */
	public async get(
		nameOrOptions?: string | ICookieStoreGetOptions
	): Promise<ICookieStoreItem | null> {
		const cookies = await this.getAll(nameOrOptions);
		return cookies.length > 0 ? cookies[0] : null;
	}

	/**
	 * Returns all cookies.
	 *
	 * @param [nameOrOptions] Name or options.
	 * @returns Cookies.
	 */
	public async getAll(
		nameOrOptions?: string | ICookieStoreGetOptions
	): Promise<ICookieStoreItem[]> {
		const browserFrame = new WindowBrowserContext(this.#window).getBrowserFrame();
		if (!browserFrame) {
			return [];
		}

		const options: ICookieStoreGetOptions =
			typeof nameOrOptions === 'string' ? { name: nameOrOptions } : nameOrOptions || {};

		let targetURL: URL;
		if (options.url) {
			targetURL = new URL(options.url, this.#window.location.href);
			// In a document context, only the current URL is valid
			if (targetURL.origin !== this.#window.location.origin) {
				throw new DOMException(
					`CookieStore.getAll(): URL must match the document origin.`,
					DOMExceptionNameEnum.securityError
				);
			}
		} else {
			targetURL = <URL>(<unknown>this.#window.location);
		}

		const internalCookies = browserFrame.page.context.cookieContainer.getCookies(targetURL, true);
		const result: ICookieStoreItem[] = [];

		for (const cookie of internalCookies) {
			if (options.name && cookie.key !== options.name) {
				continue;
			}

			result.push(this.#convertToStoreItem(cookie));
		}

		return result;
	}

	/**
	 * Sets a cookie.
	 *
	 * @param nameOrOptions Name or options.
	 * @param [value] Value.
	 * @returns Promise.
	 */
	public async set(nameOrOptions: string | ICookieStoreSetOptions, value?: string): Promise<void> {
		const browserFrame = new WindowBrowserContext(this.#window).getBrowserFrame();
		if (!browserFrame) {
			return;
		}

		let options: ICookieStoreSetOptions;
		if (typeof nameOrOptions === 'string') {
			if (value === undefined) {
				throw new TypeError(
					`Failed to execute 'set' on 'CookieStore': Value is required when name is provided as a string.`
				);
			}
			options = { name: nameOrOptions, value };
		} else {
			options = nameOrOptions;
		}

		if (!options.name) {
			throw new TypeError(
				`Failed to execute 'set' on 'CookieStore': Required member name is undefined.`
			);
		}

		const originURL = <URL>(<unknown>this.#window.location);

		// Convert expires to Date if it's a number (Unix timestamp in milliseconds)
		let expires: Date | null = null;
		if (options.expires !== undefined && options.expires !== null) {
			expires = options.expires instanceof Date ? options.expires : new Date(options.expires);
		}

		// Convert sameSite string to enum
		let sameSite = CookieSameSiteEnum.lax;
		if (options.sameSite) {
			switch (options.sameSite.toLowerCase()) {
				case 'strict':
					sameSite = CookieSameSiteEnum.strict;
					break;
				case 'lax':
					sameSite = CookieSameSiteEnum.lax;
					break;
				case 'none':
					sameSite = CookieSameSiteEnum.none;
					break;
			}
		}

		const cookie: ICookie = {
			key: options.name,
			value: options.value,
			originURL,
			domain: options.domain || '',
			path: options.path || '/',
			expires,
			httpOnly: false, // CookieStore API cannot set httpOnly cookies
			secure: sameSite === CookieSameSiteEnum.none ? true : originURL.protocol === 'https:',
			sameSite
		};

		browserFrame.page.context.cookieContainer.addCookies([cookie]);
	}

	/**
	 * Deletes a cookie.
	 *
	 * @param nameOrOptions Name or options.
	 * @returns Promise.
	 */
	public async delete(nameOrOptions: string | ICookieStoreSetOptions): Promise<void> {
		const options: ICookieStoreSetOptions =
			typeof nameOrOptions === 'string'
				? { name: nameOrOptions, value: '' }
				: { ...nameOrOptions, value: '' };

		// Set the cookie with an expired date to delete it
		await this.set({
			...options,
			expires: new Date(0)
		});
	}

	/**
	 * Converts an internal cookie to a CookieStore item.
	 *
	 * @param cookie Internal cookie.
	 * @returns CookieStore item.
	 */
	#convertToStoreItem(cookie: ICookie): ICookieStoreItem {
		let sameSite: 'strict' | 'lax' | 'none' = 'lax';
		switch (cookie.sameSite) {
			case CookieSameSiteEnum.strict:
				sameSite = 'strict';
				break;
			case CookieSameSiteEnum.lax:
				sameSite = 'lax';
				break;
			case CookieSameSiteEnum.none:
				sameSite = 'none';
				break;
		}

		return {
			name: cookie.key,
			value: cookie.value ?? '',
			domain: cookie.domain,
			path: cookie.path,
			expires: cookie.expires ? cookie.expires.getTime() : null,
			secure: cookie.secure,
			sameSite,
			partitioned: false // Not supported yet
		};
	}
}
