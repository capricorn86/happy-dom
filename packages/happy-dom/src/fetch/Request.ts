import IBlob from '../file/IBlob.js';
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
import Stream from 'stream';
import Blob from '../file/Blob.js';
import { TextDecoder } from 'util';
import FetchRequestValidationUtility from './utilities/FetchRequestValidationUtility.js';
import IRequestReferrerPolicy from './types/IRequestReferrerPolicy.js';
import IRequestRedirect from './types/IRequestRedirect.js';
import FetchRequestReferrerUtility from './utilities/FetchRequestReferrerUtility.js';
import FetchRequestHeaderUtility from './utilities/FetchRequestHeaderUtility.js';
import IRequestCredentials from './types/IRequestCredentials.js';
import FormData from '../form-data/FormData.js';
import MultipartFormDataParser from './multipart/MultipartFormDataParser.js';

/**
 * Fetch request.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/request.js
 *
 * @see https://fetch.spec.whatwg.org/#request-class
 */
export default class Request implements IRequest {
	// Owner document is set by a sub-class in the Window constructor
	public static _ownerDocument: IDocument = null;
	public readonly _ownerDocument: IDocument = null;

	// Public properties
	public readonly method: string;
	public readonly body: Stream.Readable | null;
	public readonly headers: Headers;
	public readonly redirect: IRequestRedirect;
	public readonly referrerPolicy: IRequestReferrerPolicy;
	public readonly signal: AbortSignal;
	public readonly bodyUsed: boolean = false;
	public readonly credentials: IRequestCredentials;

	// Internal properties
	public readonly _contentLength: number | null = null;
	public readonly _contentType: string | null = null;
	public _referrer: '' | 'no-referrer' | 'client' | URL = 'client';
	public readonly _url: URL;
	public readonly _bodyBuffer: Buffer | null;

	/**
	 * Constructor.
	 *
	 * @param input Input.
	 * @param [init] Init.
	 */
	constructor(input: IRequestInfo, init?: IRequestInit) {
		this._ownerDocument = (<typeof Request>this.constructor)._ownerDocument;

		if (!input) {
			throw new TypeError(`Failed to contruct 'Request': 1 argument required, only 0 present.`);
		}

		this.method = (init?.method || (<Request>input).method || 'GET').toUpperCase();

		const { stream, buffer, contentType, contentLength } = FetchBodyUtility.getBodyStream(
			input instanceof Request && (input._bodyBuffer || input.body)
				? input._bodyBuffer || FetchBodyUtility.cloneRequestBodyStream(input)
				: init?.body
		);

		this._bodyBuffer = buffer;
		this.body = stream;
		this.credentials = init?.credentials || (<Request>input).credentials || 'same-origin';
		this.headers = new Headers(init?.headers || (<Request>input).headers || {});

		FetchRequestHeaderUtility.removeForbiddenHeaders(this.headers);

		if (contentLength) {
			this._contentLength = contentLength;
		} else if (!this.body && (this.method === 'POST' || this.method === 'PUT')) {
			this._contentLength = 0;
		}

		if (contentType) {
			if (!this.headers.has('Content-Type')) {
				this.headers.set('Content-Type', contentType);
			}
			this._contentType = contentType;
		} else if (input instanceof Request && input._contentType) {
			this._contentType = input._contentType;
		}

		this.redirect = init?.redirect || (<Request>input).redirect || 'follow';
		this.referrerPolicy = <IRequestReferrerPolicy>(
			(init?.referrerPolicy || (<Request>input).referrerPolicy || '').toLowerCase()
		);
		this.signal = init?.signal || (<Request>input).signal || new AbortSignal();
		this._referrer = FetchRequestReferrerUtility.getInitialReferrer(
			this._ownerDocument,
			init?.referrer !== null && init?.referrer !== undefined
				? init?.referrer
				: (<Request>input).referrer
		);

		if (input instanceof URL) {
			this._url = input;
		} else {
			try {
				if (input instanceof Request && input.url) {
					this._url = new URL(input.url, this._ownerDocument.location);
				} else {
					this._url = new URL(<string>input, this._ownerDocument.location);
				}
			} catch (error) {
				throw new DOMException(
					`Failed to construct 'Request. Invalid URL "${input}" on document location '${
						this._ownerDocument.location
					}'.${
						this._ownerDocument.location.origin === 'null'
							? ' Relative URLs are not permitted on current document location.'
							: ''
					}`,
					DOMExceptionNameEnum.notSupportedError
				);
			}
		}

		FetchRequestValidationUtility.validateBody(this);
		FetchRequestValidationUtility.validateURL(this._url);
		FetchRequestValidationUtility.validateReferrerPolicy(this.referrerPolicy);
		FetchRequestValidationUtility.validateRedirect(this.redirect);
	}

	/**
	 * Returns referrer.
	 *
	 * @returns Referrer.
	 */
	public get referrer(): string {
		if (!this._referrer || this._referrer === 'no-referrer') {
			return '';
		}

		if (this._referrer === 'client') {
			return 'about:client';
		}

		return this._referrer.toString();
	}

	/**
	 * Returns URL.
	 *
	 * @returns URL.
	 */
	public get url(): string {
		return this._url.href;
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

		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		const taskID = taskManager.startTask(() => this.signal._abort());
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(this.body);
		} catch (error) {
			taskManager.endTask(taskID);
			throw error;
		}

		taskManager.endTask(taskID);

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

		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		const taskID = taskManager.startTask(() => this.signal._abort());
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(this.body);
		} catch (error) {
			taskManager.endTask(taskID);
			throw error;
		}

		taskManager.endTask(taskID);

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

		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		const taskID = taskManager.startTask(() => this.signal._abort());
		let buffer: Buffer;

		try {
			buffer = await FetchBodyUtility.consumeBodyStream(this.body);
		} catch (error) {
			taskManager.endTask(taskID);
			throw error;
		}

		taskManager.endTask(taskID);

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

		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		const taskID = taskManager.startTask(() => this.signal._abort());
		let formData: FormData;

		try {
			const type = this._contentType;
			formData = await MultipartFormDataParser.streamToFormData(this.body, type);
		} catch (error) {
			taskManager.endTask(taskID);
			throw error;
		}

		taskManager.endTask(taskID);

		return formData;
	}

	/**
	 * Clones request.
	 *
	 * @returns Clone.
	 */
	public clone(): IRequest {
		return <IRequest>new Request(this);
	}
}
