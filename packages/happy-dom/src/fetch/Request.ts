import IBlob from '../file/IBlob';
import IDocument from '../nodes/document/IDocument';
import IRequestInit from './IRequestInit';
import Headers from './Headers';
import { URL } from 'url';
import DOMException from 'src/exception/DOMException';
import DOMExceptionNameEnum from 'src/exception/DOMExceptionNameEnum';
import IRequestInfo from './IRequestInfo';
import IRequest from './IRequest';
import IHeaders from './IHeaders';
import FetchBodyUtility from './FetchBodyUtility';
import AbortSignal from './AbortSignal';
import { Readable } from 'stream';
import Blob from '../file/Blob';
import { TextDecoder } from 'util';
import RelativeURL from '../location/RelativeURL';

const VALID_REFERRER_POLICIES = [
	'',
	'no-referrer',
	'no-referrer-when-downgrade',
	'same-origin',
	'origin',
	'strict-origin',
	'origin-when-cross-origin',
	'strict-origin-when-cross-origin',
	'unsafe-url'
];

const VALID_REDIRECTS = ['error', 'manual', 'follow'];

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
	public readonly url: string;
	public readonly method: string;
	public readonly body: Readable | null;
	public readonly headers: IHeaders;
	public readonly referrer: string = 'about:client';
	public readonly redirect: 'error' | 'manual' | 'follow';
	public readonly referrerPolicy:
		| ''
		| 'no-referrer'
		| 'no-referrer-when-downgrade'
		| 'same-origin'
		| 'origin'
		| 'strict-origin'
		| 'origin-when-cross-origin'
		| 'strict-origin-when-cross-origin'
		| 'unsafe-url';
	public readonly signal: AbortSignal;
	public readonly bodyUsed: boolean;

	// Internal properties
	public readonly _contentLength: number | null = null;

	/**
	 * Constructor.
	 *
	 * @param input Input.
	 * @param [init] Init.
	 */
	constructor(input: IRequestInfo, init?: IRequestInit) {
		this._ownerDocument = (<typeof Request>this.constructor)._ownerDocument;

		const parsedURL = (<Request>input).url
			? RelativeURL.getAbsoluteURL(this._ownerDocument.location, (<Request>input).url)
			: input instanceof URL
			? input
			: RelativeURL.getAbsoluteURL(this._ownerDocument.location, <string>input);

		if (parsedURL.username !== '' || parsedURL.password !== '') {
			throw new DOMException(
				`${parsedURL} is an url with embedded credentials.`,
				DOMExceptionNameEnum.notSupportedError
			);
		}

		this.method = (init?.method || (<Request>input).method || 'GET').toUpperCase();

		if (
			(init?.body || (<Request>input).body) &&
			(this.method === 'GET' || this.method === 'HEAD')
		) {
			throw new DOMException(
				`Request with GET/HEAD method cannot have body.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

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

		const referrer = init?.referrer !== null ? init?.referrer : (<Request>input).referrer;

		if (referrer === '') {
			this.referrer = '';
		} else if (referrer) {
			const referrerURL =
				referrer instanceof URL
					? referrer
					: RelativeURL.getAbsoluteURL(this._ownerDocument.location, referrer);

			this.referrer =
				referrerURL.origin === this._ownerDocument.location.origin
					? referrerURL.href
					: 'about:client';
		}

		const referrerPolicy = (
			init?.referrerPolicy ||
			(<Request>input).referrerPolicy ||
			''
		).toLowerCase();
		const redirect = init?.redirect || (<Request>input).redirect || 'follow';

		if (!VALID_REFERRER_POLICIES.includes(referrerPolicy)) {
			throw new DOMException(
				`Invalid referrer policy "${referrerPolicy}".`,
				DOMExceptionNameEnum.syntaxError
			);
		}

		if (!VALID_REDIRECTS.includes(redirect)) {
			throw new DOMException(`Invalid redirect "${redirect}".`, DOMExceptionNameEnum.syntaxError);
		}

		this.redirect = redirect;
		this.referrerPolicy = <''>referrerPolicy;
		this.url = parsedURL.toString();
		this.signal = init?.signal || (<Request>input).signal || new AbortSignal();
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
