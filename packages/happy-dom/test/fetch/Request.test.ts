import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import Request from '../../src/fetch/Request.js';
import URL from '../../src/url/URL.js';
import Headers from '../../src/fetch/Headers.js';
import AbortSignal from '../../src/fetch/AbortSignal.js';
import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import IRequestReferrerPolicy from '../../src/fetch/types/IRequestReferrerPolicy.js';
import IRequestRedirect from '../../src/fetch/types/IRequestRedirect.js';
import FetchBodyUtility from '../../src/fetch/utilities/FetchBodyUtility.js';
import Blob from '../../src/file/Blob.js';
import FormData from '../../src/form-data/FormData.js';
import MultipartFormDataParser from '../../src/fetch/multipart/MultipartFormDataParser.js';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import { ReadableStream } from 'stream/web';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import File from '../../src/file/File.js';
import Path from 'path';
import FS from 'fs';

const TEST_URL = 'https://example.com/';

describe('Request', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Sets default values for properties.', () => {
			const request = new window.Request(TEST_URL);
			let headersLength = 0;

			for (const _header of request.headers) {
				headersLength++;
			}

			expect(request.method).toBe('GET');
			expect(request.headers).toBeInstanceOf(Headers);
			expect(headersLength).toBe(0);
			expect(request.body).toBe(null);
			expect(request.bodyUsed).toBe(false);
			expect(request.signal).toBeInstanceOf(AbortSignal);
			expect(request.redirect).toBe('follow');
			expect(request.referrerPolicy).toBe('');
			expect(request.credentials).toBe('same-origin');
			expect(request.referrer).toBe('about:client');
			expect(request.mode).toBe('cors');
		});

		it('Supports URL as string from Request object.', () => {
			const request = new window.Request(new window.Request(TEST_URL));
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports URL as URL object from Request object.', () => {
			const request = new window.Request(new window.Request(new URL(TEST_URL)));
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports URL as string from init object.', () => {
			const request = new window.Request(TEST_URL);
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports URL as URL object from init object.', () => {
			const request = new window.Request(new URL(TEST_URL));
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports relative URL.', () => {
			window.happyDOM?.setURL('https://example.com/other/path/');
			const request = new window.Request('/path/');
			expect(request.url).toBe('https://example.com/path/');
		});

		it('Throws error for invalid URL.', () => {
			let error: Error | null = null;
			try {
				new window.Request('/path/');
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct 'Request': Invalid URL "/path/" on document location 'about:blank'. Relative URLs are not permitted on current document location.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Supports URL from Request object.', () => {
			const request = new window.Request(new window.Request(TEST_URL));
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports method from Request object.', () => {
			const request = new window.Request(new window.Request(TEST_URL, { method: 'POST' }));
			expect(request.method).toBe('POST');
		});

		it('Supports method from init object.', () => {
			const request = new window.Request(TEST_URL, { method: 'POST' });
			expect(request.method).toBe('POST');
		});

		it('Supports mode from init object.', () => {
			const request = new window.Request(TEST_URL, { mode: 'same-origin' });
			expect(request.mode).toBe('same-origin');
		});

		it('Throws for invalid mode.', () => {
			expect(() => {
				new window.Request(TEST_URL, { mode: <'cors'>'invalid' });
			}).toThrow(
				new window.DOMException(
					`Failed to construct 'Request': The provided value 'invalid' is not a valid enum value of type RequestMode.`,
					DOMExceptionNameEnum.syntaxError
				)
			);

			expect(() => {
				new window.Request(TEST_URL, { mode: 'navigate' });
			}).toThrow(
				new window.DOMException(
					`Failed to construct 'Request': Cannot construct a Request with a RequestInit whose mode member is set as 'navigate'.`,
					DOMExceptionNameEnum.securityError
				)
			);

			expect(() => {
				new window.Request(TEST_URL, { mode: 'websocket' });
			}).toThrow(
				new window.DOMException(
					`Failed to construct 'Request': Cannot construct a Request with a RequestInit whose mode member is set as 'websocket'.`,
					DOMExceptionNameEnum.securityError
				)
			);
		});

		it('Supports body from Request object.', async () => {
			const otherRequest = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const request = new window.Request(otherRequest);
			const chunks: Buffer[] = [];

			for await (const chunk of <ReadableStream>request.body) {
				chunks.push(Buffer.from(chunk));
			}

			expect(Buffer.concat(chunks).toString()).toBe('Hello World');
		});

		it('Supports body from init object.', async () => {
			const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const chunks: Buffer[] = [];

			for await (const chunk of <ReadableStream>request.body) {
				chunks.push(Buffer.from(chunk));
			}

			expect(Buffer.concat(chunks).toString()).toBe('Hello World');
		});

		it('Supports credentials from Request object.', () => {
			const request = new window.Request(new window.Request(TEST_URL, { credentials: 'include' }));
			expect(request.credentials).toBe('include');
		});

		it('Supports credentials from init object.', () => {
			const request = new window.Request(TEST_URL, { credentials: 'include' });
			expect(request.credentials).toBe('include');
		});

		it('Supports headers from Request object.', () => {
			const headers = new Headers();

			headers.set('X-Test', 'Hello World');
			headers.set('X-Test-2', 'Hello World 2');

			const otherRequest = new window.Request(TEST_URL, { headers });
			const request = new window.Request(otherRequest);
			const headerEntries = {};

			for (const [key, value] of request.headers) {
				headerEntries[key] = value;
			}

			expect(otherRequest.headers === headers).toBe(false);
			expect(request.headers === headers).toBe(false);
			expect(headerEntries).toEqual({
				'X-Test': 'Hello World',
				'X-Test-2': 'Hello World 2'
			});
		});

		it('Supports headers from init object.', () => {
			const headers = new Headers();

			headers.set('X-Test', 'Hello World');
			headers.set('X-Test-2', 'Hello World 2');

			const request = new window.Request(TEST_URL, { headers });
			const headerEntries = {};

			for (const [key, value] of request.headers) {
				headerEntries[key] = value;
			}

			expect(request.headers === headers).toBe(false);
			expect(headerEntries).toEqual({
				'X-Test': 'Hello World',
				'X-Test-2': 'Hello World 2'
			});
		});

		it('Removes unsafe headers.', () => {
			const headers = {
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
			};

			const request = new window.Request(TEST_URL, { headers });
			const headerEntries = {};

			for (const [key, value] of request.headers) {
				headerEntries[key] = value;
			}

			expect(headerEntries).toEqual({
				'safe-header': 'safe'
			});
		});

		it('Supports content length from Request object.', () => {
			const request = new window.Request(
				new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' })
			);
			expect(request[PropertySymbol.contentLength]).toBe(11);
		});

		it('Supports content length from init object.', () => {
			const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			expect(request[PropertySymbol.contentLength]).toBe(11);
		});

		it('Supports content type from Request object.', () => {
			const request = new window.Request(
				new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' })
			);
			expect(request[PropertySymbol.contentType]).toBe('text/plain;charset=UTF-8');
		});

		it('Supports content type from init object.', () => {
			const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			expect(request[PropertySymbol.contentType]).toBe('text/plain;charset=UTF-8');
		});

		it('Supports content type header from Request object.', () => {
			const request = new window.Request(
				new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' })
			);
			expect(request.headers.get('Content-Type')).toBe('text/plain;charset=UTF-8');
		});

		it('Supports content type header from init object.', () => {
			const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			expect(request.headers.get('Content-Type')).toBe('text/plain;charset=UTF-8');
		});

		it('Supports redirect from Request object.', () => {
			const request = new window.Request(new window.Request(TEST_URL, { redirect: 'manual' }));
			expect(request.redirect).toBe('manual');
		});

		it('Supports redirect from init object.', () => {
			const request = new window.Request(TEST_URL, { redirect: 'manual' });
			expect(request.redirect).toBe('manual');
		});

		it('Supports referrer policy from Request object.', () => {
			const request = new window.Request(
				new window.Request(TEST_URL, { referrerPolicy: 'no-referrer' })
			);
			expect(request.referrerPolicy).toBe('no-referrer');
		});

		it('Supports referrer policy from init object.', () => {
			const request = new window.Request(TEST_URL, { referrerPolicy: 'no-referrer' });
			expect(request.referrerPolicy).toBe('no-referrer');
		});

		it('Supports signal from Request object.', () => {
			const signal = new window.AbortSignal();
			const request = new window.Request(new window.Request(TEST_URL, { signal }));
			expect(request.signal).toBe(signal);
		});

		it('Supports signal from init object.', () => {
			const signal = new window.AbortSignal();
			const request = new window.Request(TEST_URL, { signal });
			expect(request.signal).toBe(signal);
		});

		it('Supports referrer from Request object.', () => {
			const request1 = new window.Request(new window.Request(TEST_URL));
			const request2 = new window.Request(new window.Request(TEST_URL, { referrer: '' }));
			const request3 = new window.Request(
				new window.Request(TEST_URL, { referrer: 'no-referrer' })
			);
			const request4 = new window.Request(new window.Request(TEST_URL, { referrer: 'client' }));
			const request5 = new window.Request(
				new window.Request(TEST_URL, { referrer: 'https://example.com/path/' })
			);
			const request6 = new window.Request(
				new window.Request(TEST_URL, { referrer: new URL('https://example.com/path/') })
			);

			window.happyDOM?.setURL('https://example.com/other/path/');

			const request7 = new window.Request(
				new window.Request(TEST_URL, { referrer: 'https://example.com/path/' })
			);
			const request8 = new window.Request(
				new window.Request(TEST_URL, { referrer: new URL('https://example.com/path/') })
			);
			const request9 = new window.Request(new window.Request(TEST_URL, { referrer: '/path/' }));

			expect(request1.referrer).toBe('about:client');
			expect(request2.referrer).toBe('');
			expect(request3.referrer).toBe('');
			expect(request4.referrer).toBe('about:client');
			expect(request5.referrer).toBe('about:client');
			expect(request6.referrer).toBe('about:client');
			expect(request7.referrer).toBe('https://example.com/path/');
			expect(request8.referrer).toBe('https://example.com/path/');
			expect(request9.referrer).toBe('https://example.com/path/');
		});

		it('Supports referrer from init object.', () => {
			const request1 = new window.Request(TEST_URL);
			const request2 = new window.Request(TEST_URL, { referrer: '' });
			const request3 = new window.Request(TEST_URL, { referrer: 'no-referrer' });
			const request4 = new window.Request(TEST_URL, { referrer: 'client' });
			const request5 = new window.Request(TEST_URL, { referrer: 'https://example.com/path/' });
			const request6 = new window.Request(TEST_URL, {
				referrer: new URL('https://example.com/path/')
			});

			window.happyDOM?.setURL('https://example.com/other/path/');

			const request7 = new window.Request(TEST_URL, { referrer: 'https://example.com/path/' });
			const request8 = new window.Request(TEST_URL, {
				referrer: new URL('https://example.com/path/')
			});
			const request9 = new window.Request(TEST_URL, { referrer: '/path/' });

			expect(request1.referrer).toBe('about:client');
			expect(request2.referrer).toBe('');
			expect(request3.referrer).toBe('');
			expect(request4.referrer).toBe('about:client');
			expect(request5.referrer).toBe('about:client');
			expect(request6.referrer).toBe('about:client');
			expect(request7.referrer).toBe('https://example.com/path/');
			expect(request8.referrer).toBe('https://example.com/path/');
			expect(request9.referrer).toBe('https://example.com/path/');
		});

		it('Throws error when combining body with GET method.', () => {
			let error: Error | null = null;
			try {
				new window.Request(TEST_URL, { body: 'Hello world' });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Request with GET/HEAD method cannot have body.`,
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Throws error when combining body with HEAD method.', () => {
			let error: Error | null = null;
			try {
				new window.Request(TEST_URL, { body: 'Hello world', method: 'HEAD' });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Request with GET/HEAD method cannot have body.`,
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Throws error using username in URL.', () => {
			let error: Error | null = null;
			try {
				new window.Request('https://user@example.com');
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`https://user@example.com/ is an url with embedded credentials.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Throws error using password in URL.', () => {
			let error: Error | null = null;
			try {
				new window.Request('https://user:pass@example.com');
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`https://user:pass@example.com/ is an url with embedded credentials.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Throws error when invalid referrer policy.', () => {
			let error: Error | null = null;
			try {
				new window.Request(TEST_URL, { referrerPolicy: <IRequestReferrerPolicy>'invalid' });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(`Invalid referrer policy "invalid".`, DOMExceptionNameEnum.syntaxError)
			);
		});

		it('Throws error when invalid referrer policy.', () => {
			let error: Error | null = null;
			try {
				new window.Request(TEST_URL, { referrerPolicy: <IRequestReferrerPolicy>'invalid' });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(`Invalid referrer policy "invalid".`, DOMExceptionNameEnum.syntaxError)
			);
		});

		it('Throws error when invalid referrer policy.', () => {
			let error: Error | null = null;
			try {
				new window.Request(TEST_URL, { redirect: <IRequestRedirect>'invalid' });
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(`Invalid redirect "invalid".`, DOMExceptionNameEnum.syntaxError)
			);
		});
	});

	describe('get referrer()', () => {
		it('Returns referrer.', () => {
			window.happyDOM?.setURL('https://example.com/other/path/');
			const request = new window.Request(TEST_URL, { referrer: 'https://example.com/path/' });
			expect(request.referrer).toBe('https://example.com/path/');
		});
	});

	describe('get url()', () => {
		it('Returns URL.', () => {
			const request = new window.Request(TEST_URL);
			expect(request.url).toBe(TEST_URL);
		});
	});

	describe('get [Symbol.toStringTag]()', () => {
		it('Returns class name.', () => {
			expect(String(new window.Request(TEST_URL))).toBe('[object Request]');
		});
	});

	describe('arrayBuffer()', () => {
		it('Returns ArrayBuffer.', async () => {
			const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const arrayBuffer = await request.arrayBuffer();

			expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
			expect(Buffer.from(arrayBuffer).toString()).toBe('Hello World');
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 10))
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				request.arrayBuffer();

				setTimeout(() => {
					expect(isAsyncComplete).toBe(false);
				}, 2);

				setTimeout(() => {
					expect(isAsyncComplete).toBe(true);
					resolve(null);
				}, 50);
			});
		});
	});

	describe('blob()', () => {
		it('Returns Blob.', async () => {
			const request = new window.Request(TEST_URL, {
				method: 'POST',
				body: 'Hello World',
				headers: { 'Content-Type': 'text/plain' }
			});
			const blob = await request.blob();

			expect(blob).toBeInstanceOf(Blob);
			expect(blob.type).toBe('text/plain');

			const text = await blob.text();
			expect(text).toBe('Hello World');
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 10))
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				request.blob();

				setTimeout(() => {
					expect(isAsyncComplete).toBe(false);
				}, 2);

				setTimeout(() => {
					expect(isAsyncComplete).toBe(true);
					resolve(null);
				}, 50);
			});
		});
	});

	describe('buffer()', () => {
		it('Returns Buffer.', async () => {
			const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const buffer = await request.buffer();

			expect(buffer).toBeInstanceOf(Buffer);
			expect(buffer.toString()).toBe('Hello World');
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 10))
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				request.buffer();

				setTimeout(() => {
					expect(isAsyncComplete).toBe(false);
				}, 2);

				setTimeout(() => {
					expect(isAsyncComplete).toBe(true);
					resolve(null);
				}, 50);
			});
		});
	});

	describe('text()', () => {
		it('Returns text string.', async () => {
			const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const text = await request.text();

			expect(text).toBe('Hello World');
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const request = new window.Request(TEST_URL, { method: 'POST', body: 'Hello World' });
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 10))
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				request.text();

				setTimeout(() => {
					expect(isAsyncComplete).toBe(false);
				}, 2);

				setTimeout(() => {
					expect(isAsyncComplete).toBe(true);
					resolve(null);
				}, 50);
			});
		});
	});

	describe('json()', () => {
		it('Returns JSON.', async () => {
			const request = new window.Request(TEST_URL, {
				method: 'POST',
				body: '{ "key1": "value1" }'
			});
			const json = await request.json();

			expect(json).toEqual({ key1: 'value1' });
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const request = new window.Request(TEST_URL, {
					method: 'POST',
					body: '{ "key1": "value1" }'
				});
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) =>
							setTimeout(() => resolve(Buffer.from('{ "key1": "value1" }')), 10)
						)
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				request.json();

				setTimeout(() => {
					expect(isAsyncComplete).toBe(false);
				}, 2);

				setTimeout(() => {
					expect(isAsyncComplete).toBe(true);
					resolve(null);
				}, 50);
			});
		});
	});

	describe('formData()', () => {
		it('Returns FormData for FormData object (multipart)', async () => {
			const formData = new window.FormData();
			formData.append('some', 'test');
			const request = new window.Request(TEST_URL, { method: 'POST', body: formData });
			const formDataResponse = await request.formData();

			expect(formDataResponse).toEqual(formData);
		});

		it('Returns FormData for URLSearchParams object (application/x-www-form-urlencoded)', async () => {
			const urlSearchParams = new URLSearchParams();
			urlSearchParams.append('some', 'test');
			const request = new window.Request(TEST_URL, { method: 'POST', body: urlSearchParams });
			const formDataResponse = await request.formData();

			expect(formDataResponse instanceof FormData).toBe(true);
			expect(formDataResponse.get('some')).toBe('test');
		});

		it('Returns FormData for "application/x-www-form-urlencoded" content.', async () => {
			const urlSearchParams = new URLSearchParams();

			urlSearchParams.set('key1', 'value1');
			urlSearchParams.set('key2', 'value2');
			urlSearchParams.set('key3', 'value3');

			const request = new window.Request(TEST_URL, { method: 'POST', body: urlSearchParams });
			const formDataResponse = await request.formData();
			let size = 0;

			for (const _entry of formDataResponse) {
				size++;
			}

			expect(formDataResponse.get('key1')).toBe('value1');
			expect(formDataResponse.get('key2')).toBe('value2');
			expect(formDataResponse.get('key3')).toBe('value3');
			expect(size).toBe(3);
		});

		it('Returns FormData for multipart text fields.', async () => {
			const formData = new window.FormData();

			vi.spyOn(Math, 'random').mockImplementation(() => 0.8);

			formData.set('key1', 'value1');
			formData.set('key2', 'value2');
			formData.set('key3', 'value3');

			const request = new window.Request(TEST_URL, { method: 'POST', body: formData });
			const formDataResponse = await request.formData();
			let size = 0;

			for (const _entry of formDataResponse) {
				size++;
			}

			expect(formDataResponse.get('key1')).toBe('value1');
			expect(formDataResponse.get('key2')).toBe('value2');
			expect(formDataResponse.get('key3')).toBe('value3');
			expect(size).toBe(3);
		});

		it('Returns FormData for multipart files.', async () => {
			const formData = new window.FormData();
			const imageBuffer = await FS.promises.readFile(
				Path.join(__dirname, 'data', 'test-image.jpg')
			);

			vi.spyOn(Math, 'random').mockImplementation(() => 0.8);

			formData.set('key1', 'value1');
			formData.set('file1', new File([imageBuffer], 'test-image-1.jpg', { type: 'image/jpeg' }));
			formData.set('key2', 'value2');
			formData.set('file2', new File([imageBuffer], 'test-image-2.jpg', { type: 'image/jpeg' }));

			const request = new window.Request(TEST_URL, { method: 'POST', body: formData });
			const formDataResponse = await request.formData();
			let size = 0;

			for (const _entry of formDataResponse) {
				size++;
			}

			expect(formDataResponse.get('key1')).toBe('value1');
			expect(formDataResponse.get('key2')).toBe('value2');
			expect(size).toBe(4);

			const file1 = <File>formDataResponse.get('file1');
			const file2 = <File>formDataResponse.get('file2');

			expect(file1.name).toBe('test-image-1.jpg');
			expect(file1.type).toBe('image/jpeg');
			expect(file1.size).toBe(imageBuffer.length);
			expect(await file1.arrayBuffer()).toEqual(imageBuffer.buffer);

			expect(file2.name).toBe('test-image-2.jpg');
			expect(file2.type).toBe('image/jpeg');
			expect(file2.size).toBe(imageBuffer.length);
			expect(await file2.arrayBuffer()).toEqual(imageBuffer.buffer);
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const formData = new window.FormData();
				formData.append('some', 'test');
				const request = new window.Request(TEST_URL, { method: 'POST', body: formData });
				let isAsyncComplete = false;

				vi.spyOn(MultipartFormDataParser, 'streamToFormData').mockImplementation(
					(): Promise<{ formData; buffer: Buffer }> =>
						new Promise((resolve) =>
							setTimeout(() => resolve({ formData, buffer: Buffer.from([]) }), 10)
						)
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				request.formData();

				setTimeout(() => {
					expect(isAsyncComplete).toBe(false);
				}, 2);

				setTimeout(() => {
					expect(isAsyncComplete).toBe(true);
					resolve(null);
				}, 50);
			});
		});
	});

	describe('clone()', () => {
		it('Returns a clone.', async () => {
			window.happyDOM?.setURL('https://example.com/other/path/');

			const signal = new window.AbortSignal();
			const request = new window.Request(TEST_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: 'Hello world',
				signal,
				redirect: 'error',
				referrerPolicy: 'no-referrer',
				credentials: 'include',
				referrer: 'https://example.com/path/'
			});

			const clone = request.clone();

			expect(clone.url).toEqual(TEST_URL);
			expect(clone.method).toEqual('POST');
			expect(clone.headers.get('Content-Type')).toEqual('application/json');
			expect(clone.signal).toBe(signal);
			expect(clone.redirect).toBe('error');
			expect(clone.referrerPolicy).toBe('no-referrer');
			expect(clone.credentials).toBe('include');
			expect(clone.referrer).toBe('https://example.com/path/');
			expect(await clone.text()).toBe('Hello world');
		});
	});
});
