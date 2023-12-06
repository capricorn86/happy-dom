import IFetchCache from '../types/IFetchCache.js';
import ICachedResponse from '../types/ICachedResponse.js';
import CachedResponseStateEnum from '../enums/CachedResponseStateEnum.js';
import IRequest from '../types/IRequest.js';
import IResponse from '../types/IResponse.js';
import FetchBodyUtility from '../utilities/FetchBodyUtility.js';

const DEFAULT_CACHED_RESPONSE: ICachedResponse = {
	response: null,
	vary: {},
	expires: null,
	etag: null,
	cacheUpdateTime: null,
	lastModified: null,
	mustRevalidate: false,
	staleWhileRevalidate: false,
	state: CachedResponseStateEnum.fresh
};

/**
 * Fetch response cache.
 */
export default class FetchCache implements IFetchCache {
	#entries: { [url: string]: ICachedResponse[] } = {};

	/**
	 * Returns cached response.
	 *
	 * @param request Request.
	 * @returns Cached response.
	 */
	public get(request: IRequest): ICachedResponse | null {
		if (request.headers.get('Cache-Control')?.includes('no-cache')) {
			return null;
		}

		const url = request.url;
		if (this.#entries[url]) {
			for (let i = 0, max = this.#entries[url].length; i < max; i++) {
				const entry = this.#entries[url][i];
				let isMatch = true;
				for (const header of Object.keys(entry.vary)) {
					if (entry.vary[header] !== request.headers.get(header)) {
						isMatch = false;
						break;
					}
				}
				if (isMatch) {
					if (entry.expires && entry.expires < Date.now()) {
						if (entry.mustRevalidate || entry.staleWhileRevalidate) {
							entry.state = CachedResponseStateEnum.stale;
						} else {
							this.#entries[url].splice(i, 1);
							return null;
						}
					}
					return entry;
				}
			}
		}
		return null;
	}

	/**
	 * Adds a cache entity.
	 *
	 * @param request Request.
	 * @param response Response.
	 */
	public add(request: IRequest, response: IResponse): void {
		const url = request.url;
		let cachedResponse: ICachedResponse | null = null;

		// Remove existing entry with the same vary headers.
		if (this.#entries[url]) {
			for (let i = 0, max = this.#entries[url].length; i < max; i++) {
				const entry = this.#entries[url][i];
				let isMatch = true;
				for (const header of Object.keys(entry.vary)) {
					if (entry.vary[header] !== request.headers.get(header)) {
						isMatch = false;
						break;
					}
				}
				if (isMatch) {
					cachedResponse = entry;
					if (response.status !== 304) {
						Object.assign(entry, DEFAULT_CACHED_RESPONSE);
					}
					break;
				}
			}
		}

		if (!cachedResponse) {
			cachedResponse = { ...DEFAULT_CACHED_RESPONSE };
			this.#entries[url] = this.#entries[url] || [];
			this.#entries[url].push(cachedResponse);
		}

		const cacheControl = response.headers.get('Cache-Control');
		const age = response.headers.get('Age');
		const etag = response.headers.get('ETag');
		const vary = response.headers.get('Vary');
		const lastModified = response.headers.get('Last-Modified');

		cachedResponse.cacheUpdateTime = Date.now();

		if (cacheControl) {
			for (const part of cacheControl.split(',')) {
				const [key, value] = part.trim().split('=');
				switch (key) {
					case 'max-age':
						cachedResponse.expires = Date.now() + parseInt(value) - (age ? parseInt(age) : 0);
						break;
					case 'no-cache':
					case 'no-store':
						return;
					case 'must-revalidate':
						cachedResponse.mustRevalidate = !!cachedResponse.lastModified;
						break;
					case 'stale-while-revalidate':
						cachedResponse.staleWhileRevalidate = !!cachedResponse.lastModified;
						break;
				}
			}
		}

		if (lastModified) {
			cachedResponse.lastModified = Date.parse(lastModified);
		}

		if (vary) {
			for (const header of vary.split(',')) {
				const name = header.trim();
				const value = request.headers.get(name);
				if (value) {
					cachedResponse.vary[name] = value;
				}
			}
		}

		if (!cachedResponse.expires) {
			const expires = response.headers.get('Expires');
			if (expires) {
				cachedResponse.expires = Date.parse(expires);
			}
		}

		if (etag) {
			cachedResponse.etag = etag;
		}

		if (
			response.status !== 304 &&
			((cachedResponse.etag && !cachedResponse.expires) ||
				(cachedResponse.expires && cachedResponse.expires < Date.now()))
		) {
			const headers: { [name: string]: string } = {};
			for (const header of response.headers) {
				headers[header[0]] = header[1];
			}
			cachedResponse.response = {
				status: response.status,
				statusText: response.statusText,
				headers,
				body: FetchBodyUtility.getBodyStream(response.body).stream
			};
		}
	}

	/**
	 * Removes expired responses to clear up space.
	 *
	 * This method will not remove stale cache entities that can be revalidated.
	 *
	 * @param [url] URL.
	 */
	public clearExpired(url?: string): void {
		for (const key of url ? [url] : Object.keys(this.#entries)) {
			for (const cachedResponse of this.#entries[key]) {
				if (
					!cachedResponse.mustRevalidate &&
					!cachedResponse.staleWhileRevalidate &&
					cachedResponse.expires &&
					cachedResponse.expires < Date.now()
				) {
					delete this.#entries[url];
				}
			}
		}
	}

	/**
	 * Clears the cache.
	 *
	 * @param [options] Options.
	 * @param [options.url] URL.
	 * @param [options.toTime] Removes all entries that are older than this time. Time in MS.
	 */
	public clear(options?: { url?: string; toTime?: number }): void {
		if (options) {
			if (options.toTime) {
				for (const key of options.url ? [options.url] : Object.keys(this.#entries)) {
					for (let i = 0, max = this.#entries[key].length; i < max; i++) {
						if (this.#entries[key][i].cacheUpdateTime < options.toTime) {
							this.#entries[key].splice(i, 1);
							i--;
							max--;
						}
					}
				}
			} else if (options.url) {
				delete this.#entries[options.url];
			}
		} else {
			this.#entries = {};
		}
	}
}
