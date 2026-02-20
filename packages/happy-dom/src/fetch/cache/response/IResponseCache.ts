import type ICachedResponse from './ICachedResponse.js';
import type ICacheableRequest from './ICacheableRequest.js';
import type ICacheableResponse from './ICacheableResponse.js';
import type IResponseCacheFileSystem from './IResponseCacheFileSystem.js';

/**
 * Fetch response cache.
 */
export default interface IResponseCache {
	fileSystem: IResponseCacheFileSystem;

	/**
	 * Returns cached response.
	 *
	 * @param request Request.
	 * @returns Cached response.
	 */
	get(request: ICacheableRequest): ICachedResponse | null;

	/**
	 * Adds a cached response.
	 *
	 * @param request Request.
	 * @param response Response.
	 * @returns Cached response.
	 */
	add(request: ICacheableRequest, response: ICacheableResponse): ICachedResponse | null;

	/**
	 * Clears the cache.
	 *
	 * @param [options] Options.
	 * @param [options.url] URL.
	 * @param [options.toTime] Time in MS.
	 */
	clear(options?: { url?: string; toTime?: number }): void;
}
