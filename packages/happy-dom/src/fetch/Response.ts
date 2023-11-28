import IResponse from './types/IResponse.js';
import IBlob from '../file/IBlob.js';
import IResponseInit from './types/IResponseInit.js';
import IResponseBody from './types/IResponseBody.js';
import Headers from './Headers.js';
import IHeaders from './types/IHeaders.js';
import { URLSearchParams } from 'url';
import URL from '../url/URL.js';
import Blob from '../file/Blob.js';
import Stream from 'stream';
import FormData from '../form-data/FormData.js';
import FetchBodyUtility from './utilities/FetchBodyUtility.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import { TextDecoder } from 'util';
import MultipartFormDataParser from './multipart/MultipartFormDataParser.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import IBrowserWindow from '../window/IBrowserWindow.js';

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
	protected static __window__: IBrowserWindow;

	// Public properties
	public readonly body: Stream.Readable | null = null;
	public readonly bodyUsed = false;
	public readonly redirected = false;
	public readonly type: 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect' =
		'basic';
	public readonly url: string = '';
	public readonly status: number;
	public readonly statusText: string;
	public readonly ok: boolean;
	public readonly headers: IHeaders;
	readonly #window: IBrowserWindow;
	readonly #asyncTaskManager: AsyncTaskManager;

	/**
	 * Constructor.
	 *
	 * @param injected Injected properties.
	 * @param input Input.
	 * @param body
	 * @param [init] Init.
	 */
	constructor(
		injected: { window: IBrowserWindow; asyncTaskManager: AsyncTaskManager },
		body?: IResponseBody,
		init?: IResponseInit
	) {
		this.#window = injected.window;
		this.#asyncTaskManager = injected.asyncTaskManager;
		this.status = init?.status !== undefined ? init.status : 200;
		this.statusText = init?.statusText || '';
		this.ok = this.status >= 200 && this.status < 300;
		this.headers = new Headers(init?.headers);

		if (body) {
			const { stream, contentType } = FetchBodyUtility.getBodyStream(body);
			this.body = stream;

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

		const taskID = this.#asyncTaskManager.startTask();
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(this.body);
		} catch (error) {
			this.#asyncTaskManager.endTask(taskID);
			throw error;
		}

		this.#asyncTaskManager.endTask(taskID);

		return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	}

	/**
	 * Returns blob.
	 *
	 * @returns Blob.
	 */
	public async blob(): Promise<IBlob> {
		const type = this.headers.get('content-type') || '';
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

		const taskID = this.#asyncTaskManager.startTask();
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(this.body);
		} catch (error) {
			this.#asyncTaskManager.endTask(taskID);
			throw error;
		}

		this.#asyncTaskManager.endTask(taskID);

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

		if (!this.#asyncTaskManager) {
			debugger;
		}
		const taskID = this.#asyncTaskManager.startTask();
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(this.body);
		} catch (error) {
			this.#asyncTaskManager.endTask(taskID);
			throw error;
		}

		this.#asyncTaskManager.endTask(taskID);

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
		const contentType = this.headers.get('content-type');
		const taskID = this.#asyncTaskManager.startTask();

		if (contentType.startsWith('application/x-www-form-urlencoded')) {
			const formData = new FormData();
			let text: string;

			try {
				text = await this.text();
			} catch (error) {
				this.#asyncTaskManager.endTask(taskID);
				throw error;
			}

			const parameters = new URLSearchParams(text);

			for (const [name, value] of parameters) {
				formData.append(name, value);
			}

			this.#asyncTaskManager.endTask(taskID);

			return formData;
		}

		let formData: FormData;

		try {
			formData = await MultipartFormDataParser.streamToFormData(this.body, contentType);
		} catch (error) {
			this.#asyncTaskManager.endTask(taskID);
			throw error;
		}

		this.#asyncTaskManager.endTask(taskID);

		return formData;
	}

	/**
	 * Clones request.
	 *
	 * @returns Clone.
	 */
	public clone(): Response {
		const response = new this.#window.Response();

		(<number>response.status) = this.status;
		(<string>response.statusText) = this.statusText;
		(<boolean>response.ok) = this.ok;
		(<Headers>response.headers) = new Headers(this.headers);
		(<Stream.Readable>response.body) = this.body;
		(<boolean>response.bodyUsed) = this.bodyUsed;
		(<boolean>response.redirected) = this.redirected;
		(<string>response.type) = this.type;
		(<string>response.url) = this.url;

		return response;
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

		return new this.__window__.Response(null, {
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
		const response = new this.__window__.Response(null, { status: 0, statusText: '' });
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

		const headers = new this.__window__.Headers(init && init.headers);

		if (!headers.has('content-type')) {
			headers.set('content-type', 'application/json');
		}

		return new this.__window__.Response(body, {
			status: 200,
			...init,
			headers
		});
	}
}
