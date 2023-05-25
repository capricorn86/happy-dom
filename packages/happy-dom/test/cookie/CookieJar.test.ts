import CookieJar from '../../src/cookie/CookieJar.js';
import { URL } from 'url';

describe('CookieJar', () => {
	let cookieJar: CookieJar;

	beforeEach(() => {
		cookieJar = new CookieJar();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('addCookieString()', () => {
		it('Adds cookie string.', () => {
			const expires = 60 * 1000 + Date.now();
			const originURL = new URL('https://example.com/path/to/page/');
			const maxAge = 60;

			cookieJar.addCookieString(originURL, `key1=value1; Expires=${new Date(expires).toString()};`);
			cookieJar.addCookieString(originURL, `key2=value2; Max-Age=${maxAge};`);
			cookieJar.addCookieString(originURL, `key3=value3; Domain=example.com;`);
			cookieJar.addCookieString(originURL, `key4=value4; Domain=other.com;`);
			cookieJar.addCookieString(originURL, `key5=value5; Domain=other.com; SameSite=None;`);
			cookieJar.addCookieString(originURL, `key6=value6; Domain=other.com; SameSite=None; Secure;`);
			cookieJar.addCookieString(originURL, `key7=value7; Path=path/to/page/;`);
			cookieJar.addCookieString(originURL, `key8=value8; HttpOnly;`);
			cookieJar.addCookieString(originURL, `key9=value9; Secure;`);
			cookieJar.addCookieString(originURL, `key10=value10; SameSite=None; Secure;`);
			cookieJar.addCookieString(originURL, `key10;`);

			expect(cookieJar.getCookieString(new URL('https://example.com/path/to/page/'), false)).toBe(
				'key1=value1; key2=value2; key3=value3; key7=value7; key8=value8; key9=value9; key10=value10; key10'
			);

			expect(cookieJar.getCookieString(new URL('https://example.com/path/to/page/'), true)).toBe(
				'key1=value1; key2=value2; key3=value3; key7=value7; key9=value9; key10=value10; key10'
			);

			expect(cookieJar.getCookieString(new URL('http://example.com/path/to/page/'), false)).toBe(
				'key1=value1; key2=value2; key3=value3; key7=value7; key8=value8; key10'
			);

			expect(cookieJar.getCookieString(new URL('https://other.com/path/to/page/'), false)).toBe(
				'key6=value6; key10=value10'
			);

			cookieJar.addCookieString(originURL, `key10=newValue10`);

			expect(cookieJar.getCookieString(new URL('https://example.com/path/to/page/'), false)).toBe(
				'key1=value1; key2=value2; key3=value3; key7=value7; key8=value8; key9=value9; key10; key10=newValue10'
			);

			expect(cookieJar.getCookieString(new URL('https://other.com/path/to/page/'), false)).toBe(
				'key6=value6'
			);

			jest.spyOn(Date, 'now').mockImplementation(() => expires + 1000);

			expect(cookieJar.getCookieString(new URL('https://example.com/path/to/page/'), false)).toBe(
				'key3=value3; key7=value7; key8=value8; key9=value9; key10; key10=newValue10'
			);

			cookieJar.addCookieString(originURL, `key10; Expires=${new Date(expires).toString()};`);

			expect(cookieJar.getCookieString(new URL('https://example.com/path/to/page/'), false)).toBe(
				'key3=value3; key7=value7; key8=value8; key9=value9; key10=newValue10'
			);

			cookieJar.addCookieString(originURL, `key10=; Expires=${new Date(expires).toString()};`);

			expect(cookieJar.getCookieString(new URL('https://example.com/path/to/page/'), false)).toBe(
				'key3=value3; key7=value7; key8=value8; key9=value9'
			);
		});

		it('Validates secure cookie keys.', () => {
			const originURL = new URL('https://example.com/path/to/page/');
			const targetURL = new URL('https://example.com/path/to/page/');

			cookieJar.addCookieString(originURL, `__secure-key=value`);

			expect(cookieJar.getCookieString(targetURL, false)).toBe('');

			cookieJar.addCookieString(originURL, `__secure-key=value; Secure;`);

			expect(cookieJar.getCookieString(targetURL, false)).toBe('__secure-key=value');
		});

		it('Validates host cookie keys.', () => {
			const originURL = new URL('https://example.com/path/to/page/');
			const targetURL = new URL('https://example.com/path/to/page/');

			cookieJar.addCookieString(originURL, `__host-key=value`);

			expect(cookieJar.getCookieString(targetURL, false)).toBe('');

			cookieJar.addCookieString(originURL, `__host-key=value; Secure;`);

			expect(cookieJar.getCookieString(targetURL, false)).toBe('');

			cookieJar.addCookieString(originURL, `__host-key=value; Secure; Path=/path/to/page/;`);

			expect(cookieJar.getCookieString(targetURL, false)).toBe('');

			cookieJar.addCookieString(originURL, `__host-key=value; Secure; Domain=example.com; Path=/;`);

			expect(cookieJar.getCookieString(targetURL, false)).toBe('');

			cookieJar.addCookieString(originURL, `__host-key=value; Secure; Path=/;`);

			expect(cookieJar.getCookieString(targetURL, false)).toBe('__host-key=value');
		});
	});
});
