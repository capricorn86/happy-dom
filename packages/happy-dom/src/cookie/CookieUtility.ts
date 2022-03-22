import Location from '../location/Location';

/**
 * Cookie utility.
 */
export default class CookieUtility {
	/**
	 * Returns a cookie string.
	 *
	 * @param location Location.
	 * @param cookies Current cookie string.
	 * @param newCookie New cookie string.
	 * @returns Generated cookie string.
	 */
	public static getCookieString(location: Location, cookies: string, newCookie): string {
		const newCookieParts = newCookie.split(';');
		const [newCookieName, newCookieValue] = newCookieParts.shift().trim().split('=');
		let isExpired = false;

		for (const part of newCookieParts) {
			const [key, value] = part.trim().split('=');

			switch (key.toLowerCase()) {
				case 'expires':
					const expires = new Date(value).getTime();
					const now = Date.now();
					if (expires < now) {
						isExpired = true;
						break;
					}
					break;
				case 'domain':
					const hostnameParts = location.hostname.split('.');
					if (hostnameParts.length > 2) {
						hostnameParts.shift();
					}
					const currentDomain = hostnameParts.join('.');
					if (!value.endsWith(currentDomain)) {
						return cookies;
					}
					break;
				case 'path':
					const pathname = location.pathname;
					const currentPath = pathname.startsWith('/') ? pathname.replace('/', '') : pathname;
					const path = value.startsWith('/') ? value.replace('/', '') : value;
					if (path && !currentPath.startsWith(path)) {
						return cookies;
					}
					break;
				case 'max-age':
					if (parseInt(value) <= 0) {
						return cookies;
					}
					break;
			}
		}

		const newCookies = [];

		if (cookies) {
			for (const cookie of cookies.split(';')) {
				const [name, value] = cookie.trim().split('=');
				if (
					(name && name !== newCookieName) ||
					(!value && newCookieValue) ||
					(value && !newCookieValue)
				) {
					if (value) {
						newCookies.push(`${name}=${value}`);
					} else {
						newCookies.push(name);
					}
				}
			}
		}

		if (!isExpired) {
			if (newCookieValue) {
				newCookies.push(`${newCookieName}=${newCookieValue}`);
			} else {
				newCookies.push(newCookieName);
			}
		}

		return newCookies.join('; ');
	}
}
