import IResponse from './types/IResponse.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IBlob from '../file/IBlob.js';
import IResponseInit from './types/IResponseInit.js';
import IResponseBody from './types/IResponseBody.js';
import Headers from './Headers.js';
import IHeaders from './types/IHeaders.js';
import { URLSearchParams } from 'url';
import URL from '../url/URL.js';
import Blob from '../file/Blob.js';
import { ReadableStream } from 'stream/web';
import FormData from '../form-data/FormData.js';
import FetchBodyUtility from './utilities/FetchBodyUtility.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import MultipartFormDataParser from './multipart/MultipartFormDataParser.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import ICachedResponse from './cache/response/ICachedResponse.js';
import { Buffer } from 'buffer';

const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];

/**
 * Fetch response.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/response.js (MIT)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
 */
export default class Response implements IResponse {
	// Needs to be injected by sub-class.
	protected static [PropertySymbol.window]: IBrowserWindow;

	// Public properties
	public readonly body: ReadableStream | null = null;
	public readonly bodyUsed = false;
	public readonly redirected = false;
	public readonly type: 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect' =
		'basic';
	public readonly url: string = '';
	public readonly status: number;
	public readonly statusText: string;
	public readonly ok: boolean;
	public readonly headers: IHeaders;
	public [PropertySymbol.cachedResponse]: ICachedResponse | null = null;
	public readonly [PropertySymbol.buffer]: Buffer | null = null;
	readonly #window: IBrowserWindow;
	readonly #browserFrame: IBrowserFrame;

	/**
	 * Constructor.
	 *
	 * @param injected Injected properties.
	 * @param input Input.
	 * @param injected.window
	 * @param body
	 * @param injected.browserFrame
	 * @param [init] Init.
	 */
	constructor(
		injected: { window: IBrowserWindow; browserFrame: IBrowserFrame },
		body?: IResponseBody,
		init?: IResponseInit
	) {
		this.#window = injected.window;
		this.#browserFrame = injected.browserFrame;
		this.status = init?.status !== undefined ? init.status : 200;
		this.statusText = init?.statusText || '';
		this.ok = this.status >= 200 && this.status < 300;
		this.headers = new Headers(init?.headers);

		// "Set-Cookie" and "Set-Cookie2" are not allowed in response headers according to spec.
		this.headers.delete('Set-Cookie');
		this.headers.delete('Set-Cookie2');

		if (body) {
			const { stream, buffer, contentType } = FetchBodyUtility.getBodyStream(body);
			this.body = stream;

			if (buffer) {
				this[PropertySymbol.buffer] = buffer;
			}

			if (contentType && !this.headers.has('Content-Type')) {
				this.headers.set('Content-Type', contentType);
			}
		}
	}

	/**
	 * Returns string tag.
	 *
	 * @returns String tag.
	 */
	public get [Symbol.toStringTag](): string {
		return 'Response';
	}

	/**
	 * Returns array buffer.
	 *
	 * @returns Array buffer.
	 */
	public async arrayBuffer(): Promise<ArrayBuffer> {
		if (this.bodyUsed) {
			throw new DOMException(
				`Body has already been used for "${this.url}".`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		(<boolean>this.bodyUsed) = true;

		let buffer: Buffer | null = this[PropertySymbol.buffer];

		if (!buffer) {
			const taskID = this.#browserFrame[PropertySymbol.asyncTaskManager].startTask();

			try {
				buffer = await FetchBodyUtility.consumeBodyStream(this.body);
			} catch (error) {
				this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
				throw error;
			}

			this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
		}

		this.#storeBodyInCache(buffer);

		return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	}

	/**
	 * Returns blob.
	 *
	 * @returns Blob.
	 */
	public async blob(): Promise<IBlob> {
		const type = this.headers.get('Content-Type') || '';
		const buffer = await this.arrayBuffer();

		return new Blob([buffer], { type });
	}

	/**
	 * Returns buffer.
	 *
	 * @returns Buffer.
	 */
	public async buffer(): Promise<Buffer> {
		if (this.bodyUsed) {
			throw new DOMException(
				`Body has already been used for "${this.url}".`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		(<boolean>this.bodyUsed) = true;

		let buffer: Buffer | null = this[PropertySymbol.buffer];

		if (!buffer) {
			const taskID = this.#browserFrame[PropertySymbol.asyncTaskManager].startTask();
			try {
				buffer = await FetchBodyUtility.consumeBodyStream(this.body);
			} catch (error) {
				this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
				throw error;
			}
			this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
		}

		this.#storeBodyInCache(buffer);

		return buffer;
	}

	/**
	 * Returns text.
	 *
	 * @returns Text.
	 */
	public async text(): Promise<string> {
		if (this.bodyUsed) {
			throw new DOMException(
				`Body has already been used for "${this.url}".`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		(<boolean>this.bodyUsed) = true;

		let buffer: Buffer | null = this[PropertySymbol.buffer];

		if (!buffer) {
			const taskID = this.#browserFrame[PropertySymbol.asyncTaskManager].startTask();
			try {
				buffer = await FetchBodyUtility.consumeBodyStream(this.body);
			} catch (error) {
				this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
				throw error;
			}
			this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
		}

		this.#storeBodyInCache(buffer);

		return new TextDecoder().decode(buffer);
	}

	/**
	 * Returns json.
	 *
	 * @returns JSON.
	 */
	public async json(): Promise<string> {
		const text = await this.text();
		return JSON.parse(text);
	}

	/**
	 * Returns form data.
	 *
	 * @returns Form data.
	 */
	public async formData(): Promise<FormData> {
		const contentType = this.headers.get('Content-Type');

		if (contentType?.startsWith('application/x-www-form-urlencoded')) {
			const formData = new FormData();
			const text = await this.text();
			const parameters = new URLSearchParams(text);

			for (const [name, value] of parameters) {
				formData.append(name, value);
			}

			return formData;
		}

		const taskID = this.#browserFrame[PropertySymbol.asyncTaskManager].startTask();
		let formData: FormData;
		let buffer: Buffer;

		try {
			const result = await MultipartFormDataParser.streamToFormData(this.body, contentType);
			formData = result.formData;
			buffer = result.buffer;
		} catch (error) {
			this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);
			throw error;
		}

		this.#storeBodyInCache(buffer);

		this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskID);

		return formData;
	}

	/**
	 * Clones request.
	 *
	 * @returns Clone.
	 */
	public clone(): Response {
		const response = new this.#window.Response(this.body, {
			status: this.status,
			statusText: this.statusText,
			headers: this.headers
		});

		(<number>response.status) = this.status;
		(<string>response.statusText) = this.statusText;
		(<boolean>response.ok) = this.ok;
		(<Headers>response.headers) = new Headers(this.headers);
		(<ReadableStream>response.body) = this.body;
		(<boolean>response.bodyUsed) = this.bodyUsed;
		(<boolean>response.redirected) = this.redirected;
		(<string>response.type) = this.type;
		(<string>response.url) = this.url;

		return response;
	}

	/**
	 * Stores body in cache.
	 *
	 * @param buffer Buffer.
	 */
	#storeBodyInCache(buffer: Buffer): void {
		if (this[PropertySymbol.cachedResponse]?.response?.waitingForBody) {
			this[PropertySymbol.cachedResponse].response.body = buffer;
			this[PropertySymbol.cachedResponse].response.waitingForBody = false;
		}
	}

	/**
	 * Returns a redirect response.
	 *
	 * @param url URL.
	 * @param status Status code.
	 * @returns Response.
	 */
	public static redirect(url: string, status = 302): Response {
		if (!REDIRECT_STATUS_CODES.includes(status)) {
			throw new DOMException(
				'Failed to create redirect response: Invalid redirect status code.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		return new this[PropertySymbol.window].Response(null, {
			headers: {
				location: new URL(url).toString()
			},
			status
		});
	}

	/**
	 * Returns an error response.
	 *
	 * @param url URL.
	 * @param status Status code.
	 * @returns Response.
	 */
	public static error(): Response {
		const response = new this[PropertySymbol.window].Response(null, { status: 0, statusText: '' });
		(<string>response.type) = 'error';
		return response;
	}

	/**
	 * Returns an JSON response.
	 *
	 * @param injected Injected properties.
	 * @param data Data.
	 * @param [init] Init.
	 * @returns Response.
	 */
	public static json(data: object, init?: IResponseInit): Response {
		const body = JSON.stringify(data);

		if (body === undefined) {
			throw new TypeError('data is not JSON serializable');
		}

		const headers = new this[PropertySymbol.window].Headers(init && init.headers);

		if (!headers.has('Content-Type')) {
			headers.set('Content-Type', 'application/json');
		}

		return new this[PropertySymbol.window].Response(body, {
			status: 200,
			...init,
			headers
		});
	}
}
