import CookieContainer from '../../src/cookie/CookieContainer.js';
import CookieSameSiteEnum from '../../src/cookie/enums/CookieSameSiteEnum.js';
import type ICookie from '../../src/cookie/ICookie.js';
import type ICookieContainer from '../../src/cookie/ICookieContainer.js';
import CookieStringUtility from '../../src/cookie/urilities/CookieStringUtility.js';
import URL from '../../src/url/URL.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

describe('CookieContainer', () => {
	let cookieContainer: ICookieContainer;

	beforeEach(() => {
		cookieContainer = new CookieContainer();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('addCookies()', () => {
		it.each([
			['https://127.0.0.1/', 'localhost'],
			['https://attacker.com/', 'victim.com'],
			['https://notexample.com/', 'example.com'],
			['https://attacker.com/', 'com'],
			['https://attacker.co.uk/', 'co.uk'],
			['https://attacker.github.io/', 'github.io'],
			['https://127.0.0.1/', '0.1'],
			['https://example.com/', 'example.com.'],
			['https://example.com/', '..example.com'],
			['https://example.com/', 'example.com/path']
		])(
			'Rejects cookies from %s with Domain=%s before storing or deleting cookies.',
			(origin, domain) => {
				const victimURL = new URL(
					`https://${domain === 'localhost' ? 'localhost' : 'victim.com'}/`
				);
				cookieContainer.addCookies([{ key: 'session', value: 'original', originURL: victimURL }]);
				for (const expires of [null, new Date(0)]) {
					expect(
						cookieContainer.addCookies([
							{
								key: 'session',
								value: 'forged',
								originURL: new URL(origin),
								domain,
								secure: true,
								sameSite: CookieSameSiteEnum.none,
								expires
							}
						])
					).toEqual({ changed: [], deleted: [] });
					expect(cookieContainer.getCookies()).toHaveLength(1);
					expect(cookieContainer.getCookies(victimURL)[0].value).toBe('original');
				}
			}
		);

		it('Normalizes domain cookies and permits valid subdomains for all SameSite values.', () => {
			for (const sameSite of Object.values(CookieSameSiteEnum)) {
				cookieContainer.clearCookies();
				cookieContainer.addCookies([
					{
						key: 'session',
						value: 'value',
						originURL: new URL('https://sub.example.com/'),
						domain: '.EXAMPLE.COM',
						secure: true,
						sameSite
					}
				]);
				expect(cookieContainer.getCookies()[0].domain).toBe('example.com');
				for (const host of ['example.com', 'sub.example.com', 'other.example.com']) {
					expect(cookieContainer.getCookies(new URL(`https://${host}/`))).toHaveLength(1);
				}
				expect(cookieContainer.getCookies(new URL('https://notexample.com/'))).toEqual([]);
			}
		});

		it('Uses the effective domain when replacing and deleting cookies.', () => {
			cookieContainer.addCookies([
				{
					key: 'session',
					value: 'parent',
					originURL: new URL('https://a.example.com/'),
					domain: 'example.com'
				},
				{
					key: 'session',
					value: 'host-only',
					originURL: new URL('https://a.example.com/')
				}
			]);
			cookieContainer.addCookies([
				{
					key: 'session',
					value: 'replacement',
					originURL: new URL('https://b.example.com/'),
					domain: '.EXAMPLE.COM'
				}
			]);
			expect(cookieContainer.getCookies().map((cookie) => cookie.value)).toEqual([
				'host-only',
				'replacement'
			]);
			const result = cookieContainer.addCookies([
				{
					key: 'session',
					value: '',
					originURL: new URL('https://example.com/'),
					domain: 'example.com',
					expires: new Date(0)
				}
			]);
			expect(result.deleted.map((cookie) => cookie.value)).toEqual(['replacement']);
			expect(cookieContainer.getCookies().map((cookie) => cookie.value)).toEqual(['host-only']);
		});

		it.each(['localhost', 'com', 'co.uk', 'github.io'])(
			'Treats a public suffix Domain=%s set by itself as host-only.',
			(host) => {
				cookieContainer.addCookies([
					{
						key: 'session',
						originURL: new URL(`https://${host}/`),
						domain: host,
						secure: true,
						sameSite: CookieSameSiteEnum.none
					}
				]);
				expect(cookieContainer.getCookies()[0].domain).toBe('');
				expect(cookieContainer.getCookies(new URL(`https://${host}/`))).toHaveLength(1);
				expect(cookieContainer.getCookies(new URL(`https://sub.${host}/`))).toEqual([]);
			}
		);

		it('Adds cookie string.', () => {
			const expires = 60 * 1000 + Date.now();
			const originURL = new URL('https://example.com/path/to/page/');
			const maxAge = 60;

			cookieContainer.addCookies([
				<ICookie>(
					CookieStringUtility.stringToCookie(
						originURL,
						`key1=value1; Expires=${new Date(expires).toString()};`
					)
				),
				<ICookie>(
					CookieStringUtility.stringToCookie(originURL, `key2   =    value2   ; Max-Age=${maxAge};`)
				),
				<ICookie>CookieStringUtility.stringToCookie(originURL, `key3=value3; Domain=example.com;`),
				<ICookie>CookieStringUtility.stringToCookie(originURL, `key4=value4; Domain=other.com;`),
				<ICookie>(
					CookieStringUtility.stringToCookie(
						originURL,
						`key5=value5; Domain=other.com; SameSite=None;`
					)
				),
				<ICookie>(
					CookieStringUtility.stringToCookie(
						originURL,
						`key6=value6; Domain=other.com; SameSite=None; Secure;`
					)
				),
				<ICookie>CookieStringUtility.stringToCookie(originURL, `key7=value7; Path=path/to/page/;`),
				<ICookie>CookieStringUtility.stringToCookie(originURL, `key8=value8; HttpOnly;`),
				<ICookie>CookieStringUtility.stringToCookie(originURL, `key9=value9; Secure;`),
				<ICookie>(
					CookieStringUtility.stringToCookie(originURL, `key10=value10; SameSite=None; Secure;`)
				),
				<ICookie>CookieStringUtility.stringToCookie(originURL, `key10;`),
				<ICookie>CookieStringUtility.stringToCookie(originURL, `key11=hello=world;`)
			]);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('https://example.com/path/to/page/'), false)
				)
			).toBe(
				'key1=value1; key2=value2; key3=value3; key7=value7; key8=value8; key9=value9; key10=value10; key10; key11=hello=world'
			);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('https://example.com/path/to/page/'), true)
				)
			).toBe(
				'key1=value1; key2=value2; key3=value3; key7=value7; key9=value9; key10=value10; key10; key11=hello=world'
			);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('http://example.com/path/to/page/'), false)
				)
			).toBe(
				'key1=value1; key2=value2; key3=value3; key7=value7; key8=value8; key10; key11=hello=world'
			);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('https://other.com/path/to/page/'), false)
				)
			).toBe('');

			cookieContainer.addCookies([
				<ICookie>CookieStringUtility.stringToCookie(originURL, `key10=newValue10`)
			]);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('https://example.com/path/to/page/'), false)
				)
			).toBe(
				'key1=value1; key2=value2; key3=value3; key7=value7; key8=value8; key9=value9; key10; key11=hello=world; key10=newValue10'
			);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('https://other.com/path/to/page/'), false)
				)
			).toBe('');

			vi.spyOn(Date, 'now').mockImplementation(() => expires + 1000);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('https://example.com/path/to/page/'), false)
				)
			).toBe(
				'key3=value3; key7=value7; key8=value8; key9=value9; key10; key11=hello=world; key10=newValue10'
			);

			cookieContainer.addCookies([
				<ICookie>(
					CookieStringUtility.stringToCookie(
						originURL,
						`key10; Expires=${new Date(expires).toString()};`
					)
				)
			]);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('https://example.com/path/to/page/'), false)
				)
			).toBe(
				'key3=value3; key7=value7; key8=value8; key9=value9; key11=hello=world; key10=newValue10'
			);

			cookieContainer.addCookies([
				<ICookie>(
					CookieStringUtility.stringToCookie(
						originURL,
						`key10=; Expires=${new Date(expires).toString()};`
					)
				)
			]);

			expect(
				CookieStringUtility.cookiesToString(
					cookieContainer.getCookies(new URL('https://example.com/path/to/page/'), false)
				)
			).toBe('key3=value3; key7=value7; key8=value8; key9=value9; key11=hello=world');
		});

		it('Validates secure cookie keys.', () => {
			const originURL = new URL('https://example.com/path/to/page/');
			const targetURL = new URL('https://example.com/path/to/page/');

			expect(CookieStringUtility.stringToCookie(originURL, `__secure-key=value`)).toBe(null);

			cookieContainer.addCookies([
				<ICookie>CookieStringUtility.stringToCookie(originURL, `__secure-key=value; Secure;`)
			]);

			expect(
				CookieStringUtility.cookiesToString(cookieContainer.getCookies(targetURL, false))
			).toBe('__secure-key=value');
		});

		it('Validates secure cookie keys for localhost', () => {
			const originURL = new URL('http://localhost');
			const targetURL = new URL('http://localhost');

			expect(CookieStringUtility.stringToCookie(originURL, `__secure-key=value`)).toBe(null);

			cookieContainer.addCookies([
				<ICookie>CookieStringUtility.stringToCookie(originURL, `__secure-key=value; Secure;`)
			]);

			expect(
				CookieStringUtility.cookiesToString(cookieContainer.getCookies(targetURL, false))
			).toBe('__secure-key=value');
		});

		it('Validates host cookie keys.', () => {
			const originURL = new URL('https://example.com/path/to/page/');
			const targetURL = new URL('https://example.com/path/to/page/');

			expect(CookieStringUtility.stringToCookie(originURL, `__host-key=value`)).toBe(null);

			expect(CookieStringUtility.stringToCookie(originURL, `__host-key=value; Secure;`)).toBe(null);

			expect(
				CookieStringUtility.stringToCookie(
					originURL,
					`__host-key=value; Secure; Path=/path/to/page/;`
				)
			).toBe(null);

			expect(
				CookieStringUtility.stringToCookie(
					originURL,
					`__host-key=value; Secure; Domain=example.com; Path=/;`
				)
			).toBe(null);

			cookieContainer.addCookies([
				<ICookie>CookieStringUtility.stringToCookie(originURL, `__host-key=value; Secure; Path=/;`)
			]);

			expect(
				CookieStringUtility.cookiesToString(cookieContainer.getCookies(targetURL, false))
			).toBe('__host-key=value');
		});

		it('Ignores invalid cookies.', () => {
			const originURL = new URL('https://example.com/path/to/page/');
			cookieContainer.addCookies([
				<ICookie>{ originURL },
				<ICookie>{ key: 'key' },
				<ICookie>(<unknown>null)
			]);

			expect(cookieContainer.getCookies(originURL)).toEqual([]);
		});
	});

	describe('getCookies()', () => {
		it('Returns cookies.', () => {
			const originURL = new URL('https://example.com/path/to/page/');
			const expires = new Date(60 * 1000 + Date.now());

			cookieContainer.addCookies([
				{
					key: 'key1',
					originURL
				},
				{
					key: 'key2',
					originURL,
					value: 'value2',
					domain: 'example.com',
					path: '/path/to/page/',
					expires,
					httpOnly: true,
					secure: true,
					sameSite: CookieSameSiteEnum.strict
				}
			]);

			expect(cookieContainer.getCookies(originURL)).toEqual([
				{
					key: 'key1',
					originURL,
					value: null,
					domain: '',
					path: '',
					expires: null,
					httpOnly: false,
					secure: false,
					sameSite: CookieSameSiteEnum.lax
				},
				{
					key: 'key2',
					originURL,
					value: 'value2',
					domain: 'example.com',
					path: '/path/to/page/',
					expires,
					httpOnly: true,
					secure: true,
					sameSite: CookieSameSiteEnum.strict
				}
			]);
		});
	});

	describe('clearCookies()', () => {
		it('Clears cookies.', () => {
			const originURL = new URL('https://example.com/path/to/page/');
			const expires = new Date(60 * 1000 + Date.now());

			cookieContainer.addCookies([
				{
					key: 'key1',
					originURL
				},
				{
					key: 'key2',
					originURL,
					value: 'value2',
					domain: 'example.com',
					path: '/path/to/page/',
					expires,
					httpOnly: true,
					secure: true,
					sameSite: CookieSameSiteEnum.strict
				}
			]);

			cookieContainer.clearCookies();

			expect(cookieContainer.getCookies(originURL)).toEqual([]);
		});
	});
});
