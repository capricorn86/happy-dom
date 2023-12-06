import ICachedResponse from './ICachedResponse.js';
import IRequest from './IRequest.js';
import IResponse from './IResponse.js';

/**
 * Fetch response cache.
 */
export default interface IFetchCache {
	/**
	 * Returns cached response.
	 *
	 * @param request Request.
	 * @returns Cached response.
	 */
	get(request: IRequest): ICachedResponse | null;

	/**
	 * Adds a cache entity.
	 *
	 * @param request Request.
	 * @param response Response.
	 */
	add(request: IRequest, response: IResponse): void;

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
