import FS from 'fs';
import Path from 'path';
import Stream from 'stream';
import { URLSearchParams } from 'url';
import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import Headers from '../../src/fetch/Headers.js';
import MultipartFormDataParser from '../../src/fetch/multipart/MultipartFormDataParser.js';
import FetchBodyUtility from '../../src/fetch/utilities/FetchBodyUtility.js';
import Blob from '../../src/file/Blob.js';
import File from '../../src/file/File.js';
import FormData from '../../src/form-data/FormData.js';
import Document from '../../src/nodes/document/Document.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import { ReadableStream } from 'stream/web';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

describe('Response', () => {
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
			const response = new window.Response();
			let headersLength = 0;

			for (const _header of response.headers) {
				headersLength++;
			}

			expect(response.status).toBe(200);
			expect(response.statusText).toBe('');
			expect(response.ok).toBe(true);
			expect(response.headers).toBeInstanceOf(Headers);
			expect(headersLength).toBe(0);
			expect(response.body).toBe(null);
			expect(response.bodyUsed).toBe(false);
		});

		it('Sets status from init object.', () => {
			const response = new window.Response(null, { status: 404 });
			expect(response.status).toBe(404);
		});

		it('Sets status text from init object.', () => {
			const response = new window.Response(null, { statusText: 'test' });
			expect(response.statusText).toBe('test');
		});

		it('Sets ok state correctly based on status code.', () => {
			const response199 = new window.Response(null, { status: 199 });
			const response200 = new window.Response(null, { status: 200 });
			const response299 = new window.Response(null, { status: 299 });
			const response300 = new window.Response(null, { status: 300 });
			expect(response199.ok).toBe(false);
			expect(response200.ok).toBe(true);
			expect(response299.ok).toBe(true);
			expect(response300.ok).toBe(false);
		});

		it('Sets headers from init object.', () => {
			const headerValues = {
				'Content-Type': 'text/plain',
				'Content-Length': '123'
			};

			const headers = new Headers(headerValues);
			const response = new window.Response(null, { headers });

			const headerEntries = {};

			for (const [key, value] of response.headers) {
				headerEntries[key] = value;
			}

			expect(headers === response.headers).toBe(false);
			expect(headerEntries).toEqual(headerValues);
		});

		it('Sets body from init object.', async () => {
			const response = new window.Response('Hello World');
			const chunks: Buffer[] = [];

			for await (const chunk of <ReadableStream>response.body) {
				chunks.push(Buffer.from(chunk));
			}

			expect(Buffer.concat(chunks).toString()).toBe('Hello World');
		});
	});

	describe('get [Symbol.toStringTag]()', () => {
		it('Returns class name.', () => {
			expect(String(new window.Response())).toBe('[object Response]');
		});
	});

	describe('arrayBuffer()', () => {
		it('Returns ArrayBuffer.', async () => {
			const response = new window.Response('Hello World');
			const arrayBuffer = await response.arrayBuffer();

			expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
			expect(Buffer.from(arrayBuffer).toString()).toBe('Hello World');
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const response = new window.Response(
					new ReadableStream({
						start(controller) {
							controller.enqueue('Hello World');
							controller.close();
						}
					})
				);
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 10))
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				response.arrayBuffer();

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
			const response = new window.Response('Hello World', {
				headers: { 'Content-Type': 'text/plain' }
			});
			const blob = await response.blob();

			expect(blob).toBeInstanceOf(Blob);
			expect(blob.type).toBe('text/plain');

			const text = await blob.text();
			expect(text).toBe('Hello World');
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const response = new window.Response(
					new ReadableStream({
						start(controller) {
							controller.enqueue('Hello World');
							controller.close();
						}
					}),
					{
						headers: { 'Content-Type': 'text/plain' }
					}
				);
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 10))
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				response.blob();

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
			const response = new window.Response('Hello World');
			const buffer = await response.buffer();

			expect(buffer).toBeInstanceOf(Buffer);
			expect(buffer.toString()).toBe('Hello World');
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const response = new window.Response(
					new ReadableStream({
						start(controller) {
							controller.enqueue('Hello World');
							controller.close();
						}
					})
				);
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 5))
				);

				window.happyDOM?.waitUntilComplete().then(() => {
					isAsyncComplete = true;
				});
				response.buffer();

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
			const response = new window.Response('Hello World');
			const text = await response.text();

			expect(text).toBe('Hello World');
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const response = new window.Response(
					new ReadableStream({
						start(controller) {
							controller.enqueue('Hello World');
							controller.close();
						}
					})
				);
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 10))
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				response.text();

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
			const response = new window.Response('{ "key1": "value1" }');
			const json = await response.json();

			expect(json).toEqual({ key1: 'value1' });
		});

		it('Supports window.happyDOM?.waitUntilComplete().', async () => {
			await new Promise((resolve) => {
				const response = new window.Response(
					new ReadableStream({
						start(controller) {
							controller.enqueue('{ "key1": "value1" }');
							controller.close();
						}
					})
				);
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) =>
							setTimeout(() => resolve(Buffer.from('{ "key1": "value1" }')), 10)
						)
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				response.json();

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
			const response = new window.Response(formData);
			const formDataResponse = await response.formData();

			expect(formDataResponse).toEqual(formData);
		});

		it('Returns FormData for URLSearchParams object (application/x-www-form-urlencoded)', async () => {
			const urlSearchParams = new URLSearchParams();
			urlSearchParams.append('some', 'test');
			const response = new window.Response(urlSearchParams);
			const formDataResponse = await response.formData();

			expect(formDataResponse instanceof FormData).toBe(true);
			expect(formDataResponse.get('some')).toBe('test');
		});

		it('Returns FormData for "application/x-www-form-urlencoded" content.', async () => {
			const urlSearchParams = new URLSearchParams();

			urlSearchParams.set('key1', 'value1');
			urlSearchParams.set('key2', 'value2');
			urlSearchParams.set('key3', 'value3');

			const response = new window.Response(urlSearchParams);
			const formDataResponse = await response.formData();
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

			const response = new window.Response(formData);
			const formDataResponse = await response.formData();
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

			const response = new window.Response(formData);
			const formDataResponse = await response.formData();
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

		it('Supports window.happyDOM?.waitUntilComplete() for "application/x-www-form-urlencoded" content.', async () => {
			await new Promise((resolve) => {
				const response = new window.Response(
					new ReadableStream({
						start(controller) {
							controller.enqueue('key=value');
							controller.close();
						}
					}),
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				);
				let isAsyncComplete = false;

				vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
					(): Promise<Buffer> =>
						new Promise((resolve) => setTimeout(() => resolve(Buffer.from('')), 10))
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				response.formData();

				setTimeout(() => {
					expect(isAsyncComplete).toBe(false);
				}, 2);

				setTimeout(() => {
					expect(isAsyncComplete).toBe(true);
					resolve(null);
				}, 50);
			});
		});

		it('Supports window.happyDOM?.waitUntilComplete() for multipart content.', async () => {
			await new Promise((resolve) => {
				const response = new window.Response(new window.FormData());
				let isAsyncComplete = false;

				vi.spyOn(MultipartFormDataParser, 'streamToFormData').mockImplementation(
					(): Promise<{ formData: FormData; buffer: Buffer }> =>
						new Promise((resolve) =>
							setTimeout(
								() => resolve({ formData: new window.FormData(), buffer: Buffer.from([]) }),
								10
							)
						)
				);

				window.happyDOM?.waitUntilComplete().then(() => (isAsyncComplete = true));
				response.formData();

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
			const response = new window.Response('Hello World', {
				status: 404,
				statusText: 'Not Found',
				headers: { 'Content-Type': 'text/plain' }
			});

			const clone = response.clone();

			expect(clone).not.toBe(response);
			expect(clone.status).toBe(404);
			expect(clone.statusText).toBe('Not Found');
			expect(clone.headers.get('Content-Type')).toBe('text/plain');

			const bodyText = await clone.text();

			expect(bodyText).toBe('Hello World');
		});

		it('Can clone Response without body.', async () => {
			const response = new window.Response(null, {
				status: 404,
				statusText: 'Not Found',
				headers: { 'Content-Type': 'text/plain' }
			});

			const clone = response.clone();

			expect(clone).not.toBe(response);
			expect(clone.status).toBe(404);
			expect(clone.statusText).toBe('Not Found');
			expect(clone.headers.get('Content-Type')).toBe('text/plain');
		});

		it('Can clone Response with empty string as body.', async () => {
			const response = new window.Response('', {
				status: 404,
				statusText: 'Not Found',
				headers: { 'Content-Type': 'text/plain' }
			});

			const clone = response.clone();

			expect(clone).not.toBe(response);
			expect(clone.status).toBe(404);
			expect(clone.statusText).toBe('Not Found');
			expect(clone.headers.get('Content-Type')).toBe('text/plain');

			const bodyText = await clone.text();

			expect(bodyText).toBe('');
		});

		it('Can use the body of the cloned Response with a buffer independently.', async () => {
			const originalResponse = new window.Response('Hello World', {
				status: 200,
				statusText: 'OK',
				headers: { 'Content-Type': 'text/plain' }
			});
			const clonedResponse = originalResponse.clone();
			const clonedResponse2 = clonedResponse.clone();

			const originalResponseText = await originalResponse.text();
			const clonedResponseText = await clonedResponse.text();
			const clonedResponseText2 = await clonedResponse2.text();
			expect(originalResponseText).toBe('Hello World');
			expect(clonedResponseText).toBe('Hello World');
			expect(clonedResponseText2).toBe('Hello World');
		});

		it('Can use the body of the cloned Response with a buffer independently when cloned multiple times.', async () => {
			const originalResponse = new window.Response('Hello World', {
				status: 200,
				statusText: 'OK',
				headers: { 'Content-Type': 'text/plain' }
			});
			const clonedResponse = originalResponse.clone();

			const originalResponseText = await originalResponse.text();
			const clonedResponseText = await clonedResponse.text();
			expect(originalResponseText).toBe('Hello World');
			expect(clonedResponseText).toBe('Hello World');
		});

		it('Can use the body of the cloned Response independently (stream).', async () => {
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
			const nodeStream = Stream.Readable.from(generate());
			const readableStream = new ReadableStream({
				start(controller) {
					controller.enqueue('Hello World');
					controller.close();
				}
			});
			// Simulating that there is an underlying node stream
			readableStream[PropertySymbol.nodeStream] = nodeStream;
			const originalResponse = new window.Response(readableStream, {
				status: 200,
				statusText: 'OK',
				headers: { 'Content-Type': 'text/plain' }
			});
			const clonedResponse = originalResponse.clone();
			const clonedResponse2 = clonedResponse.clone();

			const originalResponseText = await originalResponse.text();
			const clonedResponseText = await clonedResponse.text();
			const clonedResponseText2 = await clonedResponse2.text();
			expect(originalResponseText).toBe('chunk1chunk2chunk3');
			expect(clonedResponseText).toBe('chunk1chunk2chunk3');
			expect(clonedResponseText2).toBe('chunk1chunk2chunk3');
		});

		it('Fails if the body of the original Response is already used.', async () => {
			const originalResponse = new window.Response(
				new ReadableStream({
					start(controller) {
						controller.enqueue('Hello World');
						controller.close();
					}
				}),
				{
					status: 200,
					statusText: 'OK',
					headers: { 'Content-Type': 'text/plain' }
				}
			);
			await expect(originalResponse.text()).resolves.toBe('Hello World');

			expect(() => originalResponse.clone()).toThrowError(DOMException);
			expect(() => originalResponse.clone()).toThrowError(
				'Failed to clone body stream of request: Request body is already used.'
			);
		});
	});

	describe('static redirect()', () => {
		it('Returns a new instance of Response with redirect status set to 302 by default.', async () => {
			const response = window.Response.redirect('https://example.com');

			expect(response.status).toBe(302);
			expect(response.headers.get('Location')).toBe('https://example.com/');
		});

		it('Returns a new instance of Response with redirect status set to 301.', async () => {
			const response = window.Response.redirect('https://example.com', 301);

			expect(response.status).toBe(301);
			expect(response.headers.get('Location')).toBe('https://example.com/');
		});

		it('Throws exception for ingaliv status codes.', async () => {
			let error: Error | null = null;

			try {
				window.Response.redirect('https://example.com', 200);
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					'Failed to create redirect response: Invalid redirect status code.',
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});
	});

	describe('static error()', () => {
		it('Returns a new instance of Response with type set to error.', async () => {
			const response = window.Response.error();

			expect(response.status).toBe(0);
			expect(response.statusText).toBe('');
			expect(response.type).toBe('error');
		});
	});

	describe('static json()', () => {
		it('Returns a new instance of Response with JSON body.', async () => {
			const data = { key1: 'value1', key2: 'value2' };
			const response = window.Response.json(data);

			expect(response.status).toBe(200);
			expect(response.statusText).toBe('');
			expect(response.headers.get('Content-Type')).toBe('application/json');
			expect(await response.json()).toEqual(data);
		});

		it('Returns a new instance of Response with JSON body and custom init.', async () => {
			const data = { key1: 'value1', key2: 'value2' };
			const response = window.Response.json(data, {
				status: 201,
				statusText: 'OK',
				headers: { 'Content-Type': 'test' }
			});

			expect(response.status).toBe(201);
			expect(response.statusText).toBe('OK');
			expect(response.headers.get('Content-Type')).toBe('test');
			expect(await response.json()).toEqual(data);
		});
	});
});
