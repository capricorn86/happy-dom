import BrowserWindow from '../../src/window/BrowserWindow.js';
import ResourceFetch from '../../src/fetch/ResourceFetch.js';
import Response from '../../src/fetch/Response.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Browser from '../../src/browser/Browser.js';
import Fetch from '../../src/fetch/Fetch.js';
import SyncFetch from '../../src/fetch/SyncFetch.js';
import ISyncResponse from '../../src/fetch/types/ISyncResponse.js';
import DOMException from '../../src/exception/DOMException.js';
import { PropertySymbol } from '../../src/index.js';
import PreloadUtility from '../../src/fetch/preload/PreloadUtility.js';
import PreloadEntry from '../../src/fetch/preload/PreloadEntry.js';

const URL = 'https://localhost:8080/base/';

describe('ResourceFetch', () => {
	let window: BrowserWindow;
	let resourceFetch: ResourceFetch;

	beforeEach(() => {
		const browser = new Browser();
		const page = browser.newPage();
		window = page.mainFrame.window;
		page.mainFrame.url = URL;
		resourceFetch = new ResourceFetch(window);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('fetch()', () => {
		it('Returns resource data asynchronously.', async () => {
			let requestArgs: { url: string; method: string } | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async function () {
				requestArgs = {
					url: this.request.url,
					method: this.request.method
				};
				return <Response>{
					text: () => Promise.resolve('test'),
					ok: true
				};
			});

			const response = await resourceFetch.fetch('path/to/script/', 'script');

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/base/path/to/script/',
				method: 'GET'
			});
			expect(response.content).toBe('test');
			expect(response.virtualServerFile).toBeNull();
		});

		it('Returns resource data with virtual server file asynchronously.', async () => {
			let requestArgs: { url: string; method: string } | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async function () {
				requestArgs = {
					url: this.request.url,
					method: this.request.method
				};
				return <Response>{
					text: () => Promise.resolve('test'),
					ok: true,
					[PropertySymbol.virtualServerFile]: 'virtual-server-file.js'
				};
			});

			const response = await resourceFetch.fetch('path/to/script/', 'script');

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/base/path/to/script/',
				method: 'GET'
			});
			expect(response.content).toBe('test');
			expect(response.virtualServerFile).toBe('virtual-server-file.js');
		});

		it('Handles preloaded assets asynchronously.', async () => {
			const url = 'https://localhost:8080/base/path/to/script.js';
			const key = PreloadUtility.getKey({
				url,
				destination: 'script',
				mode: 'cors',
				credentialsMode: 'same-origin'
			});
			const preloadEntry = new PreloadEntry();
			preloadEntry.response = <Response>{
				ok: true,
				[PropertySymbol.buffer]: Buffer.from('test'),
				[PropertySymbol.virtualServerFile]: '/path/virtual-server-file.js'
			};
			window.document[PropertySymbol.preloads].set(key, preloadEntry);

			const response = await resourceFetch.fetch(
				'https://localhost:8080/base/path/to/script.js',
				'script',
				{
					credentials: 'same-origin'
				}
			);

			expect(response.content).toBe('test');
			expect(response.virtualServerFile).toBe('/path/virtual-server-file.js');
		});

		it('Handles error when resource is fetched asynchronously.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async function () {
				return <Response>{
					ok: false,
					status: 404,
					statusText: 'Not Found'
				};
			});

			let error: Error | null = null;
			try {
				await resourceFetch.fetch('path/to/script/', 'script');
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to perform request to "${URL}path/to/script/". Status 404 Not Found.`
				)
			);
		});
	});

	describe('fetchSync()', () => {
		it('Returns resource data synchronously.', () => {
			const expectedResponse = 'test';
			let requestArgs: { url: string; method: string } | null = null;

			vi.spyOn(SyncFetch.prototype, 'send').mockImplementation(function () {
				requestArgs = {
					url: this.request.url,
					method: this.request.method
				};
				return <ISyncResponse>{
					body: Buffer.from(expectedResponse),
					ok: true
				};
			});

			const response = resourceFetch.fetchSync('path/to/script/', 'script');

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/base/path/to/script/',
				method: 'GET'
			});
			expect(response.content).toBe(expectedResponse);
			expect(response.virtualServerFile).toBeNull();
		});

		it('Returns resource data with virtual server file synchronously.', () => {
			const expectedResponse = 'test';
			let requestArgs: { url: string; method: string } | null = null;

			vi.spyOn(SyncFetch.prototype, 'send').mockImplementation(function () {
				requestArgs = {
					url: this.request.url,
					method: this.request.method
				};
				return <ISyncResponse>{
					body: Buffer.from(expectedResponse),
					ok: true,
					[PropertySymbol.virtualServerFile]: 'virtual-server-file.js'
				};
			});

			const response = resourceFetch.fetchSync('path/to/script/', 'script');

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/base/path/to/script/',
				method: 'GET'
			});
			expect(response.content).toBe(expectedResponse);
			expect(response.virtualServerFile).toBe('virtual-server-file.js');
		});

		it('Handles preloaded assets synchronously.', async () => {
			const url = 'https://localhost:8080/base/path/to/script.js';
			const key = PreloadUtility.getKey({
				url,
				destination: 'script',
				mode: 'cors',
				credentialsMode: 'same-origin'
			});
			const preloadEntry = new PreloadEntry();
			preloadEntry.response = <Response>{
				ok: true,
				[PropertySymbol.buffer]: Buffer.from('test'),
				[PropertySymbol.virtualServerFile]: '/path/virtual-server-file.js'
			};
			window.document[PropertySymbol.preloads].set(key, preloadEntry);

			const response = resourceFetch.fetchSync(
				'https://localhost:8080/base/path/to/script.js',
				'script',
				{
					credentials: 'same-origin'
				}
			);

			expect(response.content).toBe('test');
			expect(response.virtualServerFile).toBe('/path/virtual-server-file.js');
		});

		it('Handles error when resource is fetched synchronously.', () => {
			vi.spyOn(SyncFetch.prototype, 'send').mockImplementation(function () {
				return <ISyncResponse>{
					ok: false,
					status: 404,
					statusText: 'Not Found'
				};
			});

			let error: Error | null = null;

			try {
				resourceFetch.fetchSync('path/to/script/', 'script');
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to perform request to "${URL}path/to/script/". Status 404 Not Found.`
				)
			);
		});
	});
});
