import IBlob from '../file/IBlob.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IDocument from '../nodes/document/IDocument.js';
import IRequestInit from './types/IRequestInit.js';
import URL from '../url/URL.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import IRequestInfo from './types/IRequestInfo.js';
import IRequest from './types/IRequest.js';
import Headers from './Headers.js';
import FetchBodyUtility from './utilities/FetchBodyUtility.js';
import AbortSignal from './AbortSignal.js';
import { ReadableStream } from 'stream/web';
import Blob from '../file/Blob.js';
import FetchRequestValidationUtility from './utilities/FetchRequestValidationUtility.js';
import IRequestReferrerPolicy from './types/IRequestReferrerPolicy.js';
import IRequestRedirect from './types/IRequestRedirect.js';
import FetchRequestReferrerUtility from './utilities/FetchRequestReferrerUtility.js';
import FetchRequestHeaderUtility from './utilities/FetchRequestHeaderUtility.js';
import IRequestCredentials from './types/IRequestCredentials.js';
import FormData from '../form-data/FormData.js';
import MultipartFormDataParser from './multipart/MultipartFormDataParser.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import IBrowserWindow from '../window/IBrowserWindow.js';

/**
 * Fetch request.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/request.js
 *
 * @see https://fetch.spec.whatwg.org/#request-class
 */
export default class Request implements IRequest {
	// Public properties
	public readonly method: string;
	public readonly body: ReadableStream | null;
	public readonly headers: Headers;
	public readonly redirect: IRequestRedirect;
	public readonly referrerPolicy: IRequestReferrerPolicy;
	public readonly signal: AbortSignal;
	public readonly bodyUsed: boolean = false;
	public readonly credentials: IRequestCredentials;

	// Internal properties
	public [PropertySymbol.contentLength]: number | null = null;
	public [PropertySymbol.contentType]: string | null = null;
	public [PropertySymbol.referrer]: '' | 'no-referrer' | 'client' | URL = 'client';
	public [PropertySymbol.url]: URL;
	public [PropertySymbol.bodyBuffer]: Buffer | null;

	// Private properties
	readonly #window: IBrowserWindow;
	readonly #asyncTaskManager: AsyncTaskManager;

	/**
	 * Constructor.
	 *
	 * @param injected Injected properties.
	 * @param injected.window
	 * @param input Input.
	 * @param injected.asyncTaskManager
	 * @param [init] Init.
	 */
	constructor(
		injected: { window: IBrowserWindow; asyncTaskManager: AsyncTaskManager },
		input: IRequestInfo,
		init?: IRequestInit
	) {
		this.#window = injected.window;
		this.#asyncTaskManager = injected.asyncTaskManager;

		if (!input) {
			throw new TypeError(`Failed to contruct 'Request': 1 argument required, only 0 present.`);
		}

		this.method = (init?.method || (<Request>input).method || 'GET').toUpperCase();

		const { stream, buffer, contentType, contentLength } = FetchBodyUtility.getBodyStream(
			input instanceof Request && (input[PropertySymbol.bodyBuffer] || input.body)
				? input[PropertySymbol.bodyBuffer] || FetchBodyUtility.cloneBodyStream(input)
				: init?.body
		);

		this[PropertySymbol.bodyBuffer] = buffer;
		this.body = stream;
		this.credentials = init?.credentials || (<Request>input).credentials || 'same-origin';
		this.headers = new Headers(init?.headers || (<Request>input).headers || {});

		FetchRequestHeaderUtility.removeForbiddenHeaders(this.headers);

		if (contentLength) {
			this[PropertySymbol.contentLength] = contentLength;
		} else if (!this.body && (this.method === 'POST' || this.method === 'PUT')) {
			this[PropertySymbol.contentLength] = 0;
		}

		if (contentType) {
			if (!this.headers.has('Content-Type')) {
				this.headers.set('Content-Type', contentType);
			}
			this[PropertySymbol.contentType] = contentType;
		} else if (input instanceof Request && input[PropertySymbol.contentType]) {
			this[PropertySymbol.contentType] = input[PropertySymbol.contentType];
		}

		this.redirect = init?.redirect || (<Request>input).redirect || 'follow';
		this.referrerPolicy = <IRequestReferrerPolicy>(
			(init?.referrerPolicy || (<Request>input).referrerPolicy || '').toLowerCase()
		);
		this.signal = init?.signal || (<Request>input).signal || new AbortSignal();
		this[PropertySymbol.referrer] = FetchRequestReferrerUtility.getInitialReferrer(
			injected.window,
			init?.referrer !== null && init?.referrer !== undefined
				? init?.referrer
				: (<Request>input).referrer
		);

		if (input instanceof URL) {
			this[PropertySymbol.url] = input;
		} else {
			try {
				if (input instanceof Request && input.url) {
					this[PropertySymbol.url] = new URL(input.url, injected.window.location);
				} else {
					this[PropertySymbol.url] = new URL(<string>input, injected.window.location);
				}
			} catch (error) {
				throw new DOMException(
					`Failed to construct 'Request. Invalid URL "${input}" on document location '${
						injected.window.location
					}'.${
						injected.window.location.origin === 'null'
							? ' Relative URLs are not permitted on current document location.'
							: ''
					}`,
					DOMExceptionNameEnum.notSupportedError
				);
			}
		}

		FetchRequestValidationUtility.validateMethod(this);
		FetchRequestValidationUtility.validateBody(this);
		FetchRequestValidationUtility.validateURL(this[PropertySymbol.url]);
		FetchRequestValidationUtility.validateReferrerPolicy(this.referrerPolicy);
		FetchRequestValidationUtility.validateRedirect(this.redirect);
	}

	/**
	 * Returns owner document.
	 */
	protected get [PropertySymbol.ownerDocument](): IDocument {
		throw new Error('[PropertySymbol.ownerDocument] getter needs to be implemented by sub-class.');
	}

	/**
	 * Returns referrer.
	 *
	 * @returns Referrer.
	 */
	public get referrer(): string {
		if (!this[PropertySymbol.referrer] || this[PropertySymbol.referrer] === 'no-referrer') {
			return '';
		}

		if (this[PropertySymbol.referrer] === 'client') {
			return 'about:client';
		}

		return this[PropertySymbol.referrer].toString();
	}

	/**
	 * Returns URL.
	 *
	 * @returns URL.
	 */
	public get url(): string {
		return this[PropertySymbol.url].href;
	}

	/**
	 * Returns string tag.
	 *
	 * @returns String tag.
	 */
	public get [Symbol.toStringTag](): string {
		return 'Request';
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

		const taskID = this.#asyncTaskManager.startTask(() => this.signal[PropertySymbol.abort]());
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

		const taskID = this.#asyncTaskManager.startTask(() => this.signal[PropertySymbol.abort]());
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

		const taskID = this.#asyncTaskManager.startTask(() => this.signal[PropertySymbol.abort]());
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
	 * Returns FormData.
	 *
	 * @returns FormData.
	 */
	public async formData(): Promise<FormData> {
		if (this.bodyUsed) {
			throw new DOMException(
				`Body has already been used for "${this.url}".`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		(<boolean>this.bodyUsed) = true;

		const taskID = this.#asyncTaskManager.startTask(() => this.signal[PropertySymbol.abort]());
		let formData: FormData;

		try {
			const type = this[PropertySymbol.contentType];
			formData = (await MultipartFormDataParser.streamToFormData(this.body, type)).formData;
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
	public clone(): Request {
		return new this.#window.Request(this);
	}
}
