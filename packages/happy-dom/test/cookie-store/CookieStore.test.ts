import { beforeEach, afterEach, describe, it, expect } from 'vitest';
import Window from '../../src/window/Window.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import CookieStore from '../../src/cookie-store/CookieStore.js';

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
	});

	describe('delete()', () => {
		it('Deletes a cookie by name or options object.', async () => {
			await window.cookieStore.set('deleteCookie', 'deleteValue');
			expect(await window.cookieStore.get('deleteCookie')).not.toBeNull();
			await window.cookieStore.delete('deleteCookie');
			expect(await window.cookieStore.get('deleteCookie')).toBeNull();

			await window.cookieStore.set('deleteOptions', 'deleteValue');
			await window.cookieStore.delete({ name: 'deleteOptions', value: '' });
			expect(await window.cookieStore.get('deleteOptions')).toBeNull();
		});

		it('Does not throw when deleting non-existent cookie.', async () => {
			await expect(window.cookieStore.delete('nonexistent')).resolves.toBeUndefined();
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
