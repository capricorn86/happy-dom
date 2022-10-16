import FS from 'fs';
import { URL } from 'url';
import ChildProcess from 'child_process';
import HTTP from 'http';
import HTTPS from 'https';
import XMLHttpRequestEventTarget from './XMLHttpRequestEventTarget';
import XMLHttpRequestReadyStateEnum from './XMLHttpRequestReadyStateEnum';
import Event from '../event/Event';
import IDocument from '../nodes/document/IDocument';
import RelativeURL from '../location/RelativeURL';
import XMLHttpRequestUpload from './XMLHttpRequestUpload';

const SSL_CERT = `-----BEGIN CERTIFICATE-----
MIIDYzCCAkugAwIBAgIUJRKB/H66hpet1VfUlm0CiXqePA4wDQYJKoZIhvcNAQEL
BQAwQTELMAkGA1UEBhMCU0UxDjAMBgNVBAgMBVNrYW5lMQ4wDAYDVQQHDAVNYWxt
bzESMBAGA1UECgwJSGFwcHkgRE9NMB4XDTIyMTAxMTIyMDM0OVoXDTMyMTAwODIy
MDM0OVowQTELMAkGA1UEBhMCU0UxDjAMBgNVBAgMBVNrYW5lMQ4wDAYDVQQHDAVN
YWxtbzESMBAGA1UECgwJSGFwcHkgRE9NMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAqerQSQEg/SxVxRiwlItithr5e5EMZo1nsqt/xOxagbmpW3IEmt0j
bpbH7iEF4DDEo7KAOwUCOwVWeFxRoag8lG2ax48wrgjlCna45XDn0Xeg1ARajL04
gs46HZ0VrzIloVGfln0zgt/Vum5BNqs9Oc5fQoBmoP3cAn3dn4ZVcP0AKthtcyPl
q2DuNRN0PV0D2RtMSiAy9l1Ko6N5x+sAeClDyOL+sTDLngZBVeZyOKt9Id15S8Zt
XtA6VMgHnnF3jChn7pag77rsd/y5iANAVNZYqRl+Eg7xaDcsvbgH46UBOrBcB39Q
tTh5Mtjoxep5e3ZDFG+kQ1HUE+iz5O5n0wIDAQABo1MwUTAdBgNVHQ4EFgQU69s9
YSobG/m2SN4L/7zTaF7iDbwwHwYDVR0jBBgwFoAU69s9YSobG/m2SN4L/7zTaF7i
DbwwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAi/WUXx2oal8L
YnPlIuKfh49n/K18wXSYG//oFYwxfVxqpYH8hUiXVm/GUcXCxS++hUkaKLqXmH9q
MKJiCrZr3vS+2nsBKopkICu/TLdROl0sAI9lByfnEbfSAzjxe1IWJdK8NdY0y5m5
9pEr/URVIAp/CxrneyASb4q0Jg5To3FR7vYc+2X6wZn0MundKMg6Dp9/A37jiF3l
Tt/EJp299YZcsUzh+LnRuggRjnoOVu1aLcLFlaUiwZfy9m8mLG6B/mdW/qNzNMh9
Oqvg1zfGdpz/4D/2UUUBn6pq1vbsoAaF3OesoA3mfDcegDf/H9woJlpT0Wql+e68
Y3FblSokcA==
-----END CERTIFICATE-----`;

const SSL_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCp6tBJASD9LFXF
GLCUi2K2Gvl7kQxmjWeyq3/E7FqBualbcgSa3SNulsfuIQXgMMSjsoA7BQI7BVZ4
XFGhqDyUbZrHjzCuCOUKdrjlcOfRd6DUBFqMvTiCzjodnRWvMiWhUZ+WfTOC39W6
bkE2qz05zl9CgGag/dwCfd2fhlVw/QAq2G1zI+WrYO41E3Q9XQPZG0xKIDL2XUqj
o3nH6wB4KUPI4v6xMMueBkFV5nI4q30h3XlLxm1e0DpUyAeecXeMKGfulqDvuux3
/LmIA0BU1lipGX4SDvFoNyy9uAfjpQE6sFwHf1C1OHky2OjF6nl7dkMUb6RDUdQT
6LPk7mfTAgMBAAECggEAKkwTkTjAt4UjzK56tl+EMQTB+ep/hb/JgoaChci4Nva6
m9LkJpDJ0yuhlTuPNOGu8XjrxsVWas7HWarRf0Zb3i7yip6wZYI9Ub+AA015x4DZ
/i0fRU2NFbK0cM67qSL4jxG8gj+kZP3HPGNZxHwX/53JxMolwgmvjMc8NgvAlSFd
NnV9h4xtbhUh1NGS5zmP3iU2rwnE8JrIEzwy6axLom7nekAgkdcbAr0UoBs8gcgH
aYNhU4Gz3tGcZZ0IXAfT/bJIH1Ko8AGv4pssWc3BXcmmNdm/+kzvHIxEIV7Qegmo
XG1ZyZCyD/0b4/3e8ySDBEDqwR+HeyTW2isWG2agAQKBgQDp44aTwr3dkIXY30xv
FPfUOipg/B49dWnffYJ9MWc1FT9ijNPAngWSk0EIiEQIazICcUBI4Yji6/KeyqLJ
GdLpDi1CkKqtyh73mjELinYp3EUQgEa77aQogGa2+nMOVfu+O5CtloUrv/A18jX3
+VEyaEASK0fWmnSI0OdlxQHIAQKBgQC5+xOls2F3MlKASvWRLlnW1wHqlDTtVoYg
5Nh8syZH4Ci2UH8tON3A5/7SWNM0t1cgV6Cw4zW8Z2spgIT/W0iYYrQ4hHL1xdCu
+CxL1km4Gy8Uwpsd+KdFahFqF/XTmLzW0HXLxWSK0fTwmdV0SFrKF3MXfTCU2AeZ
jJoMFb6P0wKBgQC3Odw6s0vkYAzLGhuZxfZkVvDOK5RRF0NKpttr0iEFL9EJFkPo
2KKK8jr3QTDy229BBJGUxsJi6u6VwS8HlehpVQbV59kd7oKV/EBBx0XMg1fDlopT
PNbmN7i/zbIG4AsoOyebJZjL7kBzMn1e9vzKHWtcEHXlw/hZGja8vjooAQKBgAeg
xK2HLfg1mCyq5meN/yFQsENu0LzrT5UJzddPgcJw7zqLEqxIKNBAs7Ls8by3yFsL
PQwERa/0jfCl1M6kb9XQNpQa2pw6ANUsWKTDpUJn2wZ+9N3F1RaDwzMWyH5lRVmK
M0qoTfdjpSg5Jwgd75taWt4bxGJWeflSSv8z5R0BAoGAWL8c527AbeBvx2tOYKkD
2TFranvANNcoMrbeviZSkkGvMNDP3p8b6juJwXOIeWNr8q4vFgCzLmq6d1/9gYm2
3XJwwyD0LKlqzkBrrKU47qrnmMosUrIRlrAzd3HbShOptxc6Iz2apSaUDKGKXkaw
gl5OpEjeliU7Mus0BVS858g=
-----END PRIVATE KEY-----`;

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
			throw new Error('SecurityError: Request method not allowed');
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
			throw new Error('INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN');
		}
		const lowerHeader = header.toLowerCase();

		if (FORBIDDEN_REQUEST_HEADERS.includes(lowerHeader)) {
			return false;
		}
		if (this._sendFlag) {
			throw new Error('INVALID_STATE_ERR: send flag is true');
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
			throw new Error('INVALID_STATE_ERR: connection must be opened before send() is called');
		}

		if (this._sendFlag) {
			throw new Error('INVALID_STATE_ERR: send has already been called');
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
				throw new Error('Protocol not supported.');
		}

		// TODO: Security Issue.
		// Load files off the local filesystem (file://)
		if (local) {
			if (this._settings.method !== 'GET') {
				throw new Error('XMLHttpRequest: Only GET method is supported');
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

			return;
		}

		// Default to port 80. If accessing localhost on another port be sure
		// To use http://localhost:port/path
		const port = url.port || (ssl ? 443 : 80);
		// Add query string if one is used
		const uri = url.pathname + (url.search ? url.search : '');

		// Set the Host header or the server may reject the request
		this._requestHeaders['host'] = host;
		if (!((ssl && port === 443) || port === 80)) {
			this._requestHeaders['host'] += ':' + url.port;
		}

		// Set Basic Auth if necessary
		if (this._settings.user) {
			if (typeof this._settings.password == 'undefined') {
				this._settings.password = '';
			}
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

		const options = {
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
					this._response.statusCode === 302 ||
					this._response.statusCode === 303 ||
					this._response.statusCode === 307
				) {
					// Change URL to the redirect location
					this._settings.url = this._response.headers.location;
					const url = new URL(this._settings.url);
					// Set host var in case it's used later
					host = url.hostname;
					// Options for the new request
					const newOptions = {
						hostname: url.hostname,
						port: url.port,
						path: url.pathname,
						method: this._response.statusCode === 303 ? 'GET' : this._settings.method,
						headers: Object.assign(this._getDefaultRequestHeaders(), this._requestHeaders),
						rejectUnauthorized: true,
						key: ssl ? SSL_KEY : null,
						cert: ssl ? SSL_CERT : null
					};

					// Issue the new request
					this._request = sendRequest(newOptions, responseHandler).on('error', errorHandler);
					this._request.end();
					// @TODO Check if an XHR event needs to be fired here
					return;
				}

				if (this._response && this._response.setEncoding) {
					this._response.setEncoding('utf8');
				}

				this._setState(XMLHttpRequestReadyStateEnum.headersRecieved);
				this.status = this._response.statusCode;

				this._response.on('data', (chunk) => {
					// Make sure there's some data
					if (chunk) {
						this.responseText += chunk;
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
			this._request = sendRequest(options, responseHandler).on('error', errorHandler);

			// Node 0.4 and later won't accept empty data. Make sure it's needed.
			if (data) {
				this._request.write(data);
			}

			this._request.end();

			this.dispatchEvent(new Event('loadstart'));
		} else {
			// Synchronous
			// Create a temporary file for communication with the other Node process
			const contentFile = '.node-xmlhttprequest-content-' + process.pid;
			const syncFile = '.node-xmlhttprequest-sync-' + process.pid;
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
                    response.setEncoding('utf8');
                    response.on('data', (chunk) => {
                        responseText += chunk;
                    });
                    response.on('end', () => {
                        FS.writeFileSync('${contentFile}', 'NODE-XMLHTTPREQUEST-STATUS:' + response.statusCode + ',' + responseText, 'utf8');
                        FS.unlinkSync('${syncFile}');
                    });
                    response.on('error', (error) => {
                        FS.writeFileSync('${contentFile}', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8').on('error', (error) => {
                        FS.writeFileSync('${contentFile}', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');
                        FS.unlinkSync('${syncFile}');
                        });
                    });
                });
                request.write(\`${JSON.stringify(data).slice(1, -1)}\`);
                request.end();
            `.trim();

			// Start the other Node Process, executing this string
			ChildProcess.execFileSync(process.argv[0], ['-e', execString]);

			// If syncFile still exists, the request failed, if contentFile doesn't exist, the request failed.
			if (FS.existsSync(syncFile) || !FS.existsSync(contentFile)) {
				throw new Error('Synchronous request failed');
			}

			this.responseText = FS.readFileSync(contentFile, 'utf8');

			// Remove the temporary file
			FS.unlinkSync(contentFile);

			if (this.responseText.match(/^NODE-XMLHTTPREQUEST-ERROR:/)) {
				// If the file returned an error, handle it
				const errorObj = this.responseText.replace(/^NODE-XMLHTTPREQUEST-ERROR:/, '');
				this._handleError(errorObj, 503);
			} else {
				// If the file returned okay, parse its data and move to the DONE state
				this.status = Number(
					this.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:([0-9]*),.*/, '$1')
				);
				this.responseText = this.responseText.replace(
					/^NODE-XMLHTTPREQUEST-STATUS:[0-9]*,(.*)/,
					'$1'
				);
				this._setState(XMLHttpRequestReadyStateEnum.done);
			}
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
}
