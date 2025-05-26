import ICachedResponse from './ICachedResponse.js';
import ICachableRequest from './ICachableRequest.js';
import ICachableResponse from './ICachableResponse.js';

/**
 * Fetch response cache.
 */
export default interface IResponseCache {
	/**
	 * Cache entries where the key is the URL.
	 */
	readonly entries: Map<string, ICachedResponse[]>;

	/**
	 * Returns cached response.
	 *
	 * @param request Request.
	 * @returns Cached response.
	 */
	get(request: ICachableRequest): ICachedResponse | null;

	/**
	 * Adds a cached response.
	 *
	 * @param request Request.
	 * @param response Response.
	 * @returns Cached response.
	 */
	add(request: ICachableRequest, response: ICachableResponse): ICachedResponse | null;

	/**
	 * Clears the cache.
	 *
	 * @param [options] Options.
	 * @param [options.url] URL.
	 * @param [options.toTime] Time in MS.
	 */
	clear(options?: { url?: string; toTime?: number }): void;
}
