import Stream from 'stream';
import CachedResponseStateEnum from '../enums/CachedResponseStateEnum.js';

export default interface ICachedResponse {
	response: {
		status: number;
		statusText: string;
		headers: {
			[name: string]: string;
		};
		body: Stream.Readable;
	};
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
