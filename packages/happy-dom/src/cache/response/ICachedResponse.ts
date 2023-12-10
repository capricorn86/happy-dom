import CachedResponseStateEnum from './CachedResponseStateEnum.js';

export default interface ICachedResponse {
	response: {
		status: number;
		statusText: string;
		headers: {
			[name: string]: string;
		};
		// We need to wait for the body to be populated if set to "true".
		waitingForBody: boolean;
		body: Buffer | null;
	} | null;
	method: string | null;
	url: string | null;
	cacheUpdateTime: number | null;
	lastModified: number | null;
	vary: { [header: string]: string };
	expires: number | null;
	etag: string | null;
	mustRevalidate: boolean;
	staleWhileRevalidate: boolean;

	// Used when "mustRevalidate" or "staleWhileRevalidate" is true.
	state: CachedResponseStateEnum;
}
