import PreflightResponseCache from '../../../../src/fetch/cache/preflight/PreflightResponseCache';
import type ICacheablePreflightRequest from '../../../../src/fetch/cache/preflight/ICacheablePreflightRequest';
import type ICacheablePreflightResponse from '../../../../src/fetch/cache/preflight/ICacheablePreflightResponse';
import Headers from '../../../../src/fetch/Headers';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';

const ORIGIN = 'http://localhost:8080';
const URL = 'http://other.origin.com/some/path';

describe('PreflightResponseCache', () => {
	let preflightResponseCache: PreflightResponseCache;
	let dateNow: number;

	beforeEach(() => {
		preflightResponseCache = new PreflightResponseCache();
		dateNow = Date.now();
		vi.spyOn(Date, 'now').mockImplementation(() => dateNow);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	function getRequest(
		properties?: Partial<ICacheablePreflightRequest>
	): ICacheablePreflightRequest {
		return {
			url: URL,
			method: 'POST',
			origin: ORIGIN,
			credentials: 'same-origin',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			...properties
		};
	}

	function getResponse(
		properties?: Partial<ICacheablePreflightResponse>
	): ICacheablePreflightResponse {
		return {
			status: 200,
			url: URL,
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Max-Age': '600'
			}),
			...properties
		};
	}

	describe('matches()', () => {
		it('Returns false when the cache is empty.', () => {
			expect(preflightResponseCache.matches(getRequest())).toBe(false);
		});

		it('Returns true for a request matching a cached preflight response.', () => {
			preflightResponseCache.add(getRequest(), getResponse());
			expect(preflightResponseCache.matches(getRequest())).toBe(true);
		});

		it('Returns false for a request with a different URL or origin.', () => {
			preflightResponseCache.add(getRequest(), getResponse());
			expect(
				preflightResponseCache.matches(getRequest({ url: 'http://other.origin.com/other/path' }))
			).toBe(false);
			expect(preflightResponseCache.matches(getRequest({ origin: 'http://localhost:3000' }))).toBe(
				false
			);
		});

		it("Returns false for a request with a method that isn't allowed.", () => {
			preflightResponseCache.add(getRequest(), getResponse());
			expect(preflightResponseCache.matches(getRequest({ method: 'DELETE' }))).toBe(false);
		});

		it('Returns true for any method when the allowed methods contain the wildcard "*".', () => {
			preflightResponseCache.add(
				getRequest(),
				getResponse({
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': '*',
						'Access-Control-Allow-Headers': 'Content-Type'
					})
				})
			);
			expect(preflightResponseCache.matches(getRequest({ method: 'DELETE' }))).toBe(true);
		});

		it("Caches the request method when the response doesn't specify allowed methods.", () => {
			preflightResponseCache.add(
				getRequest(),
				getResponse({
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Headers': 'Content-Type'
					})
				})
			);
			expect(preflightResponseCache.matches(getRequest())).toBe(true);
			expect(preflightResponseCache.matches(getRequest({ method: 'DELETE' }))).toBe(false);
		});

		it("Returns false for a request with a header that isn't allowed.", () => {
			preflightResponseCache.add(getRequest(), getResponse());
			expect(
				preflightResponseCache.matches(
					getRequest({
						headers: new Headers({ 'Content-Type': 'application/json', 'X-Custom-Header': 'yes' })
					})
				)
			).toBe(false);
		});

		it('Matches header names case-insensitively.', () => {
			preflightResponseCache.add(
				getRequest(),
				getResponse({
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'POST',
						'Access-Control-Allow-Headers': 'CONTENT-TYPE'
					})
				})
			);
			expect(preflightResponseCache.matches(getRequest())).toBe(true);
		});

		it('Matches any header except "Authorization" when the allowed headers contain the wildcard "*".', () => {
			preflightResponseCache.add(
				getRequest(),
				getResponse({
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'POST',
						'Access-Control-Allow-Headers': '*'
					})
				})
			);
			expect(
				preflightResponseCache.matches(
					getRequest({ headers: new Headers({ 'X-Custom-Header': 'yes' }) })
				)
			).toBe(true);
			expect(
				preflightResponseCache.matches(
					getRequest({ headers: new Headers({ Authorization: 'Bearer token' }) })
				)
			).toBe(false);
		});

		it('Matches the "Authorization" header when it is explicitly allowed.', () => {
			preflightResponseCache.add(
				getRequest(),
				getResponse({
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'POST',
						'Access-Control-Allow-Headers': 'Authorization'
					})
				})
			);
			expect(
				preflightResponseCache.matches(
					getRequest({ headers: new Headers({ Authorization: 'Bearer token' }) })
				)
			).toBe(true);
		});

		it('Returns false for a request with credentials when the preflight request was sent without credentials.', () => {
			preflightResponseCache.add(getRequest({ credentials: 'same-origin' }), getResponse());
			expect(preflightResponseCache.matches(getRequest({ credentials: 'include' }))).toBe(false);
		});

		it('Returns true for a request without credentials when the preflight request was sent with credentials.', () => {
			preflightResponseCache.add(getRequest({ credentials: 'include' }), getResponse());
			expect(preflightResponseCache.matches(getRequest({ credentials: 'same-origin' }))).toBe(true);
		});

		it('Removes entries when the max age defined in the "Access-Control-Max-Age" header has passed.', () => {
			preflightResponseCache.add(getRequest(), getResponse());
			dateNow += 599000;
			expect(preflightResponseCache.matches(getRequest())).toBe(true);
			dateNow += 2000;
			expect(preflightResponseCache.matches(getRequest())).toBe(false);
		});

		it("Uses a default max age of 5 seconds when the response doesn't specify one.", () => {
			preflightResponseCache.add(
				getRequest(),
				getResponse({
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'POST',
						'Access-Control-Allow-Headers': 'Content-Type'
					})
				})
			);
			dateNow += 4000;
			expect(preflightResponseCache.matches(getRequest())).toBe(true);
			dateNow += 2000;
			expect(preflightResponseCache.matches(getRequest())).toBe(false);
		});
	});

	describe('add()', () => {
		it("Doesn't cache non-successful preflight responses.", () => {
			preflightResponseCache.add(getRequest(), getResponse({ status: 500 }));
			expect(preflightResponseCache.matches(getRequest())).toBe(false);
		});

		it("Doesn't cache the response when the max age is zero or negative.", () => {
			preflightResponseCache.add(
				getRequest(),
				getResponse({
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'POST',
						'Access-Control-Allow-Headers': 'Content-Type',
						'Access-Control-Max-Age': '-1'
					})
				})
			);
			expect(preflightResponseCache.matches(getRequest())).toBe(false);
		});

		it('Combines entries from multiple preflight responses.', () => {
			preflightResponseCache.add(getRequest(), getResponse());
			preflightResponseCache.add(
				getRequest({ method: 'DELETE', headers: new Headers({ 'X-Custom-Header': 'yes' }) }),
				getResponse({
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'DELETE',
						'Access-Control-Allow-Headers': 'X-Custom-Header',
						'Access-Control-Max-Age': '600'
					})
				})
			);
			expect(
				preflightResponseCache.matches(
					getRequest({
						method: 'DELETE',
						headers: new Headers({ 'Content-Type': 'application/json', 'X-Custom-Header': 'yes' })
					})
				)
			).toBe(true);
		});
	});

	describe('clear()', () => {
		it('Clears the cache.', () => {
			preflightResponseCache.add(getRequest(), getResponse());
			preflightResponseCache.clear();
			expect(preflightResponseCache.matches(getRequest())).toBe(false);
		});
	});
});
