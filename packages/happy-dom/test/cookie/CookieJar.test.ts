import CookieJar from '../../src/cookie/CookieJar';
import { URL } from 'url';

describe('CookieJar', () => {
	let cookieJar: CookieJar;

	beforeEach(() => {
		cookieJar = new CookieJar();
	});

	describe('addCookieString()', () => {
		it('Sets cookie string.', () => {
			const expires = new Date(60 * 1000 + Date.now()).toString();
			const originURL = new URL('https://example.com/path/to/page/');
			const maxAge = 60;

			cookieJar.addCookieString(originURL, `key1=value1; Expires=${expires};`);
			cookieJar.addCookieString(originURL, `key2=value2; Max-Age=${maxAge};`);
			cookieJar.addCookieString(originURL, `key3=value3; Domain=example.com;`);
			cookieJar.addCookieString(originURL, `key4=value4; Domain=other.com;`);
			cookieJar.addCookieString(originURL, `key5=value5; Path=path/to/page/;`);
			cookieJar.addCookieString(originURL, `key5=value5; HttpOnly;`);
			cookieJar.addCookieString(originURL, `key5=value5; Secure;`);
			cookieJar.addCookieString(originURL, `key5=value5; SameSite=None;`);

			expect(cookieJar.getCookieString(new URL('https://example.com/path/to/page/'), false)).toBe(
				''
			);
		});
	});
});
