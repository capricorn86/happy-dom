import { XMLHttpRequestEventTarget } from './XMLHttpRequestEventTarget';
import { ClientRequest } from 'http';

/**
 * References: https://xhr.spec.whatwg.org/#xmlhttprequestupload.
 */
export default class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
	private _contentType: string | null = null;
	private _body = null;

	/**
	 * Create a new XMLHttpRequestUpload object.
	 */
	constructor() {
		super();
		this.reset();
	}

	/**
	 * Reset the upload.
	 */
	public reset(): void {
		this._contentType = null;
		this._body = null;
	}

	/**
	 * Set data to be sent.
	 *
	 * @param data The data to be sent.
	 */
	public setData(data?: string | Buffer | ArrayBuffer | ArrayBufferView): void {
		if (data == null) {
			return;
		}

		if (typeof data === 'string') {
			if (data.length !== 0) {
				this._contentType = 'text/plain;charset=UTF-8';
			}
			this._body = Buffer.from(data, 'utf-8');
		} else if (Buffer.isBuffer(data)) {
			this._body = data;
		} else if (data instanceof ArrayBuffer) {
			const body = Buffer.alloc(data.byteLength);
			const view = new Uint8Array(data);
			for (let i = 0; i < data.byteLength; i++) {
				body[i] = view[i];
			}
			this._body = body;
		} else if (data.buffer && data.buffer instanceof ArrayBuffer) {
			const body = Buffer.alloc(data.byteLength);
			const offset = data.byteOffset;
			const view = new Uint8Array(data.buffer);
			for (let i = 0; i < data.byteLength; i++) {
				body[i] = view[i + offset];
			}
			this._body = body;
		} else {
			throw new Error(`Unsupported send() data ${data}`);
		}
	}

	/**
	 * Finalize headers.
	 *
	 * @param headers The headers to be finalized.
	 * @param loweredHeaders The lowered headers to be finalized.
	 */
	public finalizeHeaders(headers: object, loweredHeaders: object): void {
		if (this._contentType && !loweredHeaders['content-type']) {
			headers['Content-Type'] = this._contentType;
		}
		if (this._body) {
			headers['Content-Length'] = this._body.length.toString();
		}
	}

	/**
	 * Start upload.
	 *
	 * @param request The request.
	 */
	public startUpload(request: ClientRequest): void {
		if (this._body) {
			request.write(this._body);
		}
		request.end();
	}
}
