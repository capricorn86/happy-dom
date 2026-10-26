import type ICacheablePreflightRequest from './ICacheablePreflightRequest.js';
import type ICacheablePreflightResponse from './ICacheablePreflightResponse.js';

/**
 * CORS-preflight response cache.
 */
export default interface IPreflightResponseCache {
	/**
	 * Returns whether the cache contains entries that allow the preflight request to be skipped.
	 *
	 * @param request Request.
	 * @returns "true" if the preflight request can be skipped.
	 */
	matches(request: ICacheablePreflightRequest): boolean;

	/**
	 * Adds cache entries based on a successful preflight response.
	 *
	 * @param request Request.
	 * @param response Preflight response.
	 */
	add(request: ICacheablePreflightRequest, response: ICacheablePreflightResponse): void;

	/**
	 * Clears the cache.
	 */
	clear(): void;
}
