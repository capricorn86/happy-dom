import IResponseCache from './IResponseCache.js';
import ICachedResponse from './ICachedResponse.js';
import CachedResponseStateEnum from './CachedResponseStateEnum.js';
import ICachableRequest from './ICachableRequest.js';
import ICachableResponse from './ICachableResponse.js';
import Headers from '../../fetch/Headers.js';

const DEFAULT_CACHED_RESPONSE: ICachedResponse = {
	response: null,
	requestMethod: null,
	requestHeaders: {},
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
export default class ResponseCache implements IResponseCache {
	#entries: { [url: string]: ICachedResponse[] } = {};

	/**
	 * Returns cached response.
	 *
	 * @param request Request.
	 * @returns Cached response.
	 */
	public get(request: ICachableRequest): ICachedResponse | null {
		if (request.headers.get('Cache-Control')?.includes('no-cache')) {
			return null;
		}

		const url = request.url;
		if (this.#entries[url]) {
			for (let i = 0, max = this.#entries[url].length; i < max; i++) {
				const entry = this.#entries[url][i];
				let isMatch = entry.requestMethod === request.method;
				if (isMatch) {
					for (const header of Object.keys(entry.vary)) {
						if (entry.vary[header] !== request.headers.get(header)) {
							isMatch = false;
							break;
						}
					}
				}
				if (isMatch) {
					if (entry.expires && entry.expires < Date.now()) {
						if (entry.lastModified) {
							entry.state = CachedResponseStateEnum.stale;
						} else {
							this.#entries[url].splice(i, 1);
							return null;
						}
					}
					// We need to wait for the body to be consumed and then populated before it can be used.
					if (entry.response?.waitingForBody) {
						return null;
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
	public add(request: ICachableRequest, response: ICachableResponse): ICachedResponse {
		const url = request.url;
		let cachedResponse: ICachedResponse | null = null;

		// Remove existing entry with the same vary headers.
		if (this.#entries[url]) {
			for (let i = 0, max = this.#entries[url].length; i < max; i++) {
				const entry = this.#entries[url][i];
				let isMatch = entry.requestMethod === request.method;
				if (isMatch) {
					for (const header of Object.keys(entry.vary)) {
						if (entry.vary[header] !== request.headers.get(header)) {
							isMatch = false;
							break;
						}
					}
				}
				if (isMatch) {
					cachedResponse = entry;
					if (response.status !== 304) {
						Object.assign(entry, DEFAULT_CACHED_RESPONSE, {
							requestHeaders: {},
							vary: {}
						});
					}
					break;
				}
			}
		}

		if (!cachedResponse) {
			cachedResponse = { ...DEFAULT_CACHED_RESPONSE, requestHeaders: {}, vary: {} };
			this.#entries[url] = this.#entries[url] || [];
			this.#entries[url].push(cachedResponse);
		}

		const cacheControl = response.headers.get('Cache-Control');
		const age = response.headers.get('Age');
		const etag = response.headers.get('ETag');
		const vary = response.headers.get('Vary');
		const lastModified = response.headers.get('Last-Modified');

		cachedResponse.requestMethod = request.method;
		cachedResponse.cacheUpdateTime = Date.now();

		for (const [name, value] of request.headers) {
			cachedResponse.requestHeaders[name] = value;
		}

		if (cacheControl) {
			for (const part of cacheControl.split(',')) {
				const [key, value] = part.trim().split('=');
				switch (key) {
					case 'max-age':
						cachedResponse.expires =
							Date.now() + parseInt(value) / 1000 - (age ? parseInt(age) / 1000 : 0);
						break;
					case 'no-cache':
					case 'no-store':
						return;
					case 'must-revalidate':
						cachedResponse.mustRevalidate = true;
						break;
					case 'stale-while-revalidate':
						cachedResponse.staleWhileRevalidate = true;
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

		if (response.status === 304) {
			const updatedHeaders = new Headers(cachedResponse.response?.headers || {});
			if (cacheControl) {
				updatedHeaders.set('Cache-Control', cacheControl);
			}
			if (lastModified) {
				updatedHeaders.set('Last-Modified', lastModified);
			}
			if (vary) {
				updatedHeaders.set('Vary', vary);
			}
			if (etag) {
				updatedHeaders.set('ETag', etag);
			}
			const headers: { [name: string]: string } = {};
			for (const [name, value] of updatedHeaders) {
				headers[name] = value;
			}
			cachedResponse.response = {
				...cachedResponse.response,
				headers
			};
		} else {
			const headers: { [name: string]: string } = {};
			for (const [name, value] of response.headers) {
				headers[name] = value;
			}
			cachedResponse.response = {
				status: response.status,
				statusText: response.statusText,
				url: response.url,
				headers,
				// We need to wait for the body to be consumed and then populated (e.g. by using Response.text()).
				waitingForBody: response.waitingForBody,
				body: response.body ?? null
			};
		}

		if (!cachedResponse.etag && (!cachedResponse.expires || cachedResponse.expires < Date.now())) {
			const index = this.#entries[url].indexOf(cachedResponse);
			if (index !== -1) {
				this.#entries[url].splice(index, 1);
			}
			return null;
		}

		cachedResponse.state = CachedResponseStateEnum.fresh;

		return cachedResponse;
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
			for (let i = 0, max = this.#entries[key].length; i < max; i++) {
				const cachedResponse = this.#entries[key][i];
				if (
					!cachedResponse.lastModified &&
					cachedResponse.expires &&
					cachedResponse.expires < Date.now()
				) {
					this.#entries[key].splice(i, 1);
					i--;
					max--;
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
