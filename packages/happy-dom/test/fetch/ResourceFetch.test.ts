import IBrowserWindow from '../../src/window/IBrowserWindow.js';
import ResourceFetch from '../../src/resource-fetch/ResourceFetch.js';
import IResponse from '../../src/fetch/types/IResponse.js';
import XMLHttpRequestSyncRequestScriptBuilder from '../../src/xml-http-request/utilities/XMLHttpRequestSyncRequestScriptBuilder.js';
import XMLHttpRequestCertificate from '../../src/xml-http-request/XMLHttpRequestCertificate.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Browser from '../../src/browser/Browser.js';
import Fetch from '../../src/fetch/Fetch.js';
import '../types.d.js';

const URL = 'https://localhost:8080/base/';

describe('ResourceFetch', () => {
	let window: IBrowserWindow;
	let resourceFetch: ResourceFetch;

	beforeEach(() => {
		const browser = new Browser();
		const page = browser.newPage();
		window = page.mainFrame.window;
		page.mainFrame.url = URL;
		resourceFetch = new ResourceFetch({
			browserFrame: page.mainFrame,
			window
		});
	});

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('fetch()', () => {
		it('Returns resource data asynchrounously.', async () => {
			let fetchedURL: string | null = null;
			let fetchedMethod: string | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function () {
				fetchedURL = <string>this.request.url;
				fetchedMethod = <string>this.request.method;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('test'),
					ok: true
				});
			});

			const test = await resourceFetch.fetch('path/to/script/');

			expect(fetchedURL).toBe('https://localhost:8080/base/path/to/script/');
			expect(fetchedMethod).toBe('GET');
			expect(test).toBe('test');
		});
	});

	describe('fetchSync()', () => {
		it('Returns resource data synchrounously.', () => {
			const expectedResponse = 'test';

			mockModule('child_process', {
				execFileSync: (
					command: string,
					args: string[],
					options: { encoding: string; maxBuffer: number }
				) => {
					expect(command).toEqual(process.argv[0]);
					expect(args[0]).toBe('-e');
					expect(args[1]).toBe(
						XMLHttpRequestSyncRequestScriptBuilder.getScript(
							{
								host: 'localhost',
								port: 8080,
								path: '/base/path/to/script/',
								method: 'GET',
								headers: {
									Accept: '*/*',
									Referer: 'https://localhost:8080/base/',
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br',
									Connection: 'close',
									Host: 'localhost:8080'
								},
								agent: false,
								rejectUnauthorized: true,
								key: XMLHttpRequestCertificate.key,
								cert: XMLHttpRequestCertificate.cert
							},
							true
						)
					);
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {},
							text: expectedResponse,
							data: Buffer.from(expectedResponse).toString('base64')
						}
					});
				}
			});

			const response = resourceFetch.fetchSync('path/to/script/');

			expect(response).toBe(expectedResponse);
		});

		it('Handles error when resource is fetched synchrounously.', () => {
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 404,
							statusMessage: 'Not found',
							headers: {},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});
			expect(() => {
				resourceFetch.fetchSync('path/to/script/');
			}).toThrowError(`Failed to perform request to "${URL}path/to/script/". Status code: 404`);
		});
	});
});
