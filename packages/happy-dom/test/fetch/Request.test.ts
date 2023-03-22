import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import IDocument from '../../src/nodes/document/IDocument';
import Request from '../../src/fetch/Request';
import { URL } from 'url';
import Headers from '../../src/fetch/Headers';
import AbortSignal from '../../src/fetch/AbortSignal';
import DOMException from '../../src/exception/DOMException';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum';
import IRequestReferrerPolicy from '../../src/fetch/types/IRequestReferrerPolicy';
import IRequestRedirect from '../../src/fetch/types/IRequestRedirect';
import Blob from '../../src/file/Blob';

const TEST_URL = 'https://example.com/';

describe('Request', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		Request._ownerDocument = document;
	});

	describe('constructor()', () => {
		it('Sets default values for properties.', () => {
			const request = new Request(TEST_URL);
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
		});

		it('Supports URL as string from Request object.', () => {
			const request = new Request(new Request(TEST_URL));
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports URL as URL object from Request object.', () => {
			const request = new Request(new Request(new URL(TEST_URL)));
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports URL as string from init object.', () => {
			const request = new Request(TEST_URL);
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports URL as URL object from init object.', () => {
			const request = new Request(new URL(TEST_URL));
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports relative URL.', () => {
			window.happyDOM.setURL('https://example.com/other/path/');
			const request = new Request('/path/');
			expect(request.url).toBe('https://example.com/path/');
		});

		it('Throws error for invalid URL.', () => {
			let error: Error | null = null;
			try {
				new Request('/path/');
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct 'Request. Invalid URL "/path/" on document location 'about:blank'. Relative URLs are not permitted on current document location.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Supports URL from Request object.', () => {
			const request = new Request(new Request(TEST_URL));
			expect(request.url).toBe(TEST_URL);
		});

		it('Supports method from Request object.', () => {
			const request = new Request(new Request(TEST_URL, { method: 'POST' }));
			expect(request.method).toBe('POST');
		});

		it('Supports method from init object.', () => {
			const request = new Request(TEST_URL, { method: 'POST' });
			expect(request.method).toBe('POST');
		});

		it('Supports body from Request object.', async () => {
			const otherRequest = new Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const request = new Request(otherRequest);
			const chunks = [];

			for await (const chunk of request.body) {
				chunks.push(Buffer.from(chunk));
			}

			expect(Buffer.concat(chunks).toString()).toBe('Hello World');
		});

		it('Supports body from init object.', async () => {
			const request = new Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const chunks = [];

			for await (const chunk of request.body) {
				chunks.push(Buffer.from(chunk));
			}

			expect(Buffer.concat(chunks).toString()).toBe('Hello World');
		});

		it('Supports credentials from Request object.', () => {
			const request = new Request(new Request(TEST_URL, { credentials: 'include' }));
			expect(request.credentials).toBe('include');
		});

		it('Supports credentials from init object.', () => {
			const request = new Request(TEST_URL, { credentials: 'include' });
			expect(request.credentials).toBe('include');
		});

		it('Supports headers from Request object.', () => {
			const headers = new Headers();

			headers.set('X-Test', 'Hello World');
			headers.set('X-Test-2', 'Hello World 2');

			const otherRequest = new Request(TEST_URL, { headers });
			const request = new Request(otherRequest);
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

			const request = new Request(TEST_URL, { headers });
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

			const request = new Request(TEST_URL, { headers });
			const headerEntries = {};

			for (const [key, value] of request.headers) {
				headerEntries[key] = value;
			}

			expect(headerEntries).toEqual({
				'safe-header': 'safe'
			});
		});

		it('Supports content length from Request object.', () => {
			const request = new Request(new Request(TEST_URL, { method: 'POST', body: 'Hello World' }));
			expect(request._contentLength).toBe(11);
		});

		it('Supports content length from init object.', () => {
			const request = new Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			expect(request._contentLength).toBe(11);
		});

		it('Supports content type from Request object.', () => {
			const request = new Request(new Request(TEST_URL, { method: 'POST', body: 'Hello World' }));
			expect(request._contentType).toBe('text/plain;charset=UTF-8');
		});

		it('Supports content type from init object.', () => {
			const request = new Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			expect(request._contentType).toBe('text/plain;charset=UTF-8');
		});

		it('Supports redirect from Request object.', () => {
			const request = new Request(new Request(TEST_URL, { redirect: 'manual' }));
			expect(request.redirect).toBe('manual');
		});

		it('Supports redirect from init object.', () => {
			const request = new Request(TEST_URL, { redirect: 'manual' });
			expect(request.redirect).toBe('manual');
		});

		it('Supports referrer policy from Request object.', () => {
			const request = new Request(new Request(TEST_URL, { referrerPolicy: 'no-referrer' }));
			expect(request.referrerPolicy).toBe('no-referrer');
		});

		it('Supports referrer policy from init object.', () => {
			const request = new Request(TEST_URL, { referrerPolicy: 'no-referrer' });
			expect(request.referrerPolicy).toBe('no-referrer');
		});

		it('Supports signal from Request object.', () => {
			const signal = new AbortSignal();
			const request = new Request(new Request(TEST_URL, { signal }));
			expect(request.signal).toBe(signal);
		});

		it('Supports signal from init object.', () => {
			const signal = new AbortSignal();
			const request = new Request(TEST_URL, { signal });
			expect(request.signal).toBe(signal);
		});

		it('Supports referrer from Request object.', () => {
			const request1 = new Request(new Request(TEST_URL));
			const request2 = new Request(new Request(TEST_URL, { referrer: '' }));
			const request3 = new Request(new Request(TEST_URL, { referrer: 'no-referrer' }));
			const request4 = new Request(new Request(TEST_URL, { referrer: 'client' }));
			const request5 = new Request(
				new Request(TEST_URL, { referrer: 'https://example.com/path/' })
			);
			const request6 = new Request(
				new Request(TEST_URL, { referrer: new URL('https://example.com/path/') })
			);

			window.happyDOM.setURL('https://example.com/other/path/');

			const request7 = new Request(
				new Request(TEST_URL, { referrer: 'https://example.com/path/' })
			);
			const request8 = new Request(
				new Request(TEST_URL, { referrer: new URL('https://example.com/path/') })
			);
			const request9 = new Request(new Request(TEST_URL, { referrer: '/path/' }));

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
			const request1 = new Request(TEST_URL);
			const request2 = new Request(TEST_URL, { referrer: '' });
			const request3 = new Request(TEST_URL, { referrer: 'no-referrer' });
			const request4 = new Request(TEST_URL, { referrer: 'client' });
			const request5 = new Request(TEST_URL, { referrer: 'https://example.com/path/' });
			const request6 = new Request(TEST_URL, { referrer: new URL('https://example.com/path/') });

			window.happyDOM.setURL('https://example.com/other/path/');

			const request7 = new Request(TEST_URL, { referrer: 'https://example.com/path/' });
			const request8 = new Request(TEST_URL, { referrer: new URL('https://example.com/path/') });
			const request9 = new Request(TEST_URL, { referrer: '/path/' });

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
				new Request(TEST_URL, { body: 'Hello world' });
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
				new Request(TEST_URL, { body: 'Hello world', method: 'HEAD' });
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
				new Request('https://user@example.com');
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
				new Request('https://user:pass@example.com');
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
				new Request(TEST_URL, { referrerPolicy: <IRequestReferrerPolicy>'invalid' });
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
				new Request(TEST_URL, { referrerPolicy: <IRequestReferrerPolicy>'invalid' });
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
				new Request(TEST_URL, { redirect: <IRequestRedirect>'invalid' });
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
			window.happyDOM.setURL('https://example.com/other/path/');
			const request = new Request(TEST_URL, { referrer: 'https://example.com/path/' });
			expect(request.referrer).toBe('https://example.com/path/');
		});
	});

	describe('get url()', () => {
		it('Returns URL.', () => {
			const request = new Request(TEST_URL);
			expect(request.url).toBe(TEST_URL);
		});
	});

	describe('get [Symbol.toStringTag]()', () => {
		it('Returns class name.', () => {
			expect(String(new Request(TEST_URL))).toBe('[object Request]');
		});
	});

	describe('arrayBuffer()', () => {
		it('Returns ArrayBuffer.', async () => {
			const request = new Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const arrayBuffer = await request.arrayBuffer();

			expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
			expect(Buffer.from(arrayBuffer).toString()).toBe('Hello World');
		});
	});

	describe('blob()', () => {
		it('Returns Blob.', async () => {
			const request = new Request(TEST_URL, {
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
	});

	describe('buffer()', () => {
		it('Returns Buffer.', async () => {
			const request = new Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const buffer = await request.buffer();

			expect(buffer).toBeInstanceOf(Buffer);
			expect(buffer.toString()).toBe('Hello World');
		});
	});

	describe('text()', () => {
		it('Returns text string.', async () => {
			const request = new Request(TEST_URL, { method: 'POST', body: 'Hello World' });
			const text = await request.text();

			expect(text).toBe('Hello World');
		});
	});

	describe('json()', () => {
		it('Returns JSON.', async () => {
			const request = new Request(TEST_URL, { method: 'POST', body: '{ "key1": "value1" }' });
			const json = await request.json();

			expect(json).toEqual({ key1: 'value1' });
		});
	});

	describe('clone()', () => {
		it('Returns a clone.', async () => {
			window.happyDOM.setURL('https://example.com/other/path/');

			const signal = new AbortSignal();
			const request = new Request(TEST_URL, {
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
