import Window from '../../src/window/Window.js';
import IWindow from '../../src/window/IWindow.js';
import Response from '../../src/fetch/Response.js';
import Headers from '../../src/fetch/Headers.js';
import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import AbortController from '../../src/fetch/AbortController.js';
import HTTP, { ClientRequest } from 'http';
import Net from 'net';
import Stream from 'stream';
import Zlib from 'zlib';
import { TextEncoder } from 'util';
import Blob from '../../src/file/Blob.js';
import FormData from '../../src/form-data/FormData.js';
import { URLSearchParams } from 'url';
import '../types.d.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

const LAST_CHUNK = Buffer.from('0\r\n\r\n');

describe('Fetch', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window();
	});

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('send()', () => {
		it('Rejects with error if url is protocol relative.', async () => {
			const url = '//example.com/';
			let error: Error | null = null;

			try {
				await window.fetch(url);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct 'Request. Invalid URL "${url}" on document location 'about:blank'. Relative URLs are not permitted on current document location.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Rejects with error if url is relative path and no location is set on the document.', async () => {
			const url = '/some/path';
			let error: Error | null = null;

			try {
				await window.fetch(url);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct 'Request. Invalid URL "${url}" on document location 'about:blank'. Relative URLs are not permitted on current document location.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Rejects with error if protocol is unsupported.', async () => {
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
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

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
									String(responseText.length)
								];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response = await window.fetch(url);

			expect(requestArgs).toEqual({
				url,
				options: {
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br'
					}
				}
			});

			expect(response instanceof Response).toBe(true);
			expect(response.url).toBe(url);
			expect(response.ok).toBe(true);
			expect(response.redirected).toBe(false);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe('OK');
			expect(response.bodyUsed).toBe(false);
			expect(response.body instanceof Stream.Transform).toBe(true);
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
			const url = 'http://localhost:8080/some/path';
			const responseText = '{ "test": "test" }';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('http', {
				request: (url, options) => {
					requestArgs = { url, options };

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
									'application/json',
									'content-length',
									String(responseText.length)
								];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response = await window.fetch(url);

			expect(requestArgs).toEqual({
				url,
				options: {
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br'
					}
				}
			});

			expect(response instanceof Response).toBe(true);
			expect(response.url).toBe(url);
			expect(response.ok).toBe(true);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe('OK');
			expect(response.bodyUsed).toBe(false);
			expect(response.body instanceof Stream.Transform).toBe(true);
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

		it('Performs a chunked HTTP GET request.', async () => {
			const url = 'http://localhost:8080/some/path';
			const chunks = ['chunk1', 'chunk2', 'chunk3'];

			mockModule('http', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {
									yield chunks[0];
									yield chunks[1];
									yield chunks[2];
								}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [
									'Content-Length',
									String(chunks[0].length + chunks[1].length + chunks[2].length)
								];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response = await window.fetch(url);

			expect(response.headers.get('Content-Length')).toBe(
				String(chunks[0].length + chunks[1].length + chunks[2].length)
			);

			const text = await response.text();

			expect(text).toEqual(chunks[0] + chunks[1] + chunks[2]);

			expect(response.bodyUsed).toBe(true);
		});

		it('Performs a request with a relative URL and adds the "Referer" header set to the window location.', async () => {
			const path = 'some/path';
			const responseText = 'test';
			const baseUrl = 'https://localhost:8080/base/';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			window.happyDOM?.setURL(baseUrl);

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {
									yield responseText;
								}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			await window.fetch(path);

			expect(requestArgs).toEqual({
				url: `${baseUrl}${path}`,
				options: {
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Referer: baseUrl
					}
				}
			});
		});

		it('Should send custom key/value object request headers.', async () => {
			const url = 'https://localhost:8080/some/path';
			const responseText = 'test';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {
									yield responseText;
								}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			await window.fetch(url, {
				headers: {
					key1: 'value1',
					KeY2: 'Value2'
				}
			});

			expect(requestArgs).toEqual({
				url,
				options: {
					method: 'GET',
					headers: {
						key1: 'value1',
						KeY2: 'Value2',
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br'
					}
				}
			});
		});

		it('Should send custom "Headers" instance request headers.', async () => {
			const url = 'https://localhost:8080/some/path';
			const responseText = 'test';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {
									yield responseText;
								}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const headers = new Headers({
				key1: 'value1',
				KeY2: 'Value2'
			});

			headers.append('key3', 'value3');
			headers.append('key3', 'value4');

			await window.fetch(url, { headers });

			expect(requestArgs).toEqual({
				url,
				options: {
					method: 'GET',
					headers: {
						key1: 'value1',
						KeY2: 'Value2',
						key3: 'value3, value4',
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br'
					}
				}
			});
		});

		for (const httpCode of [301, 302, 303, 307, 308]) {
			for (const method of ['GET', 'POST', 'PATCH']) {
				it(`Should follow ${method} request redirect code ${httpCode}.`, async () => {
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
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br'
								}
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
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br'
								}
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
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br'
								}
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

		it('Should not follow non-GET redirect if body is a readable stream.', async () => {
			const responseText = 'test';
			const body = 'test';
			let error: Error | null = null;

			let destroyCount = 0;
			let writtenBodyData = '';

			mockModule('https', {
				request: () => {
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
									yield responseText;
								}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.statusCode = 301;
								response.rawHeaders = ['Location', 'https://localhost:8080/test2/'];

								callback(response);
							});
						}
					};
					(<unknown>request.setTimeout) = () => {};
					request.destroy = () => <ClientRequest>(destroyCount++ && {});

					return request;
				}
			});

			try {
				await window.fetch('https://localhost:8080/test/', {
					method: 'PATCH',
					body: Stream.Readable.from(body)
				});
			} catch (e) {
				error = e;
			}

			expect(destroyCount).toBe(2);
			expect(writtenBodyData).toBe(body);
			expect(error).toEqual(
				new DOMException(
					'Cannot follow redirect with body being a readable stream.',
					DOMExceptionNameEnum.networkError
				)
			);
		});

		it('Should cancel a redirect loop after 20 tries.', async () => {
			const url1 = 'https://localhost:8080/test/';
			const url2 = 'https://localhost:8080/test2/';
			let error: Error | null = null;
			let tryCount = 0;

			mockModule('https', {
				request: (requestURL) => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.statusCode = 302;
								response.rawHeaders = requestURL === url1 ? ['Location', url2] : ['Location', url1];
								tryCount++;
								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
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
			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://localhost:8080/redirect/';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.statusCode = 301;
								response.rawHeaders = ['Location', redirectURL];
								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET', redirect: 'manual' });

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should support "manual" redirect mode with broken location header.', async () => {
			const url = 'https://localhost:8080/test/';
			const redirectURL = '<>';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.statusCode = 301;
								response.rawHeaders = ['Location', redirectURL];
								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET', redirect: 'manual' });

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should support "manual" redirect mode to other host.', async () => {
			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://example.com/redirect/';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.statusCode = 301;
								response.rawHeaders = ['Location', redirectURL];
								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET', redirect: 'manual' });

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should treat missing location header as a normal response (manual).', async () => {
			const url = 'https://localhost:8080/test/';

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.statusCode = 301;
								response.rawHeaders = [];
								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
				}
			});

			const response = await window.fetch(url, { method: 'GET', redirect: 'manual' });

			expect(response.status).toBe(301);
		});

		it('Should support "error" redirect.', async () => {
			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://localhost:8080/redirect/';
			let error: Error | null = null;

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.statusCode = 301;
								response.rawHeaders = ['Location', redirectURL];
								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
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
			const url = 'https://localhost:8080/test/';
			const redirectURL = '//super:invalid:url%/';
			let error: Error | null = null;

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.statusCode = 301;
								response.rawHeaders = ['Location', redirectURL];
								callback(response);
							}
						},
						setTimeout: () => {},
						destroy: () => {}
					};
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

		it("Does'nt forward unsafe headers.", async () => {
			const url = 'https://localhost:8080/some/path';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

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

			expect(requestArgs).toEqual({
				url,
				options: {
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'safe-header': 'safe'
					}
				}
			});
		});

		it('Does\'nt forward the headers "cookie", "authorization" or "www-authenticate" if request credentials are set to "omit".', async () => {
			const url = 'https://localhost:8080/some/path';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			window.happyDOM?.setURL('https://localhost:8080');
			window.document.cookie = 'test=cookie';

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			await window.fetch(url, {
				headers: {
					authorization: 'authorization',
					'www-authenticate': 'www-authenticate'
				},
				credentials: 'omit'
			});

			expect(requestArgs).toEqual({
				url,
				options: {
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br'
					}
				}
			});
		});

		it('Does\'nt forward the headers "cookie", "authorization" or "www-authenticate" if request credentials are set to "same-origin" and the request goes do a different origin than the document.', async () => {
			const originURL = 'https://localhost:8080';
			const url = 'https://other.origin.com/some/path';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			window.happyDOM?.setURL(originURL);
			window.document.cookie = 'test=cookie';

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			await window.fetch(url, {
				headers: {
					authorization: 'authorization',
					'www-authenticate': 'www-authenticate'
				},
				credentials: 'same-origin'
			});

			expect(requestArgs).toEqual({
				url,
				options: {
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Referer: originURL + '/'
					}
				}
			});
		});

		it("Does'nt allow requests to HTTP from HTTPS (mixed content).", async () => {
			const originURL = 'https://localhost:8080/';
			const url = 'http://localhost:8080/some/path';
			let error: Error | null = null;

			window.happyDOM?.setURL(originURL);

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

		it('Forwards "cookie", "authorization" or "www-authenticate" if request credentials are set to "same-origin" and the request goes to the same origin as the document.', async () => {
			const originURL = 'https://localhost:8080';
			const url = 'https://localhost:8080/some/path';
			const cookies = 'key1=value1; key2=value2';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			window.happyDOM?.setURL(originURL);

			for (const cookie of cookies.split(';')) {
				window.document.cookie = cookie.trim();
			}

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			await window.fetch(url, {
				headers: {
					authorization: 'authorization',
					'www-authenticate': 'www-authenticate'
				},
				credentials: 'same-origin'
			});

			expect(requestArgs).toEqual({
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
					}
				}
			});
		});

		it('Forwards "cookie", "authorization" or "www-authenticate" if request credentials are set to "include".', async () => {
			const originURL = 'https://localhost:8080';
			const url = 'https://other.origin.com/some/path';
			const cookies = 'key1=value1; key2=value2';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			window.happyDOM?.setURL(originURL);

			for (const cookie of cookies.split(';')) {
				window.document.cookie = cookie.trim();
			}

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = [];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			await window.fetch(url, {
				headers: {
					authorization: 'authorization',
					'www-authenticate': 'www-authenticate'
				},
				credentials: 'include'
			});

			expect(requestArgs).toEqual({
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
					}
				}
			});
		});

		it('Sets document cookie string if the response contains a "Set-Cookie" header if request cridentials are set to "include".', async () => {
			window.happyDOM?.setURL('https://localhost:8080');

			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {}
								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.headers = {};
								response.rawHeaders = ['Set-Cookie', 'key1=value1', 'Set-Cookie', 'key2=value2'];

								callback(response);
							}
						},
						setTimeout: () => {}
					};
				}
			});

			const response = await window.fetch('https://localhost:8080/some/path', {
				credentials: 'include'
			});

			expect(response.headers.get('Set-Cookie')).toBe(null);
			expect(window.document.cookie).toBe('key1=value1; key2=value2');
		});

		it('Allows setting the headers "User-Agent" and "Accept".', async () => {
			const url = 'https://localhost:8080/test/';
			let requestArgs: {
				url: string;
				options: { method: string; headers: { [k: string]: string } };
			} | null = null;

			mockModule('https', {
				request: (url, options) => {
					requestArgs = { url, options };

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

			await window.fetch(url, {
				method: 'GET',
				headers: {
					'User-Agent': 'user-agent',
					Accept: 'accept'
				}
			});

			expect(requestArgs).toEqual({
				url,
				options: {
					method: 'GET',
					headers: {
						'Accept-Encoding': 'gzip, deflate, br',
						'User-Agent': 'user-agent',
						Accept: 'accept',
						Connection: 'close'
					}
				}
			});
		});

		for (const errorCode of [400, 401, 403, 404, 500]) {
			it(`Handles error response with status ${errorCode}.`, async () => {
				const responseText = 'some response text';

				mockModule('https', {
					request: () => {
						return {
							end: () => {},
							on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
								if (event === 'response') {
									async function* generate(): AsyncGenerator<string> {
										yield responseText;
									}
									const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

									response.statusMessage = 'Bad Request';
									response.statusCode = errorCode;
									response.headers = {};
									response.rawHeaders = ['Content-Type', 'text/plain'];

									callback(response);
								}
							},
							setTimeout: () => {}
						};
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
					`Fetch to "${url}" failed. Error: connect ECONNREFUSED ::1:8080`,
					DOMExceptionNameEnum.networkError
				)
			);
		});

		it('Doesn`t break in socket logic if response is not chunked.', async () => {
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
			expect(text).toBe('');
		});

		it('Handles unzipping content with "gzip" encoding.', async () => {
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
			expect(response.status).toBe(204);
		});

		it('Should decompress content with raw "deflate" encoding from old apache server.', async () => {
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

			const abortController = new AbortController();
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
				new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
			);
		});

		it('Supports aborting a redirect request using AbortController and AbortSignal.', async () => {
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

			const abortController = new AbortController();
			const abortSignal = abortController.signal;
			let error: Error | null = null;

			setTimeout(() => {
				abortController.abort();
			}, 20);

			try {
				await window.fetch(url1, { method: 'GET', signal: abortSignal });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
			);
		});
	});

	it('Supports aborting multiple ongoing requests using AbortController.', async () => {
		await new Promise((resolve) => {
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

			const abortController = new AbortController();
			const abortSignal = abortController.signal;
			let error1: Error | null = null;
			let error2: Error | null = null;

			setTimeout(() => {
				abortController.abort();
			}, 10);

			const onFetchCatch = (): void => {
				if (error1 && error2) {
					expect(error1).toEqual(
						new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
					);
					expect(error2).toEqual(
						new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
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
		const url = 'https://localhost:8080/test/';

		const abortController = new AbortController();
		const abortSignal = abortController.signal;

		abortController.abort();

		let error: Error | null = null;
		try {
			await window.fetch(url, { method: 'GET', signal: abortSignal });
		} catch (e) {
			error = e;
		}
		expect(error).toEqual(
			new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
		);
	});

	it('Supports aborting the read of the response body using AbortController and AbortSignal when aborted before the reading has started.', async () => {
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

		const abortController = new AbortController();
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
			new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
		);
	});

	it('Supports aborting the read of the response body using AbortController and AbortSignal.', async () => {
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

		const abortController = new AbortController();
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
			new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
		);
	});

	it('Supports aborting the read of the request body using AbortController and AbortSignal.', async () => {
		const url = 'https://localhost:8080/test/';
		const chunks = ['chunk1', 'chunk2', 'chunk3'];
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
		const body = Stream.Readable.from(generate());

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

		const abortController = new AbortController();
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
			new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
		);
	});

	it('Removes internal abort listener when a request has completed.', async () => {
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

		const abortController = new AbortController();
		const abortSignal = abortController.signal;
		const response = await window.fetch(url, { method: 'GET', signal: abortSignal });

		await response.text();

		expect(abortSignal.__listeners__['abort']).toEqual([]);
		expect(() => abortController.abort()).not.toThrow();
	});

	it('Supports POST request with body as string.', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Type': 'text/plain;charset=UTF-8',
					'Content-Length': '14'
				}
			}
		});

		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe(body);
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as object (by stringifying to [object Object]).', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Type': 'text/plain;charset=UTF-8',
					'Content-Length': '15'
				}
			}
		});

		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe('[object Object]');
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as ArrayBuffer.', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Length': '14'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe(body);
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as ArrayBufferView (Uint8Array).', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Length': '14'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe(body);
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as ArrayBufferView (DataView).', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Length': '14'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe(body);
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as ArrayBufferView (Uint8Array, offset, length).', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Length': '6'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe('world!');
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as Blob without type.', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Length': '23'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe('key1=value1&key2=value2');
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as Blob with type.', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					// Blob converts type to lowercase according to spec
					'Content-Type': 'text/plain;charset=utf-8',
					'Content-Length': '23'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe('key1=value1&key2=value2');
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as Stream.Readable.', async () => {
		const chunks = ['chunk1', 'chunk2', 'chunk3'];
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
			body: Stream.Readable.from(generate())
		});

		expect(requestArgs).toEqual({
			url: 'https://localhost:8080/test/',
			options: {
				method: 'POST',
				headers: {
					Accept: '*/*',
					Connection: 'close',
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe(chunks.join(''));
		expect(response.status).toBe(200);
	});

	it('Should reject if Stream.Readable throws an error.', async () => {
		const chunks = ['chunk1', 'chunk2', 'chunk3'];
		async function* generate(): AsyncGenerator<Buffer> {
			yield await new Promise((resolve) => {
				setTimeout(() => {
					resolve(Buffer.from(chunks[0]));
				}, 10);
			});
			yield await new Promise((_resolve, reject) => {
				setTimeout(() => {
					reject(new Error('test'));
				}, 10);
			});
			yield await new Promise((resolve) => {
				setTimeout(() => {
					resolve(Buffer.from(chunks[2]));
				}, 10);
			});
		}

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
				body: Stream.Readable.from(generate())
			});
		} catch (e) {
			error = e;
		}

		expect(error).toEqual(
			new DOMException(
				`Fetch to "https://localhost:8080/test/" failed. Error: test`,
				DOMExceptionNameEnum.networkError
			)
		);
	});

	it('Supports POST request with body as FormData.', async () => {
		const formData = new FormData();

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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Type': 'multipart/form-data; boundary=----HappyDOMFormDataBoundary0.ssssssssst',
					'Content-Length': '198'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe(
			'------HappyDOMFormDataBoundary0.ssssssssst\r\nContent-Disposition: form-data; name="key1"\r\n\r\nvalue1\r\n------HappyDOMFormDataBoundary0.ssssssssst\r\nContent-Disposition: form-data; name="key2"\r\n\r\nvalue2\r\n'
		);
		expect(response.status).toBe(200);
	});

	it('Supports POST request with body as URLSearchParams.', async () => {
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
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Length': '23',
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
				}
			}
		});
		expect(destroyCount).toBe(1);
		expect(writtenBodyData).toBe('key1=value1&key2=value2');
		expect(response.status).toBe(200);
	});

	it('Supports window.happyDOM?.whenComplete().', async () => {
		await new Promise((resolve) => {
			const chunks = ['chunk1', 'chunk2', 'chunk3'];
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

			window.happyDOM?.whenComplete().then(() => (isAsyncComplete = true));

			window.fetch('https://localhost:8080/test/', {
				method: 'POST',
				body: Stream.Readable.from(generate())
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
});
