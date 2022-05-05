import RelativeURL from '../location/RelativeURL';
import DOMException from '../exception/DOMException';
import IDocument from '../nodes/document/IDocument';

/**
 * Helper class for performing fetch of resources.
 */
export default class ResourceFetchHandler {
	/**
	 * Returns resource data asynchonously.
	 *
	 * @param document Document.
	 * @param url URL.
	 * @returns Response.
	 */
	public static async fetch(document: IDocument, url: string): Promise<string> {
		const response = await document.defaultView.fetch(url);
		if (!response.ok) {
			throw new DOMException(
				`Failed to perform request to "${url}". Status code: ${response.status}`
			);
		}
		return await response.text();
	}

	/**
	 * Returns resource data synchonously.
	 *
	 * @param document Document.
	 * @param url URL.
	 * @returns Response.
	 */
	public static fetchSync(document: IDocument, url: string): string {
		// We want to only load SyncRequest when it is needed to improve performance and not have direct dependencies to server side packages.
		const absoluteURL = RelativeURL.getAbsoluteURL(document.defaultView.location, url);
		const syncRequest = require('sync-request');
		const response = syncRequest('GET', absoluteURL);

		if (response.isError()) {
			throw new DOMException(
				`Failed to perform request to "${absoluteURL}". Status code: ${response.statusCode}`
			);
		}

		return response.getBody().toString();
	}
}
