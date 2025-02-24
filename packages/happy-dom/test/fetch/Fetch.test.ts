import Window from '../../src/window/Window.js';
import Response from '../../src/fetch/Response.js';
import Headers from '../../src/fetch/Headers.js';
import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import HTTP, { ClientRequest } from 'http';
import Net from 'net';
import Stream from 'stream';
import Zlib from 'zlib';
import { TextEncoder } from 'util';
import Blob from '../../src/file/Blob.js';
import FS from 'fs';
import Path from 'path';
import { URLSearchParams } from 'url';
import '../types.d.js';
import { ReadableStream } from 'stream/web';
import { afterEach, describe, it, expect, vi } from 'vitest';
import FetchHTTPSCertificate from '../../src/fetch/certificate/FetchHTTPSCertificate.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';

const LAST_CHUNK = Buffer.from('0\r\n\r\n');

const PLATFORM =
	'X11; ' +
	process.platform.charAt(0).toUpperCase() +
	process.platform.slice(1) +
	' ' +
	process.arch;

interface IRequestHistoryEntry {
	url: string;
	options: HTTP.RequestOptions;
}
type IBeforeResponse = (context: {
	request: IRequestHistoryEntry;
	response: HTTP.IncomingMessage;
}) => void;
interface IMockNetwork {
	requestHistory: IRequestHistoryEntry[];
}

describe('Fetch', () => {
	function mockNetwork(
		schema: 'http' | 'https',
		specification?: {
			responseText?: string | string[];
			responseProperties?: Record<string, unknown>;
			beforeResponse?: IBeforeResponse;
		}
	): IMockNetwork {
		const requestHistory: IRequestHistoryEntry[] = [];
		mockModule(schema, {
			request: (url: string, options: HTTP.RequestOptions) => {
				const request = { url, options };
				requestHistory.push(request);
				return {
					end: () => {},
					on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
						async function* generate(): AsyncGenerator<string> {
							if (typeof specification?.responseText === 'string') {
								yield specification?.responseText;
							} else if (Array.isArray(specification?.responseText)) {
								for (const text of specification?.responseText) {
									yield text;
								}
							}
						}

						const response = Object.assign(
							<HTTP.IncomingMessage>Stream.Readable.from(generate()),
							{ statusCode: 200, statusMessage: 'OK', headers: {}, rawHeaders: [] },
							specification?.responseProperties ?? {}
						);

						if (event === 'response') {
							if (specification?.beforeResponse) {
								specification.beforeResponse({ request, response });
							}
							callback(response);
						}
					},
					setTimeout: () => {},
					destroy: () => {}
				};
			}
		});
		return {
			get requestHistory() {
				return requestHistory;
			}
		};
	}

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('send()', () => {
		it('Rejects with error if url is protocol relative.', async () => {
			const window = new Window();
			const url = '//example.com/';
			let error: Error | null = null;

			try {
				await window.fetch(url);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct 'Request': Invalid URL "${url}" on document location 'about:blank'. Relative URLs are not permitted on current document location.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Rejects with error if url is relative path and no location is set on the document.', async () => {
			const window = new Window();
			const url = '/some/path';
			let error: Error | null = null;

			try {
				await window.fetch(url);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct 'Request': Invalid URL "${url}" on document location 'about:blank'. Relative URLs are not permitted on current document location.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Rejects with error if protocol is unsupported.', async () => {
			const window = new Window();
			const url = 'ftp://example.com/';
			let error: Error | null = null;

			try {
				await window.fetch(url);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to fetch from "${url}": URL scheme "ftp" is not supported.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Performs a basic plain text HTTPS GET request.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';

			const network = mockNetwork('https', {
				responseText,
				responseProperties: {
					rawHeaders: ['content-type', 'text/html', 'content-length', String(responseText.length)]
				}
			});

			const response = await window.fetch(url);

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'GET',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);

			expect(response instanceof Response).toBe(true);
			expect(response.url).toBe(url);
			expect(response.ok).toBe(true);
			expect(response.redirected).toBe(false);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe('OK');
			expect(response.bodyUsed).toBe(false);
			expect(response.body instanceof ReadableStream).toBe(true);
			expect(response.headers instanceof Headers).toBe(true);

			const headers = {};
			for (const [key, value] of response.headers) {
				headers[key] = value;
			}

			expect(headers).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length)
			});

			const text = await response.text();

			expect(text).toBe(responseText);

			expect(response.bodyUsed).toBe(true);
		});

		it('Performs a basic JSON HTTP GET request.', async () => {
			const window = new Window({ url: 'http://localhost:8080/' });
			const url = 'http://localhost:8080/some/path';
			const responseText = '{ "test": "test" }';

			const network = mockNetwork('http', {
				responseText,
				responseProperties: {
					rawHeaders: [
						'content-type',
						'application/json',
						'content-length',
						String(responseText.length)
					]
				}
			});

			const response = await window.fetch(url);

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'GET',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							Referer: 'http://localhost:8080/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br'
						},
						agent: false,
						rejectUnauthorized: true,
						key: undefined,
						cert: undefined
					}
				}
			]);

			expect(response instanceof Response).toBe(true);
			expect(response.url).toBe(url);
			expect(response.ok).toBe(true);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe('OK');
			expect(response.bodyUsed).toBe(false);
			expect(response.body instanceof ReadableStream).toBe(true);
			expect(response.headers instanceof Headers).toBe(true);

			const headers = {};
			for (const [key, value] of response.headers) {
				headers[key] = value;
			}

			expect(headers).toEqual({
				'content-type': 'application/json',
				'content-length': String(responseText.length)
			});

			const json = await response.json();

			expect(json).toEqual(JSON.parse(responseText));

			expect(response.bodyUsed).toBe(true);
		});

		it('Supports making a request using a Request object.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			const requestObject = new window.Request(url, {
				method: `POST`,
				body: ''
			});

			const network = mockNetwork('https', {
				responseText,
				responseProperties: {
					rawHeaders: ['content-type', 'text/html', 'content-length', String(responseText.length)]
				}
			});

			const response = await window.fetch(requestObject);

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'POST',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							'Content-Type': 'text/plain;charset=UTF-8',
							Referer: 'https://localhost:8080/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);

			expect(response instanceof Response).toBe(true);
			expect(response.url).toBe(url);
			expect(response.ok).toBe(true);
			expect(response.redirected).toBe(false);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe('OK');
			expect(response.bodyUsed).toBe(false);
			expect(response.body instanceof ReadableStream).toBe(true);
			expect(response.headers instanceof Headers).toBe(true);

			const headers = {};
			for (const [key, value] of response.headers) {
				headers[key] = value;
			}

			expect(headers).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length)
			});

			expect(await response.text()).toBe(responseText);

			expect(response.bodyUsed).toBe(true);
		});

		it('Performs a chunked HTTP GET request.', async () => {
			const window = new Window({ url: 'http://localhost:8080/' });
			const url = 'http://localhost:8080/some/path';
			const chunks = ['chunk1', 'chunk2', 'chunk3'];
			const chunksLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

			mockNetwork('http', {
				responseText: chunks,
				responseProperties: {
					rawHeaders: ['content-length', String(chunksLength)]
				}
			});

			const response = await window.fetch(url);

			expect(response.headers.get('Content-Length')).toBe(String(chunksLength));

			expect(await response.text()).toEqual(chunks.join(''));

			expect(response.bodyUsed).toBe(true);
		});

		it('Performs a request with a relative URL and adds the "Referer" header set to the window location.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const path = 'some/path';
			const responseText = 'test';
			const baseUrl = 'https://localhost:8080/base/';

			window.happyDOM?.setURL(baseUrl);

			const network = mockNetwork('https', { responseText });

			await window.fetch(path);

			expect(network.requestHistory).toEqual([
				{
					url: `${baseUrl}${path}`,
					options: {
						method: 'GET',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Referer: baseUrl
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		it('Should send custom key/value object request headers.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const responseText = 'test';

			const network = mockNetwork('https', { responseText });

			await window.fetch(url, {
				headers: {
					key1: 'value1',
					KeY2: 'Value2'
				}
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'GET',
						headers: {
							key1: 'value1',
							KeY2: 'Value2',
							Accept: '*/*',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		it('Should send custom "Headers" instance request headers.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const responseText = 'test';

			const network = mockNetwork('https', { responseText });

			const headers = new Headers({
				key1: 'value1',
				KeY2: 'Value2'
			});

			headers.append('key3', 'value3');
			headers.append('key3', 'value4');

			await window.fetch(url, { headers });

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'GET',
						headers: {
							key1: 'value1',
							KeY2: 'Value2',
							key3: 'value3, value4',
							Accept: '*/*',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		it('Includes Origin + Access-Control headers on cross-origin requests.', async () => {
			const originURL = 'http://localhost:8080';
			const window = new Window({ url: originURL });
			const url = 'http://other.origin.com/some/path';

			const network = mockNetwork('http', {
				beforeResponse({ request, response }) {
					response.rawHeaders =
						request.options.method === 'OPTIONS' ? ['Access-Control-Allow-Origin', '*'] : [];
				}
			});

			await window.fetch(url, {
				method: 'POST',
				body: '{"foo": "bar"}',
				headers: {
					'X-Custom-Header': 'yes',
					'Content-Type': 'application/json'
				}
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						agent: false,
						cert: undefined,
						key: undefined,
						method: 'OPTIONS',
						rejectUnauthorized: true,
						headers: {
							Accept: '*/*',
							'Access-Control-Request-Method': 'POST',
							'Access-Control-Request-Headers': 'content-type,x-custom-header',
							Connection: 'close',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Origin: originURL,
							Referer: originURL + '/'
						}
					}
				},
				{
					url,
					options: {
						agent: false,
						cert: undefined,
						key: undefined,
						method: 'POST',
						rejectUnauthorized: true,
						headers: {
							Accept: '*/*',
							Connection: 'close',
							'Content-Type': 'application/json',
							'Content-Length': '14',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Origin: originURL,
							Referer: originURL + '/',
							'X-Custom-Header': 'yes'
						}
					}
				}
			]);
		});

		it('Allows cross-origin request if "Browser.settings.fetch.disableSameOriginPolicy" is set to "true".', async () => {
			const originURL = 'http://localhost:8080';
			const window = new Window({ url: originURL });
			const url = 'http://other.origin.com/some/path';

			window.happyDOM.settings.fetch.disableSameOriginPolicy = true;
			const network = mockNetwork('http');

			await window.fetch(url, {
				method: 'POST',
				body: '{"foo": "bar"}',
				headers: {
					'X-Custom-Header': 'yes',
					'Content-Type': 'application/json'
				}
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						agent: false,
						cert: undefined,
						key: undefined,
						method: 'POST',
						rejectUnauthorized: true,
						headers: {
							Accept: '*/*',
							Connection: 'close',
							'Content-Type': 'application/json',
							'Content-Length': '14',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Origin: originURL,
							Referer: originURL + '/',
							'X-Custom-Header': 'yes'
						}
					}
				}
			]);
		});

		for (const httpCode of [301, 302, 303, 307, 308]) {
			for (const method of ['GET', 'POST', 'PATCH']) {
				it(`Should follow ${method} request redirect code ${httpCode}.`, async () => {
					const window = new Window({ url: 'https://localhost:8080/' });
					const redirectURL = 'https://localhost:8080/redirect';
					const redirectURL2 = 'https://localhost:8080/redirect2';
					const targetPath = '/some/path';
					const targetURL = 'https://localhost:8080' + targetPath;
					const body = method !== 'GET' ? 'a=1' : null;
					const responseText = '{ "key1": "value1" }';
					const requestArgs: Array<{
						url: string;
						options: { method: string; headers: { [k: string]: string } };
					}> = [];
					let destroyCount = 0;
					let writtenBodyData = '';

					mockModule('https', {
						request: (url, options) => {
							requestArgs.push({ url, options });

							const request = <HTTP.ClientRequest>new Stream.Writable();

							request._write = (chunk, _encoding, callback) => {
								writtenBodyData += chunk.toString();
								callback();
							};
							(<unknown>request.on) = (
								event: string,
								callback: (response: HTTP.IncomingMessage) => void
							) => {
								if (event === 'response') {
									setTimeout(() => {
										async function* generate(): AsyncGenerator<string> {
											yield requestArgs.length < 3 ? '' : responseText;
										}

										const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

										response.headers = {};

										if (requestArgs.length === 1) {
											response.statusCode = httpCode;
											response.rawHeaders = ['Location', redirectURL2];
										} else if (requestArgs.length === 2) {
											response.statusCode = httpCode;
											response.rawHeaders = ['Location', targetPath];
										} else {
											response.statusCode = 200;
											response.rawHeaders = [];
										}

										callback(response);
									});
								}
							};
							(<unknown>request.setTimeout) = () => {};
							request.destroy = () => <ClientRequest>(destroyCount++ && {});

							return request;
						}
					});

					const response = await window.fetch(redirectURL, {
						method,
						headers: {
							key1: 'value1',
							key2: 'value2'
						},
						body
					});

					const shouldBecomeGetRequest =
						httpCode === 303 || ((httpCode === 301 || httpCode === 302) && method === 'POST');

					expect(requestArgs).toEqual([
						{
							url: redirectURL,
							options: {
								method: method,
								headers: {
									key1: 'value1',
									key2: 'value2',
									Accept: '*/*',
									'Content-Length': body ? String(body.length) : undefined,
									'Content-Type': body ? 'text/plain;charset=UTF-8' : undefined,
									Connection: 'close',
									Referer: 'https://localhost:8080/',
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br'
								},
								agent: false,
								rejectUnauthorized: true,
								key: FetchHTTPSCertificate.key,
								cert: FetchHTTPSCertificate.cert
							}
						},
						{
							url: redirectURL2,
							options: {
								method: shouldBecomeGetRequest ? 'GET' : method,
								headers: {
									key1: 'value1',
									key2: 'value2',
									Accept: '*/*',
									'Content-Length':
										body && !shouldBecomeGetRequest ? String(body.length) : undefined,
									'Content-Type':
										body && !shouldBecomeGetRequest ? 'text/plain;charset=UTF-8' : undefined,
									Connection: 'close',
									Referer: 'https://localhost:8080/',
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br'
								},
								agent: false,
								rejectUnauthorized: true,
								key: FetchHTTPSCertificate.key,
								cert: FetchHTTPSCertificate.cert
							}
						},
						{
							url: targetURL,
							options: {
								method: shouldBecomeGetRequest ? 'GET' : method,
								headers: {
									key1: 'value1',
									key2: 'value2',
									Accept: '*/*',
									'Content-Length':
										body && !shouldBecomeGetRequest ? String(body.length) : undefined,
									'Content-Type':
										body && !shouldBecomeGetRequest ? 'text/plain;charset=UTF-8' : undefined,
									Connection: 'close',
									Referer: 'https://localhost:8080/',
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br'
								},
								agent: false,
								rejectUnauthorized: true,
								key: FetchHTTPSCertificate.key,
								cert: FetchHTTPSCertificate.cert
							}
						}
					]);

					if (body && !shouldBecomeGetRequest) {
						expect(writtenBodyData).toBe(body + body + body);
					}

					// As the Node request is a stream, it is destroyed automatically internally by Node.js adding 3 more destroys.
					// Fetch.ts adds 2 destroys after each redirect.
					expect(destroyCount).toBe(5);

					expect(response.status).toBe(200);
					expect(response.redirected).toBe(true);

					const result = await response.json();

					expect(result).toEqual(JSON.parse(responseText));
				});
			}
		}

		it('Should cancel a redirect loop after 20 tries.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url1 = 'https://localhost:8080/test/';
			const url2 = 'https://localhost:8080/test2/';
			let error: Error | null = null;
			let tryCount = 0;

			mockNetwork('https', {
				beforeResponse({ request, response }) {
					response.statusCode = 302;
					response.rawHeaders = request.url === url1 ? ['Location', url2] : ['Location', url1];
					tryCount++;
				}
			});

			try {
				await window.fetch(url1, { method: 'GET' });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(`Maximum redirects reached at: ${url1}`, DOMExceptionNameEnum.networkError)
			);

			// One more as the request is completed before it reaches the 20th try.
			expect(tryCount).toBe(20 + 1);
		});

		it('Should support "manual" redirect mode.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://localhost:8080/redirect/';

			mockNetwork('https', {
				responseProperties: {
					statusCode: 301,
					statusMessage: 'Moved Permanently',
					rawHeaders: ['Location', redirectURL]
				}
			});

			const response = await window.fetch(url, { method: 'GET', redirect: 'manual' });

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should support "manual" redirect mode with broken location header.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const redirectURL = '<>';

			mockNetwork('https', {
				responseProperties: {
					statusCode: 301,
					rawHeaders: ['Location', redirectURL]
				}
			});

			const response = await window.fetch(url, { method: 'GET', redirect: 'manual' });

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should support "manual" redirect mode to other host.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://example.com/redirect/';

			mockNetwork('https', {
				responseProperties: {
					statusCode: 301,
					rawHeaders: ['Location', redirectURL]
				}
			});

			const response = await window.fetch(url, { method: 'GET', redirect: 'manual' });

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should treat missing location header as a normal response (manual).', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			mockNetwork('https', {
				responseProperties: {
					statusCode: 301
				}
			});

			const response = await window.fetch(url, { method: 'GET', redirect: 'manual' });

			expect(response.status).toBe(301);
		});

		it('Should support "error" redirect.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://localhost:8080/redirect/';
			let error: Error | null = null;

			mockNetwork('https', {
				responseProperties: {
					statusCode: 301,
					rawHeaders: ['Location', redirectURL]
				}
			});

			try {
				await window.fetch(url, { method: 'GET', redirect: 'error' });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`URI requested responds with a redirect, redirect mode is set to "error": ${url}`,
					DOMExceptionNameEnum.abortError
				)
			);
		});

		it('Should throw an error on invalid redirect URLs.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const redirectURL = '//super:invalid:url%/';
			let error: Error | null = null;

			mockNetwork('https', {
				responseProperties: {
					statusCode: 301,
					rawHeaders: ['Location', redirectURL]
				}
			});

			try {
				await window.fetch(url, { method: 'GET' });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`URI requested responds with an invalid redirect URL: ${redirectURL}`,
					DOMExceptionNameEnum.uriMismatchError
				)
			);
		});

		it("Doesn't forward unsafe headers.", async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';

			const network = mockNetwork('https');

			await window.fetch(url, {
				headers: {
					'accept-charset': 'unsafe',
					'accept-encoding': 'unsafe',
					'access-control-request-headers': 'unsafe',
					'access-control-request-method': 'unsafe',
					connection: 'unsafe',
					'content-length': 'unsafe',
					cookie: 'unsafe',
					cookie2: 'unsafe',
					date: 'unsafe',
					dnt: 'unsafe',
					expect: 'unsafe',
					host: 'unsafe',
					'keep-alive': 'unsafe',
					origin: 'unsafe',
					referer: 'unsafe',
					te: 'unsafe',
					trailer: 'unsafe',
					'transfer-encoding': 'unsafe',
					upgrade: 'unsafe',
					via: 'unsafe',
					'proxy-unsafe': 'unsafe',
					'sec-unsafe': 'unsafe',
					'safe-header': 'safe'
				}
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'GET',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							'safe-header': 'safe'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		it(`Doesn't forward the headers "cookie", "authorization" or "www-authenticate" if request credentials are set to "omit".`, async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';

			window.document.cookie = 'test=cookie';

			const network = mockNetwork('https');

			await window.fetch(url, {
				headers: {
					authorization: 'authorization',
					'www-authenticate': 'www-authenticate'
				},
				credentials: 'omit'
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'GET',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		it('Does not forward the headers "cookie", "authorization" or "www-authenticate" if request credentials are set to "same-origin" and the request goes do a different origin than the document.', async () => {
			const originURL = 'https://localhost:8080';
			const window = new Window({ url: originURL });
			const url = 'https://other.origin.com/some/path';

			window.document.cookie = 'test=cookie';

			const network = mockNetwork('https', {
				beforeResponse({ request, response }) {
					response.rawHeaders =
						request.options.method === 'OPTIONS' ? ['Access-Control-Allow-Origin', '*'] : [];
				}
			});

			await window.fetch(url, {
				headers: {
					authorization: 'authorization',
					'www-authenticate': 'www-authenticate'
				},
				credentials: 'same-origin'
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert,
						method: 'OPTIONS',
						headers: {
							Accept: '*/*',
							'Access-Control-Request-Method': 'GET',
							'Access-Control-Request-Headers': 'authorization,www-authenticate',
							Connection: 'close',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Origin: originURL,
							Referer: originURL + '/'
						}
					}
				},
				{
					url,
					options: {
						method: 'GET',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Origin: originURL,
							Referer: originURL + '/'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		it("Doesn't allow requests to HTTP from HTTPS (mixed content).", async () => {
			const originURL = 'https://localhost:8080/';
			const window = new Window({ url: originURL });
			const url = 'http://localhost:8080/some/path';
			let error: Error | null = null;

			try {
				await window.fetch(url);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Mixed Content: The page at '${originURL}' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint '${url}'. This request has been blocked; the content must be served over HTTPS.`,
					DOMExceptionNameEnum.securityError
				)
			);
		});

		it('Should use intercepted response and not send the request when beforeAsyncRequest returns a Response', async () => {
			const originURL = 'https://localhost:8080/';
			const window = new Window({
				url: originURL,
				settings: {
					fetch: {
						interceptor: {
							async beforeAsyncRequest({ window }) {
								return new window.Response('intercepted text');
							}
						}
					}
				}
			});
			const url = 'https://localhost:8080/some/path';

			const network = mockNetwork('https', {
				beforeResponse() {
					fail('No request should be made when beforeAsyncRequest returns a Response');
				}
			});

			const response = await window.fetch(url);

			expect(await response.text()).toBe('intercepted text');
		});

		it('Should make a normal request when before does not return a Response', async () => {
			const originURL = 'https://localhost:8080/';
			const responseText = 'some text';
			const window = new Window({
				url: originURL,
				settings: {
					fetch: {
						interceptor: {
							async beforeAsyncRequest() {
								return undefined;
							}
						}
					}
				}
			});
			const url = 'https://localhost:8080/some/path';

			mockNetwork('https', {
				responseText,
				responseProperties: {
					rawHeaders: ['content-type', 'text/html', 'content-length', String(responseText.length)]
				}
			});

			const response = await window.fetch(url);

			expect(await response.text()).toBe('some text');
		});

		it('Should use intercepted response when given', async () => {
			const originURL = 'https://localhost:8080/';
			const responseText = 'some text';
			const window = new Window({
				url: originURL,
				settings: {
					fetch: {
						interceptor: {
							async afterAsyncResponse({ window }) {
								return new window.Response('intercepted text');
							}
						}
					}
				}
			});
			const url = 'https://localhost:8080/some/path';

			mockNetwork('https', {
				responseText: 'some text',
				responseProperties: {
					rawHeaders: ['content-type', 'text/html', 'content-length', String(responseText.length)]
				}
			});

			const response = await window.fetch(url);

			expect(await response.text()).toBe('intercepted text');
		});

		it('Should use original response when no response is given', async () => {
			const originURL = 'https://localhost:8080/';
			const responseText = 'some text';
			const window = new Window({
				url: originURL,
				settings: {
					fetch: {
						interceptor: {
							async afterAsyncResponse({ response }) {
								response.headers.set('x-test', 'yes');
								return undefined;
							}
						}
					}
				}
			});
			const url = 'https://localhost:8080/some/path';

			mockNetwork('https', {
				responseText,
				responseProperties: {
					rawHeaders: ['content-type', 'text/html', 'content-length', String(responseText.length)]
				}
			});

			const response = await window.fetch(url);

			expect(await response.text()).toBe(responseText);
			expect(response.headers.get('x-test')).toBe('yes');
		});

		it('Forwards "cookie", "authorization" or "www-authenticate" if request credentials are set to "same-origin" and the request goes to the same origin as the document.', async () => {
			const originURL = 'https://localhost:8080';
			const window = new Window({ url: originURL });
			const url = 'https://localhost:8080/some/path';
			const cookies = 'key1=value1; key2=value2';

			window.happyDOM?.setURL(originURL);

			for (const cookie of cookies.split(';')) {
				window.document.cookie = cookie.trim();
			}

			const network = mockNetwork('https');

			await window.fetch(url, {
				headers: {
					authorization: 'authorization',
					'www-authenticate': 'www-authenticate'
				},
				credentials: 'same-origin'
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'GET',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Referer: originURL + '/',
							Cookie: cookies,
							authorization: 'authorization',
							'www-authenticate': 'www-authenticate'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		it('Forwards "cookie", "authorization" or "www-authenticate" if request credentials are set to "include".', async () => {
			const originURL = 'https://localhost:8080';
			const window = new Window({ url: originURL });
			const url = 'https://other.origin.com/some/path';
			const cookies = 'key1=value1; key2=value2';

			for (const cookie of cookies.split(';')) {
				window.document.cookie = cookie.trim();
			}

			const network = mockNetwork('https', {
				beforeResponse({ request, response }) {
					response.rawHeaders =
						request.options.method === 'OPTIONS' ? ['Access-Control-Allow-Origin', '*'] : [];
				}
			});

			await window.fetch(url, {
				headers: {
					authorization: 'authorization',
					'www-authenticate': 'www-authenticate'
				},
				credentials: 'include'
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert,
						method: 'OPTIONS',
						headers: {
							Accept: '*/*',
							'Access-Control-Request-Method': 'GET',
							'Access-Control-Request-Headers': 'authorization,www-authenticate',
							Connection: 'close',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Origin: originURL,
							Referer: originURL + '/'
						}
					}
				},
				{
					url,
					options: {
						method: 'GET',
						headers: {
							Accept: '*/*',
							Connection: 'close',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Origin: originURL,
							Referer: originURL + '/',
							Cookie: cookies,
							authorization: 'authorization',
							'www-authenticate': 'www-authenticate'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		it('Sets document cookie string if the response contains a "Set-Cookie" header if request cridentials are set to "include".', async () => {
			const window = new Window({ url: 'https://localhost:8080' });
			mockNetwork('https', {
				responseProperties: {
					rawHeaders: ['Set-Cookie', 'key1=value1', 'Set-Cookie', 'key2=value2']
				}
			});

			const response = await window.fetch('https://localhost:8080/some/path', {
				credentials: 'include'
			});

			expect(response.headers.get('Set-Cookie')).toBe(null);
			expect(window.document.cookie).toBe('key1=value1; key2=value2');
		});

		it('Allows setting the headers "User-Agent" and "Accept".', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			const network = mockNetwork('https');

			await window.fetch(url, {
				method: 'GET',
				headers: {
					'User-Agent': 'user-agent',
					Accept: 'accept'
				}
			});

			expect(network.requestHistory).toEqual([
				{
					url,
					options: {
						method: 'GET',
						headers: {
							'Accept-Encoding': 'gzip, deflate, br',
							'User-Agent': 'user-agent',
							Accept: 'accept',
							Connection: 'close',
							Referer: 'https://localhost:8080/'
						},
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					}
				}
			]);
		});

		for (const errorCode of [400, 401, 403, 404, 500]) {
			it(`Handles error response with status ${errorCode}.`, async () => {
				const window = new Window({ url: 'https://localhost:8080/' });
				const responseText = 'some response text';

				mockNetwork('https', {
					responseText,
					responseProperties: {
						statusCode: errorCode,
						statusMessage: 'Bad Request',
						rawHeaders: ['Content-Type', 'text/plain']
					}
				});

				const response = await window.fetch('https://localhost:8080/some/path');

				expect(response.status).toBe(errorCode);
				expect(response.statusText).toBe('Bad Request');
				expect(response.headers.get('Content-Type')).toBe('text/plain');
				expect(response.ok).toBe(false);
				expect(await response.text()).toBe(responseText);
			});
		}

		it(`Handles network error response.`, async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			let error: Error | null = null;

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: Error) => void) => {
							if (event === 'error') {
								callback(new Error('connect ECONNREFUSED ::1:8080'));
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			try {
				await window.fetch(url);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to execute "fetch()" on "Window" with URL "${url}": connect ECONNREFUSED ::1:8080`,
					DOMExceptionNameEnum.networkError
				)
			);
		});

		it('Doesn`t break in socket logic if response is not chunked.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const responseText = 'some response text';
			const removedListeners: string[] = [];

			mockModule('https', {
				request: () => {
					let requestCloseListener: (() => void) | null = null;
					let socketCloseListener: (() => void) | null = null;
					const socket = <Net.Socket>(<unknown>{
						prependListener: (event: string, listener: () => void) => {
							if (event === 'close') {
								socketCloseListener = listener;
							}
						},
						on: (event: string, listener: (chunk: Buffer) => void) => {
							if (event === 'data') {
								listener(Buffer.from(responseText));
							}
						},
						removeListener: (event: string) => {
							removedListeners.push(event);
						}
					});

					return {
						end: () => {
							(<() => void>requestCloseListener)();
						},
						on: (
							event: string,
							callback: (response: HTTP.IncomingMessage | Net.Socket) => void
						) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {
									yield responseText;
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);

								(<() => void>socketCloseListener)();
							} else if (event === 'socket') {
								callback(socket);
							} else if (event === 'close') {
								requestCloseListener = <() => void>callback;
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response = await window.fetch('https://localhost:8080/some/path');
			const text = await response.text();

			expect(removedListeners).toEqual(['close', 'data']);
			expect(text).toBe(responseText);
		});

		it('Throws an error on premature close of chunked transfers when closing socket.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const chunks = ['chunk1', 'chunk2', 'chunk3'];

			mockModule('https', {
				request: () => {
					let requestCloseListener: (() => void) | null = null;
					let socketCloseListener: (() => void) | null = null;
					let socketDataListener: ((chunk: Buffer) => void) | null = null;
					const socket = <Net.Socket>(<unknown>{
						prependListener: (event: string, listener: () => void) => {
							if (event === 'close') {
								socketCloseListener = listener;
							}
						},
						on: (event: string, listener: (chunk: Buffer) => void) => {
							if (event === 'data') {
								socketDataListener = listener;
							}
						},
						removeListener: () => {}
					});

					return {
						end: () => {
							(<() => void>requestCloseListener)();
						},
						on: (
							event: string,
							callback: (response: HTTP.IncomingMessage | Net.Socket) => void
						) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										setTimeout(() => {
											(<(chunk: Buffer) => void>socketDataListener)(Buffer.from(chunks[0]));
											resolve(Buffer.from(chunks[0]));
										}, 10);
									});
									yield await new Promise((resolve) => {
										setTimeout(() => {
											(<(chunk: Buffer) => void>socketDataListener)(Buffer.from(chunks[1]));
											resolve(Buffer.from(chunks[1]));
										}, 10);
									});
									yield await new Promise((resolve) => {
										(<() => void>socketCloseListener)();
										setTimeout(() => {
											(<(chunk: Buffer) => void>socketDataListener)(Buffer.from(chunks[2]));
											resolve(Buffer.from(chunks[2]));
										}, 10);
									});
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = { 'transfer-encoding': 'chunked' };
								response.rawHeaders = ['Transfer-Encoding', 'chunked'];

								callback(response);
							} else if (event === 'socket') {
								callback(socket);
							} else if (event === 'close') {
								requestCloseListener = <() => void>callback;
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response = await window.fetch('https://localhost:8080/some/path');
			let error: Error | null = null;

			try {
				await response.text();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException('Premature close.', DOMExceptionNameEnum.networkError)
			);
		});

		it('Throws an error on premature close when reading chunks.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const chunks = ['chunk1', 'chunk2', 'chunk3'];

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										setTimeout(() => {
											resolve(Buffer.from(chunks[0]));
										}, 10);
									});
									yield await new Promise((_resolve, reject) => {
										setTimeout(() => {
											reject(new Error('Error'));
										}, 10);
									});
									yield await new Promise((resolve) => {
										setTimeout(() => {
											resolve(Buffer.from(chunks[2]));
										}, 10);
									});
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			let error: Error | null = null;

			try {
				await response.text();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					'Failed to read response body. Error: Error.',
					DOMExceptionNameEnum.encodingError
				)
			);
		});

		it('Should follow redirect after empty chunked transfer-encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url1 = 'https://localhost:8080/test/';
			const url2 = 'https://localhost:8080/test2/';
			const chunks = ['chunk1'];

			mockModule('https', {
				request: (requestURL) => {
					let requestCloseListener: (() => void) | null = null;
					let socketCloseListener: (() => void) | null = null;
					let socketDataListener: ((chunk: Buffer) => void) | null = null;
					const socket = <Net.Socket>(<unknown>{
						prependListener: (event: string, listener: () => void) => {
							if (event === 'close') {
								socketCloseListener = listener;
							}
						},
						on: (event: string, listener: (chunk: Buffer) => void) => {
							if (event === 'data') {
								socketDataListener = listener;
							}
						},
						removeListener: () => {}
					});
					return {
						end: () => {},
						on: (
							event: string,
							callback: (response: HTTP.IncomingMessage | Net.Socket) => void
						) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {}
								async function* generate2(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										setTimeout(() => {
											(<(chunk: Buffer) => void>socketDataListener)(
												Buffer.concat([Buffer.from(chunks[0]), LAST_CHUNK])
											);
											resolve(Buffer.from(chunks[0]));
											setTimeout(() => {
												(<() => void>socketCloseListener)();
												(<() => void>requestCloseListener)();
											}, 10);
										}, 10);
									});
								}
								const response = <HTTP.IncomingMessage>(
									Stream.Readable.from(requestURL === url1 ? generate() : generate2())
								);

								response.statusCode = 200;
								response.headers = { 'transfer-encoding': 'chunked' };
								response.rawHeaders = ['Transfer-Encoding', 'chunked'];

								if (requestURL === url1) {
									response.statusCode = 302;
									response.rawHeaders.push('Location', url2);
								}

								callback(response);
							} else if (event === 'socket') {
								callback(socket);
							} else if (event === 'close') {
								requestCloseListener = <() => void>callback;
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url1, { method: 'GET' });
			const text = await response.text();
			expect(text).toBe(chunks[0]);
		});

		it('Should handle no content response with "gzip" encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			mockNetwork('https', { responseProperties: { rawHeaders: ['Content-Encoding', 'gzip'] } });

			const response = await window.fetch(url, { method: 'GET' });
			const text = await response.text();
			expect(text).toBe('');
		});

		it('Handles unzipping content with "gzip" encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const chunks = ['chunk1', 'chunk2', 'chunk3'];

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										Zlib.gzip(Buffer.from(chunks[0]), (_error, result) => resolve(result));
									});
									yield await new Promise((resolve) => {
										Zlib.gzip(Buffer.from(chunks[1]), (_error, result) => resolve(result));
									});
									yield await new Promise((resolve) => {
										Zlib.gzip(Buffer.from(chunks[2]), (_error, result) => resolve(result));
									});
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'gzip'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			const text = await response.text();
			expect(text).toBe(chunks.join(''));
		});

		it('Should unzip content with slightly invalid "gzip" encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										Zlib.gzip(Buffer.from(responseText), (_error, result) =>
											// Truncate the CRC checksum and size check at the end of the stream
											resolve(result.slice(0, -8))
										);
									});
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'gzip'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			const text = await response.text();
			expect(text).toBe(responseText);
		});

		it('Handles 204 no content response with "gzip" encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 204;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'gzip'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			expect(response.status).toBe(204);
		});

		it('Should decompress content with "deflate" encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										Zlib.deflate(Buffer.from(responseText), (_error, result) => resolve(result));
									});
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'deflate'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			const text = await response.text();
			expect(text).toBe(responseText);
		});

		it('Handles 204 no content response with "deflate" encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			mockNetwork('https', {
				responseProperties: {
					statusCode: 204,
					rawHeaders: ['Content-Encoding', 'deflate']
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			expect(response.status).toBe(204);
		});

		it('Should decompress content with raw "deflate" encoding from old apache server.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										Zlib.deflateRaw(Buffer.from(responseText), (_error, result) => resolve(result));
									});
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'deflate'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			const text = await response.text();
			expect(text).toBe(responseText);
		});

		it('Handles unzipping content with "br" (brotli) encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										Zlib.brotliCompress(Buffer.from(responseText), (_error, result) =>
											resolve(result)
										);
									});
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'br'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			const text = await response.text();
			expect(text).toBe(responseText);
		});

		it('Handles 204 no content response with "br" (brotli) encoding.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 204;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'br'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			expect(response.status).toBe(204);
		});

		it('Skips decompression for unsupported encodings.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield Buffer.from(responseText);
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'unsupported-encoding'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			const text = await response.text();
			expect(text).toBe(responseText);
		});

		it('Rejects with an error if decompression for "gzip" encoding is invalid.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield Buffer.from('invalid');
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = ['Content-Encoding', 'gzip'];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET' });
			let error: Error | null = null;

			try {
				await response.text();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					'Failed to read response body. Error: incorrect header check.',
					DOMExceptionNameEnum.encodingError
				)
			);
		});

		it('Supports aborting a request using AbortController and AbortSignal.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: () => {},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;
			let error: Error | null = null;

			setTimeout(() => {
				abortController.abort();
			}, 10);

			try {
				await window.fetch(url, { method: 'GET', signal: abortSignal });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException('signal is aborted without reason', DOMExceptionNameEnum.abortError)
			);
		});

		it('Supports aborting a request using AbortSignal.timeout()', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: () => {},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const signal = window.AbortSignal.timeout(10);

			let error: Error | null = null;

			try {
				await window.fetch('https://localhost:8080/test/', { signal });
			} catch (e) {
				error = e;
			}

			expect(error).toBeInstanceOf(window.DOMException);
			expect((<Error>error).name).toBe('TimeoutError');
			expect((<Error>error).message).toBe('signal timed out');
		});

		it('Supports an already aborted signal using a custom reason', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;

			abortController.abort(1);

			let error: Error | null = null;

			try {
				await window.fetch('https://example.com', { signal: abortSignal });
			} catch (e) {
				error = e;
			}

			expect(error).toBe(1);
		});

		it('Supports aborting a request using AbortController and AbortSignal with a custom reason', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;

			setTimeout(() => {
				abortController.abort(1);
			}, 10);

			let error: Error | null = null;

			try {
				await window.fetch('https://localhost:8080/test/', { signal: abortSignal });
			} catch (e) {
				error = e;
			}

			expect(error).toBe(1);
		});

		it('Supports aborting a redirect request using AbortController and AbortSignal.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url1 = 'https://localhost:8080/redirect/';
			const url2 = 'https://localhost:8080/redirect2/';
			const url3 = 'https://localhost:8080/target/';

			mockModule('https', {
				request: (requestURL) => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								setTimeout(() => {
									async function* generate(): AsyncGenerator<Buffer> {}
									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = requestURL === url3 ? 200 : 302;
									response.headers = {};
									response.rawHeaders = [];

									if (requestURL === url1) {
										response.rawHeaders = ['Location', url2];
									} else if (requestURL === url2) {
										response.rawHeaders = ['Location', url3];
									}

									callback(response);
								}, 10);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;
			let error: Error | null = null;

			setTimeout(() => {
				abortController.abort();
			}, 15);

			try {
				await window.fetch(url1, { method: 'GET', signal: abortSignal });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException('signal is aborted without reason', DOMExceptionNameEnum.abortError)
			);
		});
		it('Supports aborting multiple ongoing requests using AbortController.', async () => {
			await new Promise((resolve) => {
				const window = new Window({ url: 'https://localhost:8080/' });
				const url = 'https://localhost:8080/test/';
				const responseText = 'some response text';

				mockModule('https', {
					request: () => {
						return {
							end: () => {},
							on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
								if (event === 'response') {
									setTimeout(() => {
										async function* generate(): AsyncGenerator<Buffer> {
											yield Buffer.from(responseText);
										}
										const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

										response.statusCode = 200;
										response.headers = {};
										response.rawHeaders = [];

										callback(response);
									}, 20);
								}
							},
							setTimeout: () => {},
							destroy: () => {}
						};
					}
				});

				const abortController = new window.AbortController();
				const abortSignal = abortController.signal;
				let error1: Error | null = null;
				let error2: Error | null = null;

				setTimeout(() => {
					abortController.abort();
				}, 10);

				const onFetchCatch = (): void => {
					if (error1 && error2) {
						expect(error1).toEqual(
							new DOMException('signal is aborted without reason', DOMExceptionNameEnum.abortError)
						);
						expect(error2).toEqual(
							new DOMException('signal is aborted without reason', DOMExceptionNameEnum.abortError)
						);
						resolve(null);
					}
				};

				window.fetch(url, { method: 'GET', signal: abortSignal }).catch((e) => {
					error1 = e;
					onFetchCatch();
				});

				window.fetch(url, { method: 'GET', signal: abortSignal }).catch((e) => {
					error2 = e;
					onFetchCatch();
				});
			});
		});

		it('Rejects immediately if signal has already been aborted.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;

			abortController.abort();

			let error: Error | null = null;
			try {
				await window.fetch(url, { method: 'GET', signal: abortSignal });
			} catch (e) {
				error = e;
			}
			expect(error).toEqual(
				new DOMException('signal is aborted without reason', DOMExceptionNameEnum.abortError)
			);
		});

		it('Supports aborting the read of the response body using AbortController and AbortSignal when aborted before the reading has started.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const chunks = ['chunk1', 'chunk2'];

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield Buffer.from(chunks[0]);
									yield Buffer.from(chunks[1]);
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;
			const response = await window.fetch(url, { method: 'GET', signal: abortSignal });
			let error: Error | null = null;

			abortController.abort();

			try {
				await response.text();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					'The operation was aborted. AbortError: signal is aborted without reason',
					DOMExceptionNameEnum.abortError
				)
			);
		});

		it('Supports aborting the read of the response body using AbortController and AbortSignal.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const chunks = ['chunk1', 'chunk2', 'chunk3'];

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {
									yield await new Promise((resolve) => {
										setTimeout(() => {
											resolve(Buffer.from(chunks[0]));
										}, 10);
									});
									yield await new Promise((resolve) => {
										setTimeout(() => {
											resolve(Buffer.from(chunks[1]));
										}, 10);
									});
									yield await new Promise((resolve) => {
										setTimeout(() => {
											resolve(Buffer.from(chunks[2]));
										}, 10);
									});
								}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;
			const response = await window.fetch(url, { method: 'GET', signal: abortSignal });
			let error: Error | null = null;

			setTimeout(() => {
				abortController.abort();
			}, 20);

			try {
				await response.text();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					'The operation was aborted. AbortError: signal is aborted without reason',
					DOMExceptionNameEnum.abortError
				)
			);
		});

		it('Supports aborting the read of the request body using AbortController and AbortSignal.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';
			const chunks = ['chunk1', 'chunk2', 'chunk3'];
			const body = new ReadableStream({
				start(controller) {
					setTimeout(() => {
						controller.enqueue(chunks[0]);
					}, 10);
					setTimeout(() => {
						controller.enqueue(chunks[1]);
					}, 20);
					setTimeout(() => {
						controller.enqueue(chunks[2]);
						controller.close();
					}, 30);
				}
			});

			mockModule('https', {
				request: () => {
					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (_chunk, _encoding, callback) => {
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							}, 40);
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>{};

					return request;
				}
			});

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;
			let error: Error | null = null;

			setTimeout(() => {
				abortController.abort();
			}, 20);

			try {
				await window.fetch(url, { method: 'POST', body, signal: abortSignal });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException('signal is aborted without reason', DOMExceptionNameEnum.abortError)
			);
		});

		it('Removes internal abort listener when a request has completed.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/test/';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<Buffer> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;
			const response = await window.fetch(url, { method: 'GET', signal: abortSignal });

			await response.text();

			expect(abortSignal[PropertySymbol.listeners].bubbling.get('abort')).toEqual([]);
			expect(() => abortController.abort()).not.toThrow();
		});

		it('Supports POST request with body as string.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const body = 'Hello, world!\n';

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Type': 'text/plain;charset=UTF-8',
						'Content-Length': '14'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});

			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe(body);
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as object (by stringifying to [object Object]).', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const body = { key: 'value' };

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: <string>(<unknown>body)
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Type': 'text/plain;charset=UTF-8',
						'Content-Length': '15'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});

			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe('[object Object]');
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as ArrayBuffer.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const body = 'Hello, world!\n';

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: new TextEncoder().encode(body).buffer
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': '14'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe(body);
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as ArrayBufferView (Uint8Array).', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const body = 'Hello, world!\n';

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: new TextEncoder().encode(body)
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': '14'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe(body);
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as ArrayBufferView (DataView).', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const body = 'Hello, world!\n';

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: new DataView(new TextEncoder().encode(body).buffer)
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': '14'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe(body);
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as ArrayBufferView (Uint8Array, offset, length).', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const body = 'Hello, world!\n';

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: new TextEncoder().encode(body).subarray(7, 13)
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': '6'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe('world!');
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as Blob without type.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const body = 'key1=value1&key2=value2';

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: new Blob([body])
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': '23'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe('key1=value1&key2=value2');
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as Blob with type.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const body = 'key1=value1&key2=value2';

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: new Blob([body], {
					type: 'text/plain;charset=UTF-8'
				})
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						// Blob converts type to lowercase according to spec
						'Content-Type': 'text/plain;charset=utf-8',
						'Content-Length': '23'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe('key1=value1&key2=value2');
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as Stream.Readable.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const chunks = ['chunk1', 'chunk2', 'chunk3'];
			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							}, 100);
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: new ReadableStream({
					start(controller) {
						setTimeout(() => {
							controller.enqueue(chunks[0]);
						}, 10);
						setTimeout(() => {
							controller.enqueue(chunks[1]);
						}, 20);
						setTimeout(() => {
							controller.enqueue(chunks[2]);
							controller.close();
						}, 30);
					}
				})
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe(chunks.join(''));
			expect(response.status).toBe(200);
		});

		it('Should reject if Stream.Readable throws an error.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const chunks = ['chunk1', 'chunk2', 'chunk3'];

			mockModule('https', {
				request: () => {
					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (_chunk, _encoding, callback) => {
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							}, 40);
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>{};

					return request;
				}
			});

			let error: Error | null = null;
			try {
				await window.fetch('https://localhost:8080/test/', {
					method: 'POST',
					body: new ReadableStream({
						start(controller) {
							setTimeout(() => {
								controller.enqueue(chunks[0]);
							}, 10);
							setTimeout(() => {
								controller.error(new Error('test'));
							}, 20);
						}
					})
				});
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to execute "fetch()" on "Window" with URL "https://localhost:8080/test/": test`,
					DOMExceptionNameEnum.networkError
				)
			);
		});

		it('Supports POST request with body as FormData.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const formData = new window.FormData();

			vi.spyOn(Math, 'random').mockImplementation(() => 0.8);

			formData.set('key1', 'value1');
			formData.set('key2', 'value2');

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							}, 10);
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: formData
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Type':
							'multipart/form-data; boundary=----HappyDOMFormDataBoundary0.ssssssssst',
						'Content-Length': '244'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe(
				'------HappyDOMFormDataBoundary0.ssssssssst\r\nContent-Disposition: form-data; name="key1"\r\n\r\nvalue1\r\n------HappyDOMFormDataBoundary0.ssssssssst\r\nContent-Disposition: form-data; name="key2"\r\n\r\nvalue2\r\n------HappyDOMFormDataBoundary0.ssssssssst--\r\n'
			);
			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as URLSearchParams.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const urlSearchParams = new URLSearchParams();

			urlSearchParams.set('key1', 'value1');
			urlSearchParams.set('key2', 'value2');

			let destroyCount = 0;
			let writtenBodyData = '';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					const request = <HTTP.ClientRequest>new Stream.Writable();

					request._write = (chunk, _encoding, callback) => {
						writtenBodyData += chunk.toString();
						callback();
					};
					(<unknown>request.on) = (
						event: string,
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						if (event === 'response') {
							setTimeout(() => {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];
								response.statusCode = 200;

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			const response = await window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: urlSearchParams
			});

			expect(requestArgs).toEqual({
				url: 'https://localhost:8080/test/',
				options: {
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': '23',
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
					},
					agent: false,
					rejectUnauthorized: true,
					key: FetchHTTPSCertificate.key,
					cert: FetchHTTPSCertificate.cert
				}
			});
			expect(destroyCount).toBe(1);
			expect(writtenBodyData).toBe('key1=value1&key2=value2');
			expect(response.status).toBe(200);
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const window = new Window({ url: 'https://localhost:8080/' });
				const chunks = ['chunk1', 'chunk2', 'chunk3'];
				let isAsyncComplete = false;

				mockModule('https', {
					request: () => {
						const request = <HTTP.ClientRequest>new Stream.Writable();

						request._write = (_chunk, _encoding, callback) => {
							callback();
						};
						(<unknown>request.on) = (
							event: string,
							callback: (response: HTTP.IncomingMessage) => void
						) => {
							if (event === 'response') {
								setTimeout(() => {
									async function* generate(): AsyncGenerator<string> {}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.headers = {};
									response.rawHeaders = [];
									response.statusCode = 200;

									callback(response);
								}, 100);
							}
						};
						(<unknown>request.setTimeout) = () => {};
						request.destroy = () => <ClientRequest>{};

						return request;
					}
				});

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));

				window.fetch('https://localhost:8080/test/', {
					method: 'POST',
					body: new ReadableStream({
						start(controller) {
							setTimeout(() => {
								controller.enqueue(chunks[0]);
							}, 10);
							setTimeout(() => {
								controller.enqueue(chunks[1]);
							}, 20);
							setTimeout(() => {
								controller.enqueue(chunks[2]);
								controller.close();
							}, 30);
						}
					})
				});

				setTimeout(() => {
					expect(isAsyncComplete).toBe(false);
				}, 10);

				setTimeout(() => {
					expect(isAsyncComplete).toBe(true);
					resolve(null);
				}, 120);
			});
		});

		it('Supports cache for GET response with "Cache-Control" set to "max-age=60".', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			let requestCount = 0;

			mockModule('https', {
				request: () => {
					requestCount++;

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {
									yield responseText;
								}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.statusMessage = 'OK';
								response.headers = {};
								response.rawHeaders = [
									'content-type',
									'text/html',
									'content-length',
									String(responseText.length),
									'cache-control',
									`max-age=60`
								];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response1 = await window.fetch(url);
			const text1 = await response1.text();

			const response2 = await window.fetch(url);
			const text2 = await response2.text();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'cache-control': `max-age=60`
			});

			expect(response2.url).toBe(response1.url);
			expect(response2.ok).toBe(response1.ok);
			expect(response2.redirected).toBe(response1.redirected);
			expect(response2.status).toBe(response1.status);
			expect(response2.statusText).toBe(response1.statusText);
			expect(text2).toBe(text1);
			expect(headers2).toEqual(headers1);

			expect(requestCount).toBe(1);
		});

		it('Revalidates cache with a "If-Modified-Since" request for a GET response with "Cache-Control" set to a "max-age".', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			const requestArgs: Array<{
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			}> = [];

			mockModule('https', {
				request: (url, options) => {
					requestArgs.push({ url, options });

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								if (options.headers['If-Modified-Since']) {
									const response = <HTTP.IncomingMessage>Stream.Readable.from([]);

									response.statusCode = 304;
									response.statusMessage = 'Not Modified';
									response.headers = {};
									response.rawHeaders = [
										'last-modified',
										'Mon, 11 Dec 2023 02:00:00 GMT',
										'cache-control',
										'max-age=1'
									];

									callback(response);
								} else {
									async function* generate(): AsyncGenerator<string> {
										yield responseText;
									}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = 200;
									response.statusMessage = 'OK';
									response.headers = {};
									response.rawHeaders = [
										'content-type',
										'text/html',
										'content-length',
										String(responseText.length),
										'cache-control',
										'max-age=0.0001',
										'last-modified',
										'Mon, 11 Dec 2023 01:00:00 GMT'
									];

									callback(response);
								}
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response1 = await window.fetch(url, {
				headers: {
					key1: 'value1'
				}
			});
			const text1 = await response1.text();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const response2 = await window.fetch(url);
			const text2 = await response2.text();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'cache-control': `max-age=0.0001`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT'
			});

			expect(response2.url).toBe(response1.url);
			expect(response2.ok).toBe(response1.ok);
			expect(response2.redirected).toBe(response1.redirected);
			expect(response2.status).toBe(response1.status);
			expect(response2.statusText).toBe(response1.statusText);
			expect(text2).toBe(text1);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'Cache-Control': 'max-age=1',
				'Last-Modified': 'Mon, 11 Dec 2023 02:00:00 GMT'
			});

			expect(requestArgs).toEqual([
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							key1: 'value1'
						},
						method: 'GET',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				},
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'If-Modified-Since': 'Mon, 11 Dec 2023 01:00:00 GMT',
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							key1: 'value1'
						},
						method: 'GET',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				}
			]);
		});

		it('Updates cache after a failed revalidation with a "If-Modified-Since" request for a GET response with "Cache-Control" set to a "max-age".', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = '/some/path';
			const responseText1 = 'some text';
			const responseText2 = 'some new text';
			const requestArgs: Array<{
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			}> = [];

			mockModule('https', {
				request: (url, options) => {
					requestArgs.push({ url, options });

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								if (options.headers['If-Modified-Since']) {
									async function* generate(): AsyncGenerator<string> {
										yield responseText2;
									}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = 200;
									response.statusMessage = 'OK';
									response.headers = {};
									response.rawHeaders = [
										'content-type',
										'text/html',
										'content-length',
										String(responseText2.length),
										'cache-control',
										'max-age=1',
										'last-modified',
										'Mon, 11 Dec 2023 02:00:00 GMT'
									];

									callback(response);
								} else {
									async function* generate(): AsyncGenerator<string> {
										yield responseText1;
									}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = 200;
									response.statusMessage = 'OK';
									response.headers = {};
									response.rawHeaders = [
										'content-type',
										'text/html',
										'content-length',
										String(responseText1.length),
										'cache-control',
										'max-age=0.0001',
										'last-modified',
										'Mon, 11 Dec 2023 01:00:00 GMT'
									];

									callback(response);
								}
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response1 = await window.fetch(url, {
				headers: {
					key1: 'value1'
				}
			});
			const text1 = await response1.text();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const response2 = await window.fetch(url);
			const text2 = await response2.text();

			const response3 = await window.fetch(url);
			const text3 = await response3.text();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			const headers3 = {};
			for (const [key, value] of response3.headers) {
				headers3[key] = value;
			}

			expect(response1.url).toBe('https://localhost:8080/some/path');
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText1);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText1.length),
				'cache-control': `max-age=0.0001`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT'
			});

			expect(response2.url).toBe('https://localhost:8080/some/path');
			expect(response2.ok).toBe(true);
			expect(response2.redirected).toBe(false);
			expect(response2.status).toBe(200);
			expect(response2.statusText).toBe('OK');
			expect(text2).toBe(responseText2);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText2.length),
				'cache-control': 'max-age=1',
				'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT'
			});

			expect(response3.url).toBe(response2.url);
			expect(response3.ok).toBe(response2.ok);
			expect(response3.redirected).toBe(response2.redirected);
			expect(response3.status).toBe(response2.status);
			expect(response3.statusText).toBe(response2.statusText);
			expect(text3).toBe(text2);
			expect(headers3).toEqual(headers2);

			expect(requestArgs).toEqual([
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							key1: 'value1'
						},
						method: 'GET',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				},
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'If-Modified-Since': 'Mon, 11 Dec 2023 01:00:00 GMT',
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							key1: 'value1'
						},
						method: 'GET',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				}
			]);
		});

		it('Revalidates cache with a "If-None-Match" request for a HEAD response with an "Etag" header.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const etag1 = '"etag1"';
			const etag2 = '"etag2"';
			const responseText = 'some text';
			const requestArgs: Array<{
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			}> = [];

			mockModule('https', {
				request: (url, options) => {
					requestArgs.push({ url, options });

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								if (options.headers['If-None-Match']) {
									const response = <HTTP.IncomingMessage>Stream.Readable.from([]);

									response.statusCode = 304;
									response.statusMessage = 'Not Modified';
									response.headers = {};
									response.rawHeaders = [
										'etag',
										etag2,
										'last-modified',
										'Mon, 11 Dec 2023 02:00:00 GMT'
									];

									callback(response);
								} else {
									async function* generate(): AsyncGenerator<string> {
										yield responseText;
									}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = 200;
									response.statusMessage = 'OK';
									response.headers = {};
									response.rawHeaders = [
										'content-type',
										'text/html',
										'content-length',
										String(responseText.length),
										'cache-control',
										'max-age=0.0001',
										'last-modified',
										'Mon, 11 Dec 2023 01:00:00 GMT',
										'etag',
										etag1
									];

									callback(response);
								}
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response1 = await window.fetch(url, {
				method: 'HEAD',
				headers: {
					key1: 'value1'
				}
			});
			const text1 = await response1.text();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const response2 = await window.fetch(url, {
				method: 'HEAD'
			});
			const text2 = await response2.text();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'cache-control': `max-age=0.0001`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
				etag: etag1
			});

			expect(response2.url).toBe(response1.url);
			expect(response2.ok).toBe(response1.ok);
			expect(response2.redirected).toBe(response1.redirected);
			expect(response2.status).toBe(response1.status);
			expect(response2.statusText).toBe(response1.statusText);
			expect(text2).toBe(text1);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'cache-control': `max-age=0.0001`,
				'Last-Modified': 'Mon, 11 Dec 2023 02:00:00 GMT',
				ETag: etag2
			});

			expect(requestArgs).toEqual([
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							key1: 'value1'
						},
						method: 'HEAD',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				},
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'If-None-Match': etag1,
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							key1: 'value1'
						},
						method: 'HEAD',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				}
			]);
		});

		it('Updates cache after a failed revalidation with a "If-None-Match" request for a GET response with an "Etag" header.', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const etag1 = '"etag1"';
			const etag2 = '"etag2"';
			const responseText1 = 'some text';
			const responseText2 = 'some new text';
			const requestArgs: Array<{
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			}> = [];

			mockModule('https', {
				request: (url, options) => {
					requestArgs.push({ url, options });

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								if (options.headers['If-None-Match']) {
									async function* generate(): AsyncGenerator<string> {
										yield responseText2;
									}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = 200;
									response.statusMessage = 'OK';
									response.headers = {};
									response.rawHeaders = [
										'content-type',
										'text/html',
										'content-length',
										String(responseText2.length),
										'cache-control',
										'max-age=1',
										'last-modified',
										'Mon, 11 Dec 2023 02:00:00 GMT',
										'etag',
										etag2
									];

									callback(response);
								} else {
									async function* generate(): AsyncGenerator<string> {
										yield responseText1;
									}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = 200;
									response.statusMessage = 'OK';
									response.headers = {};
									response.rawHeaders = [
										'content-type',
										'text/html',
										'content-length',
										String(responseText1.length),
										'cache-control',
										'max-age=0.0001',
										'last-modified',
										'Mon, 11 Dec 2023 01:00:00 GMT',
										'etag',
										etag1
									];

									callback(response);
								}
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response1 = await window.fetch(url, {
				headers: {
					key1: 'value1'
				}
			});
			const text1 = await response1.text();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const response2 = await window.fetch(url);
			const text2 = await response2.text();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText1);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText1.length),
				'cache-control': `max-age=0.0001`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
				etag: etag1
			});

			expect(response2.url).toBe(url);
			expect(response2.ok).toBe(true);
			expect(response2.redirected).toBe(false);
			expect(response2.status).toBe(200);
			expect(response2.statusText).toBe('OK');
			expect(text2).toBe(responseText2);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText2.length),
				'cache-control': `max-age=1`,
				'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT',
				etag: etag2
			});

			expect(requestArgs).toEqual([
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							key1: 'value1'
						},
						method: 'GET',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				},
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'If-None-Match': etag1,
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							key1: 'value1'
						},
						method: 'GET',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				}
			]);
		});

		it('Supports cache for GET response with "Cache-Control" set to "max-age=60" and "Vary" set to "vary-header".', async () => {
			const window = new Window({ url: 'https://localhost:8080/' });
			const url = 'https://localhost:8080/some/path';
			const responseText1 = 'vary 1';
			const responseText2 = 'vary 2';
			const requestArgs: Array<{
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			}> = [];

			mockModule('https', {
				request: (url, options) => {
					requestArgs.push({ url, options });

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								if (options.headers['vary-header'] === 'vary1') {
									async function* generate(): AsyncGenerator<string> {
										yield responseText1;
									}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = 200;
									response.statusMessage = 'OK';
									response.headers = {};
									response.rawHeaders = [
										'content-type',
										'text/html',
										'content-length',
										String(responseText1.length),
										'cache-control',
										'max-age=60',
										'last-modified',
										'Mon, 11 Dec 2023 01:00:00 GMT',
										'vary',
										'vary-header'
									];

									callback(response);
								} else if (options.headers['vary-header'] === 'vary2') {
									async function* generate(): AsyncGenerator<string> {
										yield responseText2;
									}

									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusCode = 200;
									response.statusMessage = 'OK';
									response.headers = {};
									response.rawHeaders = [
										'content-type',
										'text/html',
										'content-length',
										String(responseText2.length),
										'cache-control',
										'max-age=60',
										'last-modified',
										'Mon, 11 Dec 2023 02:00:00 GMT',
										'vary',
										'vary-header'
									];

									callback(response);
								}
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response1 = await window.fetch(url, {
				headers: {
					'vary-header': 'vary1'
				}
			});
			const text1 = await response1.text();

			const response2 = await window.fetch(url, {
				headers: {
					'vary-header': 'vary2'
				}
			});
			const text2 = await response2.text();

			const cachedResponse1 = await window.fetch(url, {
				headers: {
					'vary-header': 'vary1'
				}
			});
			const cachedText1 = await cachedResponse1.text();

			const cachedResponse2 = await window.fetch(url, {
				headers: {
					'vary-header': 'vary2'
				}
			});
			const cachedText2 = await cachedResponse2.text();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			const cachedHeaders1 = {};
			for (const [key, value] of cachedResponse1.headers) {
				cachedHeaders1[key] = value;
			}

			const cachedHeaders2 = {};
			for (const [key, value] of cachedResponse2.headers) {
				cachedHeaders2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText1);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText1.length),
				'cache-control': `max-age=60`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
				vary: 'vary-header'
			});

			expect(response2.url).toBe(url);
			expect(response2.ok).toBe(true);
			expect(response2.redirected).toBe(false);
			expect(response2.status).toBe(200);
			expect(response2.statusText).toBe('OK');
			expect(text2).toBe(responseText2);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText2.length),
				'cache-control': `max-age=60`,
				'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT',
				vary: 'vary-header'
			});

			expect(cachedResponse1.url).toBe(response1.url);
			expect(cachedResponse1.ok).toBe(response1.ok);
			expect(cachedResponse1.redirected).toBe(response1.redirected);
			expect(cachedResponse1.status).toBe(response1.status);
			expect(cachedResponse1.statusText).toBe(response1.statusText);
			expect(cachedText1).toBe(text1);
			expect(cachedHeaders1).toEqual(headers1);

			expect(cachedResponse2.url).toBe(response2.url);
			expect(cachedResponse2.ok).toBe(response2.ok);
			expect(cachedResponse2.redirected).toBe(response2.redirected);
			expect(cachedResponse2.status).toBe(response2.status);
			expect(cachedResponse2.statusText).toBe(response2.statusText);
			expect(cachedText2).toBe(text2);
			expect(cachedHeaders2).toEqual(headers2);

			expect(requestArgs).toEqual([
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							'vary-header': 'vary1'
						},
						method: 'GET',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				},
				{
					options: {
						headers: {
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Referer: 'https://localhost:8080/',
							'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
							'vary-header': 'vary2'
						},
						method: 'GET',
						agent: false,
						rejectUnauthorized: true,
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					url: 'https://localhost:8080/some/path'
				}
			]);
		});

		it('Handles virtual server defined as a string with origin', async () => {
			const window = new Window({
				url: 'http://localhost:8080/',
				settings: {
					fetch: {
						virtualServers: [
							{
								url: 'https://example.com',
								directory: './test/fetch/virtual-server'
							}
						]
					}
				}
			});
			const htmlFileContent = await FS.promises.readFile(
				Path.resolve('./test/fetch/virtual-server/index.html')
			);
			const cssFileContent = await FS.promises.readFile(
				Path.resolve('./test/fetch/virtual-server/css/style.css')
			);

			const response = await window.fetch('https://example.com');

			expect(await response.text()).toBe(htmlFileContent.toString());

			const response2 = await window.fetch('https://example.com/index.html');

			expect(await response2.text()).toBe(htmlFileContent.toString());

			const response3 = await window.fetch('https://example.com/index.html?query=value');

			expect(await response3.text()).toBe(htmlFileContent.toString());

			const response4 = await window.fetch('https://example.com/css/style.css');

			expect(await response4.text()).toBe(cssFileContent.toString());

			const response5 = await window.fetch('https://example.com/not_found.js');

			expect(response5.ok).toBe(false);
			expect(response5.status).toBe(404);
			expect(response5.statusText).toBe('Not Found');
			expect(window.happyDOM.virtualConsolePrinter.readAsString()).toBe(
				`GET https://example.com/not_found.js 404 (Not Found)\n`
			);
			expect(await response5.text()).toBe(
				'<html><head><title>Happy DOM Virtual Server - 404 Not Found</title></head><body><h1>Happy DOM Virtual Server - 404 Not Found</h1></body></html>'
			);

			const promise = mockNetwork('http', {
				responseText: '404 not found',
				responseProperties: {
					statusCode: 404,
					statusMessage: 'Not Found'
				}
			});

			const response6 = await window.fetch('http://localhost:8080/404/');

			await promise;

			expect(response6.ok).toBe(false);
			expect(response6.status).toBe(404);
			expect(response6.statusText).toBe('Not Found');
			expect(window.happyDOM.virtualConsolePrinter.readAsString()).toBe(
				`GET http://localhost:8080/404/ 404 (Not Found)\n`
			);
			expect(await response6.text()).toBe('404 not found');
		});

		it('Handles relative virtual server defined as a string without origin', async () => {
			const window = new Window({
				url: 'http://localhost:8080/',
				settings: {
					fetch: {
						virtualServers: [
							{
								url: '/path/to/virtual-server/',
								directory: './test/fetch/virtual-server'
							}
						]
					}
				}
			});
			const htmlFileContent = await FS.promises.readFile(
				Path.resolve('./test/fetch/virtual-server/index.html')
			);
			const cssFileContent = await FS.promises.readFile(
				Path.resolve('./test/fetch/virtual-server/css/style.css')
			);

			const response = await window.fetch('http://localhost:8080/path/to/virtual-server/');

			expect(await response.text()).toBe(htmlFileContent.toString());

			const response2 = await window.fetch(
				'http://localhost:8080/path/to/virtual-server/index.html'
			);

			expect(await response2.text()).toBe(htmlFileContent.toString());

			const response3 = await window.fetch(
				'http://localhost:8080/path/to/virtual-server/index.html?query=value'
			);

			expect(await response3.text()).toBe(htmlFileContent.toString());

			const response4 = await window.fetch(
				'http://localhost:8080/path/to/virtual-server/css/style.css'
			);

			expect(await response4.text()).toBe(cssFileContent.toString());

			const response5 = await window.fetch(
				'http://localhost:8080/path/to/virtual-server/not_found.js'
			);

			expect(response5.ok).toBe(false);
			expect(response5.status).toBe(404);
			expect(response5.statusText).toBe('Not Found');
			expect(window.happyDOM.virtualConsolePrinter.readAsString()).toBe(
				`GET http://localhost:8080/path/to/virtual-server/not_found.js 404 (Not Found)\n`
			);
			expect(await response5.text()).toBe(
				'<html><head><title>Happy DOM Virtual Server - 404 Not Found</title></head><body><h1>Happy DOM Virtual Server - 404 Not Found</h1></body></html>'
			);
		});

		it('Handles virtual server defined as a RegExp with origin', async () => {
			const window = new Window({
				url: 'http://localhost:8080/',
				settings: {
					fetch: {
						virtualServers: [
							{
								url: /https:\/\/example\.com\/[a-z]{2}\/[a-z]{2}\//,
								directory: './test/fetch/virtual-server'
							}
						]
					}
				}
			});
			const htmlFileContent = await FS.promises.readFile(
				Path.resolve('./test/fetch/virtual-server/index.html')
			);
			const cssFileContent = await FS.promises.readFile(
				Path.resolve('./test/fetch/virtual-server/css/style.css')
			);

			const response = await window.fetch('https://example.com/gb/en/');

			expect(await response.text()).toBe(htmlFileContent.toString());

			const response2 = await window.fetch('https://example.com/se/sv/index.html');

			expect(await response2.text()).toBe(htmlFileContent.toString());

			const response3 = await window.fetch('https://example.com/se/sv/index.html?query=value');

			expect(await response3.text()).toBe(htmlFileContent.toString());

			const response4 = await window.fetch('https://example.com/fi/fi/css/style.css');

			expect(await response4.text()).toBe(cssFileContent.toString());

			const response5 = await window.fetch('https://example.com/gb/en/not_found.js');

			expect(response5.ok).toBe(false);
			expect(response5.status).toBe(404);
			expect(response5.statusText).toBe('Not Found');
			expect(window.happyDOM.virtualConsolePrinter.readAsString()).toBe(
				`GET https://example.com/gb/en/not_found.js 404 (Not Found)\n`
			);
			expect(await response5.text()).toBe(
				'<html><head><title>Happy DOM Virtual Server - 404 Not Found</title></head><body><h1>Happy DOM Virtual Server - 404 Not Found</h1></body></html>'
			);

			const promise = mockNetwork('http', {
				responseText: '404 not found',
				responseProperties: {
					statusCode: 404,
					statusMessage: 'Not Found'
				}
			});

			const response6 = await window.fetch('http://localhost:8080/404/');

			await promise;

			expect(response6.ok).toBe(false);
			expect(response6.status).toBe(404);
			expect(response6.statusText).toBe('Not Found');
			expect(window.happyDOM.virtualConsolePrinter.readAsString()).toBe(
				`GET http://localhost:8080/404/ 404 (Not Found)\n`
			);
			expect(await response6.text()).toBe('404 not found');
		});

		it('Handles relative virtual server defined as a RegExp without origin', async () => {
			const window = new Window({
				url: 'http://localhost:8080/',
				settings: {
					fetch: {
						virtualServers: [
							{
								url: /path\/to\/virtual-server\/[a-z]{2}\/[a-z]{2}\//,
								directory: './test/fetch/virtual-server'
							}
						]
					}
				}
			});
			const htmlFileContent = await FS.promises.readFile(
				Path.resolve('./test/fetch/virtual-server/index.html')
			);
			const cssFileContent = await FS.promises.readFile(
				Path.resolve('./test/fetch/virtual-server/css/style.css')
			);

			const response = await window.fetch('http://localhost:8080/path/to/virtual-server/gb/en/');

			expect(await response.text()).toBe(htmlFileContent.toString());

			const response2 = await window.fetch(
				'http://localhost:8080/path/to/virtual-server/se/sv/index.html'
			);

			expect(await response2.text()).toBe(htmlFileContent.toString());

			const response3 = await window.fetch(
				'http://localhost:8080/path/to/virtual-server/se/sv/index.html?query=value'
			);

			expect(await response3.text()).toBe(htmlFileContent.toString());

			const response4 = await window.fetch(
				'http://localhost:8080/path/to/virtual-server/fi/fi/css/style.css'
			);

			expect(await response4.text()).toBe(cssFileContent.toString());

			const response5 = await window.fetch(
				'http://localhost:8080/path/to/virtual-server/gb/en/not_found.js'
			);

			expect(response5.ok).toBe(false);
			expect(response5.status).toBe(404);
			expect(response5.statusText).toBe('Not Found');
			expect(window.happyDOM.virtualConsolePrinter.readAsString()).toBe(
				`GET http://localhost:8080/path/to/virtual-server/gb/en/not_found.js 404 (Not Found)\n`
			);
			expect(await response5.text()).toBe(
				'<html><head><title>Happy DOM Virtual Server - 404 Not Found</title></head><body><h1>Happy DOM Virtual Server - 404 Not Found</h1></body></html>'
			);
		});
	});
});
