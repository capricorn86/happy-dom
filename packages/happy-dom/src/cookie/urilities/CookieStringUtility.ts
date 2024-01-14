import CookieSameSiteEnum from '../enums/CookieSameSiteEnum.js';
import URL from '../../url/URL.js';
import ICookie from '../types/ICookie.js';

/**
 * Cookie string.
 */
export default class CookieStringUtility {
	/**
	 * Returns cookie.
	 *
	 * @param originURL Origin URL.
	 * @param cookieString Cookie string.
	 * @returns Cookie.
	 */
	public static stringToCookie(originURL: URL, cookieString: string): ICookie | null {
		const parts = cookieString.split(';');
		const [key, value] = parts.shift().split('=');

		const cookie: ICookie = {
			// Required
			key: key.trim(),
			value: value ?? null,
			originURL,

			// Optional
			domain: '',
			path: '',
			expires: null,
			httpOnly: false,
			secure: false,
			sameSite: CookieSameSiteEnum.lax
		};

		// Invalid if key is empty.
		if (!cookie.key) {
			return null;
		}

		for (const part of parts) {
			const keyAndValue = part.split('=');
			const key = keyAndValue[0].trim().toLowerCase();
			const value = keyAndValue[1];

			switch (key) {
				case 'expires':
					cookie.expires = new Date(value);
					break;
				case 'max-age':
					cookie.expires = new Date(parseInt(value, 10) * 1000 + Date.now());
					break;
				case 'domain':
					cookie.domain = value;
					break;
				case 'path':
					cookie.path = value.startsWith('/') ? value : `/${value}`;
					break;
				case 'httponly':
					cookie.httpOnly = true;
					break;
				case 'secure':
					cookie.secure = true;
					break;
				case 'samesite':
					switch (value.toLowerCase()) {
						case 'strict':
							cookie.sameSite = CookieSameSiteEnum.strict;
							break;
						case 'lax':
							cookie.sameSite = CookieSameSiteEnum.lax;
							break;
						case 'none':
							cookie.sameSite = CookieSameSiteEnum.none;
					}
					break;
			}
		}

		const lowerKey = cookie.key.toLowerCase();

		// Invalid if __secure- prefix is used and cookie is not secure.
		if (lowerKey.startsWith('__secure-') && !cookie.secure) {
			return null;
		}

		// Invalid if __host- prefix is used and cookie is not secure, not on root path or has a domain.
		if (
			lowerKey.startsWith('__host-') &&
			(!cookie.secure || cookie.path !== '/' || cookie.domain)
		) {
			return null;
		}

		return cookie;
	}

	/**
	 * Returns cookie string with key and value.
	 *
	 * @param cookies Cookies.
	 * @returns Cookie string.
	 */
	public static cookiesToString(cookies: ICookie[]): string {
		const cookieString: string[] = [];

		for (const cookie of cookies) {
			if (cookie.value !== null) {
				cookieString.push(`${cookie.key}=${cookie.value}`);
			} else {
				cookieString.push(cookie.key);
			}
		}

		return cookieString.join('; ');
	}
}
