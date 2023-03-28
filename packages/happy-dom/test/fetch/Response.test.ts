import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import IDocument from '../../src/nodes/document/IDocument';
import Response from '../../src/fetch/Response';
import Headers from '../../src/fetch/Headers';
import Blob from '../../src/file/Blob';
import FormData from '../../src/form-data/FormData';
import FS from 'fs';
import Path from 'path';
import { File } from '../../src';
import DOMException from '../../src/exception/DOMException';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum';

describe('Response', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		Response._ownerDocument = document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Sets default values for properties.', () => {
			const response = new Response();
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
			const response = new Response(null, { status: 404 });
			expect(response.status).toBe(404);
		});

		it('Sets status text from init object.', () => {
			const response = new Response(null, { statusText: 'test' });
			expect(response.statusText).toBe('test');
		});

		it('Sets ok state correctly based on status code.', () => {
			const response199 = new Response(null, { status: 199 });
			const response200 = new Response(null, { status: 200 });
			const response299 = new Response(null, { status: 299 });
			const response300 = new Response(null, { status: 300 });
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
			const response = new Response(null, { headers });

			const headerEntries = {};

			for (const [key, value] of response.headers) {
				headerEntries[key] = value;
			}

			expect(headers === response.headers).toBe(false);
			expect(headerEntries).toEqual(headerValues);
		});

		it('Sets body from init object.', async () => {
			const response = new Response('Hello World');
			const chunks = [];

			for await (const chunk of response.body) {
				chunks.push(Buffer.from(chunk));
			}

			expect(Buffer.concat(chunks).toString()).toBe('Hello World');
		});
	});

	describe('get [Symbol.toStringTag]()', () => {
		it('Returns class name.', () => {
			expect(String(new Response())).toBe('[object Response]');
		});
	});

	describe('arrayBuffer()', () => {
		it('Returns ArrayBuffer.', async () => {
			const response = new Response('Hello World');
			const arrayBuffer = await response.arrayBuffer();

			expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
			expect(Buffer.from(arrayBuffer).toString()).toBe('Hello World');
		});
	});

	describe('blob()', () => {
		it('Returns Blob.', async () => {
			const response = new Response('Hello World', { headers: { 'Content-Type': 'text/plain' } });
			const blob = await response.blob();

			expect(blob).toBeInstanceOf(Blob);
			expect(blob.type).toBe('text/plain');

			const text = await blob.text();
			expect(text).toBe('Hello World');
		});
	});

	describe('buffer()', () => {
		it('Returns Buffer.', async () => {
			const response = new Response('Hello World');
			const buffer = await response.buffer();

			expect(buffer).toBeInstanceOf(Buffer);
			expect(buffer.toString()).toBe('Hello World');
		});
	});

	describe('text()', () => {
		it('Returns text string.', async () => {
			const response = new Response('Hello World');
			const text = await response.text();

			expect(text).toBe('Hello World');
		});
	});

	describe('json()', () => {
		it('Returns JSON.', async () => {
			const response = new Response('{ "key1": "value1" }');
			const json = await response.json();

			expect(json).toEqual({ key1: 'value1' });
		});
	});

	describe('formData()', () => {
		it('Returns FormData for text fields.', async () => {
			const formData = new FormData();

			jest.spyOn(Math, 'random').mockImplementation(() => 0.8);

			formData.set('key1', 'value1');
			formData.set('key2', 'value2');
			formData.set('key3', 'value3');

			const response = new Response(formData);
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

		it('Returns FormData for files.', async () => {
			const formData = new FormData();
			const imageBuffer = await FS.promises.readFile(
				Path.join(__dirname, 'data', 'test-image.jpg')
			);

			jest.spyOn(Math, 'random').mockImplementation(() => 0.8);

			formData.set('key1', 'value1');
			formData.set('file1', new File([imageBuffer], 'test-image-1.jpg', { type: 'image/jpeg' }));
			formData.set('key2', 'value2');
			formData.set('file2', new File([imageBuffer], 'test-image-2.jpg', { type: 'image/jpeg' }));

			const response = new Response(formData);
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
	});

	describe('clone()', () => {
		it('Returns a clone.', async () => {
			const response = new Response('Hello World', {
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
	});

	describe('static redirect()', () => {
		it('Returns a new instance of Response with redirect status set to 302 by default.', async () => {
			const response = Response.redirect('https://example.com');

			expect(response.status).toBe(302);
			expect(response.headers.get('Location')).toBe('https://example.com/');
		});

		it('Returns a new instance of Response with redirect status set to 301.', async () => {
			const response = Response.redirect('https://example.com', 301);

			expect(response.status).toBe(301);
			expect(response.headers.get('Location')).toBe('https://example.com/');
		});

		it('Throws exception for ingaliv status codes.', async () => {
			let error: Error | null = null;

			try {
				Response.redirect('https://example.com', 200);
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
			const response = Response.error();

			expect(response.status).toBe(0);
			expect(response.statusText).toBe('');
			expect(response.type).toBe('error');
		});
	});

	describe('static json()', () => {
		it('Returns a new instance of Response with JSON body.', async () => {
			const data = { key1: 'value1', key2: 'value2' };
			const response = Response.json(data);

			expect(response.status).toBe(200);
			expect(response.statusText).toBe('');
			expect(response.headers.get('Content-Type')).toBe('application/json');
			expect(await response.json()).toEqual(data);
		});

		it('Returns a new instance of Response with JSON body and custom init.', async () => {
			const data = { key1: 'value1', key2: 'value2' };
			const response = Response.json(data, {
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
