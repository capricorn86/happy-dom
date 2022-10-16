import FS from 'fs';
import ChildProcess from 'child_process';
import HTTP from 'http';
import HTTPS from 'https';
import XMLHttpRequestEventTarget from './XMLHttpRequestEventTarget';
import XMLHttpRequestReadyStateEnum from './XMLHttpRequestReadyStateEnum';
import Event from '../event/Event';
import IDocument from '../nodes/document/IDocument';
import RelativeURL from '../location/RelativeURL';
import XMLHttpRequestUpload from './XMLHttpRequestUpload';
import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import { UrlObject } from 'url';
import { IXMLHttpRequestOptions } from './IXMLHttpRequest';

const SSL_CERT = ``;

const SSL_KEY = ``;

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

/**
 * XMLHttpRequest.
 *
 * Based on:
 * https://github.com/mjwwit/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js
 */
export default class XMLHttpRequest extends XMLHttpRequestEventTarget {
	// Owner document is set by a sub-class in the Window constructor
	public static _ownerDocument: IDocument = null;

	// Constants
	public static UNSENT = XMLHttpRequestReadyStateEnum.unsent;
	public static OPENED = XMLHttpRequestReadyStateEnum.opened;
	public static HEADERS_RECEIVED = XMLHttpRequestReadyStateEnum.headersRecieved;
	public static LOADING = XMLHttpRequestReadyStateEnum.loading;
	public static DONE = XMLHttpRequestReadyStateEnum.done;

	// Public properties
	public readyState: XMLHttpRequestReadyStateEnum = XMLHttpRequestReadyStateEnum.unsent;
	public responseText = '';
	public responseXML = '';
	public responseURL = '';
	public response = null;
	public _responseType = '';
	public status: number = null;
	public statusText: string = null;
	public upload: XMLHttpRequestUpload = new XMLHttpRequestUpload();

	// Private properties
	private readonly _ownerDocument: IDocument = null;
	private _request = null;
	private _response = null;
	private _requestHeaders = {};
	private _sendFlag = false;
	private _errorFlag = false;
	private _abortedFlag = false;
	private _settings: {
		method: string;
		url: string;
		async: boolean;
		user: string;
		password: string;
	} = {
		method: null,
		url: null,
		async: true,
		user: null,
		password: null
	};

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this._ownerDocument = XMLHttpRequest._ownerDocument;
	}

	/**
	 * Set response type.
	 *
	 * @param type Response type.
	 *
	 */
	public set responseType(type: string) {
		if (this.readyState !== XMLHttpRequestReadyStateEnum.opened) {
			throw new DOMException(
				`Failed to set the 'responseType' property on 'XMLHttpRequest': The object's state must be OPENED.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
		if (this._settings.async === false) {
			throw new DOMException(
				`Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be changed for synchronous requests made from a document.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
		this._responseType = type;
	}

	/**
	 * Get response Type.
	 *
	 * @returns Response type.
	 */
	public get responseType(): string {
		return this._responseType;
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
		this._errorFlag = false;
		this._abortedFlag = false;

		const upperMethod = method.toUpperCase();

		// Check for valid request method
		if (FORBIDDEN_REQUEST_METHODS.includes(upperMethod)) {
			throw new DOMException('Request method not allowed', DOMExceptionNameEnum.securityError);
		}
		// Check responseType.
		if (!async && !!this.responseType && this.responseType !== 'text') {
			throw new DOMException(
				`Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests from a document must not set a response type.`,
				DOMExceptionNameEnum.invalidAccessError
			);
		}

		this._settings = {
			method: upperMethod,
			url: url,
			async: async,
			user: user || null,
			password: password || null
		};

		this._setState(XMLHttpRequestReadyStateEnum.opened);
	}

	/**
	 * Sets a header for the request.
	 *
	 * @param header Header name
	 * @param value Header value
	 * @returns Header added.
	 */
	public setRequestHeader(header: string, value: string): boolean {
		if (this.readyState != XMLHttpRequestReadyStateEnum.opened) {
			throw new DOMException(
				`Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
		const lowerHeader = header.toLowerCase();

		if (FORBIDDEN_REQUEST_HEADERS.includes(lowerHeader)) {
			return false;
		}
		if (this._sendFlag) {
			throw new DOMException('send flag is true', DOMExceptionNameEnum.invalidStateError);
		}
		this._requestHeaders[lowerHeader] = value;
		return true;
	}

	/**
	 * Gets a header from the server response.
	 *
	 * @param header header Name of header to get.
	 * @returns string Text of the header or null if it doesn't exist.
	 */
	public getResponseHeader(header: string): string {
		const lowerHeader = header.toLowerCase();

		if (
			typeof header === 'string' &&
			this.readyState > XMLHttpRequestReadyStateEnum.opened &&
			this._response.headers[lowerHeader] &&
			!this._errorFlag
		) {
			return this._response.headers[lowerHeader];
		}

		return null;
	}

	/**
	 * Gets all the response headers.
	 *
	 * @returns A string with all response headers separated by CR+LF.
	 */
	public getAllResponseHeaders(): string {
		if (this.readyState < XMLHttpRequestReadyStateEnum.headersRecieved || this._errorFlag) {
			return '';
		}
		let result = '';

		for (const name of Object.keys(this._response.headers)) {
			// Cookie headers are excluded
			if (name !== 'set-cookie' && name !== 'set-cookie2') {
				result += `${name}: ${this._response.headers[name]}\r\n`;
			}
		}

		return result.slice(0, -2);
	}

	/**
	 * Gets a request header
	 *
	 * @param name Name of header to get.
	 * @returns Returns the request header or empty string if not set.
	 */
	public getRequestHeader(name: string): string {
		const lowerName = name.toLowerCase();
		if (typeof name === 'string' && this._requestHeaders[lowerName]) {
			return this._requestHeaders[lowerName];
		}

		return '';
	}

	/**
	 * Sends the request to the server.
	 *
	 * @param data Optional data to send as request body.
	 */
	public send(data?: string): void {
		if (this.readyState != XMLHttpRequestReadyStateEnum.opened) {
			throw new DOMException(
				'connection must be opened before send() is called',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		if (this._sendFlag) {
			throw new DOMException(
				'send has already been called',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		let ssl = false;
		let local = false;
		const url = RelativeURL.getAbsoluteURL(
			this._ownerDocument.defaultView.location,
			this._settings.url
		);
		let host;

		// Determine the server
		switch (url.protocol) {
			case 'https:':
				host = url.hostname;
				ssl = true;
				break;

			case 'http:':
				host = url.hostname;
				break;

			case 'file:':
				local = true;
				break;

			case undefined:
			case '':
				host = 'localhost';
				break;

			default:
				throw new DOMException('Protocol not supported.', DOMExceptionNameEnum.notSupportedError);
		}

		// TODO: Security Issue.
		// Load files off the local filesystem (file://)
		if (local) {
			this._sendLocalRequest(url);
			return;
		}

		// Default to port 80. If accessing localhost on another port be sure
		// To use http://localhost:port/path
		const port = Number(url.port) || (ssl ? 443 : 80);
		// Add query string if one is used
		const uri = url.pathname + (url.search ? url.search : '');

		// Set the Host header or the server may reject the request
		this._requestHeaders['host'] = host;
		if (!((ssl && port === 443) || port === 80)) {
			this._requestHeaders['host'] += ':' + url.port;
		}

		// Set Basic Auth if necessary
		if (this._settings.user) {
			this._settings.password ??= '';
			const authBuffer = Buffer.from(this._settings.user + ':' + this._settings.password);
			this._requestHeaders['authorization'] = 'Basic ' + authBuffer.toString('base64');
		}

		// Set content length header
		if (this._settings.method === 'GET' || this._settings.method === 'HEAD') {
			data = null;
		} else if (data) {
			this._requestHeaders['content-length'] = Buffer.isBuffer(data)
				? data.length
				: Buffer.byteLength(data);

			if (!this._requestHeaders['content-type']) {
				this._requestHeaders['content-type'] = 'text/plain;charset=UTF-8';
			}
		} else if (this._settings.method === 'POST') {
			// For a post with no data set Content-Length: 0.
			// This is required by buggy servers that don't meet the specs.
			this._requestHeaders['content-length'] = 0;
		}

		const options: IXMLHttpRequestOptions = {
			host: host,
			port: port,
			path: uri,
			method: this._settings.method,
			headers: Object.assign(this._getDefaultRequestHeaders(), this._requestHeaders),
			agent: false,
			rejectUnauthorized: true,
			key: null,
			cert: null
		};

		if (ssl) {
			options.key = SSL_KEY;
			options.cert = SSL_CERT;
		}

		// Reset error flag
		this._errorFlag = false;
		// Handle async requests
		if (this._settings.async) {
			this._sendAsyncRequest(options, ssl, data);
		} else {
			this._sendSyncRequest(options, ssl, data);
		}
	}

	/**
	 * Aborts a request.
	 */
	public abort(): void {
		if (this._request) {
			this._request.abort();
			this._request = null;
		}

		this._requestHeaders = {};
		this.responseText = '';
		this.responseXML = '';

		this._errorFlag = this._abortedFlag = true;
		if (
			this.readyState !== XMLHttpRequestReadyStateEnum.unsent &&
			(this.readyState !== XMLHttpRequestReadyStateEnum.opened || this._sendFlag) &&
			this.readyState !== XMLHttpRequestReadyStateEnum.done
		) {
			this._sendFlag = false;
			this._setState(XMLHttpRequestReadyStateEnum.done);
		}
		this.readyState = XMLHttpRequestReadyStateEnum.unsent;
	}

	/**
	 * Called when an error is encountered to deal with it.
	 *
	 * @param error Error object.
	 * @param status HTTP status code to use rather than the default (0) for XHR errors.
	 */
	private _handleError(error: Error | string, status = 0): void {
		this.status = status;
		this.statusText = error.toString();
		this.responseText = error instanceof Error ? error.stack : '';
		this._errorFlag = true;
		this._setState(XMLHttpRequestReadyStateEnum.done);
	}

	/**
	 * Changes readyState and calls onreadystatechange.
	 *
	 * @param state
	 */
	private _setState(state: XMLHttpRequestReadyStateEnum): void {
		if (
			this.readyState === state ||
			(this.readyState === XMLHttpRequestReadyStateEnum.unsent && this._abortedFlag)
		) {
			return;
		}

		this.readyState = state;

		if (
			this._settings.async ||
			this.readyState < XMLHttpRequestReadyStateEnum.opened ||
			this.readyState === XMLHttpRequestReadyStateEnum.done
		) {
			this.dispatchEvent(new Event('readystatechange'));
		}

		if (this.readyState === XMLHttpRequestReadyStateEnum.done) {
			let fire: Event;

			if (this._abortedFlag) {
				fire = new Event('abort');
			} else if (this._errorFlag) {
				fire = new Event('error');
			} else {
				fire = new Event('load');
			}

			this.dispatchEvent(fire);
			this.dispatchEvent(new Event('loadend'));
		}
	}

	/**
	 * Default request headers.
	 *
	 * @returns Default request headers.
	 */
	private _getDefaultRequestHeaders(): { [key: string]: string } {
		return {
			accept: '*/*',
			referer: this._ownerDocument.defaultView.location.origin,
			'user-agent': this._ownerDocument.defaultView.navigator.userAgent,
			cookie: this._ownerDocument.defaultView.document.cookie
		};
	}

	/**
	 *
	 * @param options
	 * @param ssl
	 * @param data
	 */
	private _sendSyncRequest(options: IXMLHttpRequestOptions, ssl: boolean, data?: string): void {
		// Synchronous
		// Create a temporary file for communication with the other Node process
		const contentFile = '.node-xml-http-request-content-' + process.pid;
		const syncFile = '.node-xml-http-request-sync-' + process.pid;
		FS.writeFileSync(syncFile, '', 'utf8');

		// The async request the other Node process executes
		const execString = `
                const HTTP = require('http');
                const HTTPS = require('https');
                const FS = require('fs');
                const sendRequest = HTTP${ssl ? 'S' : ''}.request;
                const options = ${JSON.stringify(options)};
                const request = sendRequest(options, (response) => {
                    let responseText = '';
                    let responseData = Buffer.alloc(0);
                    response.setEncoding('utf8');
                    response.on('data', (chunk) => {
                        responseText += chunk;
                        responseData = Buffer.concat([responseData, Buffer.from(chunk)]);
                    });
                    response.on('end', () => {
                        FS.writeFileSync('${contentFile}', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText, data: responseData.toString('base64')}}), 'utf8');
                        FS.unlinkSync('${syncFile}');
                    });
                    response.on('error', (error) => {
                        FS.writeFileSync('${contentFile}', 'NODE-XML-HTTP-REQUEST-ERROR:' + JSON.stringify(error), 'utf8').on('error', (error) => {
                            FS.writeFileSync('${contentFile}', 'NODE-XML-HTTP-REQUEST-ERROR:' + JSON.stringify(error), 'utf8');
                            FS.unlinkSync('${syncFile}');
                        });
                    });
                });
                request.write(\`${JSON.stringify(data).slice(1, -1).replace(/'/g, "\\'")}\`);
                request.end();
            `.trim();

		// Start the other Node Process, executing this string
		ChildProcess.execFileSync(process.argv[0], ['-e', execString]);

		// If syncFile still exists, the request failed, if contentFile doesn't exist, the request failed.
		if (FS.existsSync(syncFile) || !FS.existsSync(contentFile)) {
			throw new DOMException('Synchronous request failed', DOMExceptionNameEnum.networkError);
		}
		this.responseURL = RelativeURL.getAbsoluteURL(
			this._ownerDocument.defaultView.location,
			this._settings.url
		).href;
		const content = FS.readFileSync(contentFile, 'utf8');

		// Remove the temporary file
		FS.unlinkSync(contentFile);

		if (content.match(/^NODE-XML-HTTP-REQUEST-ERROR:/)) {
			// If the file returned an error, handle it
			const errorObj = JSON.parse(content.replace(/^NODE-XMLHTTPREQUEST-ERROR:/, ''));
			this._handleError(errorObj, 503);
		} else {
			// If the file returned okay, parse its data and move to the DONE state
			const { data: responseObj } = JSON.parse(content);

			this._response = { statusCode: responseObj.statusCode, headers: responseObj.headers };
			this.status = responseObj.statusCode;
			this.responseText = responseObj.text;
			// Sync response is always text.
			this.response = Buffer.from(responseObj.data, 'base64').toString('utf8');

			// Set Cookies.
			if (this._response.headers['set-cookie']) {
				// TODO: Bugs in CookieJar.
				this._ownerDocument.defaultView.document.cookie = this._response.headers['set-cookie'];
			}
			// Redirect.
			if (
				this._response.statusCode === 301 ||
				this._response.statusCode === 302 ||
				this._response.statusCode === 303 ||
				this._response.statusCode === 307
			) {
				const redirectUrl = RelativeURL.getAbsoluteURL(
					this._ownerDocument.defaultView.location,
					this._response.headers['location']
				);
				ssl = redirectUrl.protocol === 'https:';
				this._settings.url = redirectUrl.href;
				// Recursive call.
				this._sendSyncRequest(
					Object.assign(options, {
						host: redirectUrl.host,
						path: redirectUrl.pathname + (redirectUrl.search ?? ''),
						port: redirectUrl.port || (ssl ? 443 : 80),
						method: this._response.statusCode === 303 ? 'GET' : this._settings.method,
						headers: Object.assign(options.headers, {
							referer: redirectUrl.origin,
							host: redirectUrl.host
						})
					}),
					ssl,
					data
				);
			}

			this._setState(XMLHttpRequestReadyStateEnum.done);
		}
	}

	/**
	 *
	 * @param options
	 * @param ssl
	 * @param data
	 */
	private _sendAsyncRequest(options: IXMLHttpRequestOptions, ssl: boolean, data?: string): void {
		// Use the proper protocol
		const sendRequest = ssl ? HTTPS.request : HTTP.request;

		// Request is being sent, set send flag
		this._sendFlag = true;

		// As per spec, this is called here for historical reasons.
		this.dispatchEvent(new Event('readystatechange'));

		// Handler for the response
		const responseHandler = (resp): void => {
			// Set response var to the response we got back
			// This is so it remains accessable outside this scope
			this._response = resp;

			// Check for redirect
			// @TODO Prevent looped redirects
			if (
				this._response.statusCode === 301 ||
				this._response.statusCode === 302 ||
				this._response.statusCode === 303 ||
				this._response.statusCode === 307
			) {
				// TODO: redirect url protocol change.
				// Change URL to the redirect location
				this._settings.url = this._response.headers.location;
				// Parse the new URL.
				const redirectUrl = RelativeURL.getAbsoluteURL(
					this._ownerDocument.defaultView.location,
					this._settings.url
				);
				this._settings.url = redirectUrl.href;
				ssl = redirectUrl.protocol === 'https:';
				// Issue the new request
				this._sendAsyncRequest(
					Object.assign(options, {
						host: redirectUrl.hostname,
						port: redirectUrl.port,
						path: redirectUrl.pathname + (redirectUrl.search ?? ''),
						method: this._response.statusCode === 303 ? 'GET' : this._settings.method,
						headers: Object.assign(options.headers, {
							referer: redirectUrl.origin,
							host: redirectUrl.host
						})
					}),
					ssl,
					data
				);
				// @TODO Check if an XHR event needs to be fired here
				return;
			}

			if (this._response && this._response.setEncoding) {
				this._response.setEncoding('utf8');
			}

			this._setState(XMLHttpRequestReadyStateEnum.headersRecieved);
			this.status = this._response.statusCode;

			// Initialize response.
			this.response = new Uint8Array(0);

			this._response.on('data', (chunk) => {
				// Make sure there's some data
				if (chunk) {
					this.response = Buffer.concat([this.response, Buffer.from(chunk)]);
				}
				// Don't emit state changes if the connection has been aborted.
				if (this._sendFlag) {
					this._setState(XMLHttpRequestReadyStateEnum.loading);
				}
			});

			this._response.on('end', () => {
				if (this._sendFlag) {
					// The sendFlag needs to be set before setState is called.  Otherwise, if we are chaining callbacks
					// There can be a timing issue (the callback is called and a new call is made before the flag is reset).
					this._sendFlag = false;

					// Redirect URL.
					this.responseURL = RelativeURL.getAbsoluteURL(
						this._ownerDocument.defaultView.location,
						this._settings.url
					).href;
					// Progress response.
					this.responseText = this.response.toString();
					switch (this.responseType) {
						case 'arraybuffer':
							this.response = Buffer.from(this.response);
							break;
						case 'blob':
							try {
								this.response = new this._ownerDocument.defaultView.Blob([this.response]);
							} catch (e) {
								this.response = null;
							}
							break;
						case 'document':
							try {
								this.response = new this._ownerDocument.defaultView.DOMParser().parseFromString(
									this.response.toString(),
									'text/html'
								);
							} catch (e) {
								this.response = null;
							}
							break;
						case 'json':
							try {
								this.response = JSON.parse(this.response.toString());
							} catch (e) {
								this.response = null;
							}
							break;
						case 'text':
						case '':
						default:
							this.response = this.response.toString();
							break;
					}

					// Discard the 'end' event if the connection has been aborted
					this._setState(XMLHttpRequestReadyStateEnum.done);
				}
			});

			this._response.on('error', (error) => {
				this._handleError(error);
			});
		};

		// Error handler for the request
		const errorHandler = (error): void => {
			this._handleError(error);
		};

		// Create the request
		this._request = sendRequest(<object>options, responseHandler).on('error', errorHandler);

		// Node 0.4 and later won't accept empty data. Make sure it's needed.
		if (data) {
			this._request.write(data);
		}

		this._request.end();

		this.dispatchEvent(new Event('loadstart'));
	}

	/**
	 *
	 * @param url
	 */
	private _sendLocalRequest(url: UrlObject): void {
		if (this._settings.method !== 'GET') {
			throw new DOMException(
				'XMLHttpRequest: Only GET method is supported',
				DOMExceptionNameEnum.notSupportedError
			);
		}

		if (this._settings.async) {
			FS.readFile(decodeURI(url.pathname.slice(1)), 'utf8', (error: Error, data: Buffer) => {
				if (error) {
					this._handleError(error);
				} else {
					this.status = 200;
					this.responseText = data.toString();
					this._setState(XMLHttpRequestReadyStateEnum.done);
				}
			});
		} else {
			try {
				this.responseText = FS.readFileSync(decodeURI(url.pathname.slice(1)), 'utf8');
				this.status = 200;
				this._setState(XMLHttpRequestReadyStateEnum.done);
			} catch (error) {
				this._handleError(error);
			}
		}
	}
}
