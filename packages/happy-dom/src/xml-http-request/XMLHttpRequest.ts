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
import Blob from '../file/Blob';
import {
	copyToArrayBuffer,
	MajorNodeVersion,
	IXMLHttpRequestOptions
} from './XMLHttpReqeustUtility';
import { spawnSync } from "child_process";
const SyncWorkerFile = require.resolve ? require.resolve('./XMLHttpRequestSyncWorker') : null;

/**
 * References: https://github.com/souldreamer/xhr2-cookies.
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
	public status = 0;
	public statusText = '';
	public timeout = 0;
	public upload = new XMLHttpRequestUpload();
	public responseUrl = '';
	public withCredentials = false;

	public nodejsHttpAgent: HttpAgent = http.globalAgent;
	public nodejsHttpsAgent: HttpsAgent = https.globalAgent;

	private readonly anonymous: boolean;
	private method: string | null = null;
	private url: URL | null = null;
	private auth: string | null = null;
	private body: string | Buffer | ArrayBuffer | ArrayBufferView;
	private sync = false;
	private headers: { [header: string]: string } = {};
	private loweredHeaders: { [lowercaseHeader: string]: string } = {};
	private mimeOverride: string | null = null; // TODO: is type right?
	private _request: ClientRequest | null = null;
	private _response: IncomingMessage | null = null;
	// @ts-ignore
	private _error: Error | string | null = null;
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

	/**
	 * News a request.
	 *
	 * @param options
	 */
	constructor(options: IXMLHttpRequestOptions = {}) {
		super();
		this.anonymous = options.anon || false;
	}

	/**
	 * Initializes a newly-created request, or re-initializes an existing one.
	 *
	 * @param method The HTTP request method to use.
	 * @param url The URL to request.
	 * @param async Whether the request is synchronous or asynchronous.
	 * @param user The username to use for authentication purposes.
	 * @param password The password to use for authentication purposes.
	 */
	public open(method: string, url: string, async = true, user?: string, password?: string): void {
		const { _defaultView } = XMLHttpRequest;
		// If _defaultView is not defined, then we can't set the URL.
		if (!_defaultView) {
			throw new Error('need set defaultView');
		}
		method = method.toUpperCase();
		if (this.restrictedMethods[method]) {
			throw new DOMException(
				`HTTP method ${method} is not allowed in XHR`,
				DOMExceptionNameEnum.securityError
			);
		}

		// Get and Parse the URL relative to the given Location object.
		const xhrUrl = RelativeURL.getAbsoluteURL(XMLHttpRequest._defaultView.location, url);
		// Set username and password if given.
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
		this.auth = `${this.url.username || ''}:${this.url.password || ''}`
		this.sync = !async;
		// this.headers = {};
		this.loweredHeaders = {};
		// this.mimeOverride = null;
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
	 * Sets the value of an HTTP request header.
	 *
	 * @param name The name of the header whose value is to be set.
	 * @param value The value to set as the body of the header.
	 */
	public setRequestHeader(name: string, value: unknown): void {
		const { _defaultView } = XMLHttpRequest;
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
			_defaultView.console.warn(`Refused to set unsafe header "${name}"`);
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
	 * Sends the request. If the request is asynchronous (which is the default), this method returns as soon as the request is sent.
	 *
	 * @param data The data to send with the request.
	 */
	public send(data?: string | Buffer | ArrayBuffer | ArrayBufferView): void {
		const { invalidStateError, networkError } = DOMExceptionNameEnum;
		if (this.readyState !== XMLHttpRequest.OPENED) {
			throw new DOMException('XHR readyState must be OPENED', invalidStateError);
		}
		if (this._request) {
			throw new DOMException('send() already called', invalidStateError);
		}
		switch (this.url.protocol) {
			case 'file:':
				return this.sendFile(data);
			case 'http:':
			case 'https:':
				return this.sendHttp(data);
			default:
				throw new DOMException(`Unsupported protocol ${this.url.protocol}`, networkError);
		}
	}

	/**
	 * Aborts the request if it has already been sent.
	 */
	public abort(): void {
		if (this._request == null) {
			return;
		}
		// ClientRequest.destroy breaks the test suite for versions 10 and 12,
		// Hence the version check
		if (MajorNodeVersion > 13) {
			this._request.destroy();
		} else {
			this._request.abort();
		}
		this.setReadyState(XMLHttpRequest.DONE);
		this.setError();

		this.dispatchProgress('abort');
		this.dispatchProgress('loadend');
	}

	/**
	 * Returns the string containing the text of the specified header, or null if either the response has not yet been received or the header doesn't exist in the response.
	 *
	 * @param name The name of the header.
	 */
	public getResponseHeader(name: string): string {
		if (
			this.responseHeaders == null ||
			name == null ||
			this.readyState === XMLHttpRequest.OPENED ||
			this.readyState === XMLHttpRequest.UNSENT
		) {
			return null;
		}
		const loweredName = name.toLowerCase();
		return this.responseHeaders.hasOwnProperty(loweredName)
			? this.responseHeaders[name.toLowerCase()]
			: null;
	}

	/**
	 * Returns all the response headers, separated by CRLF, as a string, or null if no response has been received.
	 *
	 */
	public getAllResponseHeaders(): string {
		if (
			this.responseHeaders == null ||
			this.readyState === XMLHttpRequest.OPENED ||
			this.readyState === XMLHttpRequest.UNSENT
		) {
			return '';
		}
		return Object.keys(this.responseHeaders)
			.map((key) => `${key}: ${this.responseHeaders[key]}`)
			.join('\r\n');
	}

	/**
	 * Overrides the MIME type returned by the server.
	 *
	 * @param mimeType The MIME type to use.
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
	 * Sets the value of the ReadyState.
	 *
	 * @param readyState The new value of the ReadyState.
	 */
	private setReadyState(readyState: number): void {
		this.readyState = readyState;
		this.dispatchEvent(new ProgressEvent('readystatechange'));
	}

	/**
	 * Send request with file.
	 *
	 * @todo Not implemented.
	 * @param _data File body to send.
	 */
	private sendFile(_data: unknown): void {
		// TODO: sendFile() not implemented.
		throw new Error('Protocol file: not implemented');
	}

	/**
	 * Send request with http.
	 *
	 * @param data Data to send.
	 */
	private sendHttp(data?: string | Buffer | ArrayBuffer | ArrayBufferView): void {
		const { _defaultView } = XMLHttpRequest;
		this.body = data;

		if (this.sync) {
			const params = this._serialParams();
			const res = spawnSync(process.execPath, [SyncWorkerFile], { input: params, maxBuffer: Infinity });
			res;
			// TODO: sync not implemented.
			throw new Error('Synchronous XHR processing not implemented');
		}
		if (data && (this.method === 'GET' || this.method === 'HEAD')) {
			_defaultView.console.warn(`Discarding entity body for ${this.method} requests`);
			data = null;
		} else {
			data = data || '';
		}

		this.upload.setData(data);
		this.finalizeHeaders();
		this.sendHxxpRequest();
	}

	/**
	 * SendHxxpRequest sends the actual request.
	 *
	 */
	private sendHxxpRequest(): void {
		const { _defaultView } = XMLHttpRequest;
		if (this.withCredentials) {
			// Set cookie if URL is same-origin.
			if (_defaultView.location.origin === this.url.origin) {
				this.headers.cookie = _defaultView.document.cookie;
			}
		}

		const [hxxp, agent] =
			this.url.protocol === 'http:' ? [http, this.nodejsHttpAgent] : [https, this.nodejsHttpsAgent];
		const requestMethod: (options: RequestOptionsHttp) => ClientRequest = hxxp.request.bind(hxxp);
		const request = requestMethod({
			hostname: this.url.hostname,
			port: +this.url.port,
			path: this.url.pathname,
			auth: this.auth,
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
	 * Finalize headers.
	 *
	 */
	private finalizeHeaders(): void {
		const { _defaultView } = XMLHttpRequest;
		this.headers = {
			...this.headers,
			Connection: 'keep-alive',
			Host: this.url.host,
			'User-Agent': _defaultView.navigator.userAgent,
			...(this.anonymous ? { Referer: 'about:blank' } : { Referer: _defaultView.location.origin })
		};
		this.upload.finalizeHeaders(this.headers, this.loweredHeaders);
	}

	/**
	 * OnHttpResponse handles the response.
	 *
	 * @param request The request.
	 * @param response The response.
	 */
	private onHttpResponse(request: ClientRequest, response: IncomingMessage): void {
		if (this._request !== request) {
			return;
		}
		const { _defaultView } = XMLHttpRequest;

		if (this.withCredentials && response.headers['set-cookie']) {
			_defaultView.document.cookie = response.headers['set-cookie'].join('; ');
		}

		if ([301, 302, 303, 307, 308].indexOf(response.statusCode) >= 0) {
			this.url = new _defaultView.URL(response.headers.location);
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
	 * OnHttpResponseData handles the response data.
	 *
	 * @param response The response.
	 * @param data The data.
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
	 * OnHttpResponseEnd handles the response end.
	 *
	 * @param response The response.
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
	 * OnHttpResponseClose handles the response close.
	 *
	 * @param response The response.
	 */
	private onHttpResponseClose(response: IncomingMessage): void {
		if (this._response !== response) {
			return;
		}

		const request = this._request;
		this.setError();
		// ClientRequest.destroy breaks the test suite for versions 10 and 12,
		// Hence the version check
		if (MajorNodeVersion > 13) {
			request.destroy();
		} else {
			request.abort();
		}
		this.setReadyState(XMLHttpRequest.DONE);

		this.dispatchProgress('error');
		this.dispatchProgress('loadend');
	}

	/**
	 * OnHttpTimeout handles the timeout.
	 *
	 * @param request The request.
	 */
	private onHttpTimeout(request: ClientRequest): void {
		if (this._request !== request) {
			return;
		}

		this.setError();
		// ClientRequest.destroy breaks the test suite for versions 10 and 12,
		// Hence the version check
		if (MajorNodeVersion > 13) {
			request.destroy();
		} else {
			request.abort();
		}
		this.setReadyState(XMLHttpRequest.DONE);

		this.dispatchProgress('timeout');
		this.dispatchProgress('loadend');
	}

	/**
	 * OnHttpRequestError handles the request error.
	 *
	 * @param request The request.
	 * @param error The error.
	 */
	private onHttpRequestError(request: ClientRequest, error: Error): void {
		this._error = error;
		if (this._request !== request) {
			return;
		}

		this.setError();
		// ClientRequest.destroy breaks the test suite for versions 10 and 12,
		// Hence the version check
		if (MajorNodeVersion > 13) {
			request.destroy();
		} else {
			request.abort();
		}
		this.setReadyState(XMLHttpRequest.DONE);

		this.dispatchProgress('error');
		this.dispatchProgress('loadend');
	}

	/**
	 * Dispatches the progress event.
	 *
	 * @param eventType The event type.
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
	 * Sets the error.
	 *
	 */
	private setError(): void {
		this._request = null;
		this._response = null;
		this.responseHeaders = null;
		this.responseParts = null;
	}

	/**
	 * Parses the response headers.
	 *
	 * @param response The response.
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
	 * Parses the response.
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
				break;
			case 'buffer':
				this.responseText = null;
				this.response = buffer;
				break;
			case 'arraybuffer':
				this.responseText = null;
				this.response = copyToArrayBuffer(buffer);
				break;
			case 'blob':
				this.responseText = null;
				this.response = new Blob([new Uint8Array(buffer)], {
					type: this.mimeOverride || this.responseHeaders['content-type'] || ''
				});
				break;
			case 'document':
				// TODO: MimeType parse not yet supported.
				break;
			case 'text':
			default:
				try {
					this.responseText = buffer.toString(<BufferEncoding>this.parseResponseEncoding());
				} catch {
					this.responseText = buffer.toString('binary');
				}
				this.response = this.responseText;
				break;
		}
		return;
	}

	/**
	 * Parses the response encoding.
	 *
	 */
	private parseResponseEncoding(): string {
		const charset = /;\s*charset=(.*)$/.exec(this.responseHeaders['content-type'] || '');
		return Array.isArray(charset) ? charset[1] : 'utf-8';
	}

	public _syncGetError(): Error {
		return <Error>this._error;
	}
	public _syncSetErrorString(error: string): void {
		this._error = error;
	}

	private _serialParams(): string {
		const { _defaultView } = XMLHttpRequest;
		const serials = {
			sync: this.sync,
			withCredentials: this.withCredentials,
			mimeType: this.mimeOverride,
			username: this.url.username,
			password: this.url.password,
			auth: this.auth,
			method: this.method,
			responseType: this.responseType,
			headers: this.headers,
			uri: this.url.href,
			timeout: this.timeout,
			body: this.body,

			cookie: _defaultView.document.cookie,
			origin: _defaultView.location.href
		};
		return JSON.stringify(serials);
	}
}
