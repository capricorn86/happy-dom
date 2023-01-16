import IBlob from '../file/IBlob';
import IDocument from '../nodes/document/IDocument';
import IRequestInit from './types/IRequestInit';
import { URL } from 'url';
import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import IRequestInfo from './types/IRequestInfo';
import IRequest from './types/IRequest';
import Headers from './Headers';
import FetchBodyUtility from './utilities/FetchBodyUtility';
import AbortSignal from './AbortSignal';
import Stream from 'stream';
import Blob from '../file/Blob';
import { TextDecoder } from 'util';
import FetchRequestValidationUtility from './utilities/FetchRequestValidationUtility';
import IRequestReferrerPolicy from './types/IRequestReferrerPolicy';
import IRequestRedirect from './types/IRequestRedirect';
import FetchRequestReferrerUtility from './utilities/FetchRequestReferrerUtility';

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
	public readonly bodyUsed: boolean;

	// Internal properties
	public _referrer: '' | 'no-referrer' | 'client' | URL = 'client';
	public readonly _contentLength: number | null;
	public readonly _url: URL;

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

		const { stream, contentType, contentLength } = FetchBodyUtility.getBodyStream(
			this._ownerDocument.defaultView,
			input instanceof Request && input.body !== null ? input.body : init?.body
		);

		this.body = stream;
		this.headers = new Headers(init?.headers || (<Request>input).headers || {});

		if (contentLength) {
			this._contentLength = contentLength;
		} else if (this.body && (this.method === 'POST' || this.method === 'PUT')) {
			this._contentLength = 0;
		}

		if (!this.headers.get('Content-Type') && contentType) {
			this.headers.append('Content-Type', contentType);
		}

		this.redirect = init?.redirect || (<Request>input).redirect || 'follow';
		this.referrerPolicy = <IRequestReferrerPolicy>(
			(init?.referrerPolicy || (<Request>input).referrerPolicy || '').toLowerCase()
		);
		this.signal = init?.signal || (<Request>input).signal || new AbortSignal();
		this._referrer = FetchRequestReferrerUtility.getInitialReferrer(
			this._ownerDocument,
			init?.referrer !== null ? init?.referrer : (<Request>input).referrer
		);
		this._url = (<Request>input).url
			? new URL((<Request>input).url, this._ownerDocument.location)
			: input instanceof URL
			? input
			: new URL(<string>input, this._ownerDocument.location);

		FetchRequestValidationUtility.validateBody(this);
		FetchRequestValidationUtility.validateURL(this._url);
		FetchRequestValidationUtility.validateHeaders(this.headers);
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

		return buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
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
	 * Clones request.
	 *
	 * @returns Clone.
	 */
	public clone(): IRequest {
		return <IRequest>new Request(this);
	}
}
