import type IPreflightResponseCache from './IPreflightResponseCache.js';
import type ICacheablePreflightRequest from './ICacheablePreflightRequest.js';
import type ICacheablePreflightResponse from './ICacheablePreflightResponse.js';
import type ICachedPreflightEntry from './ICachedPreflightEntry.js';

// According to the specification, a max age of 5 seconds should be used when the "Access-Control-Max-Age" header is missing or invalid.
const DEFAULT_MAX_AGE_IN_SECONDS = 5;

/**
 * CORS-preflight response cache.
 *
 * @see https://fetch.spec.whatwg.org/#cors-preflight-cache
 */
export default class PreflightResponseCache implements IPreflightResponseCache {
	#entries: Map<string, ICachedPreflightEntry[]> = new Map();

	/**
	 * Returns whether the cache contains entries that allow the preflight request to be skipped. This is the case when there is an entry matching the request method and an entry matching each of the request headers.
	 *
	 * @see https://fetch.spec.whatwg.org/#cors-preflight-fetch
	 * @param request Request.
	 * @returns "true" if the preflight request can be skipped.
	 */
	public matches(request: ICacheablePreflightRequest): boolean {
		const entries = this.#getMatchingEntries(request);

		if (!entries.some((entry) => entry.method === request.method || entry.method === '*')) {
			return false;
		}

		for (const [name] of request.headers) {
			const headerName = name.toLowerCase();
			const hasMatchingEntry = entries.some(
				(entry) =>
					entry.headerName === headerName ||
					// The wildcard doesn't cover the "Authorization" header, which needs to be allowed explicitly.
					(entry.headerName === '*' && headerName !== 'authorization')
			);
			if (!hasMatchingEntry) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Adds cache entries based on a successful preflight response.
	 *
	 * @param request Request.
	 * @param response Preflight response.
	 */
	public add(request: ICacheablePreflightRequest, response: ICacheablePreflightResponse): void {
		if (response.status < 200 || response.status >= 300) {
			return;
		}

		const maxAgeHeader = response.headers.get('Access-Control-Max-Age');
		const maxAge =
			maxAgeHeader !== null && !isNaN(parseInt(maxAgeHeader))
				? parseInt(maxAgeHeader)
				: DEFAULT_MAX_AGE_IN_SECONDS;

		if (maxAge <= 0) {
			return;
		}

		const expires = Date.now() + maxAge * 1000;
		const credentials = request.credentials === 'include';

		// When the response doesn't specify which methods are allowed, only the method of the request that triggered the preflight is cached.
		const methods = this.#getHeaderValues(response.headers, 'Access-Control-Allow-Methods')?.map(
			(method) => (method === '*' ? method : method.toUpperCase())
		) ?? [request.method];
		const headerNames =
			this.#getHeaderValues(response.headers, 'Access-Control-Allow-Headers')?.map((headerName) =>
				headerName.toLowerCase()
			) ?? [];

		const matchingEntries = this.#getMatchingEntries(request);
		const key = this.#getKey(request);
		let entries = this.#entries.get(key);

		if (!entries) {
			entries = [];
			this.#entries.set(key, entries);
		}

		for (const method of methods) {
			const matchingEntry = matchingEntries.find(
				(entry) => entry.method === method || entry.method === '*'
			);
			if (matchingEntry) {
				matchingEntry.expires = expires;
			} else {
				entries.push({ expires, credentials, method, headerName: null });
			}
		}

		for (const headerName of headerNames) {
			const matchingEntry = matchingEntries.find(
				(entry) => entry.headerName === headerName || entry.headerName === '*'
			);
			if (matchingEntry) {
				matchingEntry.expires = expires;
			} else {
				entries.push({ expires, credentials, method: null, headerName });
			}
		}
	}

	/**
	 * Clears the cache.
	 */
	public clear(): void {
		this.#entries.clear();
	}

	/**
	 * Returns the entries matching the origin, URL and credentials mode of the request. Expired entries are removed.
	 *
	 * @param request Request.
	 * @returns Entries.
	 */
	#getMatchingEntries(request: ICacheablePreflightRequest): ICachedPreflightEntry[] {
		const key = this.#getKey(request);
		const entries = this.#entries.get(key);

		if (!entries) {
			return [];
		}

		const now = Date.now();
		const validEntries = entries.filter((entry) => entry.expires > now);

		if (!validEntries.length) {
			this.#entries.delete(key);
		} else if (validEntries.length !== entries.length) {
			this.#entries.set(key, validEntries);
		}

		// Entries created from a request without credentials don't apply to requests with credentials.
		return validEntries.filter((entry) => entry.credentials || request.credentials !== 'include');
	}

	/**
	 * Returns the cache key for a request.
	 *
	 * @param request Request.
	 * @returns Key.
	 */
	#getKey(request: ICacheablePreflightRequest): string {
		return `${request.origin}\n${request.url}`;
	}

	/**
	 * Returns the values of a comma separated header, or null when the header isn't set.
	 *
	 * @param headers Headers.
	 * @param name Header name.
	 * @returns Header values.
	 */
	#getHeaderValues(headers: ICacheablePreflightResponse['headers'], name: string): string[] | null {
		const value = headers.get(name);

		if (value === null) {
			return null;
		}

		return value
			.split(',')
			.map((item) => item.trim())
			.filter((item) => !!item);
	}
}
