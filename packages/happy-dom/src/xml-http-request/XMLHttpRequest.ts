import * as http from 'http';
import {
	Agent as HttpAgent,
	ClientRequest,
	IncomingMessage,
	RequestOptions as RequestOptionsHttp
} from 'http';
import * as https from 'https';
import { Agent as HttpsAgent } from 'https';
import ProgressEvent from '../event/events/ProgressEvent';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import { ProgressEventListener, XMLHttpRequestEventTarget } from './XMLHttpRequestEventTarget';
import XMLHttpRequestUpload from './XMLHttpRequestUpload';
import DOMException from '../exception/DOMException';
import IWindow from '../window/IWindow';
import URL from '../location/URL';
import RelativeURL from '../location/RelativeURL';

interface IXMLHttpRequestOptions {
	anon?: boolean;
}

/**
 *
 */
export default class XMLHttpRequest extends XMLHttpRequestEventTarget {
	public static readonly UNSENT = 0;
	public static readonly OPENED = 1;
	public static readonly HEADERS_RECEIVED = 2;
	public static readonly LOADING = 3;
	public static readonly DONE = 4;

	public static _defaultView: IWindow;

	public onreadystatechange: ProgressEventListener | null = null;
	public readyState: number = XMLHttpRequest.UNSENT;

	public response: string | ArrayBuffer | Buffer | object | null = null;
	public responseText = '';
	public responseType = '';
	public status = 0; // TODO: UNSENT?
	public statusText = '';
	public timeout = 0;
	public upload = new XMLHttpRequestUpload();
	public responseUrl = '';
	public withCredentials = false;
	// Todo: need rewrite.
	public nodejsHttpAgent: HttpAgent = http.globalAgent;
	public nodejsHttpsAgent: HttpsAgent = https.globalAgent;

	private readonly anonymous: boolean;
	private method: string | null = null;
	private url: URL | null = null;
	private sync = false;
	private headers: { [header: string]: string } = {};
	private loweredHeaders: { [lowercaseHeader: string]: string } = {};
	private mimeOverride: string | null = null; // TODO: is type right?
	private _request: ClientRequest | null = null;
	private _response: IncomingMessage | null = null;
	// @ts-ignore
	private _error: Error | null = null;
	private responseParts: Buffer[] | null = null;
	private responseHeaders: { [lowercaseHeader: string]: string } | null = null;
	private loadedBytes = 0;
	private totalBytes = 0;
	private lengthComputable = false;

	private restrictedMethods = { CONNECT: true, TRACE: true, TRACK: true };
	private restrictedHeaders = {
		'accept-charset': true,
		'accept-encoding': true,
		'access-control-request-headers': true,
		'access-control-request-method': true,
		connection: true,
		'content-length': true,
		cookie: true,
		cookie2: true,
		date: true,
		dnt: true,
		expect: true,
		host: true,
		'keep-alive': true,
		origin: true,
		referer: true,
		te: true,
		trailer: true,
		'transfer-encoding': true,
		upgrade: true,
		'user-agent': true,
		via: true
	};
	private privateHeaders = { 'set-cookie': true, 'set-cookie2': true };
	private userAgent = XMLHttpRequest._defaultView.navigator.userAgent;

	/**
	 *
	 * @param options
	 */
	constructor(options: IXMLHttpRequestOptions = {}) {
		super();
		this.anonymous = options.anon || false;
	}

	/**
	 *
	 * @param method
	 * @param url
	 * @param async
	 * @param user
	 * @param password
	 */
	public open(method: string, url: string, async = true, user?: string, password?: string): void {
		method = method.toUpperCase();
		if (this.restrictedMethods[method]) {
			throw new DOMException(
				`HTTP method ${method} is not allowed in XHR`,
				DOMExceptionNameEnum.securityError
			);
		}
		const xhrUrl = new XMLHttpRequest._defaultView.URL(
			RelativeURL.getAbsoluteURL(XMLHttpRequest._defaultView.location, url)
		);
		xhrUrl.username = user ? user : xhrUrl.username;
		xhrUrl.password = password ? password : xhrUrl.password;

		if (
			this.readyState === XMLHttpRequest.HEADERS_RECEIVED ||
			this.readyState === XMLHttpRequest.LOADING
		) {
			// TODO: terminate abort(), terminate send()
		}

		this.method = method;
		this.url = xhrUrl;
		this.sync = !async;
		this.headers = {};
		this.loweredHeaders = {};
		this.mimeOverride = null;
		this.setReadyState(XMLHttpRequest.OPENED);
		this._request = null;
		this._response = null;
		this.status = 0;
		this.statusText = '';
		this.responseParts = [];
		this.responseHeaders = null;
		this.loadedBytes = 0;
		this.totalBytes = 0;
		this.lengthComputable = false;
	}

	/**
	 *
	 * @param name
	 * @param value
	 */
	public setRequestHeader(name: string, value: unknown): void {
		if (this.readyState !== XMLHttpRequest.OPENED) {
			throw new DOMException(
				'XHR readyState must be OPENED',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const loweredName = name.toLowerCase();
		if (
			this.restrictedHeaders[loweredName] ||
			/^sec-/.test(loweredName) ||
			/^proxy-/.test(loweredName)
		) {
			// eslint-disable-next-line no-console
			console.warn(`Refused to set unsafe header "${name}"`);
			return;
		}

		const headerBody = value.toString();
		if (this.loweredHeaders[loweredName] != null) {
			name = this.loweredHeaders[loweredName];
			this.headers[name] = `${this.headers[name]}, ${headerBody}`;
		} else {
			this.loweredHeaders[loweredName] = name;
			this.headers[name] = headerBody;
		}
	}

	/**
	 *
	 * @param data
	 */
	public send(data?: string | Buffer | ArrayBuffer | ArrayBufferView): void {
		if (this.readyState !== XMLHttpRequest.OPENED) {
			throw new DOMException(
				'XHR readyState must be OPENED',
				DOMExceptionNameEnum.invalidStateError
			);
		}
		if (this._request) {
			throw new DOMException('send() already called', DOMExceptionNameEnum.invalidStateError);
		}
		switch (this.url.protocol) {
			case 'file:':
				return this.sendFile(data);
			case 'http:':
			case 'https:':
				return this.sendHttp(data);
			default:
				throw new DOMException(
					`Unsupported protocol ${this.url.protocol}`,
					DOMExceptionNameEnum.networkError
				);
		}
	}

	/**
	 *
	 */
	public abort(): void {
		if (this._request == null) {
			return;
		}

		this._request.destroy();
		this.setError();

		this.dispatchProgress('abort');
		this.dispatchProgress('loadend');
	}

	/**
	 *
	 * @param name
	 */
	public getResponseHeader(name: string): string {
		if (this.responseHeaders == null || name == null) {
			return null;
		}
		const loweredName = name.toLowerCase();
		return this.responseHeaders.hasOwnProperty(loweredName)
			? this.responseHeaders[name.toLowerCase()]
			: null;
	}

	/**
	 *
	 */
	public getAllResponseHeaders(): string {
		if (this.responseHeaders == null) {
			return '';
		}
		return Object.keys(this.responseHeaders)
			.map((key) => `${key}: ${this.responseHeaders[key]}`)
			.join('\r\n');
	}

	/**
	 *
	 * @param mimeType
	 */
	public overrideMimeType(mimeType: string): void {
		if (this.readyState === XMLHttpRequest.LOADING || this.readyState === XMLHttpRequest.DONE) {
			throw new DOMException(
				'overrideMimeType() not allowed in LOADING or DONE',
				DOMExceptionNameEnum.invalidStateError
			);
		}
		this.mimeOverride = mimeType.toLowerCase();
	}

	/**
	 *
	 * @param readyState
	 */
	private setReadyState(readyState: number): void {
		this.readyState = readyState;
		this.dispatchEvent(new ProgressEvent('readystatechange'));
	}

	/**
	 *
	 * @param _data
	 */
	private sendFile(_data: unknown): void {
		// TODO
		throw new Error('Protocol file: not implemented');
	}

	/**
	 *
	 * @param data
	 */
	private sendHttp(data?: string | Buffer | ArrayBuffer | ArrayBufferView): void {
		if (this.sync) {
			throw new Error('Synchronous XHR processing not implemented');
		}
		if (data && (this.method === 'GET' || this.method === 'HEAD')) {
			// eslint-disable-next-line no-console
			console.warn(`Discarding entity body for ${this.method} requests`);
			data = null;
		} else {
			data = data || '';
		}

		this.upload.setData(data);
		this.finalizeHeaders();
		this.sendHxxpRequest();
	}

	/**
	 *
	 */
	private sendHxxpRequest(): void {
		if (this.withCredentials) {
			// Todo: need to verify same origin.
			this.headers.cookie = XMLHttpRequest._defaultView.document.cookie;
		}

		const [hxxp, agent] =
			this.url.protocol === 'http:' ? [http, this.nodejsHttpAgent] : [https, this.nodejsHttpsAgent];
		const requestMethod: (options: RequestOptionsHttp) => ClientRequest = hxxp.request.bind(hxxp);
		const request = requestMethod({
			hostname: this.url.hostname,
			port: +this.url.port,
			path: this.url.pathname,
			auth: `${this.url.username || ''}:${this.url.password || ''}`,
			method: this.method,
			headers: this.headers,
			agent
		});
		this._request = request;

		if (this.timeout) {
			request.setTimeout(this.timeout, () => this.onHttpTimeout(request));
		}
		request.on('response', (response) => this.onHttpResponse(request, response));
		request.on('error', (error) => this.onHttpRequestError(request, error));
		this.upload.startUpload(request);

		if (this._request === request) {
			this.dispatchProgress('loadstart');
		}
	}

	/**
	 *
	 */
	private finalizeHeaders(): void {
		this.headers = {
			...this.headers,
			Connection: 'keep-alive',
			Host: this.url.host,
			'User-Agent': this.userAgent,
			...(this.anonymous ? { Referer: 'about:blank' } : {})
		};
		this.upload.finalizeHeaders(this.headers, this.loweredHeaders);
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	private onHttpResponse(request: ClientRequest, response: IncomingMessage): void {
		if (this._request !== request) {
			return;
		}

		if (this.withCredentials && response.headers['set-cookie']) {
			XMLHttpRequest._defaultView.document.cookie = response.headers['set-cookie'].join('; ');
		}

		if ([301, 302, 303, 307, 308].indexOf(response.statusCode) >= 0) {
			this.url = new XMLHttpRequest._defaultView.URL(response.headers.location);
			this.method = 'GET';
			if (this.loweredHeaders['content-type']) {
				delete this.headers[this.loweredHeaders['content-type']];
				delete this.loweredHeaders['content-type'];
			}
			if (this.headers['Content-Type'] != null) {
				delete this.headers['Content-Type'];
			}
			delete this.headers['Content-Length'];

			this.upload.reset();
			this.finalizeHeaders();
			this.sendHxxpRequest();
			return;
		}

		this._response = response;
		this._response.on('data', (data) => this.onHttpResponseData(response, data));
		this._response.on('end', () => this.onHttpResponseEnd(response));
		this._response.on('close', () => this.onHttpResponseClose(response));

		this.responseUrl = this.url.href.split('#')[0];
		this.status = response.statusCode;
		this.statusText = http.STATUS_CODES[this.status];
		this.parseResponseHeaders(response);

		const lengthString = this.responseHeaders['content-length'] || '';
		this.totalBytes = +lengthString;
		this.lengthComputable = !!lengthString;

		this.setReadyState(XMLHttpRequest.HEADERS_RECEIVED);
	}

	/**
	 *
	 * @param response
	 * @param data
	 */
	private onHttpResponseData(response: IncomingMessage, data: string | Buffer): void {
		if (this._response !== response) {
			return;
		}

		this.responseParts.push(Buffer.from(<string>data));
		this.loadedBytes += data.length;

		if (this.readyState !== XMLHttpRequest.LOADING) {
			this.setReadyState(XMLHttpRequest.LOADING);
		}

		this.dispatchProgress('progress');
	}

	/**
	 *
	 * @param response
	 */
	private onHttpResponseEnd(response: IncomingMessage): void {
		if (this._response !== response) {
			return;
		}

		this.parseResponse();
		this._request = null;
		this._response = null;
		this.setReadyState(XMLHttpRequest.DONE);

		this.dispatchProgress('load');
		this.dispatchProgress('loadend');
	}

	/**
	 *
	 * @param response
	 */
	private onHttpResponseClose(response: IncomingMessage): void {
		if (this._response !== response) {
			return;
		}

		const request = this._request;
		this.setError();
		request.destroy();
		this.setReadyState(XMLHttpRequest.DONE);

		this.dispatchProgress('error');
		this.dispatchProgress('loadend');
	}

	/**
	 *
	 * @param request
	 */
	private onHttpTimeout(request: ClientRequest): void {
		if (this._request !== request) {
			return;
		}

		this.setError();
		request.destroy();
		this.setReadyState(XMLHttpRequest.DONE);

		this.dispatchProgress('timeout');
		this.dispatchProgress('loadend');
	}

	/**
	 *
	 * @param request
	 * @param error
	 */
	private onHttpRequestError(request: ClientRequest, error: Error): void {
		this._error = error;
		if (this._request !== request) {
			return;
		}

		this.setError();
		request.destroy();
		this.setReadyState(XMLHttpRequest.DONE);

		this.dispatchProgress('error');
		this.dispatchProgress('loadend');
	}

	/**
	 *
	 * @param eventType
	 */
	private dispatchProgress(eventType: string): void {
		const event = new ProgressEvent(eventType, {
			lengthComputable: this.lengthComputable,
			loaded: this.loadedBytes,
			total: this.totalBytes
		});
		this.dispatchEvent(event);
	}

	/**
	 *
	 */
	private setError(): void {
		this._request = null;
		this._response = null;
		this.responseHeaders = null;
		this.responseParts = null;
	}

	/**
	 *
	 * @param response
	 */
	private parseResponseHeaders(response: IncomingMessage): void {
		this.responseHeaders = {};
		for (const name in response.headers) {
			const loweredName = name.toLowerCase();
			if (this.privateHeaders[loweredName]) {
				continue;
			}
			this.responseHeaders[loweredName] = <string>response.headers[name];
		}
		if (this.mimeOverride != null) {
			this.responseHeaders['content-type'] = this.mimeOverride;
		}
	}

	/**
	 *
	 */
	private parseResponse(): void {
		const buffer = Buffer.concat(this.responseParts);
		this.responseParts = null;

		switch (this.responseType) {
			case 'json':
				this.responseText = null;
				try {
					this.response = JSON.parse(buffer.toString('utf-8'));
				} catch {
					this.response = null;
				}
				return;
			case 'buffer':
				this.responseText = null;
				this.response = buffer;
				return;
			case 'arraybuffer':
				this.responseText = null;
				const arrayBuffer = new ArrayBuffer(buffer.length);
				const view = new Uint8Array(arrayBuffer);
				for (let i = 0; i < buffer.length; i++) {
					view[i] = buffer[i];
				}
				this.response = arrayBuffer;
				return;
			case 'text':
			default:
				try {
					this.responseText = buffer.toString(<BufferEncoding>this.parseResponseEncoding());
				} catch {
					this.responseText = buffer.toString('binary');
				}
				this.response = this.responseText;
		}
	}

	/**
	 *
	 */
	private parseResponseEncoding(): string {
		const charset = /;\s*charset=(.*)$/.exec(this.responseHeaders['content-type'] || '');
		return Array.isArray(charset) ? charset[1] : 'utf-8';
	}
}
