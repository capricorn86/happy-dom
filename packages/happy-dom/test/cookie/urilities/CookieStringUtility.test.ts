import CookieStringUtility from '../../../src/cookie/urilities/CookieStringUtility.js';
import { describe, it, expect } from 'vitest';

describe('CookieStringUtility', () => {
	describe('splitCookiesString()', () => {
		it('Should parse empty string.', () => {
			expect(CookieStringUtility.splitCookiesString('')).toEqual([]);
		});

		it('Should parse single cookie without params.', () => {
			expect(CookieStringUtility.splitCookiesString('key=value')).toEqual(['key=value']);
		});

		it('Should parse single cookie with params.', () => {
			expect(
				CookieStringUtility.splitCookiesString(
					'key=value; HttpOnly; Path=/; Expires=Fri, 01 Jan 2100 00:00:00 GMT'
				)
			).toEqual(['key=value; HttpOnly; Path=/; Expires=Fri, 01 Jan 2100 00:00:00 GMT']);
		});

		it('Should parse multiple cookies without params.', () => {
			expect(CookieStringUtility.splitCookiesString('key1=value1, key2=value2')).toEqual([
				'key1=value1',
				'key2=value2'
			]);
		});

		it('Should parse multiple cookies with params.', () => {
			expect(
				CookieStringUtility.splitCookiesString(
					'key1=value1; HttpOnly; Path=/; Expires=Fri, 01 Jan 2100 00:00:00 GMT, key2=value2; Domain=example.com; Max-Age=1'
				)
			).toEqual([
				'key1=value1; HttpOnly; Path=/; Expires=Fri, 01 Jan 2100 00:00:00 GMT',
				'key2=value2; Domain=example.com; Max-Age=1'
			]);
		});

		it('Should parse multiple cookies including those with and without params.', () => {
			expect(
				CookieStringUtility.splitCookiesString(
					'key1=value1, key2=value2; Expires=Fri, 01 Jan 2100 00:00:00 GMT; Path=/'
				)
			).toEqual(['key1=value1', 'key2=value2; Expires=Fri, 01 Jan 2100 00:00:00 GMT; Path=/']);
		});
	});
});
