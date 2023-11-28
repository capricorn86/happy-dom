import DOMException from '../exception/DOMException.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import URL from '../url/URL.js';

/**
 * Helper class for performing fetch of resources.
 */
export default class ResourceFetch {
	/**
	 * Returns resource data asynchronously.
	 *
	 * @param window Window.
	 * @param url URL.
	 * @returns Response.
	 */
	public static async fetch(window: IBrowserWindow, url: string): Promise<string> {
		const response = await window.fetch(url);
		if (!response.ok) {
			throw new DOMException(
				`Failed to perform request to "${url}". Status code: ${response.status}`
			);
		}
		return await response.text();
	}

	/**
	 * Returns resource data synchronously.
	 *
	 * @param window Window.
	 * @param url URL.
	 * @returns Response.
	 */
	public static fetchSync(window: IBrowserWindow, url: string): string {
		// We want to only load SyncRequest when it is needed to improve performance and not have direct dependencies to server side packages.
		const absoluteURL = new URL(url, window.location).href;

		const xhr = new window.XMLHttpRequest();
		xhr.open('GET', absoluteURL, false);
		xhr.send();

		if (xhr.status !== 200) {
			throw new DOMException(
				`Failed to perform request to "${absoluteURL}". Status code: ${xhr.status}`
			);
		}

		return xhr.responseText;
	}
}
