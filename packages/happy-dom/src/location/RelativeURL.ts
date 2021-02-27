import Location from './Location';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class RelativeURL {
	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param location Location.
	 * @param url URL.
	 */
	public static getAbsoluteURL(location: Location, url: string): string {
		if (url.startsWith('/')) {
			return location.origin + url;
		}

		if (!url.startsWith('https://') && !url.startsWith('http://')) {
			let pathname = location.pathname;
			if (pathname.endsWith('/')) {
				pathname = pathname.slice(0, -1);
			}
			return location.origin + pathname + '/' + url;
		}

		return url;
	}
}
