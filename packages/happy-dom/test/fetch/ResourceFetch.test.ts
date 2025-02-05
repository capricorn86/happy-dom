import BrowserWindow from '../../src/window/BrowserWindow.js';
import ResourceFetch from '../../src/fetch/ResourceFetch.js';
import Response from '../../src/fetch/Response.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Browser from '../../src/browser/Browser.js';
import Fetch from '../../src/fetch/Fetch.js';
import SyncFetch from '../../src/fetch/SyncFetch.js';
import ISyncResponse from '../../src/fetch/types/ISyncResponse.js';
import DOMException from '../../src/exception/DOMException.js';

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
		it('Returns resource data asynchrounously.', async () => {
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

			const test = await resourceFetch.fetch('path/to/script/');

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/base/path/to/script/',
				method: 'GET'
			});
			expect(test).toBe('test');
		});

		it('Handles error when resource is fetched asynchrounously.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async function () {
				return <Response>{
					ok: false,
					status: 404,
					statusText: 'Not Found'
				};
			});

			let error: Error | null = null;
			try {
				await resourceFetch.fetch('path/to/script/');
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
		it('Returns resource data synchrounously.', () => {
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

			const response = resourceFetch.fetchSync('path/to/script/');

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/base/path/to/script/',
				method: 'GET'
			});
			expect(response).toBe(expectedResponse);
		});

		it('Handles error when resource is fetched synchrounously.', () => {
			vi.spyOn(SyncFetch.prototype, 'send').mockImplementation(function () {
				return <ISyncResponse>{
					ok: false,
					status: 404,
					statusText: 'Not Found'
				};
			});

			let error: Error | null = null;

			try {
				resourceFetch.fetchSync('path/to/script/');
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
