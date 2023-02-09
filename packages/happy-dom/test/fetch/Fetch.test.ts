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
});
