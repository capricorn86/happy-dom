import FS from 'fs';
import ChildProcess from 'child_process';
import HTTP from 'http';
import HTTPS from 'https';
import XMLHttpRequestEventTarget from './XMLHttpRequestEventTarget.js';
import XMLHttpRequestReadyStateEnum from './XMLHttpRequestReadyStateEnum.js';
import Event from '../event/Event.js';
import IDocument from '../nodes/document/IDocument.js';
import Blob from '../file/Blob.js';
import XMLHttpRequestUpload from './XMLHttpRequestUpload.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import { UrlObject } from 'url';
import URL from '../url/URL.js';
import XMLHttpRequestURLUtility from './utilities/XMLHttpRequestURLUtility.js';
import ProgressEvent from '../event/events/ProgressEvent.js';
import XMLHttpResponseTypeEnum from './XMLHttpResponseTypeEnum.js';
import XMLHttpRequestCertificate from './XMLHttpRequestCertificate.js';
import XMLHttpRequestSyncRequestScriptBuilder from './utilities/XMLHttpRequestSyncRequestScriptBuilder.js';
import IconvLite from 'iconv-lite';
import ErrorEvent from '../event/events/ErrorEvent.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import CookieStringUtility from '../cookie/urilities/CookieStringUtility.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import Headers from '../fetch/Headers.js';
import IHeaders from '../fetch/types/IHeaders.js';
import FetchCORSUtility from '../fetch/utilities/FetchCORSUtility.js';
import CachedResponseStateEnum from '../cache/response/CachedResponseStateEnum.js';
import ICachedResponse from '../cache/response/ICachedResponse.js';

// These headers are not user setable.
// The following are allowed but banned in the spec:
// * User-agent
const FORBIDDEN_REQUEST_HEADERS = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'content-transfer-encoding',
	'cookie',
	'cookie2',
	'date',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
];

// These request methods are not allowed
const FORBIDDEN_REQUEST_METHODS = ['TRACE', 'TRACK', 'CONNECT'];
// Match Content-Type header charset
const CONTENT_TYPE_ENCODING_REGEXP = /charset=([^;]*)/i;

/**
 * XMLHttpRequest.
 *
 * Based on:
 * https://github.com/mjwwit/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js
 */
export default class XMLHttpRequest extends XMLHttpRequestEventTarget {
	// Constants
	public static UNSENT = XMLHttpRequestReadyStateEnum.unsent;
	public static OPENED = XMLHttpRequestReadyStateEnum.opened;
	public static HEADERS_RECEIVED = XMLHttpRequestReadyStateEnum.headersRecieved;
	public static LOADING = XMLHttpRequestReadyStateEnum.loading;
	public static DONE = XMLHttpRequestReadyStateEnum.done;

	// Public properties
	public upload: XMLHttpRequestUpload = new XMLHttpRequestUpload();
	public withCredentials: boolean = false;

	// Non-standard properties
	public __responseBuffer__: Buffer | null = null;

	// Private properties
	readonly #internal: {
		state: {
			incomingMessage: HTTP.IncomingMessage | null;
			response: ArrayBuffer | Blob | IDocument | object | string;
			responseType: XMLHttpResponseTypeEnum | '';
			responseText: string;
			responseXML: IDocument;
			responseURL: string;
			responseHeaders: IHeaders;
			readyState: XMLHttpRequestReadyStateEnum;
			asyncRequest: HTTP.ClientRequest;
			asyncTaskID: number;
			requestHeaders: Headers;
			statusCode: number;
			statusText: string;
			send: boolean;
			error: boolean;
			aborted: boolean;
		};
		settings: {
			method: string;
			url: URL;
			async: boolean;
			user: string;
			password: string;
		};
	} = {
		state: {
			incomingMessage: null,
			response: null,
			responseType: '',
			responseText: '',
			responseXML: null,
			responseURL: '',
			responseHeaders: new Headers(),
			readyState: XMLHttpRequestReadyStateEnum.unsent,
			asyncRequest: null,
			asyncTaskID: null,
			requestHeaders: new Headers(),
			statusCode: null,
			statusText: null,
			send: false,
			error: false,
			aborted: false
		},
		settings: {
			method: null,
			url: null,
			async: true,
			user: null,
			password: null
		}
	};
	#browserFrame: IBrowserFrame;
	#window: IBrowserWindow;
	#disableCache: boolean;

	/**
	 * Constructor.
	 *
	 * @param injected Injected properties.
	 * @param injected.browserFrame Browser frame.
	 * @param injected.window Window.
	 * @param [injected.disableCache] Disables the cache.
	 */
	constructor(injected: {
		browserFrame: IBrowserFrame;
		window: IBrowserWindow;
		disableCache?: boolean;
	}) {
		super();
		this.#browserFrame = injected.browserFrame;
		this.#window = injected.window;
		this.#disableCache = injected.disableCache ?? false;
	}

	/**
	 * Returns the status.
	 *
	 * @returns Status.
	 */
	public get status(): number {
		return this.#internal.state.statusCode;
	}

	/**
	 * Returns the status text.
	 *
	 * @returns Status text.
	 */
	public get statusText(): string {
		return this.#internal.state.statusText;
	}

	/**
	 * Returns the response.
	 *
	 * @returns Response.
	 */
	public get response(): ArrayBuffer | Blob | IDocument | object | string {
		return this.#internal.state.response;
	}

	/**
	 * Get the response text.
	 *
	 * @throws {DOMException} If the response type is not text or empty.
	 * @returns The response text.
	 */
	public get responseText(): string {
		if (this.responseType === XMLHttpResponseTypeEnum.text || this.responseType === '') {
			return this.#internal.state.responseText;
		}
		throw new DOMException(
			`Failed to read the 'responseText' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'text' (was '${this.responseType}').`,
			DOMExceptionNameEnum.invalidStateError
		);
	}

	/**
	 * Get the responseXML.
	 *
	 * @throws {DOMException} If the response type is not text or empty.
	 * @returns Response XML.
	 */
	public get responseXML(): IDocument {
		if (this.responseType === XMLHttpResponseTypeEnum.document || this.responseType === '') {
			return this.#internal.state.responseXML;
		}
		throw new DOMException(
			`Failed to read the 'responseXML' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'document' (was '${this.responseType}').`,
			DOMExceptionNameEnum.invalidStateError
		);
	}

	/**
	 * Returns the response URL.
	 *
	 * @returns Response URL.
	 */
	public get responseURL(): string {
		return this.#internal.state.responseURL;
	}

	/**
	 * Returns the ready state.
	 *
	 * @returns Ready state.
	 */
	public get readyState(): XMLHttpRequestReadyStateEnum {
		return this.#internal.state.readyState;
	}

	/**
	 * Set response type.
	 *
	 * @param type Response type.
	 * @throws {DOMException} If the state is not unsent or opened.
	 * @throws {DOMException} If the request is synchronous.
	 */
	public set responseType(type: XMLHttpResponseTypeEnum | '') {
		// ResponseType can only be set when the state is unsent or opened.
		if (
			this.readyState !== XMLHttpRequestReadyStateEnum.opened &&
			this.readyState !== XMLHttpRequestReadyStateEnum.unsent
		) {
			throw new DOMException(
				`Failed to set the 'responseType' property on 'XMLHttpRequest': The object's state must be OPENED or UNSENT.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
		// Sync requests can only have empty string or 'text' as response type.
		if (!this.#internal.settings.async) {
			throw new DOMException(
				`Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be changed for synchronous requests made from a document.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
		this.#internal.state.responseType = type;
	}

	/**
	 * Get response Type.
	 *
	 * @returns Response type.
	 */
	public get responseType(): XMLHttpResponseTypeEnum | '' {
		return this.#internal.state.responseType;
	}

	/**
	 * Opens the connection.
	 *
	 * @param method Connection method (eg GET, POST).
	 * @param url URL for the connection.
	 * @param [async=true] Asynchronous connection.
	 * @param [user] Username for basic authentication (optional).
	 * @param [password] Password for basic authentication (optional).
	 */
	public open(method: string, url: string, async = true, user?: string, password?: string): void {
		this.abort();

		this.#internal.state.aborted = false;
		this.#internal.state.error = false;

		const upperMethod = method.toUpperCase();

		// Check for valid request method
		if (FORBIDDEN_REQUEST_METHODS.includes(upperMethod)) {
			throw new DOMException('Request method not allowed', DOMExceptionNameEnum.securityError);
		}

		// Check responseType.
		if (!async && !!this.responseType && this.responseType !== XMLHttpResponseTypeEnum.text) {
			throw new DOMException(
				`Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests from a document must not set a response type.`,
				DOMExceptionNameEnum.invalidAccessError
			);
		}

		this.#internal.settings = {
			method: upperMethod,
			url: new URL(url, this.#window.location),
			async: async,
			user: user || null,
			password: password || null
		};

		this.#setState(XMLHttpRequestReadyStateEnum.opened);
	}

	/**
	 * Sets a header for the request.
	 *
	 * @param header Header name
	 * @param value Header value
	 * @returns Header added.
	 */
	public setRequestHeader(header: string, value: string): boolean {
		if (this.readyState !== XMLHttpRequestReadyStateEnum.opened) {
			throw new DOMException(
				`Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		// TODO: Use FetchRequestHeaderUtility.removeForbiddenHeaders() instead.
		if (FORBIDDEN_REQUEST_HEADERS.includes(header.toLowerCase())) {
			return false;
		}

		if (this.#internal.state.send) {
			throw new DOMException(
				`Failed to execute 'setRequestHeader' on 'XMLHttpRequest': Request is in progress.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this.#internal.state.requestHeaders.set(header, value);

		return true;
	}

	/**
	 * Gets a header from the server response.
	 *
	 * @param header header Name of header to get.
	 * @returns string Text of the header or null if it doesn't exist.
	 */
	public getResponseHeader(header: string): string | null {
		const lowerHeader = header.toLowerCase();

		if (
			lowerHeader === 'set-cookie' ||
			lowerHeader === 'set-cookie2' ||
			this.readyState <= XMLHttpRequestReadyStateEnum.opened ||
			!!this.#internal.state.error
		) {
			return null;
		}

		return this.#internal.state.responseHeaders.get(header);
	}

	/**
	 * Gets all the response headers.
	 *
	 * @returns A string with all response headers separated by CR+LF.
	 */
	public getAllResponseHeaders(): string {
		if (
			this.readyState < XMLHttpRequestReadyStateEnum.headersRecieved ||
			this.#internal.state.error
		) {
			return '';
		}

		const result = [];

		for (const [name, value] of this.#internal.state.responseHeaders) {
			const lowerName = name.toLowerCase();
			if (lowerName !== 'set-cookie' && lowerName !== 'set-cookie2') {
				result.push(`${name}: ${value}`);
			}
		}

		return result.join('\r\n');
	}

	/**
	 * Sends the request to the server.
	 *
	 * @param data Optional data to send as request body.
	 */
	public send(data?: string): void {
		if (this.readyState != XMLHttpRequestReadyStateEnum.opened) {
			throw new DOMException(
				`Failed to execute 'send' on 'XMLHttpRequest': Connection must be opened before send() is called.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		if (this.#internal.state.send) {
			throw new DOMException(
				`Failed to execute 'send' on 'XMLHttpRequest': Send has already been called.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const { location } = this.#window;

		const url = this.#internal.settings.url;

		if (this.#handleCachedResponse()) {
			return;
		}

		// Security check.
		if (url.protocol === 'http:' && location.protocol === 'https:') {
			throw new DOMException(
				`Mixed Content: The page at '${location.href}' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint '${url.href}'. This request has been blocked; the content must be served over HTTPS.`,
				DOMExceptionNameEnum.securityError
			);
		}

		// Load files off the local filesystem (file://)
		if (XMLHttpRequestURLUtility.isLocal(url)) {
			if (!this.#browserFrame.page.context.browser.settings.enableFileSystemHttpRequests) {
				throw new DOMException(
					'File system is disabled by default for security reasons. To enable it, set the Happy DOM setting "enableFileSystemHttpRequests" option to true.',
					DOMExceptionNameEnum.securityError
				);
			}

			if (this.#internal.settings.method !== 'GET') {
				throw new DOMException(
					'Failed to send local file system request. Only "GET" method is supported for local file system requests.',
					DOMExceptionNameEnum.notSupportedError
				);
			}

			if (this.#internal.settings.async) {
				this.#sendLocalAsyncRequest(url).catch((error) => this.#onError(error));
			} else {
				this.#sendLocalSyncRequest(url);
			}
			return;
		}

		// TODO: CORS check.

		const host = XMLHttpRequestURLUtility.getHost(url);
		const ssl = XMLHttpRequestURLUtility.isSSL(url);

		// Default to port 80. If accessing localhost on another port be sure
		// To use http://localhost:port/path
		const port = Number(url.port) || (ssl ? 443 : 80);
		// Add query string if one is used
		const uri = url.pathname + (url.search ? url.search : '');

		// Set the Host header or the server may reject the request
		this.#internal.state.requestHeaders.set(
			'Host',
			(ssl && port === 443) || port === 80 ? host : `${host}:${port}`
		);

		// Set Basic Auth if necessary
		if (this.#internal.settings.user) {
			this.#internal.settings.password ??= '';
			const authBuffer = Buffer.from(
				this.#internal.settings.user + ':' + this.#internal.settings.password
			);
			this.#internal.state.requestHeaders.set(
				'Authorization',
				'Basic ' + authBuffer.toString('base64')
			);
		}
		// Set the Content-Length header if method is POST
		switch (this.#internal.settings.method) {
			case 'GET':
			case 'HEAD':
				data = null;
				break;
			case 'POST':
				if (!this.#internal.state.requestHeaders.has('Content-Type')) {
					this.#internal.state.requestHeaders.set('Content-Type', 'text/plain;charset=UTF-8');
				}
				if (data) {
					this.#internal.state.requestHeaders.set(
						'Content-Length',
						Buffer.isBuffer(data) ? String(data.length) : String(Buffer.byteLength(data))
					);
				} else {
					this.#internal.state.requestHeaders.set('Content-Length', '0');
				}
				break;

			default:
				break;
		}

		const options: HTTPS.RequestOptions = {
			host: host,
			port: port,
			path: uri,
			method: this.#internal.settings.method,
			headers: this.#getRequestHeaders(),
			agent: false,
			rejectUnauthorized: true
		};

		if (ssl) {
			options.key = XMLHttpRequestCertificate.key;
			options.cert = XMLHttpRequestCertificate.cert;
		}

		// Reset error flag
		this.#internal.state.error = false;

		// Handle async requests
		if (this.#internal.settings.async) {
			this.#sendAsyncRequest(options, ssl, data).catch((error) => this.#onError(error));
		} else {
			this.#sendSyncRequest(options, ssl, data);
		}
	}

	/**
	 * Aborts a request.
	 */
	public abort(): void {
		if (this.#internal.state.asyncRequest) {
			this.#internal.state.asyncRequest.destroy();
			this.#internal.state.asyncRequest = null;
		}

		this.#internal.state.statusCode = null;
		this.#internal.state.statusText = null;
		this.#internal.state.requestHeaders = new Headers();
		this.#internal.state.responseText = '';
		this.#internal.state.responseXML = null;
		this.#internal.state.aborted = true;
		this.#internal.state.error = true;

		if (
			this.readyState !== XMLHttpRequestReadyStateEnum.unsent &&
			(this.readyState !== XMLHttpRequestReadyStateEnum.opened || this.#internal.state.send) &&
			this.readyState !== XMLHttpRequestReadyStateEnum.done
		) {
			this.#internal.state.send = false;
			this.#setState(XMLHttpRequestReadyStateEnum.done);
		}
		this.#internal.state.readyState = XMLHttpRequestReadyStateEnum.unsent;

		if (this.#internal.state.asyncTaskID !== null) {
			this.#browserFrame.__asyncTaskManager__.endTask(this.#internal.state.asyncTaskID);
		}
	}

	/**
	 * Changes readyState and calls onreadystatechange.
	 *
	 * @param state
	 */
	#setState(state: XMLHttpRequestReadyStateEnum): void {
		if (
			this.readyState === state ||
			(this.readyState === XMLHttpRequestReadyStateEnum.unsent && this.#internal.state.aborted)
		) {
			return;
		}

		this.#internal.state.readyState = state;

		if (
			this.#internal.settings.async ||
			this.readyState < XMLHttpRequestReadyStateEnum.opened ||
			this.readyState === XMLHttpRequestReadyStateEnum.done
		) {
			this.dispatchEvent(new Event('readystatechange'));
		}

		if (this.readyState === XMLHttpRequestReadyStateEnum.done) {
			let fire: Event;

			if (this.#internal.state.aborted) {
				fire = new Event('abort');
			} else if (this.#internal.state.error) {
				fire = new Event('error');
			} else {
				fire = new Event('load');
			}

			this.dispatchEvent(fire);
			this.dispatchEvent(new Event('loadend'));
		}
	}

	/**
	 * Handle cached response.
	 *
	 * @return True if the response was handled.
	 */
	#handleCachedResponse(): boolean {
		if (this.#disableCache) {
			return false;
		}

		const url = this.#internal.settings.url;
		const cachedResponse = this.#browserFrame.page.context.responseCache.get({
			url: url.href,
			method: this.#internal.settings.method,
			headers: this.#internal.state.requestHeaders
		});

		if (!cachedResponse || cachedResponse.response.waitingForBody) {
			return false;
		}

		if (
			cachedResponse.etag ||
			(cachedResponse.state === CachedResponseStateEnum.stale && cachedResponse.lastModified)
		) {
			const xmlHttpRequest = new XMLHttpRequest({
				browserFrame: this.#browserFrame,
				window: this.#window,
				disableCache: true
			});

			xmlHttpRequest.open(this.#internal.settings.method, url.href, this.#internal.settings.async);

			for (const [key, value] of cachedResponse.request.headers) {
				xmlHttpRequest.setRequestHeader(key, value);
			}

			if (cachedResponse.etag) {
				xmlHttpRequest.setRequestHeader('If-None-Match', cachedResponse.etag);
			} else {
				xmlHttpRequest.setRequestHeader(
					'If-Modified-Since',
					new Date(cachedResponse.lastModified).toUTCString()
				);
			}

			xmlHttpRequest.addEventListener('load', () => {
				const responseHeaders = new Headers();
				for (const [key, value] of xmlHttpRequest.getAllResponseHeaders().split('\r\n')) {
					responseHeaders.append(key, value);
				}

				const newCachedResponse = this.#browserFrame.page.context.responseCache.add(
					{
						url: url.href,
						method: this.#internal.settings.method,
						headers: this.#internal.state.requestHeaders
					},
					{
						status: xmlHttpRequest.status,
						statusText: xmlHttpRequest.statusText,
						url: xmlHttpRequest.responseURL,
						headers: responseHeaders,
						body: xmlHttpRequest.__responseBuffer__,
						waitingForBody: false
					}
				);

				if (cachedResponse.etag || !cachedResponse.staleWhileRevalidate) {
					if (newCachedResponse) {
						this.#loadCachedResponse(newCachedResponse);
					} else {
						this.#disableCache = true;
						this.send();
					}
				}
			});

			xmlHttpRequest.addEventListener('error', (event: ErrorEvent) => {
				this.#onError(
					new DOMException(
						'Failed to revalidate cached response. Error: ' + event.error?.message,
						DOMExceptionNameEnum.networkError
					)
				);
			});

			xmlHttpRequest.send();

			if (cachedResponse.etag || !cachedResponse.staleWhileRevalidate) {
				return true;
			}
		}

		this.#loadCachedResponse(cachedResponse);

		return true;
	}

	/**
	 * Stores the response in the cache.
	 *
	 * @param body Body.
	 */
	#storeResponseInCache(body: Buffer | null): void {
		if (this.#disableCache) {
			return;
		}

		this.#browserFrame.page.context.responseCache.add(
			{
				url: this.#internal.settings.url.href,
				method: this.#internal.settings.method,
				headers: this.#internal.state.requestHeaders
			},
			{
				status: this.#internal.state.statusCode,
				statusText: this.#internal.state.statusText,
				url: this.#internal.state.responseURL,
				headers: this.#internal.state.responseHeaders,
				body,
				waitingForBody: false
			}
		);
	}

	/**
	 * Parses a cached response.
	 *
	 * @param cachedResponse Cached response.
	 */
	#loadCachedResponse(cachedResponse: ICachedResponse): void {
		this.#internal.state.statusCode = cachedResponse.response.status;
		this.#internal.state.statusText = cachedResponse.response.statusText;
		this.#internal.state.responseURL = cachedResponse.response.url;
		this.#internal.state.responseHeaders = cachedResponse.response.headers;

		// Although it will immediately be set to loading,
		// According to the spec, the state should be headersRecieved first.
		this.#setState(XMLHttpRequestReadyStateEnum.headersRecieved);
		this.#setState(XMLHttpRequestReadyStateEnum.loading);

		// Parse response
		if (cachedResponse.response.body) {
			const { response, responseXML, responseText } = this.#parseResponseData(
				cachedResponse.response.body
			);

			this.__responseBuffer__ = cachedResponse.response.body;
			this.#internal.state.response = response;
			this.#internal.state.responseText = responseText;
			this.#internal.state.responseXML = responseXML;
		}

		// Set Cookies.
		this.#setCookies(this.#internal.state.responseHeaders);

		this.#setState(XMLHttpRequestReadyStateEnum.done);
	}

	/**
	 * Default request headers.
	 *
	 * @returns Default request headers.
	 */
	#getRequestHeaders(): { [key: string]: string } {
		const isCORS = FetchCORSUtility.isCORS(this.#window.location, this.#internal.settings.url);

		const headers: { [k: string]: string } = {
			Accept: '*/*',
			Referer: this.#window.location.href,
			'User-Agent': this.#window.navigator.userAgent,
			'Accept-Encoding': 'gzip, deflate, br',
			Connection: 'close'
		};

		if (!isCORS || this.withCredentials) {
			const cookie = CookieStringUtility.cookiesToString(
				this.#browserFrame.page.context.cookieContainer.getCookies(this.#window.location, false)
			);

			if (cookie) {
				headers.cookie = cookie;
			}
		}

		if (isCORS && !this.withCredentials) {
			this.#internal.state.requestHeaders.delete('authorization');
			this.#internal.state.requestHeaders.delete('www-authenticate');
		}

		for (const [key, value] of this.#internal.state.requestHeaders) {
			headers[key] = value;
		}

		return headers;
	}

	/**
	 * Sends a synchronous request.
	 *
	 * @param options
	 * @param ssl
	 * @param data
	 */
	#sendSyncRequest(options: HTTPS.RequestOptions, ssl: boolean, data?: string): void {
		const scriptString = XMLHttpRequestSyncRequestScriptBuilder.getScript(options, ssl, data);

		// Start the other Node Process, executing this string
		const content = ChildProcess.execFileSync(process.argv[0], ['-e', scriptString], {
			encoding: 'buffer',
			maxBuffer: 1024 * 1024 * 1024 // TODO: Consistent buffer size: 1GB.
		});

		// If content length is 0, then there was an error
		if (!content.length) {
			throw new DOMException('Synchronous request failed', DOMExceptionNameEnum.networkError);
		}

		const { error, data: response } = JSON.parse(content.toString());

		if (error) {
			this.#onError(error);
			return;
		}

		if (response) {
			const statusCode = response.statusCode;
			const responseHeaders = new Headers();

			for (const key of Object.keys(response.headers)) {
				responseHeaders.set(
					key,
					Array.isArray(response.headers[key])
						? (<string[]>response.headers[key]).join(', ')
						: <string>response.headers[key]
				);
			}

			// Set Cookies.
			this.#setCookies(responseHeaders);

			// Redirect.
			if (statusCode === 301 || statusCode === 302 || statusCode === 303 || statusCode === 307) {
				const redirectUrl = new URL(responseHeaders.get('Location'), this.#window.location);
				ssl = redirectUrl.protocol === 'https:';
				this.#internal.settings.url = new URL(redirectUrl.href, this.#window.location);
				// Recursive call.
				this.#sendSyncRequest(
					Object.assign(options, {
						host: redirectUrl.host,
						path: redirectUrl.pathname + (redirectUrl.search ?? ''),
						port: redirectUrl.port || (ssl ? 443 : 80),
						method: statusCode === 303 ? 'GET' : this.#internal.settings.method,
						headers: Object.assign(options.headers, {
							Referer: redirectUrl.origin,
							Host: redirectUrl.host
						})
					}),
					ssl,
					data
				);
				return;
			}

			this.#internal.state.statusCode = statusCode;
			this.#internal.state.statusText = response.statusMessage;
			this.#internal.state.responseHeaders = responseHeaders;

			// Although it will immediately be set to loading,
			// According to the spec, the state should be headersRecieved first.
			this.#setState(XMLHttpRequestReadyStateEnum.headersRecieved);
			this.#setState(XMLHttpRequestReadyStateEnum.loading);

			// Response
			this.#internal.state.response = this.#decodeResponseText(
				Buffer.from(response.data, 'base64')
			);
			this.#internal.state.responseText = this.#internal.state.response;
			this.#internal.state.responseXML = null;
			this.#internal.state.responseURL = new URL(
				this.#internal.settings.url.href,
				this.#window.location
			).href;

			// Store response in cache.
			this.#storeResponseInCache(response);

			// Done.
			this.#setState(XMLHttpRequestReadyStateEnum.done);
		}
	}

	/**
	 * Sends an async request.
	 *
	 * @param options
	 * @param ssl
	 * @param data
	 */
	#sendAsyncRequest(options: HTTPS.RequestOptions, ssl: boolean, data?: string): Promise<void> {
		return new Promise((resolve) => {
			// Starts async task in Happy DOM
			this.#internal.state.asyncTaskID = this.#browserFrame.__asyncTaskManager__.startTask(
				this.abort.bind(this)
			);

			// Use the proper protocol
			const sendRequest = ssl ? HTTPS.request : HTTP.request;

			// Request is being sent, set send flag
			this.#internal.state.send = true;

			// As per spec, this is called here for historical reasons.
			this.dispatchEvent(new Event('readystatechange'));

			// Create the request
			this.#internal.state.asyncRequest = sendRequest(
				<object>options,
				async (response: HTTP.IncomingMessage) => {
					await this.#onAsyncResponse(response, options, ssl, data);

					resolve();

					// Ends async task in Happy DOM
					this.#browserFrame.__asyncTaskManager__.endTask(this.#internal.state.asyncTaskID);
				}
			);
			this.#internal.state.asyncRequest.on('error', (error: Error) => {
				this.#onError(error);
				resolve();

				// Ends async task in Happy DOM
				this.#browserFrame.__asyncTaskManager__.endTask(this.#internal.state.asyncTaskID);
			});

			// Node 0.4 and later won't accept empty data. Make sure it's needed.
			if (data) {
				this.#internal.state.asyncRequest.write(data);
			}

			this.#internal.state.asyncRequest.end();

			this.dispatchEvent(new Event('loadstart'));
		});
	}

	/**
	 * Handles an async response.
	 *
	 * @param options Options.
	 * @param ssl SSL.
	 * @param data Data.
	 * @param response Response.
	 * @returns Promise.
	 */
	#onAsyncResponse(
		response: HTTP.IncomingMessage,
		options: HTTPS.RequestOptions,
		ssl: boolean,
		data?: string
	): Promise<void> {
		return new Promise((resolve) => {
			// Set response var to the response we got back
			// This is so it remains accessable outside this scope
			this.#internal.state.incomingMessage = response;

			const statusCode = response.statusCode;
			const responseHeaders = new Headers();
			for (const key of Object.keys(response.headers)) {
				responseHeaders.set(
					key,
					Array.isArray(response.headers[key])
						? (<string[]>response.headers[key]).join(', ')
						: <string>response.headers[key]
				);
			}

			// Set Cookies
			this.#setCookies(responseHeaders);

			// Check for redirect
			// @TODO Prevent looped redirects
			if (statusCode === 301 || statusCode === 302 || statusCode === 303 || statusCode === 307) {
				// TODO: redirect url protocol change.
				// Change URL to the redirect location
				this.#internal.settings.url = new URL(
					responseHeaders.get('Location'),
					this.#window.location
				);

				ssl = this.#internal.settings.url.protocol === 'https:';
				// Issue the new request
				this.#sendAsyncRequest(
					{
						...options,
						host: this.#internal.settings.url.hostname,
						port: this.#internal.settings.url.port,
						path: this.#internal.settings.url.pathname + (this.#internal.settings.url.search ?? ''),
						method: statusCode === 303 ? 'GET' : this.#internal.settings.method,
						headers: {
							...options.headers,
							Referer: this.#internal.settings.url.origin,
							Host: this.#internal.settings.url.host
						}
					},
					ssl,
					data
				);
				// @TODO Check if an XHR event needs to be fired here
				return;
			}

			this.#internal.state.statusCode = statusCode;
			this.#internal.state.statusText = this.#internal.state.incomingMessage.statusMessage;
			this.#internal.state.responseHeaders = responseHeaders;
			this.#setState(XMLHttpRequestReadyStateEnum.headersRecieved);

			// Initialize response.
			let tempResponse = Buffer.from(new Uint8Array(0));

			this.#internal.state.incomingMessage.on('data', (chunk: Uint8Array) => {
				// Make sure there's some data
				if (chunk) {
					tempResponse = Buffer.concat([tempResponse, Buffer.from(chunk)]);
				}
				// Don't emit state changes if the connection has been aborted.
				if (this.#internal.state.send) {
					this.#setState(XMLHttpRequestReadyStateEnum.loading);
				}

				const contentLength = this.#internal.state.responseHeaders.get('Content-Length');
				const contentLengthNumber =
					contentLength !== null && !isNaN(Number(contentLength)) ? Number(contentLength) : null;
				this.dispatchEvent(
					new ProgressEvent('progress', {
						lengthComputable: contentLengthNumber !== null,
						loaded: tempResponse.length,
						total: contentLengthNumber !== null ? contentLengthNumber : 0
					})
				);
			});

			this.#internal.state.incomingMessage.on('end', () => {
				if (this.#internal.state.send) {
					// The sendFlag needs to be set before setState is called.  Otherwise, if we are chaining callbacks
					// There can be a timing issue (the callback is called and a new call is made before the flag is reset).
					this.#internal.state.send = false;

					// Set response according to responseType.
					const { response, responseXML, responseText } = this.#parseResponseData(tempResponse);
					this.__responseBuffer__ = tempResponse;
					this.#internal.state.response = response;
					this.#internal.state.responseXML = responseXML;
					this.#internal.state.responseText = responseText;
					this.#internal.state.responseURL = this.#internal.settings.url.href;

					// Store response in cache.
					this.#storeResponseInCache(tempResponse);

					// Discard the 'end' event if the connection has been aborted
					this.#setState(XMLHttpRequestReadyStateEnum.done);
				}

				resolve();
			});

			this.#internal.state.incomingMessage.on('error', (error) => {
				this.#onError(error);
				resolve();
			});
		});
	}

	/**
	 * Sends a local file system async request.
	 *
	 * @param url URL.
	 * @returns Promise.
	 */
	async #sendLocalAsyncRequest(url: UrlObject): Promise<void> {
		this.#internal.state.asyncTaskID = this.#browserFrame.__asyncTaskManager__.startTask(
			this.abort.bind(this)
		);

		let data: Buffer;

		try {
			data = await FS.promises.readFile(decodeURI(url.pathname.slice(1)));
		} catch (error) {
			this.#onError(error);
			// Release async task.
			this.#browserFrame.__asyncTaskManager__.endTask(this.#internal.state.asyncTaskID);
			return;
		}

		const dataLength = data.length;

		// @TODO: set state headersRecieved first.
		this.#setState(XMLHttpRequestReadyStateEnum.loading);
		this.dispatchEvent(
			new ProgressEvent('progress', {
				lengthComputable: true,
				loaded: dataLength,
				total: dataLength
			})
		);

		if (data) {
			this.#parseLocalRequestData(url, data);
		}

		this.#setState(XMLHttpRequestReadyStateEnum.done);
		this.#browserFrame.__asyncTaskManager__.endTask(this.#internal.state.asyncTaskID);
	}

	/**
	 * Sends a local file system synchronous request.
	 *
	 * @param url URL.
	 */
	#sendLocalSyncRequest(url: UrlObject): void {
		let data: Buffer;
		try {
			data = FS.readFileSync(decodeURI(url.pathname.slice(1)));
		} catch (error) {
			this.#onError(error);
			return;
		}

		// @TODO: set state headersRecieved first.
		this.#setState(XMLHttpRequestReadyStateEnum.loading);

		if (data) {
			this.#parseLocalRequestData(url, data);
		}

		this.#setState(XMLHttpRequestReadyStateEnum.done);
	}

	/**
	 * Parses local request data.
	 *
	 * @param url URL.
	 * @param data Data.
	 */
	#parseLocalRequestData(url: UrlObject, data: Buffer): void {
		this.#internal.state.statusCode = 200;
		this.#internal.state.statusText = 'OK';

		const { response, responseXML, responseText } = this.#parseResponseData(data);
		this.__responseBuffer__ = data;
		this.#internal.state.response = response;
		this.#internal.state.responseXML = responseXML;
		this.#internal.state.responseText = responseText;
		this.#internal.state.responseURL = this.#internal.settings.url.href;
		this.#internal.state.responseHeaders.set('Content-Length', String(data.length));
		this.#internal.state.responseHeaders.set(
			'Content-Type',
			XMLHttpRequestURLUtility.getMimeTypeFromExt(url)
		);

		this.#storeResponseInCache(data);
		this.#setState(XMLHttpRequestReadyStateEnum.done);
	}

	/**
	 * Returns response based to the "responseType" property.
	 *
	 * @param data Data.
	 * @returns Parsed response.
	 */
	#parseResponseData(data: Buffer): {
		response: ArrayBuffer | Blob | IDocument | object | string;
		responseText: string;
		responseXML: IDocument;
	} {
		switch (this.responseType) {
			case XMLHttpResponseTypeEnum.arraybuffer:
				// See: https://github.com/jsdom/jsdom/blob/c3c421c364510e053478520500bccafd97f5fa39/lib/jsdom/living/helpers/binary-data.js
				const newAB = new ArrayBuffer(data.length);
				const view = new Uint8Array(newAB);
				view.set(data);
				return {
					response: view,
					responseText: null,
					responseXML: null
				};
			case XMLHttpResponseTypeEnum.blob:
				try {
					return {
						response: new this.#window.Blob([new Uint8Array(data)], {
							type: this.getResponseHeader('content-type') || ''
						}),
						responseText: null,
						responseXML: null
					};
				} catch (e) {
					return { response: null, responseText: null, responseXML: null };
				}
			case XMLHttpResponseTypeEnum.document:
				const window = this.#window;
				const domParser = new window.DOMParser();
				let response: IDocument;

				try {
					response = domParser.parseFromString(this.#decodeResponseText(data), 'text/xml');
				} catch (e) {
					return { response: null, responseText: null, responseXML: null };
				}

				return { response, responseText: null, responseXML: response };
			case XMLHttpResponseTypeEnum.json:
				try {
					return {
						response: JSON.parse(this.#decodeResponseText(data)),
						responseText: null,
						responseXML: null
					};
				} catch (e) {
					return { response: null, responseText: null, responseXML: null };
				}
			case XMLHttpResponseTypeEnum.text:
			case '':
			default:
				const responseText = this.#decodeResponseText(data);
				return {
					response: responseText,
					responseText: responseText,
					responseXML: null
				};
		}
	}

	/**
	 * Set Cookies from response headers.
	 *
	 * @param headers Headers.
	 */
	#setCookies(headers: IHeaders): void {
		const isCORS = FetchCORSUtility.isCORS(this.#window.location, this.#internal.settings.url);
		if (isCORS && !this.withCredentials) {
			return;
		}
		const originURL = this.#internal.settings.url;
		const values = (headers.get('Set-Cookie') ?? '')
			.split(',')
			.concat(headers.get('Set-Cookie2') ?? '');

		if (values.length === 0) {
			return;
		}

		for (const cookieString of values) {
			this.#browserFrame.page.context.cookieContainer.addCookies([
				CookieStringUtility.stringToCookie(originURL, cookieString.trim())
			]);
		}
	}

	/**
	 * Called when an error is encountered to deal with it.
	 *
	 * @param error Error.
	 */
	#onError(error: Error | string): void {
		this.#internal.state.statusCode = 0;
		this.#internal.state.statusText = error.toString();
		this.#internal.state.responseText = error instanceof Error ? error.stack : '';
		this.#internal.state.error = true;
		this.#setState(XMLHttpRequestReadyStateEnum.done);

		const errorObject = error instanceof Error ? error : new Error(error);
		const event = new ErrorEvent('error', {
			message: errorObject.message,
			error: errorObject
		});

		this.#window.console.error(errorObject);
		this.dispatchEvent(event);
		this.#window.dispatchEvent(event);
	}

	/**
	 * Decodes response text.
	 *
	 * @param data Data.
	 * @returns Decoded text.
	 **/
	#decodeResponseText(data: Buffer): string {
		const contextTypeEncodingRegexp = new RegExp(CONTENT_TYPE_ENCODING_REGEXP, 'gi');
		// Compatibility with file:// protocol or unpredictable http request.
		const contentType =
			this.#internal.state.responseHeaders.get('Content-Type') ??
			this.#internal.state.requestHeaders.get('Content-Type');
		const charset = contextTypeEncodingRegexp.exec(contentType);
		// Default encoding: utf-8.
		return IconvLite.decode(data, charset ? charset[1] : 'utf-8');
	}
}
