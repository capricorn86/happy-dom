import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import Response from '../../src/fetch/Response';
import Headers from '../../src/fetch/Headers';
import DOMException from '../../src/exception/DOMException';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum';
import HTTP from 'http';
import Stream from 'stream';

describe('Fetch', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window();
	});

	afterEach(() => {
		resetMockedModules();
	});

	describe('send()', () => {
		it('Rejects with error if url is protocol relative.', async () => {
			const url = '//example.com/';
			let error: Error = null;

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

		it('Rejects with error if url is relative path.', async () => {
			const url = '/some/path';
			let error: Error = null;

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
			let error: Error = null;

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

		it('Rejects with error on network failure.', async () => {
			const url = 'http://localhost:8080/some/path';
			let error: Error = null;

			try {
				await window.fetch(url);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Fetch to "http://localhost:8080/some/path" failed. Error: connect ECONNREFUSED ::1:8080`,
					DOMExceptionNameEnum.networkError
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

	it('Performs a request with a relative URL and adds the "Referer" header set to the window location.', async () => {
		const path = 'some/path';
		const responseText = 'test';
		const baseUrl = 'https://localhost:8080/base/';
		let requestArgs: {
			url: string;
			options: { method: string; headers: { [k: string]: string } };
		} | null = null;

		window.happyDOM.setURL(baseUrl);

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

	it('Adds document cookie string as an header with the name "Cookie".', async () => {
		const responseText = 'test';
		const cookies = 'key1=value1; key2=value2';
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

		for (const cookie of cookies.split(';')) {
			window.document.cookie = cookie.trim();
		}

		await window.fetch(url);

		expect(requestArgs).toEqual({
			url,
			options: {
				method: 'GET',
				headers: {
					Accept: '*/*',
					Connection: 'close',
					'User-Agent': window.navigator.userAgent,
					'Accept-Encoding': 'gzip, deflate, br',
					Cookie: cookies
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
						request.destroy = () => destroyCount++;

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
								'Content-Length': body && !shouldBecomeGetRequest ? String(body.length) : undefined,
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
								'Content-Length': body && !shouldBecomeGetRequest ? String(body.length) : undefined,
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
				request.destroy = () => destroyCount++;

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
});
