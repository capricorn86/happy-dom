import ICachedPreflightResponse from './ICachedPreflightResponse.js';
import ICacheablePreflightRequest from './ICacheablePreflightRequest.js';
import ICacheablePreflightResponse from './ICacheablePreflightResponse.js';

/**
 * Fetch response cache.
 */
export default interface IPreflightResponseCache {
	/**
	 * Returns cached response.
	 *
	 * @param request Request.
	 * @returns Cached response.
	 */
	get(request: ICacheablePreflightRequest): ICachedPreflightResponse | null;

	/**
	 * Adds a cached response.
	 *
	 * @param request Request.
	 * @param response Response.
	 * @returns Cached response.
	 */
	add(
		request: ICacheablePreflightRequest,
		response: ICacheablePreflightResponse
	): ICachedPreflightResponse | null;

	/**
	 * Clears the cache.
	 */
	clear(): void;
}
