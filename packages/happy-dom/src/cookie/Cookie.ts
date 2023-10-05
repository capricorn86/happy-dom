import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import CookieSameSiteEnum from './CookieSameSiteEnum.js';
import URL from '../url/URL.js';

/**
 * Cookie.
 */
export default class Cookie {
	// Required
	public key = '';
	public value: string | null = null;
	public originURL: URL;

	// Optional
	public domain = '';
	public path = '';
	public expires: Date | null = null;
	public httpOnly = false;
	public secure = false;
	public sameSite: CookieSameSiteEnum = CookieSameSiteEnum.lax;

	/**
	 * Constructor.
	 *
	 * @param originURL Origin URL.
	 * @param cookie Cookie.
	 */
	constructor(originURL, cookie: string) {
		const parts = cookie.split(';');
		const [key, value] = parts.shift().split('=');

		this.originURL = originURL;
		this.key = key.trim();
		this.value = value !== undefined ? value : null;

		if (!this.key) {
			throw new DOMException(`Invalid cookie: ${cookie}.`, DOMExceptionNameEnum.syntaxError);
		}

		for (const part of parts) {
			const keyAndValue = part.split('=');
			const key = keyAndValue[0].trim().toLowerCase();
			const value = keyAndValue[1];

			switch (key) {
				case 'expires':
					this.expires = new Date(value);
					break;
				case 'max-age':
					this.expires = new Date(parseInt(value, 10) * 1000 + Date.now());
					break;
				case 'domain':
					this.domain = value;
					break;
				case 'path':
					this.path = value.startsWith('/') ? value : `/${value}`;
					break;
				case 'httponly':
					this.httpOnly = true;
					break;
				case 'secure':
					this.secure = true;
					break;
				case 'samesite':
					switch (value.toLowerCase()) {
						case 'strict':
							this.sameSite = CookieSameSiteEnum.strict;
							break;
						case 'lax':
							this.sameSite = CookieSameSiteEnum.lax;
							break;
						case 'none':
							this.sameSite = CookieSameSiteEnum.none;
					}
					break;
			}
		}
	}

	/**
	 * Returns cookie string.
	 *
	 * @returns Cookie string.
	 */
	public toString(): string {
		if (this.value !== null) {
			return `${this.key}=${this.value}`;
		}

		return this.key;
	}

	/**
	 * Returns "true" if expired.
	 *
	 * @returns "true" if expired.
	 */
	public isExpired(): boolean {
		// If the expries/maxage is set, then determine whether it is expired.
		if (this.expires && this.expires.getTime() < Date.now()) {
			return true;
		}
		// If the expries/maxage is not set, it's a session-level cookie that will expire when the browser is closed.
		// (it's never expired in happy-dom)
		return false;
	}

	/**
	 * Validate cookie.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#cookie_prefixes
	 * @returns "true" if valid.
	 */
	public validate(): boolean {
		const lowerKey = this.key.toLowerCase();
		if (lowerKey.startsWith('__secure-') && !this.secure) {
			return false;
		}
		if (lowerKey.startsWith('__host-') && (!this.secure || this.path !== '/' || this.domain)) {
			return false;
		}
		return true;
	}
}
