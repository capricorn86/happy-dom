import * as PropertySymbol from '../PropertySymbol.js';
import IRequestInit from './types/IRequestInit.js';
import { URL } from 'url';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import IRequestInfo from './types/IRequestInfo.js';
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
import BrowserWindow from '../window/BrowserWindow.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import IRequestMode from './types/IRequestMode.js';

/**
 * Fetch request.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/request.js
 *
 * @see https://fetch.spec.whatwg.org/#request-class
 */
export default class Request implements Request {
	// Injected by WindowContextClassExtender
	protected declare [PropertySymbol.window]: BrowserWindow;

	// Public properties
	public [PropertySymbol.method]: string;
	public [PropertySymbol.body]: ReadableStream | null;
	public [PropertySymbol.mode]: IRequestMode = 'cors';
	public [PropertySymbol.headers]: Headers;
	public [PropertySymbol.redirect]: IRequestRedirect;
	public [PropertySymbol.referrerPolicy]: IRequestReferrerPolicy;
	public [PropertySymbol.signal]: AbortSignal;
	public [PropertySymbol.bodyUsed]: boolean = false;
	public [PropertySymbol.credentials]: IRequestCredentials;

	// Internal properties
	public [PropertySymbol.aborted]: boolean = false;
	public [PropertySymbol.contentLength]: number | null = null;
	public [PropertySymbol.contentType]: string | null = null;
	public [PropertySymbol.referrer]: '' | 'no-referrer' | 'client' | URL = 'client';
	public [PropertySymbol.url]: URL;
	public [PropertySymbol.bodyBuffer]: Buffer | null;

	/**
	 * Constructor.
	 *
	 * @param input Input.
	 * @param [init] Init.
	 */
	constructor(input: IRequestInfo, init?: IRequestInit) {
		const window = this[PropertySymbol.window];

		if (!window) {
			throw new TypeError(
				`Failed to construct 'Request': 'Request' was constructed outside a Window context.`
			);
		}

		if (!input) {
			throw new window.TypeError(
				`Failed to contruct 'Request': 1 argument required, only 0 present.`
			);
		}

		this[PropertySymbol.method] = (init?.method || (<Request>input).method || 'GET').toUpperCase();

		if (init?.mode) {
			switch (init.mode) {
				case 'navigate':
				case 'websocket':
					throw new window.DOMException(
						`Failed to construct 'Request': Cannot construct a Request with a RequestInit whose mode member is set as '${init.mode}'.`,
						DOMExceptionNameEnum.securityError
					);
				case 'same-origin':
				case 'no-cors':
				case 'cors':
					this[PropertySymbol.mode] = init.mode;
					break;
				default:
					throw new window.DOMException(
						`Failed to construct 'Request': The provided value '${init.mode}' is not a valid enum value of type RequestMode.`,
						DOMExceptionNameEnum.syntaxError
					);
			}
		} else if (input instanceof Request) {
			this[PropertySymbol.mode] = input.mode;
		}

		const { stream, buffer, contentType, contentLength } = FetchBodyUtility.getBodyStream(
			input instanceof Request && (input[PropertySymbol.bodyBuffer] || input.body)
				? input[PropertySymbol.bodyBuffer] || FetchBodyUtility.cloneBodyStream(window, input)
				: init?.body
		);

		this[PropertySymbol.bodyBuffer] = buffer;
		this[PropertySymbol.body] = stream;
		this[PropertySymbol.credentials] =
			init?.credentials || (<Request>input).credentials || 'same-origin';
		this[PropertySymbol.headers] = new Headers(init?.headers || (<Request>input).headers || {});

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

		this[PropertySymbol.redirect] = init?.redirect || (<Request>input).redirect || 'follow';
		this[PropertySymbol.referrerPolicy] = <IRequestReferrerPolicy>(
			(init?.referrerPolicy || (<Request>input).referrerPolicy || '').toLowerCase()
		);
		this[PropertySymbol.signal] =
			init?.signal || (<Request>input).signal || new window.AbortSignal();
		this[PropertySymbol.referrer] = FetchRequestReferrerUtility.getInitialReferrer(
			window,
			init?.referrer !== null && init?.referrer !== undefined
				? init?.referrer
				: (<Request>input).referrer
		);

		if (input instanceof URL) {
			this[PropertySymbol.url] = input;
		} else {
			try {
				if (input instanceof Request && input.url) {
					this[PropertySymbol.url] = new URL(input.url, window.location.href);
				} else {
					this[PropertySymbol.url] = new URL(<string>input, window.location.href);
				}
			} catch (error) {
				throw new window.DOMException(
					`Failed to construct 'Request': Invalid URL "${input}" on document location '${
						window.location
					}'.${
						window.location.origin === 'null'
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
	 * Returns method.
	 *
	 * @returns Method.
	 */
	public get method(): string {
		return this[PropertySymbol.method];
	}

	/**
	 * Returns body.
	 *
	 * @returns Body.
	 */
	public get body(): ReadableStream | null {
		return this[PropertySymbol.body];
	}

	/**
	 * Returns mode.
	 *
	 * @returns Mode.
	 */
	public get mode(): IRequestMode {
		return this[PropertySymbol.mode];
	}

	/**
	 * Returns headers.
	 *
	 * @returns Headers.
	 */
	public get headers(): Headers {
		return this[PropertySymbol.headers];
	}

	/**
	 * Returns redirect.
	 *
	 * @returns Redirect.
	 */
	public get redirect(): IRequestRedirect {
		return this[PropertySymbol.redirect];
	}

	/**
	 * Returns referrer policy.
	 *
	 * @returns Referrer policy.
	 */
	public get referrerPolicy(): IRequestReferrerPolicy {
		return this[PropertySymbol.referrerPolicy];
	}

	/**
	 * Returns signal.
	 *
	 * @returns Signal.
	 */
	public get signal(): AbortSignal {
		return this[PropertySymbol.signal];
	}

	/**
	 * Returns body used.
	 *
	 * @returns Body used.
	 */
	public get bodyUsed(): boolean {
		return this[PropertySymbol.bodyUsed];
	}

	/**
	 * Returns credentials.
	 *
	 * @returns Credentials.
	 */
	public get credentials(): IRequestCredentials {
		return this[PropertySymbol.credentials];
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
		const window = this[PropertySymbol.window];

		if (this[PropertySymbol.bodyUsed]) {
			throw new window.DOMException(
				`Body has already been used for "${this.url}".`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const asyncTaskManager = new WindowBrowserContext(window).getAsyncTaskManager();

		this[PropertySymbol.bodyUsed] = true;

		const taskID = asyncTaskManager.startTask(() => {
			if (this.body) {
				this.body[PropertySymbol.aborted] = true;
			}
			this.signal[PropertySymbol.abort]();
		});
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(window, this.body);
		} catch (error) {
			asyncTaskManager.endTask(taskID);
			throw error;
		}

		asyncTaskManager.endTask(taskID);

		return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	}

	/**
	 * Returns blob.
	 *
	 * @returns Blob.
	 */
	public async blob(): Promise<Blob> {
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
		const window = this[PropertySymbol.window];

		if (this[PropertySymbol.bodyUsed]) {
			throw new window.DOMException(
				`Body has already been used for "${this.url}".`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const asyncTaskManager = new WindowBrowserContext(window).getAsyncTaskManager();

		this[PropertySymbol.bodyUsed] = true;

		const taskID = asyncTaskManager.startTask(() => {
			if (this.body) {
				this.body[PropertySymbol.aborted] = true;
			}
			this.signal[PropertySymbol.abort]();
		});
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(window, this.body);
		} catch (error) {
			asyncTaskManager.endTask(taskID);
			throw error;
		}

		asyncTaskManager.endTask(taskID);

		return buffer;
	}

	/**
	 * Returns text.
	 *
	 * @returns Text.
	 */
	public async text(): Promise<string> {
		const window = this[PropertySymbol.window];

		if (this[PropertySymbol.bodyUsed]) {
			throw new window.DOMException(
				`Body has already been used for "${this.url}".`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const asyncTaskManager = new WindowBrowserContext(window).getAsyncTaskManager();

		this[PropertySymbol.bodyUsed] = true;

		const taskID = asyncTaskManager.startTask(() => {
			if (this.body) {
				this.body[PropertySymbol.aborted] = true;
			}
			this.signal[PropertySymbol.abort]();
		});
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(window, this.body);
		} catch (error) {
			asyncTaskManager.endTask(taskID);
			throw error;
		}

		asyncTaskManager.endTask(taskID);

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
		const window = this[PropertySymbol.window];
		const asyncTaskManager = new WindowBrowserContext(window).getAsyncTaskManager();
		const contentType = this[PropertySymbol.contentType];

		if (/multipart/i.test(contentType)) {
			if (this[PropertySymbol.bodyUsed]) {
				throw new window.DOMException(
					`Body has already been used for "${this.url}".`,
					DOMExceptionNameEnum.invalidStateError
				);
			}

			this[PropertySymbol.bodyUsed] = true;

			const taskID = asyncTaskManager.startTask(() => {
				if (this.body) {
					this.body[PropertySymbol.aborted] = true;
				}
				this.signal[PropertySymbol.abort]();
			});
			let formData: FormData;

			try {
				const result = await MultipartFormDataParser.streamToFormData(
					window,
					this.body,
					contentType
				);
				formData = result.formData;
			} catch (error) {
				asyncTaskManager.endTask(taskID);
				throw error;
			}

			asyncTaskManager.endTask(taskID);

			return formData;
		}

		if (contentType?.startsWith('application/x-www-form-urlencoded')) {
			const parameters = new URLSearchParams(await this.text());
			const formData = new window.FormData();

			for (const [key, value] of parameters) {
				formData.append(key, value);
			}

			return formData;
		}

		throw new window.DOMException(
			`Failed to construct FormData object: The "content-type" header is neither "application/x-www-form-urlencoded" nor "multipart/form-data".`,
			DOMExceptionNameEnum.invalidStateError
		);
	}

	/**
	 * Clones request.
	 *
	 * @returns Clone.
	 */
	public clone(): Request {
		return new this[PropertySymbol.window].Request(this);
	}
}
