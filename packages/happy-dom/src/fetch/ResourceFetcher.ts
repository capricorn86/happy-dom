import RelativeURL from '../location/RelativeURL';
import Window from '../window/Window';
import DOMException from '../exception/DOMException';

/**
 * Helper class for performing an asynchonous or synchrounous request to a resource.
 */
export default class ResourceFetcher {
	/**
	 * Returns resource data asynchonously.
	 *
	 * @param options Options.
	 * @param options.window Location.
	 * @param options.url URL.
	 * @returns Response.
	 */
	public static async fetch(options: { window: Window; url: string }): Promise<string> {
		const response = await options.window.fetch(options.url);
		if (!response.ok) {
			throw new DOMException(
				`Failed to perform request to "${options.url}". Status code: ${response.status}`
			);
		}
		return await response.text();
	}

	/**
	 * Returns resource data synchonously.
	 *
	 * @param options Options.
	 * @param options.window Location.
	 * @param options.url URL.
	 * @returns Response.
	 */
	public static fetchSync(options: { window: Window; url: string }): string {
		const url = RelativeURL.getAbsoluteURL(options.window.location, options.url);
		let request = null;

		try {
			request = require('sync-request');
		} catch (error) {
			throw new DOMException('Failed to load script. "sync-request" could not be loaded.');
		}

		const response = request('GET', url);

		if (response.isError()) {
			throw new DOMException(
				`Failed to perform request to "${url}". Status code: ${response.statusCode}`
			);
		}

		return response.getBody();
	}
}
