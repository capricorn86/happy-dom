import ICachedResponse from './ICachedResponse.js';
import ICachableRequest from './ICachableRequest.js';
import ICachableResponse from './ICachableResponse.js';

/**
 * Fetch response cache.
 */
export default interface IResponseCache {
	/**
	 * Returns cached response.
	 *
	 * @param request Request.
	 * @returns Cached response.
	 */
	get(request: ICachableRequest): ICachedResponse | null;

	/**
	 * Adds a cache entity.
	 *
	 * @param request Request.
	 * @param response Response.
	 */
	add(request: ICachableRequest, response: ICachableResponse): ICachedResponse;

	/**
	 * Removes expired responses to clear up space.
	 *
	 * This method will not remove stale cache entities that can be revalidated.
	 *
	 * @param [url] URL.
	 */
	clearExpired(url?: string): void;

	/**
	 * Clears the cache.
	 *
	 * @param [options] Options.
	 * @param [options.url] URL.
	 * @param [options.toTime] Time in MS.
	 */
	clear(options?: { url?: string; toTime?: number }): void;
}
