import { describe, expect, it } from 'vitest';
import Window from '../../../src/window/Window.js';
import FetchCORSUtility from '../../../src/fetch/utilities/FetchCORSUtility.js';
import type IRequestInit from '../../../src/fetch/types/IRequestInit.js';

describe('FetchCORSUtility', () => {
	describe('isPreflightRequired()', () => {
		const window = new Window();

		const testCases: Array<{
			description: string;
			init: IRequestInit;
			requiresPreflight: boolean;
		}> = [
			{
				description: 'a GET request without author-controlled headers',
				init: {},
				requiresPreflight: false
			},
			{
				description: 'a HEAD request with CORS-safelisted headers',
				init: {
					method: 'HEAD',
					headers: {
						Accept: 'application/json',
						'Accept-Language': 'en-US',
						'Content-Language': 'en'
					}
				},
				requiresPreflight: false
			},
			{
				description: 'a POST request with a text/plain body',
				init: { method: 'POST', body: 'Hello world' },
				requiresPreflight: false
			},
			{
				description: 'a POST request with application/x-www-form-urlencoded content',
				init: {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
					body: 'name=Happy+DOM'
				},
				requiresPreflight: false
			},
			{
				description: 'a POST request with multipart/form-data content',
				init: {
					method: 'POST',
					headers: { 'Content-Type': 'multipart/form-data; boundary=boundary' },
					body: '--boundary--'
				},
				requiresPreflight: false
			},
			{
				description: 'a PATCH request',
				init: { method: 'PATCH' },
				requiresPreflight: true
			},
			{
				description: 'a request with a custom header',
				init: { headers: { 'X-Custom-Header': 'yes' } },
				requiresPreflight: true
			},
			{
				description: 'a request with an invalid CORS-safelisted header value',
				init: { headers: { Accept: 'application/json:application/xml' } },
				requiresPreflight: true
			},
			{
				description: 'a request with more than 128 bytes in a CORS-safelisted header',
				init: { headers: { Accept: 'a'.repeat(129) } },
				requiresPreflight: true
			},
			{
				description: 'a request with a single byte range header',
				init: { headers: { Range: 'bytes=256-' } },
				requiresPreflight: false
			},
			{
				description: 'a request with a suffix byte range header',
				init: { headers: { Range: 'bytes=-500' } },
				requiresPreflight: true
			},
			{
				description: 'a POST request with application/json content',
				init: {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: '{"name":"Happy DOM"}'
				},
				requiresPreflight: true
			}
		];

		it.each(testCases)('returns $requiresPreflight for $description', (testCase) => {
			const request = new window.Request('https://other.origin.test/', testCase.init);

			expect(FetchCORSUtility.isPreflightRequired(request)).toBe(testCase.requiresPreflight);
		});
	});
});
