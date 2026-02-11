import { beforeEach, afterEach, describe, it, expect } from 'vitest';
import Window from '../../src/window/Window.js';
import type BrowserWindow from '../../src/window/BrowserWindow.js';
import CookieStore from '../../src/cookie-store/CookieStore.js';
import CookieChangeEvent from '../../src/event/events/CookieChangeEvent.js';

describe('CookieStore', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window({ url: 'https://example.com/' });
	});

	afterEach(() => {
		window.close();
	});

	describe('constructor', () => {
		it('Throws TypeError when called without window.', () => {
			expect(() => new CookieStore(<BrowserWindow>(<unknown>null))).toThrow(TypeError);
		});

		it('Is exposed on window.', () => {
			expect(window.cookieStore).toBeInstanceOf(CookieStore);
			expect(window.CookieStore).toBe(CookieStore);
		});
	});

	describe('set()', () => {
		it('Sets a cookie with name and value.', async () => {
			await window.cookieStore.set('testCookie', 'testValue');
			const cookie = await window.cookieStore.get('testCookie');
			expect(cookie?.name).toBe('testCookie');
			expect(cookie?.value).toBe('testValue');
		});

		it('Sets a cookie with options object including expires, path, and sameSite.', async () => {
			const expires = Date.now() + 86400000;
			await window.cookieStore.set({
				name: 'optionsCookie',
				value: 'optionsValue',
				path: '/',
				expires,
				sameSite: 'strict'
			});
			const cookie = await window.cookieStore.get('optionsCookie');
			expect(cookie?.name).toBe('optionsCookie');
			expect(cookie?.value).toBe('optionsValue');
			expect(cookie?.path).toBe('/');
			expect(cookie?.expires).toBe(expires);
			expect(cookie?.sameSite).toBe('strict');
			expect(cookie?.partitioned).toBe(false);
		});

		it('Defaults value to empty string when not provided in options object.', async () => {
			await window.cookieStore.set({ name: 'emptyValue' });
			const cookie = await window.cookieStore.get('emptyValue');
			expect(cookie?.name).toBe('emptyValue');
			expect(cookie?.value).toBe('');
		});

		it('Defaults sameSite to strict.', async () => {
			await window.cookieStore.set('defaultSameSite', 'val');
			const cookie = await window.cookieStore.get('defaultSameSite');
			expect(cookie?.sameSite).toBe('strict');
		});

		it('Sets secure to true even with sameSite none.', async () => {
			await window.cookieStore.set({
				name: 'noneCookie',
				value: 'val',
				sameSite: 'none'
			});
			const cookie = await window.cookieStore.get('noneCookie');
			expect(cookie?.sameSite).toBe('none');
			expect(cookie?.secure).toBe(true);
		});

		it('Sets a cookie with domain option.', async () => {
			await window.cookieStore.set({
				name: 'domainCookie',
				value: 'val',
				domain: 'example.com'
			});
			const cookie = await window.cookieStore.get('domainCookie');
			expect(cookie?.name).toBe('domainCookie');
			expect(cookie?.domain).toBe('example.com');
		});

		it('Accepts expires as a Date object.', async () => {
			const expiresDate = new Date(Date.now() + 86400000);
			await window.cookieStore.set({
				name: 'dateExpires',
				value: 'val',
				expires: expiresDate
			});
			const cookie = await window.cookieStore.get('dateExpires');
			expect(cookie?.expires).toBe(expiresDate.getTime());
		});

		it('Does not return a cookie with a past expires date.', async () => {
			await window.cookieStore.set({
				name: 'expiredCookie',
				value: 'val',
				expires: new Date(0)
			});
			const cookie = await window.cookieStore.get('expiredCookie');
			expect(cookie).toBeNull();
		});

		it('Overwrites an existing cookie with the same name.', async () => {
			await window.cookieStore.set('overwrite', 'first');
			await window.cookieStore.set('overwrite', 'second');
			const cookie = await window.cookieStore.get('overwrite');
			expect(cookie?.value).toBe('second');
			const all = await window.cookieStore.getAll('overwrite');
			expect(all.length).toBe(1);
		});

		it('Throws TypeError for invalid arguments.', async () => {
			await expect(window.cookieStore.set({ name: '', value: 'test' })).rejects.toThrow(TypeError);
			await expect(window.cookieStore.set('testCookie')).rejects.toThrow(TypeError);
		});
	});

	describe('get()', () => {
		it('Returns null when cookie does not exist.', async () => {
			expect(await window.cookieStore.get('nonexistent')).toBeNull();
		});

		it('Gets a cookie by name string or options object.', async () => {
			await window.cookieStore.set('getCookie', 'getValue');
			expect((await window.cookieStore.get('getCookie'))?.value).toBe('getValue');
			expect((await window.cookieStore.get({ name: 'getCookie' }))?.value).toBe('getValue');
		});
	});

	describe('getAll()', () => {
		it('Returns empty array when no cookies exist.', async () => {
			expect(await window.cookieStore.getAll()).toEqual([]);
		});

		it('Returns all cookies and filters by name.', async () => {
			await window.cookieStore.set('cookie1', 'value1');
			await window.cookieStore.set('cookie2', 'value2');
			expect((await window.cookieStore.getAll()).length).toBe(2);
			expect((await window.cookieStore.getAll('cookie1')).length).toBe(1);
			expect((await window.cookieStore.getAll({ name: 'cookie2' }))[0].name).toBe('cookie2');
		});

		it('Returns cookies matching a same-origin url option.', async () => {
			await window.cookieStore.set('urlCookie', 'urlValue');
			const cookies = await window.cookieStore.getAll({ url: 'https://example.com/path' });
			expect(cookies.length).toBeGreaterThanOrEqual(1);
			expect(cookies.some((c) => c.name === 'urlCookie')).toBe(true);
		});

		it('Throws on cross-origin url option.', async () => {
			await expect(window.cookieStore.getAll({ url: 'https://other.com/' })).rejects.toThrow(
				'URL must match the document origin'
			);
		});
	});

	describe('delete()', () => {
		it('Deletes a cookie by name string or options object.', async () => {
			await window.cookieStore.set('deleteName', 'val');
			await window.cookieStore.delete('deleteName');
			expect(await window.cookieStore.get('deleteName')).toBeNull();

			await window.cookieStore.set({ name: 'deletePath', value: 'val', path: '/' });
			await window.cookieStore.delete({ name: 'deletePath', path: '/' });
			expect(await window.cookieStore.get('deletePath')).toBeNull();
		});

		it('Does not throw when deleting non-existent cookie.', async () => {
			await expect(window.cookieStore.delete('nonexistent')).resolves.toBeUndefined();
		});
	});

	describe('change event', () => {
		it('Fires a change event with changed array when a cookie is set.', async () => {
			let event: CookieChangeEvent | null = null;
			window.cookieStore.addEventListener('change', (e) => {
				event = <CookieChangeEvent>e;
			});
			await window.cookieStore.set('newCookie', 'newValue');
			expect(event).toBeInstanceOf(CookieChangeEvent);
			expect(event!.changed.length).toBe(1);
			expect(event!.changed[0].name).toBe('newCookie');
			expect(event!.changed[0].value).toBe('newValue');
			expect(event!.deleted.length).toBe(0);
		});

		it('Fires a change event with deleted array when a cookie is deleted.', async () => {
			await window.cookieStore.set('toDelete', 'val');
			let event: CookieChangeEvent | null = null;
			window.cookieStore.addEventListener('change', (e) => {
				event = <CookieChangeEvent>e;
			});
			await window.cookieStore.delete('toDelete');
			expect(event).toBeInstanceOf(CookieChangeEvent);
			expect(event!.deleted.length).toBe(1);
			expect(event!.deleted[0].name).toBe('toDelete');
			expect(event!.changed.length).toBe(0);
		});

		it('Is exposed on window as CookieChangeEvent.', () => {
			expect(window.CookieChangeEvent).toBe(CookieChangeEvent);
		});
	});

	describe('integration with document.cookie', () => {
		it('Cookies are shared between cookieStore and document.cookie.', async () => {
			await window.cookieStore.set('storeCookie', 'storeValue');
			expect(window.document.cookie).toContain('storeCookie=storeValue');

			window.document.cookie = 'docCookie=docValue';
			const cookie = await window.cookieStore.get('docCookie');
			expect(cookie?.name).toBe('docCookie');
			expect(cookie?.value).toBe('docValue');
		});
	});
});
