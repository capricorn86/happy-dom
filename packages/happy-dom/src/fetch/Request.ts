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
import FetchUtility from './FetchUtility';
import AbortSignal from './AbortSignal';

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
	public readonly body: NodeJS.ReadableStream;
	public readonly headers: IHeaders;
	public readonly referrer: string;
	public readonly redirect: 'error' | 'manual' | 'follow';
	public readonly referrerPolicy: string;
	public readonly signal: AbortSignal | null;

	/**
	 * Constructor.
	 *
	 * @param input Input.
	 * @param [init] Init.
	 */
	constructor(input: IRequestInfo, init?: IRequestInit) {
		this._ownerDocument = (<typeof Request>this.constructor)._ownerDocument;

		const parsedURL = (<Request>input).url
			? new URL((<Request>input).url)
			: input instanceof URL
			? input
			: new URL(<string>input);

		if (parsedURL.username !== '' || parsedURL.password !== '') {
			throw new DOMException(
				`${parsedURL} is an url with embedded credentials.`,
				DOMExceptionNameEnum.notSupportedError
			);
		}

		this.method = (init.method || (<Request>input).method || 'GET').toUpperCase();

		if ((init.body || (<Request>input).body) && (this.method === 'GET' || this.method === 'HEAD')) {
			throw new DOMException(
				`Request with GET/HEAD method cannot have body.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const { stream, type } = FetchUtility.bodyToStream(
			this._ownerDocument.defaultView,
			input instanceof Request && input.body !== null ? input.body : init.body
		);

		this.body = stream;
		this.headers = new Headers(init.headers || (<Request>input).headers || {});

		if (!this.headers.get('content-type') && type) {
			this.headers.append('content-type', type);
		}

		const referrer = init.referrer !== null ? init.referrer : (<Request>input).referrer;
		if (referrer) {
			const parsedReferrer = new URL(referrer).toString();
			this.referrer = /^about:(\/\/)?client$/.test(parsedReferrer)
				? 'about:client'
				: parsedReferrer;
		} else if (referrer === '') {
			this.referrer = '';
		}

		this.redirect = init.redirect || (<Request>input).redirect || 'follow';
		this.referrerPolicy = init.referrerPolicy || (<Request>input).referrerPolicy || '';
		this.url = parsedURL.toString();
		this.signal = init.signal || (<Request>input).signal || null;
	}

	/**
	 * Returns array buffer.
	 *
	 * @returns Array buffer.
	 */
	public arrayBuffer(): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.arrayBuffer()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns blob.
	 *
	 * @returns Blob.
	 */
	public blob(): Promise<IBlob> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.blob()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns buffer.
	 *
	 * @returns Buffer.
	 */
	public buffer(): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.buffer()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns json.
	 *
	 * @returns JSON.
	 */
	public json(): Promise<unknown> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.json()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns json.
	 *
	 * @returns JSON.
	 */
	public text(): Promise<string> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.text()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns json.
	 *
	 * @returns JSON.
	 */
	public textConverted(): Promise<string> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.textConverted()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Handles promise start.
	 *
	 * @returns Task ID.
	 */
	private _handlePromiseStart(): number {
		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		return taskManager.startTask();
	}

	/**
	 * Handles promise end.
	 *
	 * @param resolve Resolve.
	 * @param reject Reject.
	 * @param taskID Task ID.
	 * @param response Response.
	 */
	private _handlePromiseEnd(
		resolve: (response: unknown) => void,
		reject: (error: Error) => void,
		taskID: number,
		response: unknown
	): void {
		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		if (taskManager.getTaskCount() === 0) {
			reject(new Error('Failed to complete fetch request. Task was canceled.'));
		} else {
			resolve(response);
			taskManager.endTask(taskID);
		}
	}

	/**
	 * Handles promise error.
	 *
	 * @param error
	 * @param reject
	 */
	private _handlePromiseError(reject: (error: Error) => void, error: Error): void {
		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		reject(error);
		taskManager.cancelAll(error);
	}
}
