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
		// If the URL starts with '//' then it is a Protocol relative URL.
		// Reference: https://url.spec.whatwg.org/#protocol-relative-urls.
		// E.g. '//example.com/' needs to be converted to 'http://example.com/'.
		if (url.startsWith('//')) {
			return location.protocol + url;
		}
		// If the URL starts with '/' then it is a Path relative URL.
		// E.g. '/example.com/' needs to be converted to 'http://example.com/'.
		if (url.startsWith('/')) {
			return location.origin + url;
		}
		// If the URL starts with 'https://' or 'http://' then it is a Absolute URL.
		// E.g. 'https://example.com' needs to be converted to 'https://example.com/'.
		// E.g. 'http://example.com' needs to be converted to 'http://example.com/'.
		if (!url.startsWith('https://') && !url.startsWith('http://')) {
			let pathname = location.pathname;
			if (pathname.endsWith('/')) {
				pathname = pathname.slice(0, -1);
			}

			return (
				location.origin +
				(/(.*)\/.*/.test(pathname) ? pathname.match(/(.*)\/.*/)[1] : '') +
				'/' +
				url
			);
		}

		return url;
	}
}
