import util from 'node:util';
import URL from '../../src/url/URL.js';
import Blob from '../../src/file/Blob.js';
import type BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import { Blob as NodeJSBlob } from 'buffer';
import { beforeEach, describe, it, expect } from 'vitest';

describe('URL', () => {
	let window: BrowserWindow;
	beforeEach(() => {
		window = new Window();
	});

	describe('get href()', () => {
		it('Returns href.', () => {
			const url = new window.URL('https://example.com/path?query=1#hash');
			expect(url.href).toBe('https://example.com/path?query=1#hash');
			url.href = 'https://example.org/';
			expect(url.href).toBe('https://example.org/');
		});

		it("Returns an empty string when called on the prototype, as Node's util.inspect() does (#1938).", () => {
			expect(Reflect.get(window.URL.prototype, 'href')).toBe('');
			expect(Reflect.get(URL.prototype, 'href')).toBe('');
			expect(() => util.inspect(window.URL, { showHidden: true })).not.toThrow();
		});
	});

	describe('constructor()', () => {
		it('Throws an error from the Window context if the URL is invalid.', () => {
			let error: Error | null = null;
			try {
				new window.URL('invalid-url');
			} catch (e) {
				error = <Error>e;
			}
			expect(error).toEqual(new TypeError('Invalid URL'));
			expect(error!.constructor).toBe(window.TypeError);
		});
	});

	describe('createObjectURL()', () => {
		it('Creates a string containing a URL representing the object given in the parameter.', () => {
			const blob = new Blob(['TEST']);
			expect(window.URL.createObjectURL(blob).startsWith('blob:nodedata:')).toBe(true);
		});

		it('Supports Node.js Blob objects.', () => {
			const blob = new NodeJSBlob(['TEST']);
			expect(window.URL.createObjectURL(blob).startsWith('blob:nodedata:')).toBe(true);
		});
	});
});
