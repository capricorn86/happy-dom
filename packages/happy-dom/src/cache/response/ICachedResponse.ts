import CachedResponseStateEnum from './CachedResponseStateEnum.js';

export default interface ICachedResponse {
	/** Response. */
	response: {
		status: number;
		statusText: string;
		url: string | null;
		headers: {
			[name: string]: string;
		};
		// We need to wait for the body to be populated if set to "true".
		waitingForBody: boolean;
		body: Buffer | null;
	} | null;
	/** Request headers */
	requestHeaders: {
		[name: string]: string;
	};
	/** Request method */
	requestMethod: string | null;
	/** Cache update time in milliseconds. */
	cacheUpdateTime: number | null;
	/** Last modified time in milliseconds. */
	lastModified: number | null;
	/** Vary headers. */
	vary: { [header: string]: string };
	/** Expire time in milliseconds. */
	expires: number | null;
	/** ETag */
	etag: string | null;
	/** Must revalidate using "If-Modified-Since" request when expired */
	mustRevalidate: boolean;
	/** Stale while revalidate using "If-Modified-Since" request when expired */
	staleWhileRevalidate: boolean;
	/** Used when "mustRevalidate" or "staleWhileRevalidate" is true. */
	state: CachedResponseStateEnum;
}
