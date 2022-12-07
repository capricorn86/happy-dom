import Location from './Location';
import { URL } from 'url';

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
	public static getAbsoluteURL(location: Location, url: string): URL {
		return new URL(url, location.href);
	}
}
