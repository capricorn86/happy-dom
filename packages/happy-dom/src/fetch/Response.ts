import IResponse from './IResponse';
import IBlob from '../file/IBlob';
import IDocument from '../nodes/document/IDocument';
import IResponseInit from './IResponseInit';
import Headers from './Headers';
import IHeaders from './IHeaders';
import { URLSearchParams } from 'url';
import Blob from '../file/Blob';
import { Readable, Stream } from 'stream';
import FormData from '../form-data/FormData';
import FetchUtility from './FetchUtility';
import DOMException from 'src/exception/DOMException';
import DOMExceptionNameEnum from 'src/exception/DOMExceptionNameEnum';
import { TextDecoder } from 'util';

/**
 * Fetch response.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/response.js (MIT)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
 */
export default class Response implements IResponse {
	// Owner document is set by a sub-class in the Window constructor
	public static _ownerDocument: IDocument = null;
	public readonly _ownerDocument: IDocument = null;

	// Public properties
	public readonly body: Readable | null = null;
	public readonly bodyUsed = false;
	public readonly redirected = false;
	public readonly type: 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect' =
		'basic';
	public readonly url: string = '';
	public readonly status: number;
	public readonly statusText: string;
	public readonly ok: boolean;
	public readonly headers: IHeaders;

	/**
	 * Constructor.
	 *
	 * @param input Input.
	 * @param body
	 * @param [init] Init.
	 */
	constructor(
		body?:
			| URLSearchParams
			| Blob
			| Buffer
			| ArrayBuffer
			| ArrayBufferView
			| Stream
			| FormData
			| string
			| null,
		init?: IResponseInit
	) {
		this._ownerDocument = (<typeof Response>this.constructor)._ownerDocument;

		this.status = init?.status || 200;
		this.statusText = init?.statusText || '';
		this.ok = this.status >= 200 && this.status < 300;
		this.headers = new Headers(init?.headers);

		if (body) {
			const { stream, type } = FetchUtility.bodyToStream(this._ownerDocument.defaultView, body);
			this.body = stream;

			if (type && !this.headers.has('content-type')) {
				this.headers.set('content-type', type);
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

		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		const taskID = taskManager.startTask();
		let buffer: Buffer;

		try {
			buffer = await FetchUtility.consumeBody(this.body);
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
		const taskID = taskManager.startTask();
		let buffer: Buffer;

		try {
			buffer = await FetchUtility.consumeBody(this.body);
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
		const taskID = taskManager.startTask();
		let buffer: Buffer;

		try {
			buffer = await FetchUtility.consumeBody(this.body);
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
	 * Returns form data.
	 *
	 * @returns Form data.
	 */
	public async formData(): Promise<FormData> {
		const ct = this.headers.get('content-type');

		if (ct.startsWith('application/x-www-form-urlencoded')) {
			const formData = new FormData();
			const parameters = new URLSearchParams(await this.text());

			for (const [name, value] of parameters) {
				formData.append(name, value);
			}

			return formData;
		}

		const { toFormData } = await import('./utils/multipart-parser.js');
		return toFormData(this.body, ct);
	}

	/**
	 * Clones request.
	 *
	 * @returns Clone.
	 */
	public clone(): IResponse {
		const response = new Response();

		(<number>response.status) = this.status;
		(<string>response.statusText) = this.statusText;
		(<boolean>response.ok) = this.ok;
		(<Headers>response.headers) = new Headers(this.headers);
		(<Readable>response.body) = this.body;
		(<boolean>response.bodyUsed) = this.bodyUsed;
		(<boolean>response.redirected) = this.redirected;
		(<string>response.type) = this.type;
		(<string>response.url) = this.url;

		return <IResponse>response;
	}
}
