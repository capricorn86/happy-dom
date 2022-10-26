import FS from 'fs';
import ChildProcess from 'child_process';
import HTTP from 'http';
import HTTPS from 'https';
import XMLHttpRequestEventTarget from './XMLHttpRequestEventTarget';
import XMLHttpRequestReadyStateEnum from './XMLHttpRequestReadyStateEnum';
import Event from '../event/Event';
import IDocument from '../nodes/document/IDocument';
import Blob from '../file/Blob';
import RelativeURL from '../location/RelativeURL';
import XMLHttpRequestUpload from './XMLHttpRequestUpload';
import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import HTMLDocument from '../nodes/html-document/HTMLDocument';
import { UrlObject } from 'url';
import DOMParser, { default as DOMParserImplementation } from '../dom-parser/DOMParser';

// SSL certificates generated for Happy DOM to be able to perform HTTPS requests:

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
	// Public responseXML = '';
	public responseURL = '';
	public response: ArrayBuffer | Blob | IDocument | object | string = null;
	public status: number = null;
	public statusText: string = null;
	public upload: XMLHttpRequestUpload = new XMLHttpRequestUpload();

	// Private properties
	private readonly _ownerDocument: IDocument = null;
	private _flags: {
		// Async response or sync response.
		response: HTTP.IncomingMessage | { headers: string[]; statusCode: number };
		// Response fields
		responseType: string;
		responseText: string;
		responseXML: IDocument;
		asyncRequest: HTTP.ClientRequest;
		asyncTaskID: number;
		requestHeaders: object;
		send: boolean;
		error: boolean;
		aborted: boolean;
	} = {
		response: null,
		responseType: '',
		responseText: '',
		responseXML: null,
		asyncRequest: null,
		asyncTaskID: null,
		requestHeaders: {},
		send: false,
		error: false,
		aborted: false
	};

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
	 * Set response text.
	 *
	 * @param value
	 */
	public set responseText(value: string) {
		this._flags.responseText = value;
	}

	/**
	 * Get the response text.
	 *
	 * @throws {DOMException} If the response type is not text or empty.
	 * @returns The response text.
	 */
	public get responseText(): string {
		if (this.responseType === 'text' || this.responseType === '') {
			return this._flags.responseText;
		}
		throw new DOMException(
			`Failed to read the 'responseText' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'text' (was '${this.responseType}').`,
			DOMExceptionNameEnum.invalidStateError
		);
	}

	/**
	 * Sets the response XML.
	 *
	 * @param value The response XML.
	 */
	public set responseXML(value: IDocument) {
		this._flags.responseXML = value;
	}

	/**
	 * Get the responseXML.
	 *
	 * @throws {DOMException} If the response type is not text or empty.
	 * @returns Response XML.
	 */
	public get responseXML(): IDocument {
		if (this.responseType === 'document' || this.responseType === '') {
			return this._flags.responseXML;
		}
		throw new DOMException(
			`Failed to read the 'responseXML' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'document' (was '${this.responseType}').`,
			DOMExceptionNameEnum.invalidStateError
		);
	}

	/**
	 * Set response type.
	 *
	 * @param type Response type.
	 * @throws {DOMException} If the state is not unsent or opened.
	 * @throws {DOMException} If the request is synchronous.
	 */
	public set responseType(type: string) {
		// ResponseType can only be set when the state is unsent or opened.
		if (
			this.readyState !== XMLHttpRequestReadyStateEnum.opened &&
			this.readyState !== XMLHttpRequestReadyStateEnum.unsent
		) {
			throw new DOMException(
				`Failed to set the 'responseType' property on 'XMLHttpRequest': The object's state must be OPENED.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
		// Sync requests can only have empty string or 'text' as response type.
		if (!this._settings.async) {
			throw new DOMException(
				`Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be changed for synchronous requests made from a document.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
		this._flags.responseType = type;
	}

	/**
	 * Get response Type.
	 *
	 * @returns Response type.
	 */
	public get responseType(): string {
		return this._flags.responseType;
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
		this._flags = { ...this._flags, aborted: false, error: false };

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
		if (this._flags.send) {
			throw new DOMException('send flag is true', DOMExceptionNameEnum.invalidStateError);
		}
		this._flags.requestHeaders[lowerHeader] = value;
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
			this._flags.response.headers[lowerHeader] &&
			!this._flags.error
		) {
			return this._flags.response.headers[lowerHeader];
		}

		return null;
	}

	/**
	 * Gets all the response headers.
	 *
	 * @returns A string with all response headers separated by CR+LF.
	 */
	public getAllResponseHeaders(): string {
		if (this.readyState < XMLHttpRequestReadyStateEnum.headersRecieved || this._flags.error) {
			return '';
		}
		let result = '';

		for (const name of Object.keys(this._flags.response.headers)) {
			// Cookie headers are excluded
			if (name !== 'set-cookie' && name !== 'set-cookie2') {
				result += `${name}: ${this._flags.response.headers[name]}\r\n`;
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
		if (typeof name === 'string' && this._flags.requestHeaders[lowerName]) {
			return this._flags.requestHeaders[lowerName];
		}

		return '';
	}

	/**
	 * Sends the request to the server.
	 *
	 * @param data Optional data to send as request body.
	 */
	public send(data?: string): void {
		this._sendRequest(data);
	}

	/**
	 * Aborts a request.
	 */
	public abort(): void {
		if (this._flags.asyncRequest) {
			this._flags.asyncRequest.destroy();
			this._flags.asyncRequest = null;
		}

		this._flags.requestHeaders = {};
		this.responseText = '';
		this.responseXML = null;

		this._flags = { ...this._flags, aborted: true, error: true };

		if (
			this.readyState !== XMLHttpRequestReadyStateEnum.unsent &&
			(this.readyState !== XMLHttpRequestReadyStateEnum.opened || this._flags.send) &&
			this.readyState !== XMLHttpRequestReadyStateEnum.done
		) {
			this._flags.send = false;
			this._setState(XMLHttpRequestReadyStateEnum.done);
		}
		this.readyState = XMLHttpRequestReadyStateEnum.unsent;

		if (this._flags.asyncTaskID !== null) {
			this._ownerDocument.defaultView.happyDOM.asyncTaskManager.endTask(this._flags.asyncTaskID);
		}
	}

	/**
	 * Changes readyState and calls onreadystatechange.
	 *
	 * @param state
	 */
	private _setState(state: XMLHttpRequestReadyStateEnum): void {
		if (
			this.readyState === state ||
			(this.readyState === XMLHttpRequestReadyStateEnum.unsent && this._flags.aborted)
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

			if (this._flags.aborted) {
				fire = new Event('abort');
			} else if (this._flags.error) {
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
	 * Sends a request.
	 *
	 * @param [data] Optional data to send as request body.
	 * @returns Promise that resolves when the request is done.
	 */
	private async _sendRequest(data?: string): Promise<void> {
		if (this.readyState != XMLHttpRequestReadyStateEnum.opened) {
			throw new DOMException(
				'connection must be opened before send() is called',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		if (this._flags.send) {
			throw new DOMException(
				'send has already been called',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const { location } = this._ownerDocument.defaultView;

		const url = RelativeURL.getAbsoluteURL(location, this._settings.url);
		// Security check.
		if (url.protocol === 'http:' && location.protocol === 'https:') {
			throw new DOMException(
				`Mixed Content: The page at '${location.href}' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint '${url.href}'. This request has been blocked; the content must be served over HTTPS.`,
				DOMExceptionNameEnum.securityError
			);
		}

		// TODO: CORS check.

		let ssl = false;
		let local = false;
		let host;

		this._flags.asyncTaskID = this._ownerDocument.defaultView.happyDOM.asyncTaskManager.startTask();

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

		// Load files off the local filesystem (file://)
		if (local) {
			if (this._settings.async) {
				await this._sendLocalAsyncRequest(url);
			} else {
				this._sendLocalSyncRequest(url);
			}
			this._ownerDocument.defaultView.happyDOM.asyncTaskManager.endTask(this._flags.asyncTaskID);
			return;
		}

		// Default to port 80. If accessing localhost on another port be sure
		// To use http://localhost:port/path
		const port = Number(url.port) || (ssl ? 443 : 80);
		// Add query string if one is used
		const uri = url.pathname + (url.search ? url.search : '');

		// Set the Host header or the server may reject the request
		this._flags.requestHeaders['host'] = host;
		if (!((ssl && port === 443) || port === 80)) {
			this._flags.requestHeaders['host'] += ':' + url.port;
		}

		// Set Basic Auth if necessary
		if (this._settings.user) {
			this._settings.password ??= '';
			const authBuffer = Buffer.from(this._settings.user + ':' + this._settings.password);
			this._flags.requestHeaders['authorization'] = 'Basic ' + authBuffer.toString('base64');
		}
		// Set the Content-Length header if method is POST
		if (this._settings.method === 'GET' || this._settings.method === 'HEAD') {
			data = null;
		} else if (this._settings.method === 'POST') {
			// Set default content type if not set.
			if (!this._flags.requestHeaders['content-type']) {
				this._flags.requestHeaders['content-type'] = 'text/plain;charset=UTF-8';
			}

			if (data) {
				this._flags.requestHeaders['content-length'] = Buffer.isBuffer(data)
					? data.length
					: Buffer.byteLength(data);
			} else {
				this._flags.requestHeaders['content-length'] = 0;
			}
		}

		const options: HTTPS.RequestOptions = {
			host: host,
			port: port,
			path: uri,
			method: this._settings.method,
			headers: { ...this._getDefaultRequestHeaders(), ...this._flags.requestHeaders },
			agent: false,
			rejectUnauthorized: true,
			key: ssl ? SSL_KEY : null,
			cert: ssl ? SSL_CERT : null
		};

		// Reset error flag
		this._flags.error = false;

		// Handle async requests
		if (this._settings.async) {
			await this._sendAsyncRequest(options, ssl, data);
		} else {
			this._sendSyncRequest(options, ssl, data);
		}

		this._ownerDocument.defaultView.happyDOM.asyncTaskManager.endTask(this._flags.asyncTaskID);
	}

	/**
	 * Sends a synchronous request.
	 *
	 * @param options
	 * @param ssl
	 * @param data
	 */
	private _sendSyncRequest(options: HTTPS.RequestOptions, ssl: boolean, data?: string): void {
		const scriptString = this._getSyncRequestScriptString(options, ssl, data);

		// Start the other Node Process, executing this string
		const content = ChildProcess.execFileSync(process.argv[0], ['-e', scriptString], {
			encoding: 'buffer',
			maxBuffer: 1024 * 1024 * 1024 // TODO: Consistent buffer size: 1GB.
		});

		// If content length is 0, then there was an error
		if (!content.length) {
			throw new DOMException('Synchronous request failed', DOMExceptionNameEnum.networkError);
		}

		const { err: error, data: responseObj } = JSON.parse(content.toString());
		if (error) {
			this._onError(error, 503);
		}

		if (responseObj) {
			this._flags.response = { statusCode: responseObj.statusCode, headers: responseObj.headers };
			this.status = responseObj.statusCode;
			// Sync responseType === ''
			this.response = responseObj.text;
			this.responseText = responseObj.text;
			this.responseXML = null;
			this.responseURL = RelativeURL.getAbsoluteURL(
				this._ownerDocument.defaultView.location,
				this._settings.url
			).href;
			// Set Cookies.
			if (this._flags.response.headers['set-cookie']) {
				// TODO: Bugs in CookieJar.
				this._ownerDocument.defaultView.document.cookie =
					this._flags.response.headers['set-cookie'];
			}
			// Redirect.
			if (
				this._flags.response.statusCode === 301 ||
				this._flags.response.statusCode === 302 ||
				this._flags.response.statusCode === 303 ||
				this._flags.response.statusCode === 307
			) {
				const redirectUrl = RelativeURL.getAbsoluteURL(
					this._ownerDocument.defaultView.location,
					this._flags.response.headers['location']
				);
				ssl = redirectUrl.protocol === 'https:';
				this._settings.url = redirectUrl.href;
				// Recursive call.
				this._sendSyncRequest(
					Object.assign(options, {
						host: redirectUrl.host,
						path: redirectUrl.pathname + (redirectUrl.search ?? ''),
						port: redirectUrl.port || (ssl ? 443 : 80),
						method: this._flags.response.statusCode === 303 ? 'GET' : this._settings.method,
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
	 * Sends a synchronous request.
	 *
	 * @param options Options.
	 * @param ssl SSL.
	 * @param data Data.
	 */
	private _getSyncRequestScriptString(
		options: HTTPS.RequestOptions,
		ssl: boolean,
		data?: string
	): string {
		// Synchronous
		// Note: console.log === stdout
		// The async request the other Node process executes
		return `
                const HTTP = require('http');
                const HTTPS = require('https');
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
                        console.log(JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText, data: responseData.toString('base64')}}));
                    });
                    response.on('error', (error) => {
                        console.log(JSON.stringify({err: error, data: null}));
                    });
                });
                request.write(\`${JSON.stringify(data ?? '')
									.slice(1, -1)
									.replace(/'/g, "\\'")}\`);
                request.end();
            `;
	}

	/**
	 * Sends an async request.
	 *
	 * @param options
	 * @param ssl
	 * @param data
	 */
	private _sendAsyncRequest(
		options: HTTPS.RequestOptions,
		ssl: boolean,
		data?: string
	): Promise<void> {
		return new Promise((resolve) => {
			// Use the proper protocol
			const sendRequest = ssl ? HTTPS.request : HTTP.request;

			// Request is being sent, set send flag
			this._flags.send = true;

			// As per spec, this is called here for historical reasons.
			this.dispatchEvent(new Event('readystatechange'));

			// Create the request
			this._flags.asyncRequest = sendRequest(
				<object>options,
				async (response: HTTP.IncomingMessage) => {
					await this._onAsyncResponse(response, options, ssl, data);
					resolve();
				}
			).on('error', (error: Error) => {
				this._onError(error);
				resolve();
			});

			// Node 0.4 and later won't accept empty data. Make sure it's needed.
			if (data) {
				this._flags.asyncRequest.write(data);
			}

			this._flags.asyncRequest.end();

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
	private _onAsyncResponse(
		response: HTTP.IncomingMessage,
		options: HTTPS.RequestOptions,
		ssl: boolean,
		data?: string
	): Promise<void> {
		return new Promise((resolve) => {
			// Set response var to the response we got back
			// This is so it remains accessable outside this scope
			this._flags.response = response;

			// Check for redirect
			// @TODO Prevent looped redirects
			if (
				this._flags.response.statusCode === 301 ||
				this._flags.response.statusCode === 302 ||
				this._flags.response.statusCode === 303 ||
				this._flags.response.statusCode === 307
			) {
				// TODO: redirect url protocol change.
				// Change URL to the redirect location
				this._settings.url = this._flags.response.headers.location;
				// Parse the new URL.
				const redirectUrl = RelativeURL.getAbsoluteURL(
					this._ownerDocument.defaultView.location,
					this._settings.url
				);
				this._settings.url = redirectUrl.href;
				ssl = redirectUrl.protocol === 'https:';
				// Issue the new request
				this._sendAsyncRequest(
					{
						...options,
						host: redirectUrl.hostname,
						port: redirectUrl.port,
						path: redirectUrl.pathname + (redirectUrl.search ?? ''),
						method: this._flags.response.statusCode === 303 ? 'GET' : this._settings.method,
						headers: { ...options.headers, referer: redirectUrl.origin, host: redirectUrl.host }
					},
					ssl,
					data
				);
				// @TODO Check if an XHR event needs to be fired here
				return;
			}

			if (this._flags.response && this._flags.response.setEncoding) {
				this._flags.response.setEncoding('utf-8');
			}

			this._setState(XMLHttpRequestReadyStateEnum.headersRecieved);
			this.status = this._flags.response.statusCode;

			// Initialize response.
			let tempResponse = Buffer.from(new Uint8Array(0));

			this._flags.response.on('data', (chunk: Uint8Array) => {
				// Make sure there's some data
				if (chunk) {
					tempResponse = Buffer.concat([tempResponse, Buffer.from(chunk)]);
				}
				// Don't emit state changes if the connection has been aborted.
				if (this._flags.send) {
					this._setState(XMLHttpRequestReadyStateEnum.loading);
				}
			});

			this._flags.response.on('end', () => {
				if (this._flags.send) {
					// The sendFlag needs to be set before setState is called.  Otherwise, if we are chaining callbacks
					// There can be a timing issue (the callback is called and a new call is made before the flag is reset).
					this._flags.send = false;

					// Set response according to responseType.
					const { response, responseXML, responseText } = this._parseResponseData(tempResponse);
					this.response = response;
					this.responseXML = responseXML;
					this.responseText = responseText;
					this.responseURL = RelativeURL.getAbsoluteURL(
						this._ownerDocument.defaultView.location,
						this._settings.url
					).href;
					// Discard the 'end' event if the connection has been aborted
					this._setState(XMLHttpRequestReadyStateEnum.done);
				}

				resolve();
			});

			this._flags.response.on('error', (error) => {
				this._onError(error);
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
	private async _sendLocalAsyncRequest(url: UrlObject): Promise<void> {
		if (!this._ownerDocument.defaultView.happyDOM.settings.enableFileSystemHttpRequests) {
			throw new DOMException(
				'File system is disabled by default for security reasons. To enable it, set the "window.happyDOM.settings.enableFileSystemHttpRequests" option to true.',
				DOMExceptionNameEnum.securityError
			);
		}

		if (this._settings.method !== 'GET') {
			throw new DOMException(
				'Only GET method is supported',
				DOMExceptionNameEnum.notSupportedError
			);
		}

		let data: Buffer;

		try {
			data = await FS.promises.readFile(decodeURI(url.pathname.slice(1)));
		} catch (error) {
			this._onError(error);
		}

		if (data) {
			this._parseLocalRequestData(data);
		}
	}

	/**
	 * Sends a local file system synchronous request.
	 *
	 * @param url URL.
	 */
	private _sendLocalSyncRequest(url: UrlObject): void {
		if (!this._ownerDocument.defaultView.happyDOM.settings.enableFileSystemHttpRequests) {
			throw new DOMException(
				'File system is disabled by default for security reasons. To enable it, set the "window.happyDOM.settings.enableFileSystemHttpRequests" option to true.',
				DOMExceptionNameEnum.securityError
			);
		}

		if (this._settings.method !== 'GET') {
			throw new DOMException(
				'Only GET method is supported',
				DOMExceptionNameEnum.notSupportedError
			);
		}

		let data: Buffer;
		try {
			data = FS.readFileSync(decodeURI(url.pathname.slice(1)));
		} catch (error) {
			this._onError(error);
		}

		if (data) {
			this._parseLocalRequestData(data);
		}
	}

	/**
	 * Parses local request data.
	 *
	 * @param data Data.
	 */
	private _parseLocalRequestData(data: Buffer): void {
		this.status = 200;

		const { response, responseXML, responseText } = this._parseResponseData(data);
		this.response = response;
		this.responseXML = responseXML;
		this.responseText = responseText;
		this.responseURL = RelativeURL.getAbsoluteURL(
			this._ownerDocument.defaultView.location,
			this._settings.url
		).href;

		this._setState(XMLHttpRequestReadyStateEnum.done);
	}

	/**
	 * Returns response based to the "responseType" property.
	 *
	 * @param data Data.
	 * @returns Parsed response.
	 */
	private _parseResponseData(data: Buffer): {
		response: ArrayBuffer | Blob | IDocument | object | string;
		responseText: string;
		responseXML: IDocument;
	} {
		switch (this.responseType) {
			case 'arraybuffer':
				// See: https://github.com/jsdom/jsdom/blob/c3c421c364510e053478520500bccafd97f5fa39/lib/jsdom/living/helpers/binary-data.js
				const newAB = new ArrayBuffer(data.length);
				const view = new Uint8Array(newAB);
				view.set(data);
				return {
					response: view,
					responseText: null,
					responseXML: null
				};
			case 'blob':
				try {
					return {
						response: new this._ownerDocument.defaultView.Blob([new Uint8Array(data)], {
							type: this.getResponseHeader('content-type') || ''
						}),
						responseText: null,
						responseXML: null
					};
				} catch (e) {
					return { response: null, responseText: null, responseXML: null };
				}
			case 'document':
				const window = this._ownerDocument.defaultView;
				const happyDOMSettings = window.happyDOM.settings;
				let response: IDocument;

				// Temporary disables unsecure features.
				window.happyDOM.settings = {
					...happyDOMSettings,
					enableFileSystemHttpRequests: false,
					disableJavaScriptEvaluation: true,
					disableCSSFileLoading: true,
					disableJavaScriptFileLoading: true
				};

				const domParser = new window.DOMParser();

				try {
					response = domParser.parseFromString(data.toString(), 'text/xml');
				} catch (e) {
					return { response: null, responseText: null, responseXML: null };
				}

				// Restores unsecure features.
				window.happyDOM.settings = happyDOMSettings;

				return { response, responseText: null, responseXML: response };
			case 'json':
				try {
					return {
						response: JSON.parse(data.toString()),
						responseText: null,
						responseXML: null
					};
				} catch (e) {
					return { response: null, responseText: null, responseXML: null };
				}
			case 'text':
			case '':
			default:
				return {
					response: data.toString(),
					responseText: data.toString(),
					responseXML: null
				};
		}
	}

	/**
	 * Called when an error is encountered to deal with it.
	 *
	 * @param error Error object.
	 * @param status HTTP status code to use rather than the default (0) for XHR errors.
	 */
	private _onError(error: Error | string, status = 0): void {
		this.status = status;
		this.statusText = error.toString();
		this.responseText = error instanceof Error ? error.stack : '';
		this._flags.error = true;
		this._setState(XMLHttpRequestReadyStateEnum.done);
	}
}
