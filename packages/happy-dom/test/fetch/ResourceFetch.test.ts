import Window from '../../src/window/Window.js';
import IWindow from '../../src/window/IWindow.js';
import ResourceFetch from '../../src/fetch/ResourceFetch.js';
import IResponse from '../../src/fetch/types/IResponse.js';
import XMLHttpRequestSyncRequestScriptBuilder from '../../src/xml-http-request/utilities/XMLHttpRequestSyncRequestScriptBuilder.js';
import XMLHttpRequestCertificate from '../../src/xml-http-request/XMLHttpRequestCertificate.js';
import '../types.d.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import IRequestInfo from '../../src/fetch/types/IRequestInfo.js';

const URL = 'https://localhost:8080/base/';

describe('ResourceFetch', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window({ url: URL });
	});

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('fetch()', () => {
		it('Returns resource data asynchrounously.', async () => {
			let fetchedURL: string | null = null;

			vi.spyOn(window, 'fetch').mockImplementation((url: IRequestInfo) => {
				fetchedURL = <string>url;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('test'),
					ok: true
				});
			});

			const test = await ResourceFetch.fetch(window, 'path/to/script/');

			expect(fetchedURL).toBe('path/to/script/');
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

			const response = ResourceFetch.fetchSync(window, 'path/to/script/');

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
				ResourceFetch.fetchSync(window, 'path/to/script/');
			}).toThrowError(`Failed to perform request to "${URL}path/to/script/". Status code: 404`);
		});
	});
});
